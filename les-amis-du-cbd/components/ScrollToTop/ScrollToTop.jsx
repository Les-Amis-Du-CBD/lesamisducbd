'use client';

import { useEffect } from 'react';

export default function ScrollToTop() {
    useEffect(() => {
        // Force scroll to top on mount (reload)
        if ('scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'manual';
        }
        window.scrollTo(0, 0);

        // Optional: Reset to auto when unmounting? 
        // Usually not needed for a one-page app reload fix.
    }, []);

    return null;
}
