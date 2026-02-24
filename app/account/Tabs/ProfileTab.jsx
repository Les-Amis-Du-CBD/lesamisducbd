'use client';
import { useState } from 'react';
import { Save, Loader2, CheckCircle } from 'lucide-react';

export default function ProfileTab({ user, onUpdate }) {
    const [name, setName] = useState(user?.name || '');
    const [company, setCompany] = useState(user?.company || '');
    const [siret, setSiret] = useState(user?.siret || '');

    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    const handleSave = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage({ text: '', type: '' });

        try {
            const res = await fetch('/api/user/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, company, siret })
            });

            const data = await res.json();

            if (res.ok && data.success) {
                setMessage({ text: 'Profil mis à jour avec succès.', type: 'success' });
                onUpdate(data.user);
            } else {
                setMessage({ text: data.message || 'Erreur lors de la mise à jour.', type: 'error' });
            }
        } catch (err) {
            console.error("Erreur saving profile:", err);
            setMessage({ text: 'Erreur réseau.', type: 'error' });
        } finally {
            setIsLoading(false);
            setTimeout(() => setMessage({ text: '', type: '' }), 3000);
        }
    };

    return (
        <div style={{ maxWidth: '600px', animation: 'fadeIn 0.3s ease' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '1.5rem', color: 'var(--primary-dark)', letterSpacing: '-0.02em' }}>
                Mes Informations
            </h2>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.95rem', fontWeight: '600', color: '#4B5563' }}>Adresse E-mail (Identifiant)</label>
                    <input
                        type="email"
                        value={user?.email || ''}
                        disabled
                        style={{ padding: '14px 18px', borderRadius: '12px', border: '1px solid #E5E7EB', background: '#F9FAFB', color: '#9CA3AF', cursor: 'not-allowed', fontFamily: 'inherit', fontSize: '1rem' }}
                    />
                    <small style={{ color: '#9CA3AF', fontSize: '0.85rem' }}>L'adresse email ne peut pas être modifiée car elle est liée à votre compte.</small>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.95rem', fontWeight: '600', color: '#4B5563' }}>Nom / Prénom</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        style={{ padding: '14px 18px', borderRadius: '12px', border: '1px solid #D1D5DB', outline: 'none', fontFamily: 'inherit', fontSize: '1rem', transition: 'border-color 0.2s' }}
                        onFocus={(e) => e.target.style.borderColor = 'var(--accent-neon)'}
                        onBlur={(e) => e.target.style.borderColor = '#D1D5DB'}
                    />
                </div>

                {user?.role === 'buraliste' && (
                    <div style={{ display: 'flex', gap: '20px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                            <label style={{ fontSize: '0.95rem', fontWeight: '600', color: '#4B5563' }}>Société</label>
                            <input
                                type="text"
                                value={company}
                                onChange={(e) => setCompany(e.target.value)}
                                style={{ padding: '14px 18px', borderRadius: '12px', border: '1px solid #D1D5DB', outline: 'none', fontFamily: 'inherit', fontSize: '1rem', transition: 'border-color 0.2s' }}
                                onFocus={(e) => e.target.style.borderColor = 'var(--accent-neon)'}
                                onBlur={(e) => e.target.style.borderColor = '#D1D5DB'}
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                            <label style={{ fontSize: '0.95rem', fontWeight: '600', color: '#4B5563' }}>N° SIRET</label>
                            <input
                                type="text"
                                value={siret}
                                onChange={(e) => setSiret(e.target.value)}
                                style={{ padding: '14px 18px', borderRadius: '12px', border: '1px solid #D1D5DB', outline: 'none', fontFamily: 'inherit', fontSize: '1rem', transition: 'border-color 0.2s' }}
                                onFocus={(e) => e.target.style.borderColor = 'var(--accent-neon)'}
                                onBlur={(e) => e.target.style.borderColor = '#D1D5DB'}
                            />
                        </div>
                    </div>
                )}

                <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <button
                        type="submit"
                        disabled={isLoading}
                        style={{
                            background: 'var(--primary-dark)',
                            color: 'white',
                            border: 'none',
                            padding: '14px 28px',
                            borderRadius: '12px',
                            fontWeight: '600',
                            fontSize: '1rem',
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            transition: 'all 0.2s',
                            boxShadow: '0 4px 12px rgba(31, 75, 64, 0.2)',
                            opacity: isLoading ? 0.8 : 1
                        }}
                        onMouseEnter={(e) => { if (!isLoading) e.target.style.transform = 'translateY(-1px)'; }}
                        onMouseLeave={(e) => { if (!isLoading) e.target.style.transform = 'translateY(0)'; }}
                    >
                        {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                        Enregistrer
                    </button>

                    {message.text && (
                        <div style={{
                            color: message.type === 'error' ? '#EF4444' : '#10B981',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontSize: '0.95rem',
                            fontWeight: '500',
                            animation: 'fadeIn 0.3s ease'
                        }}>
                            {message.type === 'success' && <CheckCircle size={18} />}
                            {message.text}
                        </div>
                    )}
                </div>
            </form>
        </div>
    );
}
