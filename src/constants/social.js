/**
 * NACOS KKU VOM — Social Media Handles
 *
 * HOW TO UPDATE:
 * 1. Fill in the URLs below
 * 2. Leave any you don't use as empty string ""
 * 3. Only filled-in platforms will appear on the site
 *
 * Example:  instagram: "https://instagram.com/nacoskkuvom"
 */

export const SOCIAL = {
  instagram:  "",   // e.g. "https://instagram.com/nacoskkuvom"
  twitter:    "",   // e.g. "https://x.com/nacoskkuvom"
  whatsapp:   "",   // e.g. "https://chat.whatsapp.com/xxxxx"
  facebook:   "",   // e.g. "https://facebook.com/nacoskkuvom"
  linkedin:   "",   // e.g. "https://linkedin.com/company/nacoskkuvom"
  tiktok:     "",   // e.g. "https://tiktok.com/@nacoskkuvom"
  youtube:    "",   // e.g. "https://youtube.com/@nacoskkuvom"
  email:      "nacoskkuvom@gmail.com",
};

/**
 * Only returns entries that have a value.
 * Used by the Footer to render only the active platforms.
 */
export function getActiveSocials() {
  return Object.entries(SOCIAL).filter(([_, value]) => value && value.trim());
}