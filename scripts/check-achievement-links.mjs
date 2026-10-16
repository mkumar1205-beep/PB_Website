#!/usr/bin/env node
/**
 * Checks every achievement proof link and reports dead or missing ones.
 *
 * Usage:
 *   node scripts/check-achievement-links.mjs https://www.pointblank.club
 *   node scripts/check-achievement-links.mjs http://localhost:3000
 *
 * Reads GET /api/achievements (public), then sends a HEAD request (falling
 * back to GET) to each url. Exits with code 1 if any link is broken, so it can
 * run in CI or as a scheduled GitHub Action.
 *
 * Note: some sites (single-page apps, bot protection) answer 403/405 to
 * scripts even when the page works in a browser. Those are reported as
 * "check manually", not as failures.
 */
const base = (process.argv[2] ?? "http://localhost:3000").replace(/\/$/, "");
const TIMEOUT_MS = 15000;
const DELAY_MS = 500; // be polite to third-party sites

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function probe(url) {
  for (const method of ["HEAD", "GET"]) {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
    try {
      const res = await fetch(url, {
        method,
        redirect: "follow",
        signal: ctrl.signal,
        headers: { "user-agent": "pointblank-link-checker/1.0" },
      });
      clearTimeout(t);
      if (res.status === 405 && method === "HEAD") continue;
      return res.status;
    } catch (e) {
      clearTimeout(t);
      if (method === "GET") return `error: ${e.name === "AbortError" ? "timeout" : e.message}`;
    }
  }
}

const res = await fetch(`${base}/api/achievements`);
const { achievements = [] } = await res.json();

const rows = [];
for (const doc of achievements) {
  for (const [category, entries] of Object.entries(doc.achivements ?? {})) {
    for (const e of entries ?? []) {
      rows.push({ member: doc.name, category, title: e.title, url: e.url });
    }
  }
}

let missing = 0, broken = 0, manual = 0, ok = 0;
for (const r of rows) {
  const label = `${r.member} | ${r.category} | ${r.title}`;
  if (!r.url) {
    missing++;
    console.log(`MISSING  ${label}`);
    continue;
  }
  const status = await probe(r.url);
  if (status === 200) ok++;
  else if (status === 403 || status === 405 || status === 429) {
    manual++;
    console.log(`MANUAL   ${status}  ${label}\n         ${r.url}`);
  } else {
    broken++;
    console.log(`BROKEN   ${status}  ${label}\n         ${r.url}`);
  }
  await sleep(DELAY_MS);
}

console.log(
  `\n${rows.length} entries: ${ok} ok, ${missing} missing link, ${manual} check manually, ${broken} broken`,
);
process.exit(broken > 0 ? 1 : 0);