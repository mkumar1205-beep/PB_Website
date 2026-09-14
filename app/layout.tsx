import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/ui/Navbar";
import AuthInitializer from "@/components/AuthInitializer";
import { Lexend } from "next/font/google";
import { GoogleTagManager } from "@next/third-parties/google";
import { Analytics } from "@hellyeah/x-ray/next";

import Footer from "@/components/ui/Footer";
import { cookies } from "next/headers";
import verifyAuth from "@/lib/verifyAuth";
import ico from "@/public/favicon.ico";
import ReactLenis from "lenis/react";
import ScrollToTop from "@/components/ui/ScrollToTop";
import { Toaster } from "react-hot-toast";
import { safeJsonLd } from "@/lib/seo/jsonld";
import { SITE_NAME, DEFAULT_DESCRIPTION, SITE_URL, DEFAULT_OG_IMAGE } from "@/lib/seo/constants";

const lexand = Lexend({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  keywords: ["Point Blank", "student tech community India", "open source community India", "Point Blank Club", "Point Blank India", "Point Blank tech community", "Point Blank coding club", "Point Blank open source", "student developers India", "developer community India", "college tech community", "student coding community", "open source contributors", "open source development"],
  authors:[{name: SITE_NAME}],
  icons: {
    icon: ico.src,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    title: SITE_NAME,
    description: DEFAULT_DESCRIPTION, 
    siteName: SITE_NAME,
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session");
  const user = sessionCookie ? (await verifyAuth(sessionCookie.value)) || null : null;

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}${DEFAULT_OG_IMAGE.url}`,
    sameAs: [
      "https://x.com/pointblank_club",
      "https://instagram.com/pointblank_club_",
      "https://linkedin.com/company/pointblank-club",
    ],
  };
  return (
    <html lang="en-IN">
      {process.env.NEXT_PUBLIC_GTM_ID && (
        <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID} />
      )}

      <body className={`bg-pbpages ${lexand.className}`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(organizationJsonLd) }}
        />
        <Analytics
          websiteId={process.env.NEXT_PUBLIC_HELLYEAH_TRACKER_ID as string}
          env={process.env.NEXT_PUBLIC_HELLYEAH_TRACKER_ENV}
          domains="www.pointblank.club"
        />
        <AuthInitializer
          authenticated={!!user}
          email={user?.email ?? null}
          name={user?.name ?? null}
          token={sessionCookie?.value ?? null}
        />
        <ReactLenis root>
          <ScrollToTop />
          {/* <DotWaveAnimation /> */}
          <div className="relative">
            <Navbar />
            {children}
            <Footer />
          </div>
          <Toaster position="top-center" />
        </ReactLenis>
      </body>
    </html>
  );
}
