import {notFound} from "next/navigation";
import {BRANDS, getSite} from "@/app/lib/i18n";
import NavbarGlassArtista from "@/app/components/NavbarGlassArtista";

export default async function GlassArtistaLayout({children, params}) {
    // These pages only exist on the glassartista domain(s); the middleware never routes them elsewhere.
    if (getSite((await params).host).brand !== BRANDS.GLASSARTISTA) notFound();

    return (
        <section className="min-h-screen max-w-screen">
            <div>
                <NavbarGlassArtista/>
                {children}
            </div>
        </section>
    );
}
