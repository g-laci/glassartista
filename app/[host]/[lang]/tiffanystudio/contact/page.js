import {FaFacebookSquare} from "react-icons/fa";
import {AiFillInstagram} from "react-icons/ai";
import {RiMailFill} from "react-icons/ri";
import ContactLayout, {ExternalProfileLink} from "@/app/components/contact/ContactLayout";
import {TIFFANY_LINKS} from "@/app/content/site";
import {BRANDS} from "@/app/lib/i18n";
import {buildPageJsonLd, buildPageMetadata} from "@/app/lib/seo";
import JsonLd from "@/app/components/seo/JsonLd";
import {TIFFANY_NAV_TEXT} from "@/app/content/navigation";

export async function generateMetadata({params}) {
    return buildPageMetadata(BRANDS.TIFFANY, "contact", (await params).lang);
}

export default async function TiffanyStudioContactPage({params}) {
    const locale = (await params).lang;

    return (
        <ContactLayout site="tiffanystudio" locale={locale}
                       heading={`${TIFFANY_NAV_TEXT[locale].contact} – ${TIFFANY_NAV_TEXT[locale].branding}`}
                       jsonLd={<JsonLd data={buildPageJsonLd(BRANDS.TIFFANY, "contact", locale)}/>}
                       infoClassName="flex flex-col gap-6 h-full w-min justify-center items-start">
            <div className="flex flex-row items-center gap-2 select-all ">
                <RiMailFill size={30}/>
                {TIFFANY_LINKS.email}
            </div>
            <ExternalProfileLink href={TIFFANY_LINKS.instagram} icon={<AiFillInstagram size={30}/>} label="magnolia_tiffanystudio"/>
            <ExternalProfileLink href={TIFFANY_LINKS.facebook} icon={<FaFacebookSquare size={30}/>} label="Magnólia Tiffanystúdió"/>
        </ContactLayout>
    );
}
