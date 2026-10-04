export function prefersReducedMotion(): boolean {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function hasFinePointer(): boolean {
    return window.matchMedia('(hover: hover) and (pointer: fine)').matches;
}

export function matchesMinimumWidth(widthPixels: number): boolean {
    return window.matchMedia(`(min-width: ${widthPixels}px)`).matches;
}

export function isApplePlatform(): boolean {
    return /Mac|iPhone|iPad/.test(navigator.userAgent);
}
