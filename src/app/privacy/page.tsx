import type { Metadata } from "next";
import { LegalPage } from "@/components/shared/LegalPage";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy",
  description: "How CargoNova Logistics collects, uses, and protects your personal data.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="August 2026"
      sections={[
        {
          heading: "Who we are",
          body: [
            "CargoNova Logistics operates this website. This policy explains what personal data we collect, why we collect it, and the rights you have over it. This is a demo website; contact details below are placeholders.",
          ],
        },
        {
          heading: "Data we collect",
          body: [
            "When you request a quote, track a shipment, or contact us, we collect the information you provide: name, company, email, phone, and shipment details such as route and cargo type.",
            "We also collect limited technical data — device type, browser, and pages visited — to keep the site working and understand how it's used.",
          ],
        },
        {
          heading: "How we use your data",
          body: [
            "Quote and contact information is used to respond to your request and, if you proceed, to operate your shipment. Shipment tracking data (tracking numbers) is used to provide the tracking service.",
            "We do not sell personal data. We share it only with service providers who help operate the website (for example, email delivery) under appropriate safeguards.",
          ],
        },
        {
          heading: "Retention",
          body: [
            "Quote requests are retained for up to 24 months for customer service and accounting purposes. Tracking lookups are not stored on our side for visitors who are not customers.",
          ],
        },
        {
          heading: "Your rights",
          body: [
            "Depending on your jurisdiction (including the GDPR in the EU/EEA), you may have rights to access, correct, delete, or export your personal data, and to object to certain processing.",
            "To exercise any of these rights, contact us at the address below and we will respond within 30 days.",
          ],
        },
        {
          heading: "Cookies",
          body: [
            "This site uses only essential technical storage to function. If analytics or advertising cookies are added later, this policy will be updated and consent will be requested where required.",
          ],
        },
        {
          heading: "Contact",
          body: [
            "Data protection questions: hello@cargonova.example.com. CargoNova Logistics, Kurfürstendamm 21, 10719 Berlin, Germany.",
          ],
        },
      ]}
    />
  );
}
