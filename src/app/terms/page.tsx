import type { Metadata } from "next";
import { LegalPage } from "@/components/shared/LegalPage";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Terms of Service",
  description: "Terms governing the use of the CargoNova Logistics website and services.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      titleKa="მომსახურების პირობები"
      updated="August 2026"
      sections={[
        {
          heading: "Using this website",
          body: [
            "This website provides information about CargoNova Logistics services and tools for requesting quotes and tracking shipments. By using it you agree to these terms. This is a demo website; no binding transport contracts are formed through it.",
          ],
        },
        {
          heading: "Quotes and bookings",
          body: [
            "Quote requests submitted through this website are estimates, not binding offers. A binding transport contract is formed only when we confirm a booking in writing and you accept it.",
            "Prices quoted are valid for 7 days unless stated otherwise and may be affected by fuel, capacity, or route changes notified to you before booking.",
          ],
        },
        {
          heading: "Shipment tracking",
          body: [
            "Tracking information is provided for convenience and reflects the latest available scan or telemetry data. While we work to keep it accurate, tracking data does not create contractual delivery guarantees on its own.",
          ],
        },
        {
          heading: "Acceptable use",
          body: [
            "You agree not to misuse the website, attempt to access systems you are not authorized for, or submit false or harmful information through forms. We may suspend access for violations.",
          ],
        },
        {
          heading: "Liability",
          body: [
            "Transport of goods is governed by the applicable carriage conventions and our booking terms, which prevail over these website terms in case of conflict. To the extent permitted by law, this website is provided as-is without warranties.",
          ],
        },
        {
          heading: "Contact",
          body: [
            "Questions about these terms: hello@cargonova.example.com. CargoNova Logistics, Kurfürstendamm 21, 10719 Berlin, Germany.",
          ],
        },
      ]}
      sectionsKa={[
        {
          heading: "ვებსაიტის გამოყენება",
          body: [
            "ეს ვებსაიტი გთავაზობთ ინფორმაციას CargoNova Logistics-ის მომსახურებებისა და ხელსაწყოების შესახებ შეთავაზების მოთხოვნისა და ტვირთების თვალთვალისთვის. მისი გამოყენებით თქვენ ეთანხმებით ამ პირობებს. ეს საჩვენებელი ვებსაიტია; მისი მეშვეობით სავალდებულო სატრანსპორტო ხელშეკრულებები არ იდება.",
          ],
        },
        {
          heading: "შეთავაზებები და დაჯავშნა",
          body: [
            "ამ ვებსაიტით გაგზავნილი შეთავაზების მოთხოვნები შეფასებებია და არა სავალდებულო წინადადებები. სავალდებულო სატრანსპორტო ხელშეკრულება იდება მხოლოდ მაშინ, როცა დაჯავშნას წერილობით დავადასტურებთ და თქვენ მას მიიღებთ.",
            "დაფასებული ფასები მოქმედებს 7 დღის განმავლობაში, თუ სხვაგვარად არ არის მითითებული, და შეიძლება დაზარალდეს საწვავის, ტევადობის ან მარშრუტის ცვლილებებით, რაზეც დაჯავშნამდე გაცნობებთ.",
          ],
        },
        {
          heading: "ტვირთის თვალთვალი",
          body: [
            "თვალთვალის ინფორმაცია მოცემულია მოხერხებულობისთვის და ასახავს უახლეს ხელმისაწვდომ სკანირების ან ტელემეტრიის მონაცემებს. მიუხედავად იმისა, რომ სიზუსტეზე ვზრუნავთ, თვალთვალის მონაცემები თავისთავად არ ქმნის ხელშეკრულებით გათვალისწინებულ მიწოდების გარანტიებს.",
          ],
        },
        {
          heading: "გამოყენების წესები",
          body: [
            "თქვენ ეთანხმებით, რომ არ გამოიყენებთ ვებსაიტს ბოროტად, არ შეეცდებით სისტემებში არაავტორიზებულ წვდომას და არ გამოაგზავნით ყალბ ან მავნე ინფორმაციას ფორმების მეშვეობით. დარღვევის შემთხვევაში შეიძლება წვდომა შევზღუდოთ.",
          ],
        },
        {
          heading: "პასუხისმგებლობა",
          body: [
            "საქონლის გადაზიდვა რეგულირდება გადაზიდვის შესაბამისი კონვენციებითა და ჩვენი დაჯავშნის პირობებით, რომლებიც კონფლიქტის შემთხვევაში უპირატესობას იძენენ ამ ვებსაიტის პირობებზე. კანონით დაშვებულ ფარგლებში ეს ვებსაიტი გათვალისწინებულია ისე, როგორც არის, გარანტიების გარეშე.",
          ],
        },
        {
          heading: "კონტაქტი",
          body: [
            "კითხვები ამ პირობებთან დაკავშირებით: hello@cargonova.example.com. CargoNova Logistics, Kurfürstendamm 21, 10719 Berlin, Germany.",
          ],
        },
      ]}
    />
  );
}
