import type {ComponentType, CSSProperties} from "react";
import {FaDiscord} from "react-icons/fa";
import ArticleIcon from '@mui/icons-material/Article';
import EmailIcon from '@mui/icons-material/Email';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import PhoneIcon from '@mui/icons-material/Phone';
import YouTubeIcon from '@mui/icons-material/YouTube';

export const profile = {
    name: "Brandon Li",
    handle: "PulseBeat02",
    title: "Software Engineer",
    tagline: "I like to build fun low-level projects no one has ever thought before...",
    university: "University of California, Los Angeles",
    photoPath: "/images/profile/selfie.webp",
} as const;

export interface SocialLink {
    Icon: ComponentType<{ style?: CSSProperties }>;
    href: string;
    label: string;
}

export const socialLinks: SocialLink[] = [
    {Icon: GitHubIcon, href: "https://github.com/PulseBeat02", label: "GitHub"},
    {Icon: YouTubeIcon, href: "https://www.youtube.com/@pulsebeat_02", label: "YouTube"},
    {Icon: FaDiscord, href: "https://discord.gg/MgqRKvycMC", label: "Discord"},
    {Icon: LinkedInIcon, href: "https://linkedin.com/in/brandonli28", label: "LinkedIn"},
    {Icon: EmailIcon, href: "mailto:jobs@brandonli.me", label: "Email"},
    {Icon: PhoneIcon, href: "tel:+1-978-245-5532", label: "Phone"},
    {Icon: ArticleIcon, href: "https://blog.brandonli.me", label: "Blog"},
];
