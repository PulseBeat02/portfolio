import React, {useEffect, useRef, useState} from 'react';
import {motion} from 'framer-motion';

interface FadeInProps {
    children: React.ReactNode;
    delay?: number;
    direction?: 'up' | 'down' | 'left' | 'right';
    scrollTriggered?: boolean;
    duration?: number;
}

export const Fade: React.FC<FadeInProps> = ({
                                                children,
                                                delay = 0,
                                                direction = 'up',
                                                scrollTriggered = false,
                                                duration = 0.5,
                                            }) => {
    const [isVisible, setIsVisible] = useState(!scrollTriggered);
    const ref = useRef<HTMLDivElement>(null);

    const getDirectionOffset = () => {
        switch (direction) {
            case 'up':
                return {y: 20};
            case 'down':
                return {y: -20};
            case 'left':
                return {x: 20};
            case 'right':
                return {x: -20};
            default:
                return {y: 20};
        }
    };

    useEffect(() => {
        if (!scrollTriggered) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            {threshold: 0.1}
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, [scrollTriggered]);

    return (
        <motion.div
            ref={ref}
            initial={{opacity: 0, ...getDirectionOffset()}}
            animate={isVisible ? {opacity: 1, x: 0, y: 0} : {opacity: 0, ...getDirectionOffset()}}
            transition={{duration, delay}}
        >
            {children}
        </motion.div>
    );
};