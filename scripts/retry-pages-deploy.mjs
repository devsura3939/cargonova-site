#!/usr/bin/env node
/**
 * Retry loop for the GitHub Pages deploy.
 *
 * GitHub Pages occasionally 503s the deploy API ("No server is currently
 * available"). The build job still succeeds; only the deploy step fails.
 * This script:
 *   1. Enables Pages (build_type: workflow) if not already enabled.
 *   2. Watches the latest workflow run and re-dispatches the workflow every
 *      120s until a run completes with `success`.
 *
 * Usage: node scripts/retry-pages-deploy.mjs [owner/repo] [maxMinutes]
 *   default owner/repo: devsura3939/cargonova-site
 */
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const [owner, repo] = (process.argv[2] || "devsura3939/cargonova-site").split("/");
const MAX_MINUTES = Number(process.argv[3] || 60);
const log = (msg) => console.log(`[${new Date().toISOString()}] ${msg}`);

function token() {
  if (process.env.GH_TOKEN) return process.env.GH_TOKEN;
  const p = join(dirname(fileURLToPath(import.meta.url)), "..", "..", ".freebuff", "github-token.txt");
  if (existsSync(p)) {
    const t = readFileSync(p, "utf8").trim().split(/\s+/).pop();
    if (t && (t.startsWith("ghp_") || t.startsWith("github_pat_"))) return t;
  }
  throw new Error("No GitHub token found (set GH_TOKEN or .freebuff/github-token.txt)");
}

async function gh(path, method = "GET", body) {
  const res = await fetch(`https://api.github.com${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token()}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
      "User-Agent": "cargonova-retry",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  return { ok: res.ok, status: res.status, data: text ? JSON.parse(text) : null };
}

async function latestRun() {
  const { data } = await gh(`/repos/${owner}/${repo}/actions/runs?per_page=1`);
  return data?.workflow_runs?.[0] ?? null;
}

async function ensurePages() {
  const { data, status } = await gh(`/repos/${owner}/${repo}/pages`);
  if (status === 200 && data?.html_url) {
    log(`Pages already enabled: ${data.html_url}`);
    return true;
  }
  const res = await gh(`/repos/${owner}/${repo}/pages`, "POST", { build_type: "workflow" });
  if (res.status === 201 || res.status === 200) {
    log(`✅ Pages enabled: ${res.data?.html_url ?? "see repo settings"}`);
    return true;
  }
  log(`Pages enable deferred (HTTP ${res.status}${res.data?.message ? `: ${res.data.message}` : ""})`);
  return false;
}

const deadline = Date.now() + MAX_MINUTES * 60_000;
let lastId = null;

while (Date.now() < deadline) {
  try {
    await ensurePages();
    const run = await latestRun();
    if (run && run.id !== lastId) {
      lastId = run.id;
      log(`run ${run.id} (${run.name}) → ${run.status} ${run.conclusion ?? ""}`);
    }
    if (run && run.status === "completed" && run.conclusion === "success") {
      log(`✅ Deploy succeeded on run ${run.id}`);
      log(`🌐 https://${owner}.github.io/${repo}/`);
      process.exit(0);
    }
    if (run && run.status === "completed" && run.conclusion !== "success") {
      log(`run ${run.id} failed — re-dispatching workflow`);
      const res = await gh(
        `/repos/${owner}/${repo}/actions/workflows/deploy-pages.yml/dispatches`,
        "POST",
        { ref: "main" },
      );
      if (res.status !== 204) log(`dispatch warning: HTTP ${res.status}${res.data?.message ? `: ${res.data.message}` : ""}`);
      else log("workflow re-dispatched");
      lastId = null; // wait for the NEW run
    }
  } catch (e) {
    log(`error: ${e.message}`);
  }
  await new Promise((r) => setTimeout(r, 120_000));
}
log(`✗ Timed out after ${MAX_MINUTES} minutes — GitHub Pages still unavailable.`);
process.exit(1);
