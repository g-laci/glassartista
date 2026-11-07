// Brand contact channels shown in the navbars and on the contact pages.

export const GLASSARTISTA_LINKS = {
    email: "info@glassartista.com",
    instagram: "https://www.instagram.com/glassartista_h",
    facebook: "https://www.facebook.com/glassartistah",
    youtube: "https://www.youtube.com/@GlassArtista",
};

export const TIFFANY_LINKS = {
    email: "m.tiffanystudio@gmail.com",
    instagram: "https://www.instagram.com/magnolia_tiffanystudio/",
    facebook: "https://www.facebook.com/profile.php?id=100054201323550#",
};

const PHONE_AT = {href: "tel:+436766933329", display: "+43 (0) 676 693 3329"};
const PHONE_HU = {href: "tel:+36703600950", display: "+36-70/360-0950"};

/** Owner of both brands (shown on the contact pages). */
export const OWNER = {givenName: "Eszter", familyName: "Nyíri"};

/**
 * Business locations, structured for Schema.org. Must match CONTACT_ADDRESS_LINES / CONTACT_PHONES in
 * contact.js: the Hungarian pages show the Miskolc location, the German and English pages Achenkirch.
 */
export const LOCATIONS = {
    miskolc: {
        address: {streetAddress: "János utca 23.", postalCode: "3535", addressLocality: "Miskolc", addressCountry: "HU"},
        phones: ["+36703600950"],
        areaServed: ["HU"],
    },
    achenkirch: {
        address: {
            streetAddress: "Sagbichl 494C",
            postalCode: "6215",
            addressLocality: "Achenkirch",
            addressRegion: "Tirol",
            addressCountry: "AT",
        },
        phones: ["+436766933329", "+491728184253"],
        areaServed: ["AT", "DE"],
    },
};

/** Location presented on the pages of `locale`. */
export function getLocationKey(locale) {
    return locale === "hu" ? "miskolc" : "achenkirch";
}

/** Phone shown in the GlassArtista navbar: the Hungarian number for Hungarian, otherwise the Austrian one. */
export function getGlassArtistaPhone(locale) {
    return locale === "hu" ? PHONE_HU : PHONE_AT;
}

/** Phone shown in the Tiffany Studio navbar, by host. */
export function getTiffanyPhone(host) {
    return host === "tiffanystudio.hu" ? PHONE_HU : {href: PHONE_AT.href, display: "+43 (0) 676 6933329"};
}
