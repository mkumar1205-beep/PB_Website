/**
 * Safely serializes data for embedding in a <script type="application/ld+json">.
 * JSON.stringify alone does not escape "<", so content containing
 * "</script><script>...</script>" would terminate the script block early
 * (the HTML parser closes a script element on the first literal "</script>"
 * regardless of JS/JSON string context) and execute injected JS for every
 * visitor. Escaping <, >, & as unicode escapes keeps the JSON valid — a
 * JSON.parse on the other end reconstructs the original text exactly —
 * while making the raw bytes unreadable as HTML tags. \u2028/\u2029 are
 * escaped too since they're legal in JSON strings but act as line
 * terminators when embedded raw in a script block.
 */
export function safeJsonLd(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}