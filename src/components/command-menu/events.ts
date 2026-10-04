export const OPEN_COMMAND_MENU_EVENT = "portfolio:open-command-menu";

export function requestCommandMenuOpen(): void {
    window.dispatchEvent(new Event(OPEN_COMMAND_MENU_EVENT));
}
