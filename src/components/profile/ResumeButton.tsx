"use client";

import {Box, Button, IconButton, Modal} from "@mui/material";
import {useState} from "react";
import CloseIcon from '@mui/icons-material/Close';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import {profile} from "@/data/profile";
import {siteMetadata} from "@/data/site";
import {accentButtonStyle} from "@/components/ui/styles";
import {accentAlpha} from "@/theme/tokens";

const RESUME_TITLE = `${profile.name}'s Resume`;

function ResumeDialog({isOpen, onClose}: { isOpen: boolean; onClose: () => void }) {
    return (
        <Modal open={isOpen} onClose={onClose}>
            <Box role="dialog" aria-modal="true" aria-label={RESUME_TITLE} sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: {xs: '90%', sm: '80%', md: '70%'},
                height: '80%',
                bgcolor: 'background.paper',
                border: `2px solid ${accentAlpha(0.3)}`,
                boxShadow: 24,
                p: 1,
                borderRadius: 2,
                outline: 'none',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
            }}>
                <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
                    <IconButton aria-label="Close resume" size="small" onClick={onClose}>
                        <CloseIcon/>
                    </IconButton>
                </Box>
                <iframe
                    src={siteMetadata.resumePath}
                    title={RESUME_TITLE}
                    style={{width: '100%', flex: 1, border: 'none'}}
                />
            </Box>
        </Modal>
    );
}

export function ResumeButton() {
    const [isResumeOpen, setIsResumeOpen] = useState(false);
    return (
        <>
            <Button
                fullWidth
                variant="outlined"
                endIcon={<OpenInNewIcon/>}
                onClick={() => setIsResumeOpen(true)}
                sx={{mt: 2, whiteSpace: 'nowrap', ...accentButtonStyle}}
            >
                View My Resume (PDF)
            </Button>
            <ResumeDialog isOpen={isResumeOpen} onClose={() => setIsResumeOpen(false)}/>
        </>
    );
}
