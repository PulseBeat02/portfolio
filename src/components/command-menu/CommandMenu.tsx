"use client";

import {Box, InputBase, Modal, Typography} from "@mui/material";
import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import SearchIcon from '@mui/icons-material/Search';
import {NAVIGABLE_SECTIONS, type SectionDefinition} from "@/data/sections";
import {CommandMenuOption, getCommandMenuOptionId} from "@/components/command-menu/CommandMenuOption";
import {filterSections, wrapIndex} from "@/components/command-menu/filterSections";
import {useCommandMenuShortcut} from "@/components/command-menu/useCommandMenuShortcut";
import {keyboardKeyStyle} from "@/components/ui/styles";
import {scrollToElementById} from "@/lib/scroll";
import {blackAlpha, colors, whiteAlpha} from "@/theme/tokens";

const SECTION_SCROLL_TOP_OFFSET_PIXELS = 32;
const OPTION_LIST_ID = "command-menu-options";
const BACKDROP_STYLES = {backdropFilter: 'blur(4px)', bgcolor: blackAlpha(0.5)};

export function CommandMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedOptionIndex, setSelectedOptionIndex] = useState(0);
    const optionListRef = useRef<HTMLUListElement>(null);

    const matchingSections = useMemo(() => filterSections(NAVIGABLE_SECTIONS, searchQuery), [searchQuery]);
    const selectedSection = matchingSections[selectedOptionIndex];

    const openMenu = useCallback(() => setIsOpen(true), []);
    const toggleMenu = useCallback(() => setIsOpen((wasOpen) => !wasOpen), []);
    useCommandMenuShortcut(toggleMenu, openMenu);

    useEffect(() => {
        optionListRef.current
            ?.querySelector(`[data-option-index="${selectedOptionIndex}"]`)
            ?.scrollIntoView({block: "nearest"});
    }, [selectedOptionIndex]);

    const closeMenu = () => {
        setIsOpen(false);
        setSearchQuery("");
        setSelectedOptionIndex(0);
    };

    const navigateToSection = (section: SectionDefinition | undefined) => {
        if (!section) return;
        closeMenu();
        scrollToElementById(section.id, SECTION_SCROLL_TOP_OFFSET_PIXELS);
    };

    const moveSelection = (step: number) => {
        setSelectedOptionIndex((currentIndex) => wrapIndex(currentIndex + step, matchingSections.length));
    };

    const handleSearchKeyDown = (event: React.KeyboardEvent) => {
        const keyActions: Record<string, () => void> = {
            ArrowDown: () => moveSelection(1),
            ArrowUp: () => moveSelection(-1),
            Enter: () => navigateToSection(selectedSection),
        };
        const keyAction = keyActions[event.key];
        if (!keyAction) return;
        event.preventDefault();
        keyAction();
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
        setSelectedOptionIndex(0);
    };

    return (
        <Modal open={isOpen} onClose={closeMenu} slotProps={{backdrop: {sx: BACKDROP_STYLES}}}>
            <Box role="dialog" aria-modal="true" aria-label="Command menu" sx={{
                position: 'absolute',
                top: '15%',
                left: '50%',
                transform: 'translateX(-50%)',
                width: 'min(560px, calc(100% - 32px))',
                bgcolor: colors.surfaceRaised,
                border: `1px solid ${whiteAlpha(0.1)}`,
                borderRadius: 3,
                boxShadow: 24,
                outline: 'none',
                overflow: 'hidden',
            }}>
                <Box sx={{display: 'flex', alignItems: 'center', gap: 1.5, px: 2, py: 1.5, borderBottom: `1px solid ${whiteAlpha(0.08)}`}}>
                    <SearchIcon aria-hidden sx={{color: colors.textMuted}}/>
                    <InputBase
                        autoFocus
                        fullWidth
                        placeholder="Jump to a section…"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        onKeyDown={handleSearchKeyDown}
                        inputProps={{
                            "aria-label": "Search sections",
                            role: "combobox",
                            "aria-expanded": true,
                            "aria-controls": OPTION_LIST_ID,
                            "aria-activedescendant": selectedSection ? getCommandMenuOptionId(selectedSection) : undefined,
                        }}
                        sx={{color: colors.textPrimary, fontSize: '0.95rem'}}
                    />
                    <Box component="kbd" sx={{...keyboardKeyStyle, fontSize: '0.7rem', color: colors.textMuted}}>esc</Box>
                </Box>
                <Box component="ul" id={OPTION_LIST_ID} role="listbox" ref={optionListRef} sx={{listStyle: 'none', m: 0, p: 1, maxHeight: 360, overflowY: 'auto'}}>
                    {matchingSections.length === 0 && (
                        <Typography component="li" variant="body2" sx={{px: 1.5, py: 2, color: colors.textMuted}}>No results</Typography>
                    )}
                    {matchingSections.map((section, optionIndex) => (
                        <CommandMenuOption
                            key={section.id}
                            section={section}
                            optionIndex={optionIndex}
                            isSelected={optionIndex === selectedOptionIndex}
                            onHover={setSelectedOptionIndex}
                            onChoose={navigateToSection}
                        />
                    ))}
                </Box>
            </Box>
        </Modal>
    );
}
