import {Suspense} from "react";
import NavbarGlassArtista from "@/app/components/NavbarGlassArtista";

export default function GlassArtistaLayout({children}) {
    return (
        <section className="min-h-screen max-w-screen">
            <div>
                {/* The navbar reads search params, which requires a Suspense boundary. */}
                <Suspense>
                    <NavbarGlassArtista/>
                </Suspense>
                {children}
            </div>
        </section>
    );
}
