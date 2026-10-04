import {Box} from "@mui/material";
import type {SectionDefinition} from "@/data/sections";
import {accentAlpha, colors} from "@/theme/tokens";

export const getCommandMenuOptionId = (section: SectionDefinition) => `command-menu-option-${section.id}`;

interface CommandMenuOptionProps {
    section: SectionDefinition;
    optionIndex: number;
    isSelected: boolean;
    onHover: (optionIndex: number) => void;
    onChoose: (section: SectionDefinition) => void;
}

export function CommandMenuOption({section, optionIndex, isSelected, onHover, onChoose}: CommandMenuOptionProps) {
    return (
        <Box
            component="li"
            id={getCommandMenuOptionId(section)}
            role="option"
            aria-selected={isSelected}
            data-option-index={optionIndex}
            onMouseMove={() => onHover(optionIndex)}
            onClick={() => onChoose(section)}
            sx={{
                px: 1.5,
                py: 1,
                borderRadius: 1.5,
                cursor: 'pointer',
                fontSize: '0.9rem',
                color: isSelected ? colors.textPrimary : colors.textSubtle,
                bgcolor: isSelected ? accentAlpha(0.1) : 'transparent',
                borderLeft: `2px solid ${isSelected ? colors.accent : 'transparent'}`,
            }}
        >
            {section.title}
        </Box>
    );
}
