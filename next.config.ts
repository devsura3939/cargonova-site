import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Hide the floating "N" devtools indicator in development.
  devIndicators: false,
  // Static export: `npm run build` emits a plain `out/` folder that can be
  // hosted anywhere for free (Netlify Drop, tiiny.host, GitHub Pages, …).
  // Everything is client-rendered, so no server is required.
  output: "export",
  // GitHub Pages serves project sites under /<repo>/. The deploy workflow sets
  // BASE_PATH to the repo name; on Vercel/Netlify the site sits at the root so
  // the env var is absent and this stays "". NEXT_PUBLIC_BASE_PATH is threaded
  // through to client components so raw asset URLs get the same prefix.
  basePath: process.env.BASE_PATH || process.env.NEXT_PUBLIC_BASE_PATH || "",
  images: {
    // Static hosting has no image optimizer; use the remote images as-is.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/photo-*",
      },
    ],
  },
};

export default nextConfig;
