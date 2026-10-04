import type {MetadataRoute} from "next";
import {SITE_LAST_UPDATED_DATE, SITE_URL} from "@/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: SITE_URL,
            lastModified: SITE_LAST_UPDATED_DATE,
            changeFrequency: "weekly",
            priority: 1,
        },
    ];
}
