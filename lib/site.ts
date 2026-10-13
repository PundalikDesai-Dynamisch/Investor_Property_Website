export const SITE = {
  name: "Pune Property Investor",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://punepropertyinvestor.com",
  // Both numbers appear on the current site; the client should confirm which one is primary.
  phone: "+917398174444",
  phoneLabel: "+91 73981 74444",
  whatsapp: "919970791999",
  email: "info@punepropertyinvestor.com",
  address: "3rd floor, Gera Imperium Alpha, Grant Rd, Vitthal Nagar, Kharadi, Pune, Maharashtra 411014",
  entity: "PPI INFRA PVT LTD",
  branches: ["Kharadi (head office)", "Dighi", "Katraj"],
  social: [
    { label: "YouTube", href: "https://www.youtube.com/@PunePropertyInvestor" },
    { label: "Instagram", href: "https://www.instagram.com/punepropertyinvestor/" },
    { label: "LinkedIn", href: "https://www.linkedin.com/company/pune-property-investor1/" },
    { label: "Facebook", href: "https://www.facebook.com/punepropertyinvestors/" },
    { label: "X", href: "https://x.com/pune_investors" },
  ],
} as const;

export const NAV = [
  { label: "Properties", href: "/properties" },
  { label: "Locations", href: "/locations" },
  { label: "Services", href: "/services" },
  { label: "Insights", href: "/blogs" },
  { label: "About", href: "/about-us" },
] as const;

export const waLink = (text = "Hi, I would like help finding a property in Pune.") =>
  `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`;

export const CONSENT = `I authorise ${SITE.entity} and its representatives to contact me with updates and notifications via Email/SMS/WhatsApp/call. This will override DND/NDNC.`;
