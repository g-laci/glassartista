import {Suspense} from "react";
import NavbarTiffanyStudio from "@/app/components/NavbarTiffanyStudio";

export default function TiffanyStudioLayout({children}) {
    return (
        <section className="min-h-screen max-w-screen">
            <div>
                {/* The navbar reads search params, which requires a Suspense boundary. */}
                <Suspense>
                    <NavbarTiffanyStudio/>
                </Suspense>
                {children}
            </div>
        </section>
    );
}
