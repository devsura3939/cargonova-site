import type { Metadata } from "next";
import { ContactPageContent } from "@/components/forms/ContactPageContent";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Contact Us",
  description:
    "Contact the BRB Enterprise logistics team: sales and quotes, logistics support, office location in Berlin, and business hours.",
  path: "/contact",
});

export default function ContactPage() {
  return <ContactPageContent />;
}
