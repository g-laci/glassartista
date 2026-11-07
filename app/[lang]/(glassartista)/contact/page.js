import {FaFacebookSquare, FaYoutube} from "react-icons/fa";
import {AiFillInstagram} from "react-icons/ai";
import {RiMailFill} from "react-icons/ri";
import ContactLayout, {ExternalProfileLink} from "@/app/components/contact/ContactLayout";
import {GLASSARTISTA_EMAILS} from "@/app/content/contact";
import {GLASSARTISTA_LINKS} from "@/app/content/site";
import {resolveLocale} from "@/app/lib/i18n";

export default async function GlassArtistaContactPage({params}) {
    const locale = resolveLocale((await params).lang);

    return (
        <ContactLayout site="glassartista" locale={locale}
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
