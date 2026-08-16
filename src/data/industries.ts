import type { Industry } from "@/types";

export const industries: Industry[] = [
  {
    slug: "manufacturing",
    name: "Manufacturing",
    icon: "factory",
    problem: "Production lines depend on components arriving in the right sequence, at the right time — a single late delivery stops a line.",
    challenge: "Synchronizing inbound components and outbound finished goods across multiple plants.",
    solution:
      "Scheduled daily and weekly lanes between your plants and suppliers, with slot-based delivery windows and live visibility so planners always know where inventory is.",
    services: ["ground-freight", "full-truckload", "business-logistics"],
    benefit: "Reduced line-stoppage risk and predictable inbound flow.",
    nameKa: "წარმოება",
    problemKa:
      "საწარმოო ხაზები დამოკიდებულია კომპონენტების სწორი თანმიმდევრობით და დროულად მიწოდებაზე — ერთი დაგვიანებული მიწოდებაც აჩერებს ხაზს.",
    challengeKa: "შემომავალი კომპონენტებისა და მზა პროდუქციის სინქრონიზაცია მრავალ ქარხანას შორის.",
    solutionKa:
      "დაგეგმილი ყოველდღიური და ყოველკვირეული რეისები თქვენს ქარხნებსა და მომწოდებლებს შორის, სლოტზე დაფუძნებული მიწოდების ფანჯრებით და ცოცხალი ხილვადობით, რომ პლანერებმა ყოველთვის იცოდნენ, სად არის მარაგი.",
    benefitKa: "ხაზის გაჩერების რისკის შემცირება და პროგნოზირებადი შემომავალი ნაკადი.",
  },
  {
    slug: "retail",
    name: "Retail",
    icon: "shopping-bag",
    problem: "Seasonal peaks, store replenishment, and omnichannel demand make inventory timing everything.",
    challenge: "Matching inbound freight to promotion calendars and store opening hours.",
    solution:
      "Distribution programs with staging in our warehousing network, then just-in-time delivery to stores and e-commerce fulfillment hubs.",
    services: ["ltl", "warehousing", "ground-freight"],
    benefit: "Stores stocked when they need to be, without overflow inventory.",
    nameKa: "საცალო ვაჭრობა",
    problemKa:
      "სეზონური პიკები, მაღაზიების შევსება და ომნიჩანელური მოთხოვნა მარაგის დროულობას გადამწყვეტს ხდის.",
    challengeKa: "შემომავალი ტვირთების შეთანხმება სარეკლამო კალენდრებთან და მაღაზიების მუშაობის საათებთან.",
    solutionKa:
      "დისტრიბუციის პროგრამები ჩვენს საწყობის ქსელში სტეიჯინგით, შემდეგ კი ზუსტად დროული მიწოდება მაღაზიებსა და ელექტრონული კომერციის ჰაბებში.",
    benefitKa: "მაღაზიები დროულად ივსება, ზედმეტი მარაგის გარეშე.",
  },
  {
    slug: "construction",
    name: "Construction",
    icon: "hard-hat",
    problem: "Site deadlines are contractual — materials arriving late cascade into penalties.",
    challenge: "Moving heavy, irregular loads to sites with limited access and tight windows.",
    solution:
      "FTL and oversized transport with route surveys for every site, plus crane-coordinated unloading for structural and heavy components.",
    services: ["oversized", "full-truckload", "ground-freight"],
    benefit: "Materials on site when the crane and crew are ready.",
    nameKa: "მშენებლობა",
    problemKa:
      "ობიექტის ვადები სახელშეკრულებოა — მასალების დაგვიანება ჯარიმებში გადაიზრდება.",
    challengeKa: "მძიმე და არასტანდარტული ტვირთების გადაადგილება ობიექტებზე შეზღუდული მისასვლელით და მკაცრი ფანჯრებით.",
    solutionKa:
      "FTL და მსხვილი ტვირთების ტრანსპორტირება მარშრუტის შესწავლით თითოეული ობიექტისთვის, პლუს ამწესთან კოორდინირებული გადმოტვირთვა კონსტრუქციული და მძიმე ელემენტებისთვის.",
    benefitKa: "მასალები ადგილზეა მაშინ, როცა ამწე და გუნდი მზადაა.",
  },
  {
    slug: "automotive",
    name: "Automotive",
    icon: "car",
    problem: "Automotive supply chains run on exact sequences and zero tolerance for damage.",
    challenge: "Just-in-sequence delivery of parts with damage-free handling.",
    solution:
      "Dedicated FTL programs with sequence loading, protective securing, and telematics-monitored vehicles for parts and finished vehicles.",
    services: ["full-truckload", "business-logistics", "ground-freight"],
    benefit: "JIS/JIT reliability with documented handling quality.",
    nameKa: "ავტომობილები",
    problemKa:
      "ავტომობილების მიწოდების ჯაჭვი მუშაობს ზუსტ თანმიმდევრობაზე და დაზიანებისადმი ნულოვანი ტოლერანტობით.",
    challengeKa: "ნაწილების ზუსტად თანმიმდევრობით მიწოდება დაზიანების გარეშე.",
    solutionKa:
      "სპეციალიზებული FTL პროგრამები თანმიმდევრობით ჩატვირთვით, დამცავი დამაგრებით და ტელემატიკით კონტროლირებადი მანქანებით ნაწილებისა და მზა ავტომობილებისთვის.",
    benefitKa: "JIS/JIT საიმედოობა დოკუმენტირებული დამუშავების ხარისხით.",
  },
  {
    slug: "food-beverage",
    name: "Food & Beverage",
    icon: "utensils",
    problem: "Cold chains cannot be broken — temperature excursions mean rejected product and lost value.",
    challenge: "Maintaining documented temperature integrity across borders and handoffs.",
    solution:
      "Refrigerated transport with continuous logging, pre-trip validation, and dual-zone units for mixed chilled and ambient loads.",
    services: ["refrigerated", "warehousing", "full-truckload"],
    benefit: "Documented cold-chain integrity, from plant to shelf.",
    nameKa: "საკვები და სასმელი",
    problemKa:
      "ცივი ჯაჭვი არ შეიძლება დაირღვეს — ტემპერატურის გადახრა ნიშნავს პროდუქტის უარყოფას და ღირებულების დაკარგვას.",
    challengeKa: "დოკუმენტირებული ტემპერატურის მთლიანობის შენარჩუნება საზღვრებსა და გადაცემის ეტაპებზე.",
    solutionKa:
      "რეფრიჟერატორული ტრანსპორტი უწყვეტი ჟურნალით, წინასწარი ვალიდაციით და ორზონიანი აგრეგატებით შერეული გაცივებული და ჩვეულებრივი ტვირთებისთვის.",
    benefitKa: "დოკუმენტირებული ცივი ჯაჭვის მთლიანობა ქარხნიდან თაროებამდე.",
  },
  {
    slug: "ecommerce",
    name: "E-commerce",
    icon: "package",
    problem: "Customers expect fast, tracked delivery — and returns handled without friction.",
    challenge: "Scaling fulfillment and last-mile delivery with the season.",
    solution:
      "Warehouse-integrated fulfillment with pick-and-pack, plus express and LTL lanes into e-commerce carrier networks.",
    services: ["express", "warehousing", "ltl"],
    benefit: "Faster order cycles and a returns process customers don't dread.",
    nameKa: "ელექტრონული კომერცია",
    problemKa:
      "მომხმარებლები მოელოდებიან სწრაფ, თვალთვალად მიწოდებას — და დაბრუნებებს უპრობლემოდ.",
    challengeKa: "შეკვეთების შესრულებისა და ბოლო მილის მიწოდების მასშტაბირება სეზონთან ერთად.",
    solutionKa:
      "საწყობთან ინტეგრირებული შეკვეთების შესრულება pick-and-pack-ით, პლუს ექსპრეს და LTL რეისები ელექტრონული კომერციის ქსელებში.",
    benefitKa: "უფრო სწრაფი შეკვეთის ციკლები და დაბრუნების პროცესი, რომელიც მომხმარებელს არ აშინებს.",
  },
  {
    slug: "healthcare",
    name: "Healthcare",
    icon: "heart-pulse",
    problem: "Pharmaceuticals and medical equipment are time- and temperature-critical, with strict compliance.",
    challenge: "GDP-aligned transport with validation for sensitive products.",
    solution:
      "Temperature-controlled express and FTL with logging, alarm monitoring, and documented handling for pharma and medical devices.",
    services: ["express", "refrigerated", "business-logistics"],
    benefit: "Compliance-ready cold chain for regulated products.",
    nameKa: "ჯანდაცვა",
    problemKa:
      "ფარმაცევტული პროდუქტები და სამედიცინო აპარატურა დროზე და ტემპერატურაზე მგრძნობიარეა, მკაცრი შესაბამისობის მოთხოვნებით.",
    challengeKa: "GDP-თან შესაბამისი ტრანსპორტი მგრძნობიარე პროდუქტებისთვის ვალიდაციით.",
    solutionKa:
      "ტემპერატურის კონტროლირებადი ექსპრეს და FTL ჟურნალით, სიგნალიზაციის მონიტორინგით და დოკუმენტირებული დამუშავებით ფარმასა და სამედიცინო მოწყობილობებისთვის.",
    benefitKa: "რეგულირებადი პროდუქტებისთვის შესაბამისი ცივი ჯაჭვი.",
  },
  {
    slug: "industrial-equipment",
    name: "Industrial Equipment",
    icon: "cog",
    problem: "Heavy machinery is slow to load, hard to move, and expensive to damage.",
    challenge: "Permits, route engineering, and specialized equipment for out-of-gauge loads.",
    solution:
      "Oversized cargo planning with route surveys, lowbed transport, and escort coordination for machinery moves across Europe.",
    services: ["oversized", "ground-freight", "full-truckload"],
    benefit: "Heavy equipment moved safely, legally, and on schedule.",
    nameKa: "სამრეწველო აღჭურვილობა",
    problemKa:
      "მძიმე ტექნიკა ნელა იტვირთება, რთულად მოძრაობს და ძვირი ღირს დაზიანების შემთხვევაში.",
    challengeKa: "ნებართვები, მარშრუტის ინჟინერია და სპეციალიზებული ტექნიკა გაბარიტული ტვირთებისთვის.",
    solutionKa:
      "მსხვილი ტვირთების დაგეგმვა მარშრუტის შესწავლით, დაბალი პლატფორმის ტრანსპორტით და ესკორტის კოორდინაციით მანქანების გადასატანად ევროპის მასშტაბით.",
    benefitKa: "მძიმე აღჭურვილობის უსაფრთხო, კანონიერი და გრაფიკით გადაზიდვა.",
  },
];

export function getIndustry(slug: string): Industry | undefined {
  return industries.find((i) => i.slug === slug);
}
