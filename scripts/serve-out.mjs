/**
 * Minimal static server for previewing the `out/` static export locally.
 * Usage: node scripts/serve-out.mjs [port]   (default 4310)
 * Serves the built folder the same way Netlify Drop / any static host would.
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";

const port = Number(process.argv[2] ?? 4310);
const root = path.resolve("out");

const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".xml": "application/xml",
  ".txt": "text/plain",
  ".woff2": "font/woff2",
};

const server = http.createServer((req, res) => {
  let p;
  try {
    p = decodeURIComponent((req.url ?? "/").split("?")[0]);
  } catch {
    p = "/";
  }
  if (p === "/") p = "/index.html";
  let f = path.join(root, p);
  // Clean URLs like Netlify Drop: /about → about.html when present.
  if (!f.endsWith(".html") && !path.extname(f)) {
    try {
      if (fs.statSync(f + ".html").isFile()) f = f + ".html";
    } catch {}
  }
  try {
    if (fs.statSync(f).isDirectory()) f = path.join(f, "index.html");
  } catch {}
  fs.readFile(f, (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("404 not found: " + p);
      return;
    }
    res.writeHead(200, { "Content-Type": types[path.extname(f)] ?? "application/octet-stream" });
    res.end(data);
  });
});

server.listen(port, () => console.log(`Static preview of out/ → http://localhost:${port}`));
