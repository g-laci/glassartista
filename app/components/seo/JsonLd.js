/** Server-rendered Schema.org JSON-LD. `<` is escaped so the payload can never close the script tag. */
export default function JsonLd({data}) {
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{__html: JSON.stringify(data).replace(/</g, "\u003c")}}
        />
    );
}
