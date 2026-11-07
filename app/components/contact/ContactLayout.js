import Link from "next/link";
import {FaPhoneAlt} from "react-icons/fa";
import {FaLocationDot} from "react-icons/fa6";
import {TbExternalLink} from "react-icons/tb";
import ContactForm from "@/app/components/contact/ContactForm";
import {CONTACT_ADDRESS_LINES, CONTACT_PHONES, CONTACT_TEXT} from "@/app/content/contact";

/**
 * Contact page: address, phones and brand channels (`children`) next to the contact form.
 * `heading` is the page's (visually hidden) <h1>; `jsonLd` its structured data element.
 */
export default function ContactLayout({site, locale, infoClassName, heading, jsonLd, children}) {
    const t = CONTACT_TEXT[locale];
    const addressLines = CONTACT_ADDRESS_LINES[locale];
    const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addressLines.join(', '))}`;

    return (
        <div
            className="flex flex-col overflow-visible lg:flex-row gap-10 lg:gap-24 w-screen items-center justify-center lg:h-screen-minus-navbar-desktop mt-4 lg:mt-0 lg:pl-16">
            {jsonLd}
            <h1 className="sr-only">{heading}</h1>
            <div className={infoClassName}>
                <h2 className="text-5xl allura-regular underline decoration-2 underline-offset-8 mx-auto">{t.contactNameHeader}</h2>

                <div className="flex flex-row items-center gap-2">
                    <FaLocationDot size={25}/>
                    <a href={mapsHref} target="_blank" rel="noopener noreferrer">
                        {addressLines.map((line) => <div key={line}>{line}</div>)}
                    </a>
                </div>

                <div className="flex flex-row items-center gap-2 select-all ">
                    <FaPhoneAlt size={25} className="mb-1"/>
                    <div className="flex flex-col">
                        {CONTACT_PHONES[locale].map((phone) => <a key={phone.href} href={phone.href}>{phone.label}</a>)}
                    </div>
                </div>

                {children}
            </div>
            <div className="flex flex-col w-10/12 pb-24 lg:pb-0 lg:w-1/2">
                <h2 className="font-semibold text-neutral-400 lg:pb-5">{t.pageHeading}</h2>
                <ContactForm site={site} locale={locale} t={t}/>
            </div>
        </div>
    );
}

/** Link to an external profile: brand icon, handle and an "external link" marker. */
export function ExternalProfileLink({href, icon, label}) {
    return (
        <Link href={href} target="_blank" rel="noopener">
            <div className="flex flex-row items-center gap-2 ">
                {icon}
                {label}
                <TbExternalLink size={16}/>
            </div>
        </Link>
    );
}
