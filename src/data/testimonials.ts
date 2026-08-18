import type { Testimonial } from "@/types";

export const testimonials: Testimonial[] = [
  {
    company: "Helvetia Industrial Components",
    person: "Marta Kowalska",
    role: "Head of Supply Chain",
    quote:
      "We moved our inbound component network to BRB Enterprise two years ago. Line-stoppage risk is down, and for the first time we can show the board a real on-time number — 99.1% across the program.",
    metric: "99.1%",
    metricLabel: "program on-time delivery",
    ka: {
      company: "Helvetia Industrial Components",
      role: "მიწოდების ჯაჭვის ხელმძღვანელი",
      quote:
        "შემომავალი კომპონენტების ქსელი BRB Enterprise-ზე ორი წლის წინ გადავიყვანეთ. საწარმოო გაჩერებების რისკი შემცირდა და პირველად შეგვიძლია გამგეობას რეალური დროულობის მაჩვენებელი ვაჩვენოთ — 99.1% მთელ პროგრამაზე.",
      metricLabel: "პროგრამის დროული მიწოდება",
    },
  },
  {
    company: "Nordic Fresh Foods",
    person: "Thomas Lindqvist",
    role: "Operations Director",
    quote:
      "The temperature logs arrive with the POD, every time, without us asking. That single change took a full audit item off our customer scorecard.",
    metric: "100%",
    metricLabel: "cold-chain documentation",
    ka: {
      company: "Nordic Fresh Foods",
      role: "ოპერაციების დირექტორი",
      quote:
        "ტემპერატურის ჟურნალები POD-თან ერთად მოდის, ყოველ ჯერზე, მოთხოვნის გარეშე. ამ ერთმა ცვლილებამ ჩვენი კლიენტის შეფასების ბარათიდან მთელი აუდიტის პუნქტი მოხსნა.",
      metricLabel: "ცივი ჯაჭვის დოკუმენტაცია",
    },
  },
  {
    company: "Baumgartner Bau GmbH",
    person: "Jonas Baumgartner",
    role: "Project Manager",
    quote:
      "Two oversized deliveries this year, both surveyed, permitted, and on site when the crane crew arrived. Their special transport desk just works.",
    metric: "0 days",
    metricLabel: "project delays caused by transport",
    ka: {
      company: "Baumgartner Bau GmbH",
      role: "პროექტის მენეჯერი",
      quote:
        "წელს ორი განსაკუთრებული ზომის მიწოდება — ორივე გაზომილი, ნებართვიანი და ადგილზე იმ დროს, როცა ამწის გუნდი მივიდა. მათი სპეციალური ტრანსპორტირების განყოფილება უბრალოდ მუშაობს.",
      metricLabel: "ტრანსპორტით გამოწვეული დაგვიანება",
    },
  },
  {
    company: "Vela Retail Group",
    person: "Anna Reyes",
    role: "Logistics Manager",
    quote:
      "Peak season used to mean panic. Now we stage in their warehouse and let the network do the timing. Store fill rates held at 98% through Q4.",
    metric: "98%",
    metricLabel: "store fill rate at peak",
    ka: {
      company: "Vela Retail Group",
      role: "ლოგისტიკის მენეჯერი",
      quote:
        "პიკის სეზონი ადრე პანიკას ნიშნავდა. ახლა მათ საწყობში ვაწყობთ მარაგს და ქსელი დროზე ზრუნავს. მაღაზიების შევსების მაჩვენებელი Q4-ში 98%-ზე შევინარჩუნეთ.",
      metricLabel: "მაღაზიების შევსება პიკში",
    },
  },
  {
    company: "MediCore Devices",
    person: "Dr. Stefan Berger",
    role: "Quality & Compliance Lead",
    quote:
      "GDP-aligned handling, validated units, and a compliance file we can actually produce in an audit. That is what we pay for, and that is what we get.",
    metric: "GDP",
    metricLabel: "compliant pharma transport",
    ka: {
      company: "MediCore Devices",
      role: "ხარისხისა და შესაბამისობის ხელმძღვანელი",
      quote:
        "GDP-თან შესაბამისი მოპყრობა, ვალიდირებული ტრანსპორტი და შესაბამისობის ფაილი, რომელსაც აუდიტზე ნამდვილად წარმოვადგენთ. სწორედ ამას ვიხდით და სწორედ ამას ვიღებთ.",
      metricLabel: "GDP-შესაბამისი ფარმა ტრანსპორტი",
    },
  },
  {
    company: "Atlas E-Commerce",
    person: "Lena Fischer",
    role: "Fulfillment Lead",
    quote:
      "Their express lanes turned our next-day promise from a hope into a schedule. Customers notice, and so does our return rate.",
    metric: "-22%",
    metricLabel: "delivery-related support tickets",
    ka: {
      company: "Atlas E-Commerce",
      role: "შეკვეთების შესრულების ხელმძღვანელი",
      quote:
        "მათი ექსპრეს ხაზებმა ჩვენი მეორე დღის დაპირება იმედიდან გრაფიკად აქცია. მომხმარებელი ამას ამჩნევს და ჩვენი დაბრუნების მაჩვენებელიც.",
      metricLabel: "მიწოდებასთან დაკავშირებული საჩივრები",
    },
  },
];
