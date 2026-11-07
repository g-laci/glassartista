import Image from "next/image";
import {BRANDS} from "@/app/lib/i18n";
import {buildPageJsonLd, buildPageMetadata} from "@/app/lib/seo";
import JsonLd from "@/app/components/seo/JsonLd";
import {HOME_TEXT} from "@/app/content/home";

export async function generateMetadata({params}) {
    return buildPageMetadata(BRANDS.GLASSARTISTA, "home", (await params).lang);
}

export default async function GlassArtistaHomePage({params}) {
    const {lang} = await params;
    const t = HOME_TEXT[lang];

    return (
        <div className="w-screen px-10 xl:px-0 xl:w-1/2 justify-self-center pb-16">
            <JsonLd data={buildPageJsonLd(BRANDS.GLASSARTISTA, "home", lang)}/>
            {/* The logo is the page heading (its alt text is the heading text). */}
            <h1>
                <Image src="/design/glassartista_logo_text_gradient.png" alt="GlassArtista" width={250} height={250}
                       className=" justify-self-center my-12 select-none animate__animated animate__fadeInDown" draggable={false}/>
            </h1>
            <article className="flex flex-col gap-2 text-md xl:text-lg animate__animated animate__fadeInUp">
                <p>{t.p1}</p>
                <p>{t.p2}</p>
                <p>{t.p3}</p>
                <p><strong>{t.p4}</strong></p>
                <ul className="list-disc pl-5">
                    <li>{t.li1}</li>
                    <li>{t.li2}</li>
                    <li>{t.li3}</li>
                    <li>{t.li4}</li>
                </ul>
            </article>
        </div>
    );
}
