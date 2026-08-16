"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type Lang = "en" | "ka";

const en = {
  // Nav
  "nav.services": "Services",
  "nav.industries": "Industries",
  "nav.tracking": "Tracking",
  "nav.coverage": "Coverage",
  "nav.fleet": "Fleet",
  "nav.technology": "Technology",
  "nav.about": "About",
  "nav.insights": "Insights",
  "nav.careers": "Careers",
  "nav.faq": "FAQ",
  "nav.contact": "Contact",
  "nav.getQuote": "Get a Quote",
  "nav.track": "Track Shipment",

  // Common actions
  "common.learnMore": "Learn more",
  "common.exploreAll": "Explore all services",
  "common.viewAll": "View all",
  "common.back": "Back",
  "common.continue": "Continue",
  "common.submit": "Submit",
  "common.required": "required",

  // Hero
  "hero.badge": "European ground freight · 24/7 control tower",
  "hero.title1": "Logistics That",
  "hero.titleAccent": "Keep Business Moving",
  "hero.sub":
    "Reliable cargo transportation, intelligent route planning, and end-to-end logistics solutions built for businesses that cannot afford delays.",
  "hero.getQuote": "Get a Quote",
  "hero.track": "Track Shipment",
  "hero.trust1": "10,000+ shipments delivered yearly",
  "hero.trust2": "98.7% on-time delivery rate",
  "hero.trust3": "30+ regions across Europe & beyond",
  "hero.liveNetwork": "Live Network",
  "hero.eta": "ETA Berlin → Tbilisi",

  // Logos
  "logos.heading": "Trusted by operations teams across Europe",

  // Stats
  "stats.shipments": "Shipments delivered yearly",
  "stats.ontime": "On-time delivery rate",
  "stats.support": "Logistics support & monitoring",
  "stats.regions": "Regions covered across Europe",

  // Calculator
  "calc.eyebrow": "Freight calculator",
  "calc.title": "Real route, real distance, real estimate",
  "calc.sub":
    "Pick real cities — we compute the road distance and estimate freight cost per kilometer, per pallet, and per load. No sign-up, no API keys, works instantly.",
  "calc.origin": "Pickup country",
  "calc.originCity": "Pickup city",
  "calc.dest": "Delivery country",
  "calc.destCity": "Delivery city",
  "calc.cargoType": "Cargo type",
  "calc.weight": "Weight (kg)",
  "calc.pallets": "Pallets",
  "calc.date": "Transport date",
  "calc.estimate": "Estimate freight cost",
  "calc.distance": "Road distance",
  "calc.transit": "Estimated transit",
  "calc.baseRate": "Base freight",
  "calc.fuel": "Fuel surcharge (12%)",
  "calc.border": "Customs & permits",
  "calc.total": "Estimated total",
  "calc.inGel": "in GEL",
  "calc.eur": "EUR",
  "calc.gel": "GEL",
  "calc.note": "Indicative estimate only — final quote confirmed by our planners within 4 business hours.",
  "calc.request": "Request this exact quote",
  "calc.palletLoad": "Full Truckload (FTL)",
  "calc.partialLoad": "Partial load (LTL)",
  "calc.express": "Express / urgent",
  "calc.refrigerated": "Temperature controlled",
  "calc.oversized": "Oversized / heavy",
  "calc.other": "Other",
  "calc.swap": "Swap route",
  "calc.days": "days",

  // Services section
  "svc.eyebrow": "What we move",
  "svc.title": "Freight solutions for every load, every corridor",
  "svc.sub":
    "Eight core services covering the full logistics lifecycle — from a single pallet to project-scale special transport.",
  "svc.explore": "Explore all services",
  "svc.learnMore": "Learn more",

  // How it works
  "how.eyebrow": "How it works",
  "how.title": "From request to delivery in four steps",
  "how.sub": "A simple, transparent process — you always know where your cargo is and what happens next.",
  "how.step1t": "Request",
  "how.step1d": "Share your route, cargo, and timing. Get a confirmed quote within 4 business hours — 60 minutes for urgent loads.",
  "how.step2t": "Planning",
  "how.step2d": "Our planners match the right vehicle and route, check corridor conditions, and schedule pickup within your window.",
  "how.step3t": "Transportation",
  "how.step3d": "Your cargo moves with live GPS tracking, checkpoint updates, and a control tower that watches the route around the clock.",
  "how.step4t": "Delivery",
  "how.step4d": "On-time delivery with signed proof of delivery and full documentation in your portal — the same day.",

  // Coverage
  "cov.eyebrow": "Coverage & routes",
  "cov.title": "A network that reaches where your freight needs to go",
  "cov.sub":
    "Scheduled lanes across Europe's core corridors, gateway hubs at key ports, and an international corridor network that extends beyond the EU.",
  "cov.explore": "Explore full coverage",
  "cov.note":
    "Hover a corridor to highlight it. Demo data — real geographic coordinates plug in behind this component.",

  // Technology
  "tech.eyebrow": "Technology",
  "tech.title": "A control tower for your entire freight operation",
  "tech.sub":
    "Every CargoNova shipment runs through the same platform — tracking, routing, telemetry, and documentation working as one system.",
  "tech.seeHow": "See how the platform works",

  // Fleet
  "fleet.eyebrow": "Our fleet",
  "fleet.title": "Modern equipment for every kind of freight",
  "fleet.sub":
    "Vetted vehicles with telematics, maintenance programs, and drivers trained to your cargo's requirements.",
  "fleet.browse": "Browse full fleet",
  "fleet.recommend": "Tell us what you're shipping. We'll recommend the right vehicle — payload, dimensions, and equipment matched to your cargo.",
  "fleet.getRecommendation": "Get a recommendation",
  "fleet.available": "Available for booking",
  "fleet.onRequest": "Booking on request",

  // Industries
  "ind.eyebrow": "Industries we serve",
  "ind.title": "Logistics designed around your industry's pressure points",
  "ind.sub":
    "We build transport programs around how your supply chain actually behaves — not a generic one-size-fits-all model.",
  "ind.view": "View industries",

  // Testimonials
  "test.eyebrow": "Client outcomes",
  "test.title": "Results our customers measure in their own KPIs",
  "test.sub":
    "Enterprise logistics is judged by numbers. These are the numbers our clients report after moving freight with CargoNova.",
  "test.placeholder":
    "Placeholder case studies for demo purposes — replace with customer-approved references.",

  // CTA
  "cta.badge": "Capacity available this week on core corridors",
  "cta.title1": "Move Your Cargo With",
  "cta.titleAccent": "Confidence",
  "cta.sub":
    "Get a confirmed quote within 4 business hours — or talk to a logistics specialist about your network today.",
  "cta.getQuote": "Get a Quote",
  "cta.contact": "Contact Logistics Team",
  "cta.prefers": "Prefer to talk? Call",

  // Footer
  "footer.tagline": "Ground freight, FTL/LTL, express, refrigerated, oversized, and warehousing — built for businesses that cannot afford delays.",
  "footer.newsletterTitle": "Freight brief, monthly",
  "footer.newsletterSub": "Corridor updates, capacity notes, and logistics insights. No noise.",
  "footer.newsletterCta": "Subscribe",
  "footer.newsletterPlaceholder": "you@company.com",
  "footer.subscribed": "You're subscribed. First brief arrives next month.",
  "footer.services": "Services",
  "footer.company": "Company",
  "footer.resources": "Resources",
  "footer.legal": "Legal",
  "footer.contact": "Contact",
  "footer.rights": "All rights reserved.",

  // Tracking
  "trk.title": "Track your shipment in real time",
  "trk.sub":
    "Enter your tracking number to see exactly where your cargo is, what happened at every checkpoint, and when it arrives.",
  "trk.placeholder": "Enter shipment ID, e.g. CRG-582941",
  "trk.search": "Track",
  "trk.quick": "Quick lookup:",
  "trk.idleTitle": "Where is your shipment?",
  "trk.idleSub": "Enter your tracking number to see current status, checkpoint history, ETA, and delivery progress.",
  "trk.shipment": "Shipment",
  "trk.status": "Status",
  "trk.origin": "Origin",
  "trk.destination": "Destination",
  "trk.checkpoint": "Current checkpoint",
  "trk.eta": "Estimated delivery",
  "trk.progress": "Journey progress",
  "trk.cargo": "Cargo",
  "trk.weight": "Weight",
  "trk.service": "Service",
  "trk.vehicle": "Vehicle",
  "trk.timeline": "Shipment timeline",
  "trk.refresh": "Refresh status",
  "trk.updated": "Last updated",
  "trk.notFound": "Shipment not found",
  "trk.notFoundMsg":
    "We couldn't find a shipment with that tracking number. Double-check the ID or contact support.",
  "trk.invalidMsg": "Tracking numbers look like CRG-582941 — 3 letters, a dash, then 4–8 digits.",
  "trk.emptyMsg": "Enter a tracking number to search.",
  "trk.clear": "Clear search",
  "trk.docsNote1": "Need proof of delivery or temperature logs for this shipment?",
  "trk.docsNote2": "— available in your portal on request.",
  "trk.requestDocs": "Request documents",
  "trk.step.pickup": "Pickup",
  "trk.step.originHub": "Origin Hub",
  "trk.step.transit": "Transit",
  "trk.step.borderCheck": "Border Check",
  "trk.step.destHub": "Destination Hub",
  "trk.step.delivery": "Delivery",
  "trk.liveStatus": "Live status",
  "trk.liveStatusText": "Position and status updated continuously from vehicle telemetry and scan events.",
  "trk.checkpointHistory": "Checkpoint history",
  "trk.checkpointHistoryText": "Every pickup, hub, border, and delivery step — timestamped and documented.",
  "trk.noLogin": "No login required",
  "trk.noLoginText": "Anyone with the tracking number can check. Portal access adds full history.",
  "trk.shipmentStatus.pending": "Pending",
  "trk.shipmentStatus.picked_up": "Picked Up",
  "trk.shipmentStatus.in_transit": "In Transit",
  "trk.shipmentStatus.customs": "Customs Clearance",
  "trk.shipmentStatus.out_for_delivery": "Out for Delivery",
  "trk.shipmentStatus.delivered": "Delivered",

  // Quote form
  "quote.title": "Tell us what you're shipping",
  "quote.sub": "Five short steps. A confirmed quote within 4 business hours — and 60 minutes for urgent loads. No commitment until you book.",
  "quote.step.route": "Route",
  "quote.step.cargo": "Cargo",
  "quote.step.transport": "Transport",
  "quote.step.customer": "Customer",
  "quote.step.review": "Review",
  "quote.heading.route": "Where is the cargo going?",
  "quote.heading.cargo": "What are we moving?",
  "quote.heading.transport": "When and how should it move?",
  "quote.heading.customer": "Who should receive the quote?",
  "quote.selectCountry": "Select country",
  "quote.selectCargo": "Select cargo type",
  "quote.exampleCity": "e.g. Tbilisi",
  "quote.asap": "As soon as possible",
  "quote.required": "Required",
  "quote.notRequired": "Not required",
  "quote.sum.pickup": "Pickup",
  "quote.sum.delivery": "Delivery",
  "quote.sum.cargoType": "Cargo type",
  "quote.sum.weight": "Weight",
  "quote.sum.pallets": "Pallets",
  "quote.sum.volume": "Volume",
  "quote.sum.dimensions": "Dimensions",
  "quote.sum.date": "Transport date",
  "quote.sum.urgency": "Urgency",
  "quote.sum.refrig": "Refrigeration",
  "quote.sum.contact": "Contact",
  "quote.sum.email": "Email",
  "quote.sum.phone": "Phone",
  "quote.sum.special": "Special handling",
  "quote.pickupCountry": "Pickup country",
  "quote.pickupCity": "Pickup city",
  "quote.destCountry": "Delivery country",
  "quote.destCity": "Delivery city",
  "quote.cargoType": "Cargo type",
  "quote.description": "Description (optional)",
  "quote.weight": "Weight (kg)",
  "quote.pallets": "Pallets",
  "quote.volume": "Volume (m³, optional)",
  "quote.length": "Length (m, optional)",
  "quote.width": "Width (m, optional)",
  "quote.height": "Height (m, optional)",
  "quote.date": "Desired transport date",
  "quote.urgency": "Delivery urgency",
  "quote.urgencyStandard": "Standard (most economical)",
  "quote.urgencyPriority": "Priority (faster lane)",
  "quote.urgencyExpress": "Express (dedicated vehicle)",
  "quote.refrigeration": "Temperature-controlled transport",
  "quote.refrigerationSub": "Reefer unit, continuous logging, -25°C to +25°C",
  "quote.special": "Special handling (optional)",
  "quote.name": "Full name",
  "quote.company": "Company (optional)",
  "quote.phone": "Phone",
  "quote.email": "Email",
  "quote.prefersPhone": "Prefer to talk? Call +49 30 1234 5678 — urgent loads answered in minutes.",
  "quote.reviewTitle": "Review your request",
  "quote.reviewSub": "Check the details below, then submit. You'll receive the quote by email.",
  "quote.submit": "Submit Quote Request",
  "quote.submitting": "Submitting…",
  "quote.successTitle": "Quote request received",
  "quote.successSub": "Your reference is",
  "quote.successSub2":
    ". Our planning team will confirm pricing and availability within 4 business hours — for urgent loads, within 60 minutes.",
  "quote.next1": "You'll receive the quote by email.",
  "quote.next2": "Confirm to lock capacity and schedule pickup.",
  "quote.next3": "We handle the rest — you track it live.",
  "quote.whatNext": "What happens next:",
  "quote.trackFirst": "Track your first shipment",
  "quote.agree": "By submitting you agree to our",
  "quote.and": "and",
  "quote.error": "Your request could not be submitted. Please try again.",

  // Contact
  "contact.title": "Talk to a logistics team that answers",
  "contact.sub": "Quotes, active shipments, or a question about your network — reach the right desk directly.",

  // Language / theme
  "lang.en": "English",
  "lang.ka": "ქართული",
  "theme.toggle": "Toggle dark mode",
  "theme.light": "Light mode",
  "theme.dark": "Dark mode",
} as const;

