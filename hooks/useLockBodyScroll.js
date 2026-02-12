import { useLayoutEffect } from 'react';

export default function useLockBodyScroll(locked = true) {
    useLayoutEffect(() => {
        if (!locked) return;

        // Get original styles
        const originalStyle = window.getComputedStyle(document.body).overflow;
        const originalHtmlStyle = window.getComputedStyle(document.documentElement).overflow;

        // Prevent scrolling on mount
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';

        // Re-enable scrolling when component unmounts or locked becomes false
        return () => {
            document.body.style.overflow = originalStyle;
            document.documentElement.style.overflow = originalHtmlStyle;
        };
    }, [locked]);
}
