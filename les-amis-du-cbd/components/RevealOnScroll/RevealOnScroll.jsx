'use client';
import { useEffect, useRef, useState } from 'react';
import styles from './RevealOnScroll.module.css';

export default function RevealOnScroll({ children, threshold = 0.1 }) {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect(); // Stop observing once visible
                }
            },
            {
                threshold: threshold
            }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, [threshold]);

    return (
        <div ref={ref} className={`${styles.reveal} ${isVisible ? styles.visible : ''}`}>
            {children}
        </div>
    );
}
