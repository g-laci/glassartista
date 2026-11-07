import Image from "next/image";
import {resolveLocale} from "@/app/lib/i18n";
import {HOME_TEXT} from "@/app/content/home";

export default async function GlassArtistaHomePage({params}) {
    const t = HOME_TEXT[resolveLocale((await params).lang)];

    return (
        <div className="w-screen px-10 xl:px-0 xl:w-1/2 justify-self-center pb-16">
            <Image src="/design/glassartista_logo_text_gradient.png" alt="GlassArtista Logo" width={250} height={250}
                   className=" justify-self-center my-12 select-none animate__animated animate__fadeInDown" draggable={false}/>
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
