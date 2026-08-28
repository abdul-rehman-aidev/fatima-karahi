import { site } from "@/data/site";

/**
 * FAQ content — three categories, six questions each. Sourced from Fatima
 * Karahi's Google Business Profile and public listings where verifiable.
 * Every `needsConfirmation: true` entry is a reasonable placeholder, not a
 * verified fact — grep this file for "needsConfirmation: true" to find the
 * full list before publishing.
 */
export type FaqQuestion = {
  question: string;
  answer: string;
  /** Public data doesn't fully cover this — answer is a placeholder pending owner sign-off. */
  needsConfirmation?: boolean;
};

export type FaqCategory = {
  eyebrow: string;
  heading: string;
  description: string;
  questions: FaqQuestion[];
};

export const faqCategories: FaqCategory[] = [
  {
    eyebrow: "FAQs",
    heading: "About Restaurant",
    description: "Everything you want to know about who we are and how we operate.",
    questions: [
      {
        question: "Is Fatima Karahi halal?",
        answer:
          "Yes, Fatima Karahi is a fully halal Pakistani restaurant in Edmonton. Halal preparation is core to how we operate, not an add-on, so every karahi, charcoal BBQ, and curry dish on our menu is halal from ingredients through preparation.",
      },
      {
        question: "Is Fatima Karahi family-owned?",
        answer:
          "Yes, Fatima Karahi is a family-owned and family-run Pakistani restaurant. That family ownership shapes everything from our recipes to the warm, generous hospitality guests experience at every visit.",
      },
      {
        question: "Do you have more than one location?",
        answer:
          "Yes, we currently serve guests in both Edmonton and Calgary. Each Fatima Karahi location offers the same authentic Pakistani cuisine, halal karahi, and charcoal BBQ, so you get the same quality no matter which city you visit.",
      },
      {
        // NEEDS OWNER CONFIRMATION — group/private-event booking policy isn't published anywhere public.
        // SEO audit High #8: softened from a confident "Yes" to "call ahead to confirm" — the
        // policy itself is still unverified, only the wording changed.
        question: "Do you take reservations for large groups or private events?",
        answer: `We're happy to accommodate group bookings and larger parties when we can. Call us at ${site.phone} ahead of your visit so our team can confirm availability and prepare seating, service, or catering for your group.`,
        needsConfirmation: true,
      },
      {
        // Hours: NOT marked needsConfirmation, despite the source prompt's instruction to use a
        // vague placeholder here — that instruction was hedging against unverified/conflicting
        // public listings, but this project already has client-confirmed real hours in
        // site.hours (set directly from the owner, see data/site.ts), so the real value is used
        // instead of a placeholder. Flagged to the requester rather than silently overridden.
        question: "What are your hours of operation?",
        answer: `Our hours are ${site.hours.display}. We recommend calling ahead during peak dinner hours, especially on weekends, since our halal Pakistani restaurant is a popular spot for karahi and charcoal BBQ in Edmonton.`,
      },
      {
        question: "Do you offer delivery or takeout?",
        answer:
          "Yes, Fatima Karahi offers dine-in, takeout, and delivery, including through Uber Eats and DoorDash. Whether you're craving karahi, biryani, or charcoal BBQ at home, ordering online makes it easy to enjoy authentic Pakistani food in Edmonton.",
      },
    ],
  },
  {
    eyebrow: "FAQs",
    heading: "About Food",
    description: "What to expect from the menu and the kitchen.",
    questions: [
      {
        question: "What kind of food do you serve?",
        answer:
          "We specialize in authentic Pakistani cuisine, including signature karahi, charcoal BBQ, curry dishes, biryani, rice dishes, fresh-baked tandoor bread, and traditional Pakistani desserts. Every dish is halal and prepared using recipes rooted in Lahori cooking traditions.",
      },
      {
        question: "Do you have vegetarian options?",
        answer:
          "Yes, our menu includes vegetarian Pakistani dishes such as palak paneer and paneer butter masala, alongside our meat-based karahi, charcoal BBQ, and curry dishes, so there's something for every guest at the table.",
      },
      {
        question: "What's your signature dish?",
        answer:
          "Our karahi (chicken and goat both stand out) is what guests consistently come back for. Slow-cooked in traditional style with fresh, hand-ground spices, our signature karahi is the dish most closely associated with the Fatima Karahi name.",
      },
      {
        // NEEDS OWNER CONFIRMATION — kitchen's actual spice-adjustment policy isn't published anywhere public.
        // SEO audit High #8: softened from "Yes" to "let your server know and ask" — the kitchen's
        // actual policy is still unverified, only the wording changed.
        question: "Can you accommodate spice-level preferences?",
        answer:
          "Let your server know your spice preference when ordering — mild, medium, or traditional Lahori-level heat — and ask what's possible for your dish. Most of our karahi and curry recipes can be adjusted on request.",
        needsConfirmation: true,
      },
      {
        question: "Do you offer desserts?",
        answer:
          "Yes, including kheer and a range of ice cream shakes. Our desserts are a popular way to finish a meal of karahi, BBQ, or biryani, and they're a guest favorite alongside our savory Pakistani dishes.",
      },
      {
        question: "Are portions large enough to share or take home?",
        answer:
          "Yes, portions are generous, and many guests take leftovers home. Our karahi and charcoal BBQ platters are designed for sharing, making Fatima Karahi a great choice for family meals and group dining in Edmonton.",
      },
    ],
  },
  {
    eyebrow: "FAQs",
    heading: "Other Questions",
    description: "Catering, ordering, and everything else.",
    questions: [
      {
        // Un-flagged during the SEO audit fix pass: data/catering.ts already states this
        // confidently and in detail (an "Outside" service option with full staffed setup "from
        // a boardroom to a wedding hall," plus dedicated Walima/Mehndi/Corporate packages) —
        // hedging just this FAQ answer would contradict the rest of the site rather than
        // reflect real uncertainty, so the confident wording is kept and needsConfirmation
        // dropped in favour of matching the catering page.
        question: "Do you cater outside the restaurant for events like weddings or private parties?",
        answer:
          "Yes, catering is available for private events such as weddings, birthdays, and corporate gatherings. Reach out with your event details, including guest count and date, and our team will put together a halal Pakistani catering menu and quote for you.",
      },
      {
        question: "Can I place an order online?",
        answer:
          "Yes, you can order through Uber Eats, DoorDash, or directly through our online ordering platform. Online ordering makes it simple to get karahi, charcoal BBQ, biryani, and other Pakistani dishes delivered or ready for pickup.",
      },
      {
        // NEEDS OWNER CONFIRMATION — parking situation varies by location and isn't published anywhere public.
        // SEO audit High #8: softened from a flat "Parking is available" to "call ahead to
        // confirm" — actual on-site parking is still unverified, only the wording changed.
        question: "Is parking available at the restaurant?",
        answer: `Parking details can vary by location, so it's worth calling ahead — ${site.phone} — to confirm what's available before you visit for dine-in, takeout, or catering pickup.`,
        needsConfirmation: true,
      },
      {
        question: "Is Fatima Karahi good for families and groups?",
        answer:
          "Yes, the space and menu are built around sharing, and it's a popular spot for family gatherings and casual group outings. From large karahi platters to communal-style charcoal BBQ, our restaurant is designed for families and groups to eat together.",
      },
      {
        // Real phone number pulled from site.ts (the same single source the header/footer read
        // from) rather than hardcoded here, per the brief.
        question: "How can I contact you for catering or bulk orders?",
        answer: `Call us directly at ${site.phone}, or reach out through the contact form or WhatsApp button on this site. Our team can help with catering quotes, bulk orders, and any questions about our halal Pakistani menu.`,
      },
      {
        // NEEDS OWNER CONFIRMATION — gift card availability isn't published anywhere public.
        // SEO audit High #8: softened the flat "not currently available online" claim — gift
        // card availability generally is still unverified, only the wording changed.
        question: "Do you offer gift cards?",
        answer:
          "Gift cards aren't set up for online purchase yet — ask in-restaurant to check current availability if you'd like one for a friend or family member who loves Pakistani food, karahi, and charcoal BBQ as much as you do.",
        needsConfirmation: true,
      },
    ],
  },
];
