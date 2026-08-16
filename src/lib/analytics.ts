/**
 * Analytics abstraction.
 *
 * Wire real providers (Google Analytics / PostHog) by initializing them in
 * a client component and pointing `trackEvent` at their API. No real keys
 * are shipped; the default implementation is a safe no-op.
 */

export type AnalyticsEvent =
  | "quote_started"
  | "quote_completed"
  | "tracking_search"
  | "contact_submitted"
  | "career_submitted"
  | "phone_clicked"
  | "email_clicked"
  | "newsletter_subscribed";

export function trackEvent(event: AnalyticsEvent, properties?: Record<string, unknown>) {
  if (process.env.NODE_ENV === "development") {
    console.info(`[analytics] ${event}`, properties ?? {});
  }
  // Future: window.gtag?.("event", event, properties)
  // Future: window.posthog?.capture(event, properties)
}

export function trackPageView(path: string) {
  // Future: window.gtag?.("config", "G-XXXXXXX", { page_path: path })
  // Future: window.posthog?.capture("$pageview", { path })
  void path;
}
