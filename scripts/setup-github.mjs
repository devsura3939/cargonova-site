#!/usr/bin/env node
/**
 * One-shot GitHub + Pages setup for CargoNova.
 *
 * Run AFTER the human step (creating a GitHub account + fine-grained token):
 *   node scripts/setup-github.mjs <token>   (or set GH_TOKEN / paste the token
 *   into .freebuff/github-token.txt next to surge-account.txt)
 *
 * Does, fully automated:
 *   1. Resolve the account from the token
 *   2. Create the public `cargonova` repo if it doesn't exist
 *   3. Push the local `main` branch
 *   4. Enable GitHub Pages (workflow build_type — the included
 *      .github/workflows/deploy-pages.yml builds and publishes on push)
 *   5. Print the permanent public URL
 */
import { execSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const REPO = "cargonova";

function tokenFromArgv() {
  const arg = process.argv[2];
  if (arg && (arg.startsWith("github_pat_") || arg.startsWith("ghp_"))) return arg;
  if (process.env.GH_TOKEN) return process.env.GH_TOKEN;
  const candidates = [
    join(dirname(fileURLToPath(import.meta.url)), "..", "..", ".freebuff", "github-token.txt"),
  ];
  for (const p of candidates) {
    try {
      if (existsSync(p)) {
        const t = readFileSync(p, "utf8").trim().split(/\s+/).pop();
        if (t && (t.startsWith("github_pat_") || t.startsWith("ghp_"))) return t;
      }
    } catch {
      /* keep looking */
    }
  }
  throw new Error(
    "No GitHub token found. Do the one human step first (see DEPLOY.md / .freebuff/deployment-handoff.md): " +
      "create a GitHub account, generate a fine-grained token (Repository permissions → Contents: Read and write, " +
      "Repository access: Public repositories), then save it to .freebuff/github-token.txt or pass it as an argument.",
  );
}

async function gh(apiPath, method = "GET", body, token) {
  const res = await fetch(`https://api.github.com${apiPath}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "cargonova-setup",
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) {
    throw new Error(`GitHub API ${method} ${apiPath} → ${res.status}: ${data?.message ?? text}`);
  }
  return data;
}

const token = tokenFromArgv();

// 1. Who am I?
const user = await gh("/user", "GET", null, token);
console.log(`✓ Authenticated as ${user.login}`);

// 2. Create repo if missing
let repo;
try {
  repo = await gh(`/repos/${user.login}/${REPO}`, "GET", null, token);
  console.log(`✓ Repo already exists: ${repo.html_url}`);
} catch {
  repo = await gh("/user/repos", "POST", { name: REPO, description: "CargoNova — premium logistics & cargo transportation website", homepage: `https://${user.login}.github.io/${REPO}/` }, token);
  console.log(`✓ Created repo: ${repo.html_url}`);
}

// 3. Push main (token used only for this one push, never stored in remote URL)
const pushUrl = `https://x-access-token:${token}@github.com/${user.login}/${REPO}.git`;
try {
  execSync(`git push ${pushUrl} main:main`, { stdio: "inherit", cwd: join(dirname(fileURLToPath(import.meta.url)), "..") });
} catch (e) {
  console.error("✗ Push failed — see output above.");
  process.exit(1);
}
console.log("✓ Pushed main");

// Record the remote WITHOUT the token so future agent pushes are simple.
try {
  execSync(`git remote remove origin`, { stdio: "ignore" });
} catch {}
execSync(`git remote add origin https://github.com/${user.login}/${REPO}.git`, { stdio: "ignore" });
console.log("✓ Remote origin set");

// 4. Enable GitHub Pages (workflow build type → the Actions workflow deploys)
try {
  await gh(`/repos/${user.login}/${REPO}/pages`, "POST", { build_type: "workflow" }, token);
  console.log("✓ GitHub Pages enabled (workflow source)");
} catch (e) {
  console.log(`ℹ Pages enable: ${e.message.split("→").pop().trim()} — the first push's workflow may enable it automatically.`);
}

console.log(`\n🌐 Permanent public URL: https://${user.login}.github.io/${REPO}/`);
console.log("   First deploy runs in the repo's Actions tab (~1 min). Every future push auto-redeploys.");
console.log("   The token stays local; nothing secret is committed.");
