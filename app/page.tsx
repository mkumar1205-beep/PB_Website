import type { Metadata } from "next";
import HomeClient from "@/components/homepage/HomeClient";
import { safeJsonLd } from "@/lib/seo/jsonld";
import { buildMetadata } from "@/lib/seo/metadata";

const SITE_URL = "https://www.pointblank.club";

export const metadata = buildMetadata({
  path: "/",
  absoluteTitle: "Point Blank | Student Run Open Source Community from India",
  description:
    "Point Blank is a student run open source community. We are a group of tech enthusiasts who love to learn and grow together.",
});

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Point Blank",
    url: SITE_URL,
  };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLd(jsonLd),
        }}
      />
      <HomeClient />
    </>
  );
}