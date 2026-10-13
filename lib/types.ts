export type AreaKey =
  | "kharadi" | "dhanori" | "mundhwa" | "hadapsar" | "keshav-nagar" | "charholi" | "wagholi"
  | "nibm" | "undri" | "lohegaon" | "wadgaon-sheri" | "viman-nagar" | "manjari" | "kalyani-nagar";

export type Status = "new_launch" | "under_construction" | "ready";

export interface Configuration {
  type: string;
  carpet: string;
  price: string;
  priceLakh: number | null;
}

/** One residential project. Every field comes from the current site; null means "not published". */
export interface Property {
  slug: string;
  name: string;
  developer: string | null;
  developerSlug: string | null;
  area: AreaKey | null;
  status: Status | null;
  statusLabel: string | null;
  priceFromLakh: number | null;
  configs: Configuration[];
  bhk: number[];
  carpetMin: number | null;
  carpetMax: number | null;
  carpetLabel: string | null;
  landParcel: string | null;
  towers: string | null;
  floors: string | null;
  rera: string | null;
  targetPossession: string | null;
  reraPossession: string | null;
  litigation: string | null;
  video: string | null;
  lat: number | null;
  lng: number | null;
  brochure: string | null;
  cover: string | null;
  gallery: string[];
  floorPlans: string[];
  masterPlans: string[];
  description: string;
  metaTitle: string;
  lastmod: string | null;
  layout: string;
  flags: string[];
}

export type PropertyCardData = Pick<
  Property,
  "slug" | "name" | "developer" | "developerSlug" | "area" | "status" | "priceFromLakh" | "bhk" | "carpetMin" | "carpetMax" | "cover" | "targetPossession"
> & { rera: boolean; video: boolean };

export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  locations: string[];
  cover: string;
  readingMinutes: number;
  html: string;
  metaTitle: string;
}

export type PostLite = Omit<Post, "html" | "metaTitle">;

export interface Video {
  id: string;
  title: string;
  group: string;
  duration: string | null;
  project: string | null;
}

export interface LegacyPage {
  slug: string;
  title: string;
  metaTitle: string;
  description: string;
  html: string;
}

export type Intent = "price" | "brochure" | "visit" | "advisor";
export interface PropertyRef {
  slug: string;
  name: string;
  brochure?: string | null;
}
