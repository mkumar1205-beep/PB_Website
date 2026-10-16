export type LinkCategory = "GSoC" | "LFX";

const LINK_CONFIG: Record<
  LinkCategory,
  { label: string; placeholder: string; officialHosts: string[] }
> = {
  GSoC: {
    label: "GSoC project link",
    placeholder: "https://summerofcode.withgoogle.com/archive/2024/projects/...",
    officialHosts: ["summerofcode.withgoogle.com"],
  },
  LFX: {
    label: "LFX mentorship link",
    placeholder: "https://mentorship.lfx.linuxfoundation.org/project/...",
    officialHosts: ["linuxfoundation.org"],
  },
};

export function supportsLink(category: string): category is LinkCategory {
  return category === "GSoC" || category === "LFX";
}

export function linkConfig(category: LinkCategory) {
  return LINK_CONFIG[category];
}
export function officialLinkWarning(
  category: string,
  url: string | undefined,
): string | null {
  if (!supportsLink(category) || !url?.trim()) return null;
  let host: string;
  try {
    const u = new URL(url.trim());
    if (u.protocol !== "https:") return "Link must start with https://";
    host = u.hostname.toLowerCase();
  } catch {
    return "This doesn't look like a valid URL";
  }
  const ok = LINK_CONFIG[category].officialHosts.some(
    (h) => host === h || host.endsWith(`.${h}`),
  );
  return ok
    ? null
    : `This doesn't look like an official ${category} link (expected ${LINK_CONFIG[category].officialHosts[0]}). You can still save it.`;
}