import type { Metadata } from "next";
import { SITE_NAME, DEFAULT_DESCRIPTION, DEFAULT_OG_IMAGE } from "./constants";

interface BuildMetadataInput {
  /** Relative path starting with "/", e.g. "/events". Resolved against
   *  layout.tsx's metadataBase. */
  path: string;
  /**
   * Short page title, e.g. "Events". Passed through as-is to
   * `metadata.title`, so layout.tsx's title.template ("%s | Point Blank")
   * adds the brand suffix exactly once.
   *
   * NOT for the homepage: pass `absoluteTitle` instead. A short title
   * here would incorrectly go through the template.
   */
  title?: string;
  /**
   * Full, final title string, opting this page OUT of title.template
   * entirely (via Next's `title: { absolute }`). Use this for the ONE
   * page (the homepage) whose title is meant to stand alone rather than
   * have "| Point Blank" appended.
   */
  absoluteTitle?: string;
  description?: string;
  type?: "website" | "article";
  image?: typeof DEFAULT_OG_IMAGE;
}

/**
 * Builds a page's Metadata object from a minimal input, so individual
 * pages don't hand-write canonical URLs, OG image blocks, or repeat the
 * brand suffix. Exactly one of `title` / `absoluteTitle` must be passed.
 */
export function buildMetadata({
  path,
  title,
  absoluteTitle,
  description = DEFAULT_DESCRIPTION,
  type = "website",
  image = DEFAULT_OG_IMAGE,
}: BuildMetadataInput): Metadata {
  if (!title && !absoluteTitle) {
    throw new Error("buildMetadata: pass either `title` or `absoluteTitle`");
  }

  // OG/Twitter titles are NOT run through Next's title.template — social
  // crawlers read them literally — so the full brand string is always
  // needed here regardless of which title mode the page uses.
  const socialTitle = absoluteTitle ?? `${title} | ${SITE_NAME}`;

  return {
    title: absoluteTitle ? { absolute: absoluteTitle } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: socialTitle,
      description,
      url: path,
      type,
      siteName: SITE_NAME,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [image],
    },
  };
}