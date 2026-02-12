import {Grid, Typography} from "@mui/material";
import {FaDiscord} from "react-icons/fa";
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import GitHubIcon from '@mui/icons-material/GitHub'
import YouTubeIcon from '@mui/icons-material/YouTube'
import {SectionHeading} from "@/app/common";
import {ElementType, MouseEvent} from "react";

export default function Contact() {

    interface SocialIconProps {
        Icon: ElementType;
        href: string;
        label: string;
    }

    const SocialIcon = ({Icon, href, label}: SocialIconProps) => {
        return (
            <Grid>
                <a href={href} target="_blank" rel="noopener noreferrer" style={{textDecoration: 'none'}}
                   aria-label={label}>
                    <Icon sx={{
                        fontSize: 28,
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                        '&:hover': {
                            filter: 'brightness(1.3)'
                        }
                    }}/>
                </a>
            </Grid>
        );
    };

    interface DiscordIconProps {
        sx?: {
            fontSize?: number | string;
            color?: string;
            cursor?: string;
        };
        className?: string;
        onClick?: () => void;
    }

    const DiscordIcon = (props: DiscordIconProps) => {
        return (
            <FaDiscord
                style={{
                    fontSize: props.sx?.fontSize,
                    color: props.sx?.color,
                    cursor: props.sx?.cursor,
                    transition: 'all 0.3s'
                }}
                onMouseOver={(e: MouseEvent<SVGElement>) => {
                    const target = e.currentTarget;
                    target.style.filter = 'brightness(1.3)';
                }}
                onMouseOut={(e: MouseEvent<SVGElement>) => {
                    const target = e.currentTarget;
                    target.style.filter = 'brightness(1)';
                }}
                className={props.className}
                onClick={props.onClick}
            />
        );
    };

    return (
        <Grid sx={{maxWidth: '350px', width: '100%'}}>
            <SectionHeading number={1} text="Contact"/>
            <Grid>
                <Typography variant="h3" fontWeight="bold">Brandon Li</Typography>
                <Typography variant="h4" fontWeight="bold" sx={{fontSize: "1.25rem"}}>Software Engineer</Typography>
                <Typography marginTop={3} variant="body1">
                    I build fast, reliable open-source software that powers back end applications.
                </Typography>
            </Grid>
            <Grid container spacing={2} marginTop={5} sx={{maxWidth: '700px'}}>
                <SocialIcon Icon={DiscordIcon} href="https://discord.gg/MgqRKvycMC" label={"Discord"}/>
                <SocialIcon Icon={GitHubIcon} href="https://github.com/PulseBeat02" label={"GitHub"}/>
                <SocialIcon Icon={YouTubeIcon} href="https://www.youtube.com/@pulsebeat_02" label={"YouTube"}/>
                <SocialIcon Icon={LinkedInIcon} href="https://linkedin.com/in/brandonli28" label={"LinkedIn"}/>
                <SocialIcon Icon={EmailIcon} href="mailto:jobs@brandonli.me" label={"Email"}/>
                <SocialIcon Icon={PhoneIcon} href="tel:+1-978-245-5532" label={"Phone"}/>
            </Grid>
        </Grid>
    );
}