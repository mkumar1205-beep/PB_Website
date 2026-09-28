import Lore from "@/components/lore/Lore";
import LoreType from "@/types/lore/loreType";
import { getAllLores } from "@/lib/server/lore";
import connectDB from "@/lib/db/connection";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  path: "/lore",
  title: "Lore",
  description:
    "Explore the stories, memories, and moments that shaped Point Blank — our journey as a student-run open source community from India.",
});

export default async function LorePage() {
  await connectDB();
  const data = await getAllLores();
  const lores: LoreType[] = JSON.parse(JSON.stringify(data));
  lores.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <section className="w-full h-full">
      <Lore lores={lores} />
    </section>
  );
}
