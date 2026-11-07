import {getSite, SITE_KEYS} from "@/app/lib/i18n";

// /robots.txt of each domain (the middleware rewrites it to /{site}/robots.txt). Preview and development
// hosts are kept out of the index by the X-Robots-Tag header the middleware adds, which crawlers can
// only see if crawling is allowed, so robots.txt stays permissive there too.
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
    return SITE_KEYS.map((host) => ({host}));
}

export async function GET(request, {params}) {
    const {origin} = getSite((await params).host);
    const body = [
        "User-agent: *",
        "Allow: /",
        "Disallow: /api/",
        "",
        `Sitemap: ${origin}/sitemap.xml`,
        "",
    ].join("\n");
    return new Response(body, {headers: {"Content-Type": "text/plain; charset=utf-8"}});
}
