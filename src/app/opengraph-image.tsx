import {ImageResponse} from "next/og";
import {join} from "node:path";
import sharp from "sharp";
import {profile} from "@/data/profile";
import {colors} from "@/theme/tokens";

export const alt = `${profile.name} – ${profile.title}`;
export const size = {width: 1200, height: 630};
export const contentType = "image/png";

async function loadProfilePhotoDataUrl(): Promise<string> {
    const photoFilePath = join(process.cwd(), "public", profile.photoPath);
    const pngBuffer = await sharp(photoFilePath).png().toBuffer();
    return `data:image/png;base64,${pngBuffer.toString("base64")}`;
}

const profilePhotoDataUrl = await loadProfilePhotoDataUrl();

export default function OpenGraphImage() {
    return new ImageResponse(
        (
            <div style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                gap: 72,
                padding: "0 96px",
                background: colors.surfaceSocialCard,
                color: colors.textPrimary,
            }}>
                <img
                    src={profilePhotoDataUrl}
                    width={300}
                    height={300}
                    alt=""
                    style={{borderRadius: "50%", border: `6px solid ${colors.accent}`, objectFit: "cover"}}
                />
                <div style={{display: "flex", flexDirection: "column", maxWidth: 620}}>
                    <div style={{fontSize: 84, fontWeight: 700, lineHeight: 1.1}}>{profile.name}</div>
                    <div style={{fontSize: 40, color: colors.textSecondary, marginTop: 12}}>{profile.title}</div>
                    <div style={{fontSize: 28, color: colors.textMuted, marginTop: 28, lineHeight: 1.4}}>{profile.tagline}</div>
                    <div style={{fontSize: 28, color: colors.accent, marginTop: 36}}>brandonli.me</div>
                </div>
            </div>
        ),
        size,
    );
}
