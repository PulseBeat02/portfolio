import {SITE_URL} from "@/data/site";
import {profile, socialLinks} from "@/data/profile";

export function buildPersonStructuredData() {
    return {
        "@context": "https://schema.org",
        "@type": "Person",
        name: profile.name,
        alternateName: profile.handle,
        jobTitle: profile.title,
        url: SITE_URL,
        image: `${SITE_URL}${profile.photoPath}`,
        alumniOf: {"@type": "CollegeOrUniversity", name: profile.university},
        sameAs: socialLinks.map((link) => link.href).filter((href) => href.startsWith("https://")),
    };
}

export function serializeStructuredData(data: object): string {
    return JSON.stringify(data).replace(/</g, "\\u003c");
}
