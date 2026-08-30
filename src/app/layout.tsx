import type { Metadata, Viewport } from "next";
import { draftMode } from "next/headers";
import { VisualEditing } from "next-sanity/visual-editing";
import { marcellus, cormorant, openSans, allura, gulzar } from "./fonts";
import { SiteNav } from "@/components/chrome/SiteNav";
import { SiteFooter } from "@/components/chrome/SiteFooter";
import { FloatingActions } from "@/components/chrome/FloatingActions";
import { RestaurantJsonLd } from "@/components/chrome/JsonLd";
import { SanityLive } from "@/sanity/live";
import { site } from "@/data/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name}: ${site.tagline}`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en_CA",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: `${site.name}, Pakistani restaurant in Edmonton` }],
  },
  twitter: {
    card: "summary_large_image",
  },
};

export const viewport: Viewport = {
  // Sole intentional exception to "no raw hex": the <meta name="theme-color">
  // tag needs a literal string (it can't reference a CSS custom property).
  // This is --emerald-deep from globals.css — keep them in sync if that token changes.
  themeColor: "#112D2A",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const isDraftMode = (await draftMode()).isEnabled;

  return (
    <html
      lang="en"
      className={`${marcellus.variable} ${cormorant.variable} ${openSans.variable} ${allura.variable} ${gulzar.variable}`}
    >
      <body>
        <a
          href="#main"
          className="sr-only z-50 rounded-button bg-gold px-s4 py-s2 font-semibold text-ink focus:not-sr-only focus:fixed focus:left-s4 focus:top-s4"
        >
          Skip to content
        </a>
        <SiteNav />
        <main id="main">{children}</main>
        <SiteFooter />
        <FloatingActions />
        <RestaurantJsonLd />
        <SanityLive />
        {isDraftMode && <VisualEditing />}
      </body>
    </html>
  );
}
