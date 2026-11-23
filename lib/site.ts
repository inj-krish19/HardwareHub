/** The public address of the site (for example https://hardwarehub.vercel.app), used for
 * canonical links and the sitemap. Optional: set NEXT_PUBLIC_SITE_URL in the
 * frontend environment. Without it the sitemap is empty and canonical links stay relative. */
export function siteUrl(): string | null {
    const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/+$/, "");
    return raw ? raw : null;
}