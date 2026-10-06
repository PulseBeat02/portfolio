import type {Metadata} from "next";
import {CommandMenu} from "@/components/command-menu/CommandMenu";
import {PageLayout} from "@/components/layout/PageLayout";
import {SiteFooter} from "@/components/layout/SiteFooter";
import {Spotlight} from "@/components/motion/Spotlight";
import {ProfileCard} from "@/components/profile/ProfileCard";
import {AboutSection} from "@/components/sections/AboutSection";
import {ExperienceSection} from "@/components/sections/ExperienceSection";
import {ProjectsSection} from "@/components/sections/ProjectsSection";
import {VideosSection} from "@/components/sections/VideosSection";
import {SoftDivider} from "@/components/ui/SoftDivider";

export const metadata: Metadata = {
    alternates: {
        canonical: "/",
    },
};

export default function HomePage() {
    return (
        <>
            <Spotlight/>
            <CommandMenu/>
            <PageLayout sidebar={<ProfileCard/>}>
                <SoftDivider sx={{display: {lg: 'none'}, mb: 4}}/>
                <AboutSection/>
                <ExperienceSection/>
                <SoftDivider/>
                <ProjectsSection/>
                <SoftDivider/>
                <VideosSection/>
                <SoftDivider/>
                <SiteFooter/>
            </PageLayout>
        </>
    );
}
