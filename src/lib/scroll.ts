import {prefersReducedMotion} from "@/lib/browser";

export function scrollToElementById(elementId: string, topOffsetPixels: number): void {
    const targetElement = document.getElementById(elementId);
    if (!targetElement) return;
    const targetTop = targetElement.getBoundingClientRect().top + window.scrollY - topOffsetPixels;
    window.scrollTo({
        top: Math.max(0, targetTop),
        behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    });
}
