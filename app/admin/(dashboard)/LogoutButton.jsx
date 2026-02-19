
'use client';

import { useRouter } from 'next/navigation';
import styles from './AdminLayout.module.css';

export default function LogoutButton() {
    const handleLogout = async (e) => {
        e.preventDefault();
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            // Force hard refresh to clear any client state and update Layout
            window.location.href = '/admin/login';
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    return (
        <button onClick={handleLogout} className={styles.logoutBtn}>
            Déconnexion
        </button>
    );
}
