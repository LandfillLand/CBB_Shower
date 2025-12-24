const rawIndexingFlag =
  process.env.NEXT_PUBLIC_ALLOW_INDEXING ??
  process.env.ALLOW_INDEXING ??
  "";

const normalizedFlag = rawIndexingFlag.trim().toLowerCase();
const truthyFlags = new Set(["1", "true", "yes", "on"]);

export const ALLOW_INDEXING = truthyFlags.has(normalizedFlag);

export function getBaseUrl() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  const vercelUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`.replace(/\/$/, "")
    : undefined;
  const env = process.env.VERCEL_ENV || process.env.NODE_ENV;

  if (env !== "production" && vercelUrl) return vercelUrl;
  if (env === "production" && siteUrl) return siteUrl;
  if (vercelUrl) return vercelUrl;
  if (siteUrl) return siteUrl;
  return "http://localhost:3000";
}

export const EXTERNAL_SITEMAPS = [
  "https://astrbot.qzz.io/sitemap.xml",
];
