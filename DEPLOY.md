# Deploying CargoNova — GitHub + Vercel (or GitHub Pages only)

The site is a **static export** (`npm run build` → `out/`). Everything runs in
the browser — tracking, live map, quote form, language switcher. There is no
backend, database, or API key.

**You never need Node.js on your machine.** Both options below build the site
in the cloud (Vercel or GitHub Actions) and redeploy automatically on every
push to `main`. So the update workflow becomes: *ask for a change → the change
is pushed to GitHub → the site updates itself.*

## Why surge may not open on some devices (diagnosed 2026-08-16)

The surge URL is genuinely public: it loads from this PC (Georgian residential
ISP, Magticom) and from external networks. However, surge.sh returns HTTP 451
("Unavailable For Legal Reasons") to **datacenter/proxy IPs** (anti-bot
policy) — verified from probes in GE, RU, US, DE, TR, UA. It does NOT block
Georgia residential. If a phone/other device fails while this PC works, the
cause is that device's network path (commonly a mobile ISP filtering
surge.sh, or device DNS). Quick tests: same Wi-Fi as the PC; set device DNS to
8.8.8.8/1.1.1.1; try `http://` instead of `https://`; VPN test. The guaranteed
fix is a mainstream CDN domain (Vercel/Netlify/GitHub Pages) which no ISP
filters — see the GitHub → Vercel option below.

## Zero-account link that works on EVERY network (temporary tunnel)

When surge is blocked on some device (mobile ISP / DNS filters), open a
Cloudflare Quick Tunnel — no account, no captcha, nothing to install on the
user's side. It routes through Cloudflare's edge, which no ISP blocks:

```bash
# 1) serve the built site locally
node scripts/serve-out.mjs 4310
# 2) in another terminal, tunnel it (cloudflared needs downloading once)
cloudflared tunnel --url http://localhost:4310
# → prints a URL like https://<random>.trycloudflare.com — open it on any device
```

Caveats: this PC must stay on (the tunnel routes through it), and the URL
changes each time the tunnel restarts. It is a *test/access* link, not a
permanent host — for the permanent URL see Option 1 below (one-time GitHub
account step, then fully automatic).

## Already live right now (zero-account deploy)

**https://cargonova-live.surge.sh** — published from this machine via the
surge.sh CLI (account auto-created, credentials in
`C:\Users\anani\OneDrive\Documents\New folder\.freebuff\surge-account.txt`).

To update it after any code change:
```bash
cd cargonova && npm run build && npx surge out/ cargonova-live.surge.sh
```

The surge session lives in `~/.netrc`, so the command is fully non-interactive.
Free tier caveats: unverified email = reduced rate limits; surge is a hosting
test bed — use GitHub+Vercel below for a permanent, production-grade URL.

---

## Option 1 — GitHub → Vercel (recommended, simplest permanent URL)

1. **Create a GitHub account** if you don't have one: https://github.com/signup
2. **Create a new repository** at https://github.com/new (name e.g. `cargonova`,
   keep it **Private** or **Public**, do NOT add a README — the code is ready).
3. **Push this folder** to that repo. Either:
   - ask me to do it (I'll run the push once the repo URL exists), or
   - run these yourself in the terminal:
     ```bash
     cd cargonova
     git remote add origin https://github.com/<you>/cargonova.git
     git branch -M main
     git push -u origin main
     ```
4. **Connect Vercel:** go to https://vercel.com/new → sign up with GitHub →
   import the `cargonova` repo. Vercel detects Next.js automatically and runs
   `npm run build` **on their servers**.
5. You get a permanent public URL like `https://cargonova.vercel.app` —
   open it on any device. (Optional: add your own domain later in the Vercel
   dashboard.)

**After setup, updates are automatic:** every push to GitHub redeploys the
site in ~1 minute.

---

## Option 2 — GitHub Pages only (no Vercel)

The repo includes `.github/workflows/deploy-pages.yml`, which builds the site
in GitHub's cloud and publishes it to Pages on every push.

1. Steps 1–3 above (create repo, push the code).
2. On GitHub: **Settings → Pages → Source: GitHub Actions** (this activates
   the included workflow).
3. Your site goes live at `https://<you>.github.io/cargonova/` after the first
   build finishes (see the **Actions** tab for progress).

Notes:
- GitHub Pages needs the repo name in the URL, so the workflow passes it to
  Next.js as `basePath` automatically (links/assets are built correctly).
- **Vercel** uses the cleaner root domain; choose Option 1 if you want
  `https://cargonova.vercel.app` instead of the `/cargonova/` subpath.

---

## One-time local checks (optional, only if you have Node.js)

```bash
cd cargonova
npm run build          # static export → out/
node scripts/serve-out.mjs 4310   # preview locally at :4310
```

## Preview the built site before pushing

Run `node scripts/serve-out.mjs 4310` (or just ask me) — the current build is
already served at `http://localhost:4310`.

## Files you can ignore

`cargonova-static.zip` is a throwaway archive for no-account hosts and is
excluded from git (`.gitignore`). `out/` and `.next/` are build artifacts and
are never committed.
