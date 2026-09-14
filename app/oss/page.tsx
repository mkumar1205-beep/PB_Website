import type { Metadata } from "next";
import OssDashboard from "@/components/oss/OssDashboard";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  path: "/oss",
  title: "OSS",
  description:
    "Open source contributions and merged pull requests of Point Blank members.",
});

export default function OssPage() {
  return (
    <section className="w-full" id="oss">
      <OssDashboard endpoint="/api/contributionsV2" />
    </section>
  );
}
