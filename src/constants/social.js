/**
 * NACOS KKU VOM — Social Media Handles
 *
 * HOW TO UPDATE:
 * 1. Replace each "#" with your real profile URL
 * 2. Leave any you don't use as "" (empty string) — the icon will hide
 *
 * Examples:
 *   instagram: "https://instagram.com/nacos_kkuvom"
 *   whatsapp:  "https://chat.whatsapp.com/xxxxx"
 */

export const SOCIAL = {
  instagram: "#",
  twitter:   "#",
  whatsapp:  "#",
  facebook:  "#",
  linkedin:  "#",
  tiktok:    "#",
  youtube:   "#",
  email:     "nacoskkuvom@gmail.com",
};

/**
 * Only returns entries that have a value.
 * Used by the Footer to render only active platforms.
 */
export function getActiveSocials() {
  return Object.entries(SOCIAL).filter(([_, value]) => value && value.trim());
}