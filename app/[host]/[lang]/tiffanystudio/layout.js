import {notFound} from "next/navigation";
import {BRANDS, getSite} from "@/app/lib/i18n";
import NavbarTiffanyStudio from "@/app/components/NavbarTiffanyStudio";

export default async function TiffanyStudioLayout({children, params}) {
    // These pages only exist on the tiffany domain(s); the middleware never routes them elsewhere.
    if (getSite((await params).host).brand !== BRANDS.TIFFANY) notFound();

    return (
        <section className="min-h-screen max-w-screen">
            <div>
                <NavbarTiffanyStudio/>
                {children}
            </div>
        </section>
    );
}
