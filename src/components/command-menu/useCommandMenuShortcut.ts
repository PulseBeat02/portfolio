"use client";

import {useEffect} from "react";
import {OPEN_COMMAND_MENU_EVENT} from "@/components/command-menu/events";

const SHORTCUT_KEY = "k";

function isCommandMenuShortcut(event: KeyboardEvent): boolean {
    return (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === SHORTCUT_KEY;
}

export function useCommandMenuShortcut(onToggle: () => void, onOpen: () => void): void {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (!isCommandMenuShortcut(event)) return;
            event.preventDefault();
            onToggle();
        };
        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener(OPEN_COMMAND_MENU_EVENT, onOpen);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener(OPEN_COMMAND_MENU_EVENT, onOpen);
        };
    }, [onToggle, onOpen]);
}
