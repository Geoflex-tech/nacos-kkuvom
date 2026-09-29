/**
 * NACOS KKU VOM — Site-wide configuration
 *
 * This is the single source of truth for social links and other
 * site-level constants. Import from here anywhere social links
 * or contact details are displayed (Footer, About page, etc.).
 *
 * HOW TO ADD SOCIAL LINKS
 * ───────────────────────
 * Paste the full https:// URL for each platform below.
 * Leave a string EMPTY ("") to hide that icon from the footer.
 * Icons are rendered ONLY when the URL is a non-empty https:// string.
 *
 * Example:
 *   tiktok:   "https://www.tiktok.com/@nacos_kkuvom",
 *   x:        "https://x.com/nacos_kkuvom",
 *   linkedin: "https://www.linkedin.com/company/nacos-kkuvom",
 *   facebook: "https://www.facebook.com/nacos.kkuvom",
 */
export const SOCIAL_LINKS = {
  // TODO: paste the TikTok profile URL here, e.g. "https://www.tiktok.com/@your_handle"
  tiktok: "",

  // TODO: paste the X (Twitter) profile URL here, e.g. "https://x.com/your_handle"
  x: "",

  // TODO: paste the LinkedIn page URL here, e.g. "https://www.linkedin.com/company/your-page"
  linkedin: "",

  // TODO: paste the Facebook page URL here, e.g. "https://www.facebook.com/your.page"
  facebook: "",
};

/** Site name constants — used in SEO, footer, etc. */
export const SITE = {
  name:       "NACOS KKU VOM",
  fullName:   "Nigeria Association of Computing Students, Karl Kumm University, Vom Chapter",
  year:       new Date().getFullYear(),
};
