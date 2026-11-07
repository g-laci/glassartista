// 404 page rendered inside the localized root layout (so the footer and site styles apply).
// Markup and styles mirror Next.js' built-in not-found page, which the site has always shown.

const STYLES = {
    error: {
        fontFamily: 'system-ui,"Segoe UI",Roboto,Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji"',
        height: '100vh',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    desc: {display: 'inline-block'},
    h1: {
        display: 'inline-block',
        margin: '0 20px 0 0',
        padding: '0 23px 0 0',
        fontSize: 24,
        fontWeight: 500,
        verticalAlign: 'top',
        lineHeight: '49px',
    },
    h2: {fontSize: 14, fontWeight: 400, lineHeight: '49px', margin: 0},
};

const CSS = "body{color:#000;background:#fff;margin:0}.next-error-h1{border-right:1px solid rgba(0,0,0,.3)}"
    + "@media (prefers-color-scheme:dark){body{color:#fff;background:#000}.next-error-h1{border-right:1px solid rgba(255,255,255,.3)}}";

export default function NotFound() {
    return (
        <>
            <title>404: This page could not be found.</title>
            <div style={STYLES.error}>
                <div>
                    <style dangerouslySetInnerHTML={{__html: CSS}}/>
                    <h1 className="next-error-h1" style={STYLES.h1}>404</h1>
                    <div style={STYLES.desc}>
                        <h2 style={STYLES.h2}>This page could not be found.</h2>
                    </div>
                </div>
            </div>
        </>
    );
}