const ka: Record<keyof typeof en, string> = {
  // Nav
  "nav.services": "სერვისები",
  "nav.industries": "ინდუსტრიები",
  "nav.tracking": "თვალთვალი",
  "nav.coverage": "გეოგრაფია",
  "nav.fleet": "ავტოპარკი",
  "nav.technology": "ტექნოლოგია",
  "nav.about": "ჩვენ შესახებ",
  "nav.insights": "ბლოგი",
  "nav.careers": "კარიერა",
  "nav.faq": "კითხვა-პასუხი",
  "nav.contact": "კონტაქტი",
  "nav.getQuote": "მიიღეთ შეთავაზება",
  "nav.track": "ტვირთის თვალთვალი",

  // Common actions
  "common.learnMore": "დეტალურად",
  "common.exploreAll": "ყველა სერვისი",
  "common.viewAll": "ყველას ნახვა",
  "common.back": "უკან",
  "common.continue": "შემდეგი",
  "common.submit": "გაგზავნა",
  "common.required": "აუცილებელი",

  // Hero
  "hero.badge": "ევროპული სახმელეთო ტვირთები · 24/7 საკონტროლო ცენტრი",
  "hero.title1": "ლოგისტიკა, რომელიც",
  "hero.titleAccent": "ბიზნესს მოძრაობაში ინარჩუნებს",
  "hero.sub":
    "სანდო სატვირთო გადაზიდვები, ინტელექტუალური მარშრუტების დაგეგმვა და სრული ლოგისტიკური გადაწყვეტილებები ბიზნესებისთვის, რომლებსაც დაგვიანება არ შეუძლიათ.",
  "hero.getQuote": "მიიღეთ შეთავაზება",
  "hero.track": "ტვირთის თვალთვალი",
  "hero.trust1": "10,000+ ტვირთი წელიწადში",
  "hero.trust2": "98.7% დროული მიწოდება",
  "hero.trust3": "30+ რეგიონი ევროპასა და მის ფარგლებს გარეთ",
  "hero.liveNetwork": "ცოცხალი ქსელი",
  "hero.eta": "ETA ბერლინი → თბილისი",

  // Logos
  "logos.heading": "გვენდობიან ოპერაციული გუნდები მთელ ევროპაში",

  // Stats
  "stats.shipments": "წლიურად მიწოდებული ტვირთები",
  "stats.ontime": "დროული მიწოდების მაჩვენებელი",
  "stats.support": "ლოგისტიკური მხარდაჭერა და მონიტორინგი",
  "stats.regions": "დაფარული რეგიონები ევროპაში",

  // Calculator
  "calc.eyebrow": "ტვირთის კალკულატორი",
  "calc.title": "რეალური მარშრუტი, რეალური მანძილი, რეალური შეფასება",
  "calc.sub":
    "აირჩიეთ რეალური ქალაქები — ჩვენ ვითვლით საგზაო მანძილს და ვაფასებთ ტვირთის ღირებულებას კილომეტრზე, პალეტზე და სრულ დატვირთვაზე. რეგისტრაციის გარეშე, მყისიერად.",
  "calc.origin": "ჩატვირთვის ქვეყანა",
  "calc.originCity": "ჩატვირთვის ქალაქი",
  "calc.dest": "მიწოდების ქვეყანა",
  "calc.destCity": "მიწოდების ქალაქი",
  "calc.cargoType": "ტვირთის ტიპი",
  "calc.weight": "წონა (კგ)",
  "calc.pallets": "პალეტები",
  "calc.date": "ტრანსპორტირების თარიღი",
  "calc.estimate": "ტვირთის ღირებულების შეფასება",
  "calc.distance": "საგზაო მანძილი",
  "calc.transit": "სავარაუდო ტრანზიტი",
  "calc.baseRate": "საბაზო ტარიფი",
  "calc.fuel": "საწვავის დანამატი (12%)",
  "calc.border": "საბაჟო და ნებართვები",
  "calc.total": "სავარაუდო ჯამი",
  "calc.inGel": "ლარში",
  "calc.eur": "EUR",
  "calc.gel": "GEL",
  "calc.note": "სავარაუდო გაანგარიშება — საბოლოო ფასს ადასტურებს ჩვენი პლანერების გუნდი 4 სამუშაო საათში.",
  "calc.request": "მოითხოვეთ ეს ზუსტად ასე",
  "calc.palletLoad": "სრული დატვირთვა (FTL)",
  "calc.partialLoad": "ნაწილობრივი დატვირთვა (LTL)",
  "calc.express": "ექსპრეს / გადაუდებელი",
  "calc.refrigerated": "ტემპერატურული რეჟიმი",
  "calc.oversized": "განსაკუთრებული / მძიმე ტვირთი",
  "calc.other": "სხვა",
  "calc.swap": "მარშრუტის შეცვლა",
  "calc.days": "დღე",

  // Services section
  "svc.eyebrow": "რას ვაზიდავთ",
  "svc.title": "სატვირთო გადაწყვეტილებები ნებისმიერი დატვირთვისთვის",
  "svc.sub":
    "რვა ძირითადი სერვისი ლოგისტიკის სრულ ციკლზე — ერთი პალეტიდან პროექტული მასშტაბის სპეციალურ ტრანსპორტირებამდე.",
  "svc.explore": "ყველა სერვისის ნახვა",
  "svc.learnMore": "დეტალურად",

  // How it works
  "how.eyebrow": "როგორ მუშაობს",
  "how.title": "მოთხოვნიდან მიწოდებამდე — ოთხი ნაბიჯი",
  "how.sub": "მარტივი და გამჭვირვალე პროცესი — თქვენ ყოველთვის იცით, სად არის თქვენი ტვირთი.",
  "how.step1t": "მოთხოვნა",
  "how.step1d": "გააზიარეთ მარშრუტი, ტვირთი და ვადები. დადასტურებულ ფასს მიიღებთ 4 სამუშაო საათში — გადაუდებლად 60 წუთში.",
  "how.step2t": "დაგეგმვა",
  "how.step2d": "ჩვენი პლანერები შეარჩევენ შესაბამის ტრანსპორტს და მარშრუტს და დაგინიშნავთ ჩატვირთვის დროს.",
  "how.step3t": "ტრანსპორტირება",
  "how.step3d": "თქვენი ტვირთი მოძრაობს ცოცხალი GPS თვალთვალით, საკონტროლო პუნქტების განახლებით და მრგვალი საათის მონიტორინგით.",
  "how.step4t": "მიწოდება",
  "how.step4d": "დროული მიწოდება ხელმოწერილი ჩაბარების დამადასტურებელი დოკუმენტით — იმავე დღეს.",

  // Coverage
  "cov.eyebrow": "გეოგრაფია და მარშრუტები",
  "cov.title": "ქსელი, რომელიც თქვენს ტვირთს ყველგან მიაწვდის",
  "cov.sub":
    "დაგეგმილი რეისები ევროპის ძირითად დერეფნებზე, საკვანძო პორტები და საერთაშორისო დერეფნები ევროკავშირის მიღმაც.",
  "cov.explore": "სრული გეოგრაფიის ნახვა",
  "cov.note":
    "დერეფანზე გადაიტანეთ კურსორი ხაზგასასმელად. საჩვენებელი მონაცემები — რეალური კოორდინატები ამ კომპონენტს უკან უერთდება.",

  // Technology
  "tech.eyebrow": "ტექნოლოგია",
  "tech.title": "საკონტროლო ცენტრი თქვენი ტვირთბრუნვისთვის",
  "tech.sub":
    "ყველა ტვირთი მოძრაობს ერთ პლატფორმაზე — თვალთვალი, მარშრუტიზაცია, ტელემეტრია და დოკუმენტაცია ერთ სისტემად.",
  "tech.seeHow": "ნახეთ, როგორ მუშაობს პლატფორმა",

  // Fleet
  "fleet.eyebrow": "ჩვენი ავტოპარკი",
  "fleet.title": "თანამედროვე ტექნიკა ნებისმიერი ტვირთისთვის",
  "fleet.sub": "შემოწმებული მანქანები ტელემეტრიით, მოვლის პროგრამით და გაწვრთნილი მძღოლებით.",
  "fleet.browse": "მთელი ავტოპარკის ნახვა",
  "fleet.recommend": "გვითხარით, რას ზიდავთ — შემოგთავაზებთ შესაბამის ტრანსპორტს.",
  "fleet.getRecommendation": "მიიღეთ რეკომენდაცია",
  "fleet.available": "დაჯავშნა შესაძლებელია",
  "fleet.onRequest": "მოთხოვნით",

  // Industries
  "ind.eyebrow": "ინდუსტრიები",
  "ind.title": "ლოგისტიკა თქვენი ინდუსტრიის საჭიროებებზე მორგებული",
  "ind.sub": "ჩვენ ვაშენებთ სატრანსპორტო პროგრამებს თქვენი მიწოდების ჯაჭვის რეალურ საჭიროებებზე დაყრდნობით.",
  "ind.view": "ინდუსტრიების ნახვა",

  // Testimonials
  "test.eyebrow": "კლიენტების შედეგები",
  "test.title": "შედეგები, რომლებსაც კლიენტები საკუთარი KPI-ებით აფასებენ",
  "test.sub": "საწარმოთა ლოგისტიკას ციფრები აფასებენ. ეს ის ციფრებია, რასაც კლიენტები იუწყებიან.",
  "test.placeholder":
    "საჩვენებელი ქეისები დემო მიზნებისთვის — ჩანაცვლდება კლიენტის მიერ დამტკიცებული რეფერენციებით.",

  // CTA
  "cta.badge": "თავისუფალი ტევადობა ამ კვირაში ძირითად დერეფნებზე",
  "cta.title1": "გადააადგილეთ თქვენი ტვირთი",
  "cta.titleAccent": "დარწმუნებით",
  "cta.sub": "დადასტურებული ფასი 4 სამუშაო საათში — ან ესაუბრეთ ლოგისტიკის სპეციალისტს დღესვე.",
  "cta.getQuote": "მიიღეთ შეთავაზება",
  "cta.contact": "დაუკავშირდით გუნდს",
  "cta.prefers": "გირჩევნიათ ზარი?",

  // Footer
  "footer.tagline": "სახმელეთო ტვირთები, FTL/LTL, ექსპრეს, რეფრიჟერატორული და სასაწყობო სერვისები — ბიზნესებისთვის, რომლებსაც დაგვიანება არ შეუძლიათ.",
  "footer.newsletterTitle": "ყოველთვიური ბიულეტენი",
  "footer.newsletterSub": "დერეფნების განახლებები, ტევადობის ინფორმაცია და ლოგისტიკური მიმოხილვები. ზედმეტი ინფორმაციის გარეშე.",
  "footer.newsletterCta": "გამოწერა",
  "footer.newsletterPlaceholder": "you@company.com",
  "footer.subscribed": "გამოწერილია. პირველი ბიულეტენი მომავალ თვეში.",
  "footer.services": "სერვისები",
  "footer.company": "კომპანია",
  "footer.resources": "რესურსები",
  "footer.legal": "სამართლებრივი",
  "footer.contact": "კონტაქტი",
  "footer.rights": "ყველა უფლება დაცულია.",

  // Tracking
  "trk.title": "თვალყური ადევნეთ თქვენს ტვირთს რეალურ დროში",
  "trk.sub": "შეიყვანეთ ტვირთის ნომერი და ნახეთ სად არის თქვენი ტვირთი, რა მოხდა თითოეულ პუნქტში და როდის ჩაბარდება.",
  "trk.placeholder": "შეიყვანეთ ტვირთის ნომერი, მაგ. CRG-582941",
  "trk.search": "ძებნა",
  "trk.quick": "სწრაფი ძებნა:",
  "trk.idleTitle": "სად არის თქვენი ტვირთი?",
  "trk.idleSub": "შეიყვანეთ ნომერი სტატუსის, ისტორიის, ETA-ს და მიწოდების პროგრესის სანახავად.",
  "trk.shipment": "ტვირთი",
  "trk.status": "სტატუსი",
  "trk.origin": "გამგზავრება",
  "trk.destination": "დანიშნულება",
  "trk.checkpoint": "მიმდინარე პუნქტი",
  "trk.eta": "მიწოდების სავარაუდო დრო",
  "trk.progress": "მგზავრობის პროგრესი",
  "trk.cargo": "ტვირთი",
  "trk.weight": "წონა",
  "trk.service": "სერვისი",
  "trk.vehicle": "ტრანსპორტი",
  "trk.timeline": "ტვირთის ვადები",
  "trk.refresh": "განახლება",
  "trk.updated": "ბოლო განახლება",
  "trk.notFound": "ტვირთი ვერ მოიძებნა",
  "trk.notFoundMsg": "ამ ნომრით ტვირთი ვერ მოიძებნა. შეამოწმეთ ნომერი ან დაუკავშირდით მხარდაჭერას.",
  "trk.invalidMsg": "ტვირთის ნომერი ასე გამოიყურება: CRG-582941 — 3 ასო, ტირე და 4–8 ციფრი.",
  "trk.emptyMsg": "შეიყვანეთ ტვირთის ნომერი ძებნისთვის.",
  "trk.clear": "ძებნის გასუფთავება",  "trk.docsNote1": "გჭირდებათ ჩაბარების დამადასტურებელი დოკუმენტი ან ტემპერატურის ჟურნალი?",
  "trk.docsNote2": "— ხელმისაწვდომია თქვენს პორტალში მოთხოვნით.",
  "trk.requestDocs": "დოკუმენტების მოთხოვნა",
  "trk.step.pickup": "ჩატვირთვა",
  "trk.step.originHub": "გამგზავრების ჰაბი",
  "trk.step.transit": "ტრანზიტი",
  "trk.step.borderCheck": "საბაჟო შემოწმება",
  "trk.step.destHub": "დანიშნულების ჰაბი",
  "trk.step.delivery": "მიწოდება",
  "trk.liveStatus": "ცოცხალი სტატუსი",
  "trk.liveStatusText": "პოზიცია და სტატუსი განახლდება ტელემეტრიისა და სკანირების მონაცემებით.",
  "trk.checkpointHistory": "საკონტროლო პუნქტების ისტორია",
  "trk.checkpointHistoryText": "ყოველი ნაბიჯი — ჩატვირთვა, ჰაბი, საზღვარი, მიწოდება — თარიღითა და აღწერით.",
  "trk.noLogin": "რეგისტრაციის გარეშე",
  "trk.noLoginText": "ნებისმიერს შეუძლია ნომრით შემოწმება. პორტალი გაძლევთ სრულ ისტორიას.",
  "trk.shipmentStatus.pending": "მომზადებაშია",
  "trk.shipmentStatus.picked_up": "ჩატვირთულია",
  "trk.shipmentStatus.in_transit": "გზაშია",
  "trk.shipmentStatus.customs": "საბაჟოზეა",
  "trk.shipmentStatus.out_for_delivery": "მიწოდებაშია",
  "trk.shipmentStatus.delivered": "ჩაბარებულია",

  // Quote form
  "quote.title": "გვითხარით, რას ზიდავთ",
  "quote.sub": "ხუთი მოკლე ნაბიჯი. დადასტურებული ფასი 4 სამუშაო საათში — გადაუდებელი ტვირთისთვის 60 წუთში. დაჯავშნამდე არაფერი ვალდებულება.",
  "quote.step.route": "მარშრუტი",
  "quote.step.cargo": "ტვირთი",
  "quote.step.transport": "ტრანსპორტი",
  "quote.step.customer": "კლიენტი",
  "quote.step.review": "შემოწმება",
  "quote.heading.route": "საით მიდის ტვირთი?",
  "quote.heading.cargo": "რას გადავაზიდავთ?",
  "quote.heading.transport": "როდის და როგორ უნდა გადაადგილდეს?",
  "quote.heading.customer": "ვინ უნდა მიიღოს შეთავაზება?",
  "quote.selectCountry": "აირჩიეთ ქვეყანა",
  "quote.selectCargo": "აირჩიეთ ტვირთის ტიპი",
  "quote.exampleCity": "მაგ. თბილისი",
  "quote.asap": "რაც შეიძლება მალე",
  "quote.required": "საჭიროა",
  "quote.notRequired": "არ არის საჭირო",
  "quote.sum.pickup": "ჩატვირთვა",
  "quote.sum.delivery": "მიწოდება",
  "quote.sum.cargoType": "ტვირთის ტიპი",
  "quote.sum.weight": "წონა",
  "quote.sum.pallets": "პალეტები",
  "quote.sum.volume": "მოცულობა",
  "quote.sum.dimensions": "ზომები",
  "quote.sum.date": "ტრანსპორტირების თარიღი",
  "quote.sum.urgency": "სასწრაფოობა",
  "quote.sum.refrig": "ტემპერატურული რეჟიმი",
  "quote.sum.contact": "კონტაქტი",
  "quote.sum.email": "ელფოსტა",
  "quote.sum.phone": "ტელეფონი",
  "quote.sum.special": "განსაკუთრებული პირობები",
  "quote.pickupCountry": "ჩატვირთვის ქვეყანა",
  "quote.pickupCity": "ჩატვირთვის ქალაქი",
  "quote.destCountry": "მიწოდების ქვეყანა",
  "quote.destCity": "მიწოდების ქალაქი",
  "quote.cargoType": "ტვირთის ტიპი",
  "quote.description": "აღწერა (არასავალდებულო)",
  "quote.weight": "წონა (კგ)",
  "quote.pallets": "პალეტები",
  "quote.volume": "მოცულობა (მ³, არასავალდებულო)",
  "quote.length": "სიგრძე (მ, არასავალდებულო)",
  "quote.width": "სიგანე (მ, არასავალდებულო)",
  "quote.height": "სიმაღლე (მ, არასავალდებულო)",
  "quote.date": "სასურველი ტრანსპორტირების თარიღი",
  "quote.urgency": "მიწოდების სასწრაფოობა",
  "quote.urgencyStandard": "სტანდარტული (ყველაზე ეკონომიური)",
  "quote.urgencyPriority": "პრიორიტეტული (უფრო სწრაფი)",
  "quote.urgencyExpress": "ექსპრეს (ცალკე ტრანსპორტი)",
  "quote.refrigeration": "ტემპერატურული რეჟიმი",
  "quote.refrigerationSub": "რეფრიჟერატორი, უწყვეტი ჟურნალირება, -25°C-დან +25°C-მდე",
  "quote.special": "განსაკუთრებული პირობები (არასავალდებულო)",
  "quote.name": "სრული სახელი",
  "quote.company": "კომპანია (არასავალდებულო)",
  "quote.phone": "ტელეფონი",
  "quote.email": "ელფოსტა",
  "quote.prefersPhone": "გირჩევნიათ ზარი? დარეკეთ +49 30 1234 5678 — გადაუდებელ შემთხვევებში წუთებში გიპასუხებთ.",
  "quote.reviewTitle": "შეამოწმეთ თქვენი მოთხოვნა",
  "quote.reviewSub": "შეამოწმეთ დეტალები და გაგზავნეთ. ფასს მიიღებთ ელფოსტაზე.",
  "quote.submit": "მოთხოვნის გაგზავნა",
  "quote.submitting": "იგზავნება…",
  "quote.successTitle": "მოთხოვნა მიღებულია",
  "quote.successSub": "თქვენი რეფერენსია",
  "quote.successSub2": ". ჩვენი გუნდი დაადასტურებს ფასსა და ტევადობას 4 სამუშაო საათში — გადაუდებელი ტვირთისთვის 60 წუთში.",
  "quote.next1": "ფასს მიიღებთ ელფოსტაზე.",
  "quote.next2": "დაადასტურეთ ტევადობის დაჯავშნა და ჩატვირთვის დრო.",
  "quote.next3": "დანარჩენს ჩვენ ვაკეთებთ — თქვენ ცოცხლად ადევნებთ თვალს.",
  "quote.whatNext": "რა ხდება შემდეგ:",
  "quote.trackFirst": "ტვირთის თვალთვალი",
  "quote.agree": "გაგზავნით თქვენ ეთანხმებით ჩვენს",
  "quote.and": "და",
  "quote.error": "მოთხოვნა ვერ გაიგზავნა. გთხოვთ, კიდევ სცადოთ.",

  // Contact
  "contact.title": "ესაუბრეთ გუნდს, რომელიც პასუხობს",
  "contact.sub": "ფასები, აქტიური ტვირთები თუ შეკითხვა თქვენს ქსელზე — დაუკავშირდით შესაბამის განყოფილებას პირდაპირ.",

  // Language / theme
  "lang.en": "English",
  "lang.ka": "ქართული",
  "theme.toggle": "მუქი რეჟიმი",
  "theme.light": "ნათელი რეჟიმი",
  "theme.dark": "მუქი რეჟიმი",
};

const dictionaries: Record<Lang, Record<keyof typeof en, string>> = { en, ka };

const LangContext = createContext<{ lang: Lang; setLang: (l: Lang) => void; t: (key: keyof typeof en) => string }>({
  lang: "en",
  setLang: () => {},
  t: (k) => en[k],
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    // Read persisted language after mount so the initial SSR render is stable.
    const stored = localStorage.getItem("cargonova-lang") as Lang | null;
    if (stored === "en" || stored === "ka") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLangState(stored);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  // Persist on explicit user action only — never on mount, so a reload keeps
  // the stored language instead of being overwritten by the initial state.
  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem("cargonova-lang", l);
    } catch {
      /* private mode */
    }
  };
  const t = (key: keyof typeof en) => dictionaries[lang][key] ?? en[key];

  return <LangContext.Provider value={{ lang, setLang, t }}>{children}</LangContext.Provider>;
}

export function useLang() {
  return useContext(LangContext);
}

export type DictKey = keyof typeof en;
