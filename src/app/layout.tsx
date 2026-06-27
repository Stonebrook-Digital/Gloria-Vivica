import type { Metadata } from "next";
import { site } from "@/data/site";
import "./globals.css";

const { formalName, headshotHero, seo } = site;

export const metadata: Metadata = {
  metadataBase: new URL(seo.siteUrl),
  title: {
    default: formalName,
    template: `%s | ${formalName}`,
  },
  description: seo.description,
  keywords: [...seo.keywords],
  authors: [{ name: formalName }],
  creator: formalName,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: seo.siteUrl,
    siteName: formalName,
    title: formalName,
    description: seo.description,
    images: [
      {
        url: headshotHero,
        alt: `${formalName} — headshot`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: formalName,
    description: seo.description,
    images: [headshotHero],
  },
  alternates: {
    canonical: seo.siteUrl,
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
