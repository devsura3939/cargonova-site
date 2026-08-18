import type { FaqItem } from "@/types";

export const faqCategories = [
  "General",
  "Shipment",
  "Pricing",
  "Tracking",
  "Insurance",
  "Cargo Requirements",
  "International Transport",
] as const;

/** Georgian labels for the category chips. */
export const faqCategoryKa: Record<string, string> = {
  General: "ზოგადი",
  Shipment: "გადაზიდვა",
  Pricing: "ფასები",
  Tracking: "თვალთვალი",
  Insurance: "დაზღვევა",
  "Cargo Requirements": "ტვირთის მოთხოვნები",
  "International Transport": "საერთაშორისო ტრანსპორტირება",
};

export const faqs: FaqItem[] = [
  {
    category: "General",
    question: "What does BRB Enterprise do?",
    answer:
      "We provide ground freight, FTL and LTL transport, express cargo, refrigerated logistics, oversized transport, warehousing, and managed logistics programs for B2B customers across Europe and international corridors.",
    questionKa: "რას აკეთებს BRB Enterprise?",
    answerKa:
      "ჩვენ გთავაზობთ სახმელეთო ტვირთებს, FTL და LTL ტრანსპორტირებას, ექსპრეს ტვირთებს, რეფრიჟერატორულ ლოგისტიკას, მსხვილი ტვირთების გადაზიდვას, საწყობსა და მართულ ლოგისტიკურ პროგრამებს B2B კლიენტებისთვის ევროპასა და საერთაშორისო დერეფნებზე.",
  },
  {
    category: "General",
    question: "Which regions do you cover?",
    answer:
      "Our core network covers Central and Western Europe with daily scheduled lanes, extended to Southern, Eastern, and Nordic Europe through partner corridors. International services connect EU hubs with the Caucasus, Middle East, and Central Asia.",
    questionKa: "რომელ რეგიონებს ფარავთ?",
    answerKa:
      "ჩვენი ძირითადი ქსელი მოიცავს ცენტრალურ და დასავლეთ ევროპას ყოველდღიური გრაფიკით, გაფართოებული სამხრეთ, აღმოსავლეთ და ჩრდილოეთ ევროპისკენ პარტნიორი დერეფნებით. საერთაშორისო სერვისები აკავშირებს ევროკავშირის ჰაბებს კავკასიასთან, ახლო აღმოსავლეთთან და ცენტრალურ აზიასთან.",
  },
  {
    category: "General",
    question: "How do I get a quote?",
    answer:
      "Use the quote form with your route and cargo details. Most requests receive a confirmed price within 4 business hours, and express requests within 60 minutes.",
    questionKa: "როგორ მივიღო შეთავაზება?",
    answerKa:
      "გამოიყენეთ შეთავაზების ფორმა მარშრუტისა და ტვირთის მონაცემებით. მოთხოვნების უმეტესობაზე დადასტურებულ ფასს 4 სამუშაო საათში მიიღებთ, ექსპრეს მოთხოვნებზე კი — 60 წუთში.",
  },
  {
    category: "Shipment",
    question: "How far in advance should I book transport?",
    answer:
      "Standard ground freight and LTL can be booked 24–48 hours ahead. FTL benefits from 2–3 days lead time, oversized cargo from 2–4 weeks, and express is available on request with availability confirmed within 30 minutes.",
    questionKa: "რამდენად ადრე უნდა დავჯავშნო ტრანსპორტი?",
    answerKa:
      "სტანდარტული სახმელეთო ტვირთები და LTL იჯავშნება 24–48 საათით ადრე. FTL-ისთვის სასურველია 2–3 დღით ადრე, მსხვილი ტვირთისთვის — 2–4 კვირით, ხოლო ექსპრეს ხელმისაწვდომია მოთხოვნით, დადასტურებით 30 წუთში.",
  },
  {
    category: "Shipment",
    question: "What is the difference between FTL and LTL?",
    answer:
      "FTL (Full Truckload) gives you a dedicated vehicle for your cargo alone — faster and with no transfers. LTL (Less-than-Truckload) shares capacity with other freight, so you pay only for the space you use on smaller loads.",
    questionKa: "რა განსხვავებაა FTL-სა და LTL-ს შორის?",
    answerKa:
      "FTL (სრული დატვირთვა) გაძლევთ მხოლოდ თქვენი ტვირთისთვის გამოყოფილ მანქანას — უფრო სწრაფად და გადატვირთვების გარეშე. LTL (ნაწილობრივი დატვირთვა) იზიარებს ტევადობას სხვა ტვირთებთან, ამიტომ იხდით მხოლოდ იმ სივრცეს, რომელსაც იყენებთ მცირე ტვირთებისთვის.",
  },
  {
    category: "Shipment",
    question: "Can you pick up and deliver at specific times?",
    answer:
      "Yes. Time windows are confirmed at booking, and most routes support early, standard, and evening windows. Express service offers two-hour pickup windows.",
    questionKa: "შეგიძლიათ კონკრეტულ დროს ჩატვირთვა და მიწოდება?",
    answerKa:
      "დიახ. დროის ფანჯრები დასტურდება დაჯავშნისას და უმეტეს მარშრუტზე ხელმისაწვდომია დილის, სტანდარტული და საღამოს ფანჯრები. ექსპრეს სერვისი გთავაზობთ ორსაათიან ჩატვირთვის ფანჯრებს.",
  },
  {
    category: "Pricing",
    question: "How is freight pricing calculated?",
    answer:
      "Pricing depends on route, cargo type, weight or volume, pallet count, required equipment, and urgency. FTL is quoted per vehicle, LTL per pallet or m³, and special transport is quoted per project after assessment.",
    questionKa: "როგორ გამოითვლება ტვირთის ფასი?",
    answerKa:
      "ფასი დამოკიდებულია მარშრუტზე, ტვირთის ტიპზე, წონაზე ან მოცულობაზე, პალეტების რაოდენობაზე, საჭირო ტექნიკასა და გადაუდებლობაზე. FTL ფასდება მანქანაზე, LTL — პალეტზე ან კუბურ მეტრზე, ხოლო სპეციალური ტრანსპორტი — პროექტის მიხედვით შეფასების შემდეგ.",
  },
  {
    category: "Pricing",
    question: "Are there fuel surcharges?",
    answer:
      "Quotes are valid for 7 days and include current fuel levels. Long-term programs are priced with a transparent fuel index mechanism so neither side carries fuel risk alone.",
    questionKa: "არსებობს თუ არა საწვავის დანამატი?",
    answerKa:
      "შეთავაზებები მოქმედებს 7 დღე და მოიცავს მიმდინარე საწვავის დონეს. გრძელვადიანი პროგრამები ფასდება გამჭვირვალე საწვავის ინდექსის მექანიზმით, რომ საწვავის რისკი არცერთ მხარეს არ ეკისროს მარტო.",
  },
  {
    category: "Tracking",
    question: "How do I track my shipment?",
    answer:
      "Enter your tracking number (format CRG-000000) on the tracking page. You'll see current status, checkpoint history, ETA, and progress — no login required for single shipments.",
    questionKa: "როგორ ვითვალთვალო ჩემი ტვირთი?",
    answerKa:
      "შეიყვანეთ თქვენი თვალთვალის ნომერი (ფორმატი CRG-000000) თვალთვალის გვერდზე. ნახავთ მიმდინარე სტატუსს, საკონტროლო პუნქტების ისტორიას, ETA-ს და პროგრესს — ერთი ტვირთისთვის რეგისტრაცია არ არის საჭირო.",
  },
  {
    category: "Tracking",
    question: "Why is my tracking status not updating?",
    answer:
      "Most checkpoints update on scan or GPS events. If nothing changes for more than 12 hours during transit, contact our support team — they can see telemetry beyond the public feed.",
    questionKa: "რატომ არ განახლდება ჩემი თვალთვალის სტატუსი?",
    answerKa:
      "საკონტროლო პუნქტების უმეტესობა განახლდება სკანირების ან GPS მოვლენებზე. თუ ტრანზიტის დროს 12 საათზე მეტი არაფერი იცვლება, დაუკავშირდით ჩვენს მხარდაჭერას — მათ ტელემეტრია საჯარო არხს მიღმაც ჩანს.",
  },
  {
    category: "Insurance",
    question: "Is my cargo insured during transport?",
    answer:
      "Every shipment includes base carrier liability. We also arrange full-value cargo insurance on request, quoted per shipment at booking.",
    questionKa: "დაზღვეულია თუ არა ჩემი ტვირთი ტრანსპორტირების დროს?",
    answerKa:
      "ყველა გადაზიდვა მოიცავს გადამზიდველის საბაზისო პასუხისმგებლობას. ასევე შეგვიძლია მოთხოვნით მოვაწყოთ ტვირთის სრულღირებული დაზღვევა, ფასი გამოითვლება დაჯავშნისას თითო გადაზიდვაზე.",
  },
  {
    category: "Insurance",
    question: "What should I do if cargo is damaged?",
    answer:
      "Note the damage on the delivery receipt, photograph the cargo, and file a claim within 7 days through your account manager or support. Claims are typically resolved within 15 business days.",
    questionKa: "რა უნდა გავაკეთო, თუ ტვირთი დაზიანდა?",
    answerKa:
      "მონიშნეთ დაზიანება მიწოდების დოკუმენტზე, გადაიღეთ ტვირთი და შეიტანეთ პრეტენზია 7 დღის ვადაში თქვენი მენეჯერის ან მხარდაჭერის მეშვეობით. პრეტენზიები, როგორც წესი, წყდება 15 სამუშაო დღეში.",
  },
  {
    category: "Cargo Requirements",
    question: "What cargo can you not transport?",
    answer:
      "We do not carry hazardous materials outside our certified hazmat lanes, and we never carry illegal goods. Weapons, valuables, and live animals are handled under special arrangements only.",
    questionKa: "რომელი ტვირთის გადაზიდვას არ ახორციელებთ?",
    answerKa:
      "საშიშ მასალებს არ ვატარებთ სერტიფიცირებული ხაზების გარეთ და არასდროს ვატარებთ არალეგალურ საქონელს. იარაღი, ძვირფასი ნივთები და ცოცხალი ცხოველები გადაიზიდება მხოლოდ სპეციალური შეთანხმებით.",
  },
  {
    category: "Cargo Requirements",
    question: "How should pallets be prepared?",
    answer:
      "Pallets should be stable, stackable per your load plan, and stretch-wrapped or shrink-wrapped. Weight should not exceed the pallet's rated capacity. We can advise on special securing for unusual loads.",
    questionKa: "როგორ უნდა მომზადდეს პალეტები?",
    answerKa:
      "პალეტები უნდა იყოს სტაბილური, დასტექვადი ჩატვირთვის გეგმის მიხედვით და შეფუთული ფირით ან შრინკ ფირით. წონა არ უნდა აღემატებოდეს პალეტის ნომინალურ ტევადობას. არასტანდარტული ტვირთებისთვის შეგვიძლია ვურჩიოთ სპეციალური დამაგრება.",
  },
  {
    category: "International Transport",
    question: "Do you handle customs documentation?",
    answer:
      "Yes. For international routes we prepare transport documents, coordinate with customs brokers at borders, and pre-clear where the corridor allows.",
    questionKa: "აკეთებთ თუ არა საბაჟო დოკუმენტაციას?",
    answerKa:
      "დიახ. საერთაშორისო მარშრუტებზე ვამზადებთ სატრანსპორტო დოკუმენტებს, ვკოორდინირებთ საბაჟო ბროკერებთან საზღვრებზე და სადაც დერეფანი იძლევა საშუალებას, წინასწარ ვასუფთავებთ.",
  },
  {
    category: "International Transport",
    question: "What is your coverage beyond Europe?",
    answer:
      "We operate international corridors to the Caucasus, Middle East, and Central Asia, and partner with vetted operators for intercontinental freight. Route-specific capabilities are confirmed at quote stage.",
    questionKa: "რა გაქვთ ევროპის მიღმა?",
    answerKa:
      "ვმოქმედებთ საერთაშორისო დერეფნებზე კავკასიის, ახლო აღმოსავლეთისა და ცენტრალური აზიის მიმართულებით და კონტინენტთაშორისო ტვირთებისთვის ვთანამშრომლობთ შემოწმებულ ოპერატორებთან. კონკრეტული მარშრუტის შესაძლებლობები დასტურდება შეთავაზების ეტაპზე.",
  },
];

export function searchFaqs(query: string): FaqItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return faqs;
  return faqs.filter(
    (f) =>
      f.question.toLowerCase().includes(q) ||
      f.answer.toLowerCase().includes(q) ||
      f.category.toLowerCase().includes(q),
  );
}
