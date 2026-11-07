// IndexNow key verification file. The middleware rewrites /<key>.txt to this route; it answers only for
// the configured key (INDEXNOW_KEY, server-side env var), so other *.txt paths still 404.

export const dynamic = "force-dynamic";

export function GET(request) {
    const key = process.env.INDEXNOW_KEY;
    // After the middleware rewrite the handler may see either the public URL (/<key>.txt) or the
    // rewritten one (?key=<key>), depending on the runtime; accept both.
    const url = new URL(request.url);
    const requested = url.pathname.match(/^\/([a-f0-9]{32})\.txt$/)?.[1] ?? url.searchParams.get("key");
    if (!key || requested !== key) {
        return new Response("Not Found", {status: 404, headers: {"Content-Type": "text/plain"}});
    }
    return new Response(key, {headers: {"Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=86400"}});
}
