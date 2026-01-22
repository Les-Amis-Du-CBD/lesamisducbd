'use client';
import { useState, useEffect, useRef } from 'react';

export default function CountUp({ end, duration = 2000 }) {
    const [count, setCount] = useState(0);
    const countRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );

        if (countRef.current) {
            observer.observe(countRef.current);
        }

        return () => {
            if (countRef.current) {
                observer.unobserve(countRef.current);
            }
        };
    }, []);

    useEffect(() => {
        if (!isVisible) return;

        let start = 0;
        const endValue = parseInt(end, 10);
        if (start === endValue) return;

        let totalDuration = duration;
        let incrementTime = (totalDuration / endValue) * 1000;

        // Ensure at least smooth 60fps-ish updates if possible, or simple interval
        // For distinct numbers like 0-100, interval is fine.

        let startTime = null;
        let animationFrame;

        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const percentage = Math.min(progress / duration, 1);

            // Easing function for smooth effect (easeOutExpo)
            const easeOut = 1 - Math.pow(2, -10 * percentage);

            const currentCount = Math.floor(easeOut * endValue);
            setCount(currentCount);

            if (percentage < 1) {
                animationFrame = requestAnimationFrame(animate);
            } else {
                setCount(endValue);
            }
        };

        animationFrame = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animationFrame);
    }, [isVisible, end, duration]);

    return <span ref={countRef}>{count}</span>;
}
