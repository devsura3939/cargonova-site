/**
 * Watch-and-rebuild helper.
 *
 * Watches the project sources and runs `npm run build` (eslint + next build)
 * whenever anything changes, so the static server / Cloudflare tunnel always
 * serve the freshest build. Run detached:
 *
 *   node scripts/watch-rebuild.mjs [logfile]
 *
 * An initial build runs on start, then it rebuilds on every change
 * (debounced). Build failures are logged but never crash the watcher.
 */
import { spawn } from "node:child_process";
import { appendFileSync, mkdirSync } from "node:fs";
import { watch } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const logFile = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.join(root, ".freebuff-watch.log");

const WATCH_DIRS = ["src", "public", "scripts", "."];
const WATCH_FILES = ["next.config.ts", "package.json", "eslint.config.mjs"];
const DEBOUNCE_MS = 2500;

function log(msg) {
  const line = `[${new Date().toISOString()}] ${msg}\n`;
  try {
    mkdirSync(path.dirname(logFile), { recursive: true });
    appendFileSync(logFile, line);
  } catch {
    /* logging must never kill the watcher */
  }
  process.stdout.write(line);
}

function build() {
  return new Promise((resolve) => {
    log("build: starting");
    const child = spawn("npm.cmd", ["run", "build"], {
      cwd: root,
      shell: true,
      windowsHide: true,
      stdio: ["ignore", "pipe", "pipe"],
    });
    let out = "";
    child.stdout.on("data", (d) => (out += d.toString()));
    child.stderr.on("data", (d) => (out += d.toString()));
    child.on("close", (code) => {
      if (code === 0) {
        log("build: OK — out/ updated, tunnel serves the latest build");
      } else {
        log(`build: FAILED (exit ${code}) — keeping previous out/:\n${out.slice(-2000)}`);
      }
      resolve();
    });
    child.on("error", (err) => {
      log(`build: spawn error ${err.message}`);
      resolve();
    });
  });
}

let timer = null;
let running = false;
let pending = false;

function schedule() {
  if (timer) clearTimeout(timer);
  timer = setTimeout(async () => {
    if (running) {
      pending = true;
      return;
    }
    running = true;
    try {
      await build();
    } finally {
      running = false;
      if (pending) {
        pending = false;
        schedule();
      }
    }
  }, DEBOUNCE_MS);
}

// Initial build so the served output is current at startup.
build().then(() => {
  log(`watching ${root} — rebuilds are automatic`);
  for (const dir of WATCH_DIRS) {
    try {
      watch(path.join(root, dir), { recursive: true }, () => schedule());
    } catch (err) {
      log(`watch ${dir}: ${err.message}`);
    }
  }
  for (const file of WATCH_FILES) {
    try {
      watch(path.join(root, file), () => schedule());
    } catch {
      /* ignore */
    }
  }
});
