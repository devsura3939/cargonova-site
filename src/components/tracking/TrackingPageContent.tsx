"use client";

import { PageHero } from "@/components/shared/PageHero";
import { Container } from "@/components/shared/Container";
import { TrackingForm } from "@/components/tracking/TrackingForm";
import { useLang } from "@/lib/i18n";

const FEATURE_KEYS = [
  { title: "trk.liveStatus", text: "trk.liveStatusText" },
  { title: "trk.checkpointHistory", text: "trk.checkpointHistoryText" },
  { title: "trk.noLogin", text: "trk.noLoginText" },
] as const;

export function TrackingPageContent() {
  const { t } = useLang();

  return (
    <>
      <PageHero
        crumb={[{ name: t("nav.tracking"), path: "/tracking" }]}
        eyebrow="Shipment tracking"
        title={t("trk.title")}
        description={t("trk.sub")}
      >
        <TrackingForm />
      </PageHero>

      <section className="bg-surface-muted py-20 sm:py-24">
        <Container className="max-w-4xl">
          <div className="grid gap-8 sm:grid-cols-3">
            {FEATURE_KEYS.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-soft bg-surface p-6"
              >
                <h2 className="font-display font-bold text-strong">{t(item.title)}</h2>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">
                  {t(item.text)}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
