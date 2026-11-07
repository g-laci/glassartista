import {FaFacebookSquare, FaYoutube} from "react-icons/fa";
import {AiFillInstagram} from "react-icons/ai";
import {RiMailFill} from "react-icons/ri";
import ContactLayout, {ExternalProfileLink} from "@/app/components/contact/ContactLayout";
import {GLASSARTISTA_EMAILS} from "@/app/content/contact";
import {GLASSARTISTA_LINKS} from "@/app/content/site";
import {BRANDS} from "@/app/lib/i18n";
import {buildPageJsonLd, buildPageMetadata} from "@/app/lib/seo";
import JsonLd from "@/app/components/seo/JsonLd";
import {GLASSARTISTA_NAV_TEXT} from "@/app/content/navigation";

export async function generateMetadata({params}) {
    return buildPageMetadata(BRANDS.GLASSARTISTA, "contact", (await params).lang);
}

export default async function GlassArtistaContactPage({params}) {
    const locale = (await params).lang;

    return (
        <ContactLayout site="glassartista" locale={locale}
                       heading={`${GLASSARTISTA_NAV_TEXT[locale].contact} – GlassArtista`}
                       jsonLd={<JsonLd data={buildPageJsonLd(BRANDS.GLASSARTISTA, "contact", locale)}/>}
                       infoClassName="flex flex-col gap-6 h-full justify-center items-start">
            <div className="flex flex-row items-center gap-2">
                <RiMailFill size={25}/>
                <div>
                    {GLASSARTISTA_EMAILS[locale].map((email) => (
                        <div key={email}><a href={`mailto:${email}`}>{email}</a></div>
                    ))}
                </div>
            </div>
            <ExternalProfileLink href={GLASSARTISTA_LINKS.instagram} icon={<AiFillInstagram size={30}/>} label="glassartista_h"/>
            <ExternalProfileLink href={GLASSARTISTA_LINKS.facebook} icon={<FaFacebookSquare size={30}/>} label="GlassArtista"/>
            <ExternalProfileLink href={GLASSARTISTA_LINKS.youtube} icon={<FaYoutube size={30}/>} label="@GlassArtista"/>
        </ContactLayout>
    );
}
