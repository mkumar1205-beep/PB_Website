import type { Metadata } from "next";
import ReviewMarquee from "@/components/events/ReviewMarquee";
import { getAllEvents } from "@/lib/server/events";
import connectDB from "@/lib/db/connection";
import Events, { type Event } from "@/components/events/Events";
import { safeJsonLd } from "@/lib/seo/jsonld";
import { buildMetadata } from "@/lib/seo/metadata";
import { SITE_URL } from "@/lib/seo/constants"

export const metadata: Metadata = buildMetadata({
  path: "/events",
  title: "Events",
  description:
    "Discover upcoming and past events by Point Blank — workshops, hackathons, talks, and meetups for student developers and tech enthusiasts.",
});

export default async function EventsPage() {
  await connectDB();
  const rawEvents = await getAllEvents();
  const events: Event[] = JSON.parse(JSON.stringify(rawEvents));
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: events.slice(0, 10).map((event, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      item: {
        "@type": "Event",
        name: event.eventName,
        description: event.description,
        startDate: event.eventDate,
        organizer: {
          "@type": "Organization",
          name: "Point Blank",
          // Absolute on purpose: JSON-LD is raw serialized data, not part
          // of the `metadata` export, so metadataBase does NOT resolve it.
          url: SITE_URL,
        },
      },
    })),
  };
  return (
    <>
    <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLd(jsonLd)}}
       />
      <section className="relative overflow-hidden text-white flex items-center justify-center px-4 sm:px-10 lg:px-20">
        <div className="relative z-10 flex flex-col items-center justify-center pt-24 max-w-8xl mx-auto w-full">
          <h1 className="text-center text-white tracking-tight text-5xl md:text-6xl lg:text-7xl font-normal leading-tight md:leading-snug">
            Events
          </h1>
        </div>
      </section>
      <Events events={events} />
      <div className="text-white py-14 overflow-hidden">
        <h2 className="text-4xl md:text-5xl lg:text-7xl font-normal leading-tight md:leading-snug text-white mb-8 text-center px-6">
          Events experience
        </h2>
        <ReviewMarquee />
      </div>
    </>
  );
}
