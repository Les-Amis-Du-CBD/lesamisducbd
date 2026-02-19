
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Clear previous errors
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            });

            const data = await res.json();

            if (res.ok) {
                // Force hard navigation to ensure cookies are sent 
                window.location.href = '/admin/products';
            } else {
                setError(data.message || 'Mot de passe incorrect');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('Erreur de connexion serveur');
            alert('Erreur technique: ' + err.message);
        }
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            background: '#1F4B40', // Brand Dark Green
            backgroundImage: 'radial-gradient(circle at top left, #1F4B40 0%, #0d211c 100%)',
            fontFamily: "'Bricolage Grotesque', sans-serif",
            padding: '20px'
        }}>
            <form onSubmit={handleSubmit} style={{
                padding: '3rem',
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(20px)',
                borderRadius: '32px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                display: 'flex',
                flexDirection: 'column',
                gap: '2rem',
                width: '100%',
                maxWidth: '420px'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <h1 style={{ color: '#00FF94', fontSize: '2rem', fontWeight: '800', margin: '0 0 10px 0', letterSpacing: '-1px' }}>ADMIN</h1>
                    <p style={{ color: 'rgba(255, 255, 255, 0.6)', margin: 0 }}>Espace de gestion Les Amis du CBD</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#00FF94', marginLeft: '5px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Mot de passe</label>
                    <input
                        type="password"
                        placeholder="••••••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{
                            padding: '1.25rem',
                            borderRadius: '16px',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            fontSize: '1rem',
                            outline: 'none',
                            background: 'rgba(0, 0, 0, 0.2)',
                            color: 'white',
                            transition: 'all 0.2s',
                            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
                        }}
                    />
                </div>

                {error && <p style={{ color: '#ff6b6b', fontSize: '0.9rem', background: 'rgba(255, 107, 107, 0.1)', padding: '1rem', borderRadius: '12px', textAlign: 'center', border: '1px solid rgba(255, 107, 107, 0.2)' }}>{error}</p>}

                <button type="submit" style={{
                    padding: '1.25rem',
                    backgroundColor: '#00FF94',
                    color: '#1F4B40',
                    border: 'none',
                    borderRadius: '16px',
                    cursor: 'pointer',
                    fontWeight: '800',
                    fontSize: '1.1rem',
                    marginTop: '1rem',
                    boxShadow: '0 10px 25px -5px rgba(0, 255, 148, 0.4)',
                    transition: 'transform 0.2s'
                }}>Se connecter</button>
            </form>
        </div>
    );
}
