import {SITE_KEYS} from "@/app/lib/i18n";
import {getSitemapEntries, renderSitemap} from "@/app/lib/sitemapEntries";

// /sitemap.xml of each domain (the middleware rewrites it to /{site}/sitemap.xml). Built at deploy time.
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
    return SITE_KEYS.map((host) => ({host}));
}

export async function GET(request, {params}) {
    const {host} = await params;
    return new Response(renderSitemap(getSitemapEntries(host)), {
        headers: {"Content-Type": "application/xml; charset=utf-8"},
    });
}
