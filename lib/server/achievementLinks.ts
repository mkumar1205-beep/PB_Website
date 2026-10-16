export type EntryWithUrl = { title?: string; url?: string };
export function isSafeHttpsUrl(value: string): boolean {
  try {
    const u = new URL(value);
    return u.protocol === "https:" && !!u.hostname;
  } catch {
    return false;
  }
}

export function validateAchievementUrls(
  achivements: Record<string, EntryWithUrl[] | undefined> | undefined,
): string[] {
  const problems: string[] = [];
  for (const [category, entries] of Object.entries(achivements ?? {})) {
    for (const entry of entries ?? []) {
      if (entry.url === undefined) continue;
      const trimmed = entry.url.trim();
      if (!trimmed) {
        delete entry.url;
        continue;
      }
      if (!isSafeHttpsUrl(trimmed)) {
        problems.push(
          `${category} → "${entry.title ?? "untitled"}": link must be a valid https:// URL`,
        );
      } else {
        entry.url = trimmed;
      }
    }
  }
  return problems;
}