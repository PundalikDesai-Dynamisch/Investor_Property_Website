import type { Metadata, Viewport } from "next";
import { Manrope, Newsreader } from "next/font/google";
import "./globals.css";
import { LeadProvider } from "@/components/lead/lead-provider";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileBar } from "@/components/layout/mobile-bar";
import { CompareTray } from "@/components/property/compare-tray";
import { JsonLd } from "@/components/json-ld";
import { SITE } from "@/lib/site";

const sans = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });
const display = Newsreader({ subsets: ["latin"], variable: "--font-newsreader", display: "swap", style: ["normal", "italic"], axes: ["opsz"] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: "Real Estate Consultant in Pune | Pune Property Investor", template: "%s | Pune Property Investor" },
  description: "Independent property advisory in Pune. Compare 188 projects across Kharadi, Dhanori, Mundhwa, Hadapsar and more, with site visits, loan help and honest price context.",
  openGraph: { type: "website", siteName: SITE.name, locale: "en_IN" },
  alternates: { canonical: "/" },
  // Dark Reader rewrites SVG and image styles before React hydrates, which floods the dev overlay with false hydration errors.
  // Locked out in development only; visitors who use the extension in production are left alone.
  other: process.env.NODE_ENV === "development" ? { "darkreader-lock": "dev" } : {},
};
export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [{ media: "(prefers-color-scheme: light)", color: "#f4f7fc" }, { media: "(prefers-color-scheme: dark)", color: "#0a0f1e" }],
  width: "device-width", initialScale: 1,
};

// Runs before first paint so there is no flash of the wrong theme.
const THEME_INIT = `(function(){try{var s=localStorage.getItem("ppi:theme");var d=s?s==="dark":matchMedia("(prefers-color-scheme: dark)").matches;document.documentElement.setAttribute("data-theme",d?"dark":"light")}catch(e){}})()`;

const org = {
  "@context": "https://schema.org", "@type": "RealEstateAgent", name: SITE.name, url: SITE.url, telephone: SITE.phone, email: SITE.email,
  address: { "@type": "PostalAddress", streetAddress: "3rd floor, Gera Imperium Alpha, Grant Rd, Vitthal Nagar, Kharadi", addressLocality: "Pune", addressRegion: "MH", postalCode: "411014", addressCountry: "IN" },
  areaServed: "Pune", sameAs: SITE.social.map((s) => s.href),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${sans.variable} ${display.variable}`} suppressHydrationWarning>
      <body>
        {/* Emitted as raw HTML so React never creates a <script> on the client (that triggers a dev-only warning). It still runs before first paint. */}
        <div hidden dangerouslySetInnerHTML={{ __html: `<script>${THEME_INIT}</script>` }} />
        <LeadProvider>
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <CompareTray />
          <MobileBar />
        </LeadProvider>
        <JsonLd data={org} />
      </body>
    </html>
  );
}
