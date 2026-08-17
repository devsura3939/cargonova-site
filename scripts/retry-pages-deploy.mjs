#!/usr/bin/env node
/**
 * Retry loop for the GitHub Pages deploy.
 *
 * GitHub Pages occasionally 503s the deploy API ("No server is currently
 * available"). The build job still succeeds; only the deploy step fails.
 * This script watches the latest workflow run and re-dispatches the workflow
 * every 120s until a run completes with `success`, then prints the live URL.
 *
 * Usage: node scripts/retry-pages-deploy.mjs [maxMinutes]
 */
import { execSync } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const OWNER = "devsura3939";
const REPO = "Cargonova";
const WORKFLOW = "deploy-pages.yml";
const MAX_MINUTES = Number(process.argv[2] || 45);
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
  const { data } = await gh(`/repos/${OWNER}/${REPO}/actions/runs?per_page=1`);
  return data?.workflow_runs?.[0] ?? null;
}

const deadline = Date.now() + MAX_MINUTES * 60_000;
let lastId = null;

while (Date.now() < deadline) {
  try {
    const run = await latestRun();
    if (run && run.id !== lastId) {
      lastId = run.id;
      log(`run ${run.id} (${run.name}) → ${run.status} ${run.conclusion ?? ""}`);
    }
    if (run && run.status === "completed" && run.conclusion === "success") {
      log(`✅ Deploy succeeded on run ${run.id}`);
      log(`🌐 https://${OWNER}.github.io/${REPO}/`);
      process.exit(0);
    }
    if (run && run.status === "completed" && run.conclusion !== "success") {
      log(`run ${run.id} failed — re-dispatching workflow`);
      const res = await gh(
        `/repos/${OWNER}/${REPO}/actions/workflows/${WORKFLOW}/dispatches`,
        "POST",
        { ref: "main" },
      );
      if (!res.ok && res.status !== 204) log(`dispatch warning: HTTP ${res.status}`);
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
