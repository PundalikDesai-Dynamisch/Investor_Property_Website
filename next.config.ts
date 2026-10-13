import type { NextConfig } from "next";

// Old short slugs that still receive links; each one 301s to the page that holds the content today.
const slugMoves: Record<string, string> = {
  "greentastic-wave": "kohinoor-greentastic-wave-kharadi",
  "vtp-altair": "vtp-altair-kharadi",
  "kumar-goldmine": "kumar-goldmine-sapphire-mundhwa",
  triaa: "triaa-one-aretha-dhanori",
  "mantra-magnus": "mantra-magnus-mundhwa",
  "lodha-estilo": "lodha-estilo-kharadi",
  "parmar-the-highgates": "parmar-the-high-gates-hadapsar",
  "ganga-avanta": "goel-ganga-avanta-hadapsar",
  "kohinoor-viva-pixel": "kohinoor-viva-pixel-dhanori",
  "nyti-era": "nyati-era-dhanori",
  "dolce-vita": "vtp-dolce-vita-kharadi",
  "mantra-29-gold-cost-dhanori-tingre-nagar": "mantra-29-gold-coast-dhanori-tingre-nagar",
  "emi-calculator-pune-property-investor": "emi-calculator",
};
const pageMoves: Record<string, string> = {
  blog: "/blogs",
  contact: "/contact-us",
  career: "/career-in-pune",
  "awards-and-recognition": "/awards-certifications",
  kharadi: "/2-bhk-flats-in-kharadi",
  dhanori: "/2-bhk-flats-in-dhanori",
  wagholi: "/2-bhk-flats-in-wagholi",
  nibm: "/2-bhk-flats-in-nibm",
  hadapasar: "/2-bhk-flats-in-hadapsar",
  keshavnagar: "/2-bhk-flats-in-keshav-nagar",
  mundhwa: "/2-bhk-flats-in-mundhwa",
  "2-3-bhk-flats-in-mundhwa": "/2-bhk-flats-in-mundhwa",
  "2-3-bhk-flats-in-nibm": "/2-bhk-flats-in-nibm",
  "2-3-bhk-flats-in-dhanori": "/2-bhk-flats-in-dhanori",
};

const config: NextConfig = {
  turbopack: { root: process.cwd() },
  trailingSlash: true, // the current site serves every URL with a trailing slash; keep them identical
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 90],
    remotePatterns: [
      { protocol: "https", hostname: "punepropertyinvestor.com", pathname: "/wp-content/uploads/**" },
      { protocol: "https", hostname: "i.ytimg.com", pathname: "/vi/**" },
    ],
  },
  async redirects() {
    return [
      ...Object.entries(slugMoves).map(([from, to]) => ({ source: `/${from}`, destination: `/${to}/`, permanent: true })),
      ...Object.entries(pageMoves).map(([from, to]) => ({ source: `/${from}`, destination: `${to}/`, permanent: true })),
    ];
  },
};

export default config;
