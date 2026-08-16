"use client";

import dynamic from "next/dynamic";

const LiveWorldMap = dynamic(() => import("@/components/map/LiveWorldMap").then((m) => m.LiveWorldMap), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center rounded-3xl border border-soft bg-surface-muted text-sm text-muted">
      Loading live fleet…
    </div>
  ),
});

export function LiveMapMount() {
  return <LiveWorldMap />;
}
