/**
 * search.js — lightweight client-side search helpers
 *
 * Used across the portal to filter lists (members, news, resources, etc.)
 * before or instead of a Supabase full-text search call.
 */

/**
 * Normalise a string for consistent comparison:
 * lowercase, collapse whitespace, strip leading/trailing space.
 *
 * @param {string} str
 * @returns {string}
 */
export function normalise(str = "") {
  return String(str).toLowerCase().replace(/\s+/g, " ").trim();
}

/**
 * Check whether `haystack` includes the `needle` (case-insensitive).
 *
 * @param {string} haystack
 * @param {string} needle
 * @returns {boolean}
 */
export function includes(haystack, needle) {
  if (!needle) return true;
  return normalise(haystack).includes(normalise(needle));
}

/**
 * Filter an array of objects by a query string, searching across
 * a specified set of fields.
 *
 * @param {Object[]} items  - array to filter
 * @param {string}   query  - user search query
 * @param {string[]} fields - object keys to search (dot-notation not supported)
 * @returns {Object[]}      - matched items (original references, not copies)
 *
 * @example
 *   const filtered = searchItems(members, query, ["full_name", "email", "matric_no"]);
 */
export function searchItems(items, query, fields) {
  if (!query || !query.trim()) return items;
  const q = normalise(query);
  return items.filter((item) =>
    fields.some((field) => {
      const value = item[field];
      return value != null && normalise(String(value)).includes(q);
    })
  );
}

/**
 * Highlight occurrences of `query` inside `text` by wrapping them in
 * a <mark> element string.
 *
 * Safe against XSS — only the original `text` characters are rendered,
 * the query is never injected into HTML.
 *
 * @param {string} text
 * @param {string} query
 * @returns {string} HTML string with <mark> tags
 *
 * @example
 *   // In JSX: <span dangerouslySetInnerHTML={{ __html: highlightMatch(title, query) }} />
 *   highlightMatch("Computer Science", "comp");
 *   // → "<mark>Comp</mark>uter Science"
 */
export function highlightMatch(text, query) {
  if (!query || !query.trim()) return escapeHtml(text);
  const escaped = escapeRegExp(query.trim());
  const regex = new RegExp(`(${escaped})`, "gi");
  return escapeHtml(text).replace(regex, "<mark>$1</mark>");
}

// ---- internal helpers -------------------------------------------------------

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
