import type {ComponentType, CSSProperties} from "react";
import {FaDiscord} from "react-icons/fa";
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import GitHubIcon from '@mui/icons-material/GitHub';
import YouTubeIcon from '@mui/icons-material/YouTube';

export const profile = {
    name: "Brandon Li",
    title: "Software Engineer",
    tagline: "I build unique, low-level projects never thought of before.",
};

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
];
