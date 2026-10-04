import type {MetadataRoute} from "next";
import {SITE_URL} from "@/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: SITE_URL,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 0.7,
        },
    ];
}
