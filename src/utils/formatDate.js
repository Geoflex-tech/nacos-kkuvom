/**
 * formatDate.js — date formatting helpers for the NACOS KKU VOM portal.
 *
 * Thin wrappers around the Intl.DateTimeFormat API so components don't have
 * to pass format strings around. All functions accept a Date, ISO string,
 * or Unix timestamp (milliseconds).
 */

/**
 * Parse a value into a Date, returning null for invalid inputs.
 * @param {Date|string|number} value
 * @returns {Date|null}
 */
function toDate(value) {
  if (!value) return null;
  const d = value instanceof Date ? value : new Date(value);
  return isNaN(d.getTime()) ? null : d;
}

/**
 * Format a date for display in news/event cards.
 * e.g.  "29 Sep 2026"
 *
 * @param {Date|string|number} value
 * @param {string} [locale="en-NG"]
 * @returns {string}
 */
export function formatDate(value, locale = "en-NG") {
  const d = toDate(value);
  if (!d) return "—";
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(d);
}

/**
 * Format a date with time.
 * e.g.  "29 Sep 2026, 10:30 AM"
 *
 * @param {Date|string|number} value
 * @param {string} [locale="en-NG"]
 * @returns {string}
 */
export function formatDateTime(value, locale = "en-NG") {
  const d = toDate(value);
  if (!d) return "—";
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(d);
}

/**
 * Format a date as a long readable string.
 * e.g.  "Monday, 29 September 2026"
 *
 * @param {Date|string|number} value
 * @param {string} [locale="en-NG"]
 * @returns {string}
 */
export function formatDateLong(value, locale = "en-NG") {
  const d = toDate(value);
  if (!d) return "—";
  return new Intl.DateTimeFormat(locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}

/**
 * Return "Today", "Yesterday", or the formatted date otherwise.
 *
 * @param {Date|string|number} value
 * @param {string} [locale="en-NG"]
 * @returns {string}
 */
export function formatDateRelative(value, locale = "en-NG") {
  const d = toDate(value);
  if (!d) return "—";

  const now = new Date();
  const diffDays = Math.floor((now - d) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7)  return `${diffDays} days ago`;

  return formatDate(d, locale);
}

/**
 * Format just the month and year — useful for history / milestone sections.
 * e.g.  "September 2026"
 *
 * @param {Date|string|number} value
 * @param {string} [locale="en-NG"]
 * @returns {string}
 */
export function formatMonthYear(value, locale = "en-NG") {
  const d = toDate(value);
  if (!d) return "—";
  return new Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric",
  }).format(d);
}
