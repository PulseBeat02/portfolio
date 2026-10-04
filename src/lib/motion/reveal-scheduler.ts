import {matchesMinimumWidth, prefersReducedMotion} from "@/lib/browser";
import {layout} from "@/theme/tokens";
import {motionTimings} from "@/theme/motion";

interface RevealAnimation {
    element: HTMLElement;
    keyframes: Keyframe[];
    durationSeconds: number;
    easing: string;
    isChainedToList: boolean;
}

const VISIBILITY_THRESHOLD = 0.2;
export const REVEAL_GROUP_ATTRIBUTE = "data-reveal-group";
export const REVEAL_PAIR_ATTRIBUTE = "data-reveal-pair";

function toReducedMotionKeyframes(keyframes: Keyframe[]): Keyframe[] {
    return keyframes.map((keyframe) => ({opacity: keyframe.opacity ?? 1, transform: 'none'}));
}

function compareDocumentOrder(first: Element, second: Element): number {
    return first.compareDocumentPosition(second) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
}

function findPairLeader(element: HTMLElement): Element | null {
    const pairIndex = element.getAttribute(REVEAL_PAIR_ATTRIBUTE);
    if (pairIndex === null || !matchesMinimumWidth(layout.twoColumnGridBreakpointPixels)) return null;
    return element.parentElement?.querySelector(`[${REVEAL_PAIR_ATTRIBUTE}="${pairIndex}"]`) ?? null;
}

function resolveRevealGroup(element: HTMLElement): Element {
    return findPairLeader(element) ?? element.closest(`[${REVEAL_GROUP_ATTRIBUTE}]`) ?? element;
}

function findChainList(element: HTMLElement): Element | null {
    return element.closest('ol, ul');
}

class RevealScheduler {
    private readonly pendingAnimationsByGroup = new Map<Element, RevealAnimation[]>();
    private readonly chainEndSecondsByList = new Map<Element, number>();
    private nextAvailableStartSeconds: number = motionTimings.introEndSeconds;
    private intersectionObserver: IntersectionObserver | null = null;

    register(animation: RevealAnimation): () => void {
        const revealAnimation = prefersReducedMotion()
            ? {...animation, keyframes: toReducedMotionKeyframes(animation.keyframes)}
            : animation;
        const group = resolveRevealGroup(animation.element);
        const groupAnimations = this.pendingAnimationsByGroup.get(group);
        if (groupAnimations) {
            groupAnimations.push(revealAnimation);
        } else {
            this.pendingAnimationsByGroup.set(group, [revealAnimation]);
            this.getIntersectionObserver().observe(group);
        }
        return () => this.unregister(group, revealAnimation);
    }

    private unregister(group: Element, animation: RevealAnimation): void {
        const groupAnimations = this.pendingAnimationsByGroup.get(group);
        if (!groupAnimations) return;
        const remainingAnimations = groupAnimations.filter((pending) => pending !== animation);
        if (remainingAnimations.length > 0) {
            this.pendingAnimationsByGroup.set(group, remainingAnimations);
            return;
        }
        this.pendingAnimationsByGroup.delete(group);
        this.intersectionObserver?.unobserve(group);
    }

    private getIntersectionObserver(): IntersectionObserver {
        this.intersectionObserver ??= new IntersectionObserver(
            (entries) => this.handleIntersections(entries),
            {threshold: VISIBILITY_THRESHOLD},
        );
        return this.intersectionObserver;
    }

    private handleIntersections(entries: IntersectionObserverEntry[]): void {
        const nowSeconds = performance.now() / 1000;
        entries
            .filter((entry) => entry.isIntersecting)
            .map((entry) => entry.target)
            .sort(compareDocumentOrder)
            .forEach((group) => this.startGroup(group, nowSeconds));
    }

    private startGroup(group: Element, nowSeconds: number): void {
        this.intersectionObserver?.unobserve(group);
        const groupAnimations = this.pendingAnimationsByGroup.get(group) ?? [];
        this.pendingAnimationsByGroup.delete(group);

        const chainedAnimation = groupAnimations.find((animation) => animation.isChainedToList);
        const chainList = chainedAnimation ? findChainList(chainedAnimation.element) : null;
        const groupStartSeconds = Math.max(nowSeconds, this.nextAvailableStartSeconds, this.getChainEndSeconds(chainList));

        for (const animation of groupAnimations) {
            const animationStartSeconds = this.reserveStartSeconds(animation, groupStartSeconds, chainList);
            this.play(animation, animationStartSeconds - nowSeconds);
        }

        const nextStaggeredStartSeconds = groupStartSeconds + motionTimings.staggerSeconds;
        this.nextAvailableStartSeconds = Math.max(nextStaggeredStartSeconds, this.getChainEndSeconds(chainList));
    }

    private reserveStartSeconds(animation: RevealAnimation, groupStartSeconds: number, chainList: Element | null): number {
        if (!animation.isChainedToList || !chainList) return groupStartSeconds;
        const startSeconds = Math.max(groupStartSeconds, this.getChainEndSeconds(chainList));
        this.chainEndSecondsByList.set(chainList, startSeconds + animation.durationSeconds);
        return startSeconds;
    }

    private getChainEndSeconds(chainList: Element | null): number {
        return chainList ? this.chainEndSecondsByList.get(chainList) ?? 0 : 0;
    }

    private play(animation: RevealAnimation, delaySeconds: number): void {
        animation.element.animate(animation.keyframes, {
            duration: animation.durationSeconds * 1000,
            easing: animation.easing,
            delay: delaySeconds * 1000,
            fill: 'both',
        });
    }
}

export const revealScheduler = new RevealScheduler();
