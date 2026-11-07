import {FaFacebookSquare} from "react-icons/fa";
import {AiFillInstagram} from "react-icons/ai";
import {RiMailFill} from "react-icons/ri";
import ContactLayout, {ExternalProfileLink} from "@/app/components/contact/ContactLayout";
import {TIFFANY_LINKS} from "@/app/content/site";
import {resolveLocale} from "@/app/lib/i18n";

export default async function TiffanyStudioContactPage({params}) {
    const locale = resolveLocale((await params).lang);

    return (
        <ContactLayout site="tiffanystudio" locale={locale}
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
