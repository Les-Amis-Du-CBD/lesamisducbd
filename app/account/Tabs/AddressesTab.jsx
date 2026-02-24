'use client';
import { useState } from 'react';
import { Plus, Edit2, Trash2, Save, Loader2, MapPin } from 'lucide-react';

export default function AddressesTab({ user, onUpdate }) {
    const [addresses, setAddresses] = useState(user?.addresses || []);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Form state
    const [editingIndex, setEditingIndex] = useState(null);
    const [formData, setFormData] = useState({
        alias: 'Domicile', // Domicile, Boutique
        firstname: '',
        lastname: '',
        company: '',
        address1: '',
        address2: '',
        postcode: '',
        city: '',
        phone: ''
    });

    const resetForm = () => {
        setFormData({
            alias: 'Domicile', firstname: '', lastname: '', company: '',
            address1: '', address2: '', postcode: '', city: '', phone: ''
        });
        setEditingIndex(null);
        setIsEditing(false);
    };

    const handleEdit = (index) => {
        setFormData(addresses[index]);
        setEditingIndex(index);
        setIsEditing(true);
    };

    const handleDelete = async (index) => {
        if (!confirm("Voulez-vous vraiment supprimer cette adresse ?")) return;

        const newAddresses = [...addresses];
        newAddresses.splice(index, 1);
        await saveAddressesToApi(newAddresses);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let newAddresses = [...addresses];

        // Auto-fill names if empty
        const addressToSave = { ...formData };
        if (!addressToSave.firstname) {
            const splitName = (user.name || '').split(' ');
            addressToSave.firstname = splitName[0] || '';
            addressToSave.lastname = splitName.slice(1).join(' ') || '';
        }

        if (editingIndex !== null) {
            newAddresses[editingIndex] = addressToSave;
        } else {
            newAddresses.push(addressToSave);
        }

        await saveAddressesToApi(newAddresses);
        resetForm();
    };

    const saveAddressesToApi = async (newAddresses) => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/user/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ addresses: newAddresses })
            });

            const data = await res.json();
            if (res.ok && data.success) {
                setAddresses(newAddresses);
                onUpdate(data.user); // update parent
            } else {
                alert("Erreur lors de l'enregistrement de l'adresse.");
            }
        } catch (err) {
            console.error(err);
            alert("Erreur de connexion.");
        } finally {
            setIsLoading(false);
        }
    };

    const inputFocus = (e) => e.target.style.borderColor = 'var(--accent-neon)';
    const inputBlur = (e) => e.target.style.borderColor = '#D1D5DB';

    const inputStyle = {
        padding: '12px 16px',
        borderRadius: '10px',
        border: '1px solid #D1D5DB',
        outline: 'none',
        fontSize: '0.95rem',
        fontFamily: 'inherit',
        transition: 'border-color 0.2s'
    };

    if (isEditing) {
        return (
            <div style={{ maxWidth: '650px', animation: 'fadeIn 0.3s ease' }}>
                <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '1.5rem', color: 'var(--primary-dark)', letterSpacing: '-0.02em' }}>
                    {editingIndex !== null ? 'Modifier une adresse' : 'Ajouter une adresse'}
                </h2>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '0.9rem', fontWeight: '600', color: '#4B5563' }}>Type d'adresse</label>
                        <select required value={formData.alias || 'Domicile'} onChange={e => setFormData({ ...formData, alias: e.target.value })} style={{ ...inputStyle, WebkitAppearance: 'none', appearance: 'none', background: 'white url("data:image/svg+xml;utf8,<svg fill=%234B5563 height=24 viewBox=0 0 24 24 width=24 xmlns=http://www.w3.org/2000/svg><path d=M7 10l5 5 5-5z/></svg>") no-repeat right 10px center' }} onFocus={inputFocus} onBlur={inputBlur}>
                            <option value="Domicile">Domicile</option>
                            <option value="Boutique">Boutique</option>
                        </select>
                    </div>

                    <div style={{ display: 'flex', gap: '15px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                            <label style={{ fontSize: '0.9rem', fontWeight: '600', color: '#4B5563' }}>Prénom</label>
                            <input type="text" value={formData.firstname} onChange={e => setFormData({ ...formData, firstname: e.target.value })} style={inputStyle} onFocus={inputFocus} onBlur={inputBlur} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                            <label style={{ fontSize: '0.9rem', fontWeight: '600', color: '#4B5563' }}>Nom</label>
                            <input type="text" value={formData.lastname} onChange={e => setFormData({ ...formData, lastname: e.target.value })} style={inputStyle} onFocus={inputFocus} onBlur={inputBlur} />
                        </div>
                    </div>

                    {user?.role === 'buraliste' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '0.9rem', fontWeight: '600', color: '#4B5563' }}>Société (Boutique)</label>
                            <input type="text" value={formData.company} onChange={e => setFormData({ ...formData, company: e.target.value })} style={inputStyle} onFocus={inputFocus} onBlur={inputBlur} />
                        </div>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '0.9rem', fontWeight: '600', color: '#4B5563' }}>Adresse</label>
                        <input required type="text" value={formData.address1} onChange={e => setFormData({ ...formData, address1: e.target.value })} style={inputStyle} onFocus={inputFocus} onBlur={inputBlur} />
                    </div>

                    <div style={{ display: 'flex', gap: '15px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                            <label style={{ fontSize: '0.9rem', fontWeight: '600', color: '#4B5563' }}>Code Postal</label>
                            <input required type="text" value={formData.postcode} onChange={e => setFormData({ ...formData, postcode: e.target.value })} style={inputStyle} onFocus={inputFocus} onBlur={inputBlur} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 2 }}>
                            <label style={{ fontSize: '0.9rem', fontWeight: '600', color: '#4B5563' }}>Ville</label>
                            <input required type="text" value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} style={inputStyle} onFocus={inputFocus} onBlur={inputBlur} />
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '0.9rem', fontWeight: '600', color: '#4B5563' }}>Téléphone</label>
                        <input required type="tel" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} style={inputStyle} onFocus={inputFocus} onBlur={inputBlur} />
                    </div>

                    <div style={{ marginTop: '20px', display: 'flex', gap: '15px' }}>
                        <button
                            type="button"
                            onClick={resetForm}
                            style={{ padding: '14px', background: '#F3F4F6', color: '#4B5563', border: 'none', borderRadius: '10px', cursor: 'pointer', flex: 1, fontWeight: '600', fontSize: '1rem', transition: 'background 0.2s' }}
                            onMouseEnter={(e) => e.target.style.background = '#E5E7EB'}
                            onMouseLeave={(e) => e.target.style.background = '#F3F4F6'}
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            style={{
                                padding: '14px',
                                background: 'var(--primary-dark)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '10px',
                                cursor: isLoading ? 'not-allowed' : 'pointer',
                                flex: 2,
                                fontWeight: '600',
                                fontSize: '1rem',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: '8px',
                                transition: 'all 0.2s',
                                boxShadow: '0 4px 12px rgba(31, 75, 64, 0.2)',
                                opacity: isLoading ? 0.8 : 1
                            }}
                            onMouseEnter={(e) => { if (!isLoading) e.target.style.transform = 'translateY(-1px)'; }}
                            onMouseLeave={(e) => { if (!isLoading) e.target.style.transform = 'translateY(0)'; }}
                        >
                            {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                            Sauvegarder l'adresse
                        </button>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <div style={{ animation: 'fadeIn 0.4s ease' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--primary-dark)', margin: 0, letterSpacing: '-0.02em' }}>
                    Carnet d'adresses
                </h2>
                <button
                    onClick={() => setIsEditing(true)}
                    style={{
                        background: 'var(--primary-dark)',
                        color: 'white',
                        border: 'none',
                        padding: '10px 20px',
                        borderRadius: '30px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontWeight: '600',
                        fontSize: '0.95rem',
                        transition: 'all 0.2s',
                        boxShadow: '0 4px 12px rgba(31, 75, 64, 0.2)'
                    }}
                    onMouseEnter={(e) => e.target.style.transform = 'translateY(-1px)'}
                    onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                >
                    <Plus size={18} /> Ajouter
                </button>
            </div>

            {addresses.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px', background: '#F9FAFB', borderRadius: '24px', color: '#6B7280', border: '1px dashed #D1D5DB' }}>
                    <MapPin size={48} style={{ color: '#D1D5DB', margin: '0 auto 15px auto' }} />
                    <h3 style={{ color: 'var(--primary-dark)', fontSize: '1.2rem', marginBottom: '8px' }}>Aucune adresse</h3>
                    <p>Vous n'avez pas encore enregistré d'adresse de livraison.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                    {addresses.map((addr, idx) => (
                        <div key={idx} style={{
                            border: '1px solid #F3F4F6',
                            background: '#FFFFFF',
                            borderRadius: '20px',
                            padding: '24px',
                            position: 'relative',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                            transition: 'transform 0.2s',
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px', paddingBottom: '15px', borderBottom: '1px solid #F3F4F6' }}>
                                <div style={{ background: 'var(--background-light)', color: 'var(--primary-dark)', padding: '8px', borderRadius: '10px' }}>
                                    <MapPin size={20} />
                                </div>
                                <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--primary-dark)', margin: 0 }}>
                                    {addr.alias || `Adresse ${idx + 1}`}
                                </h3>
                            </div>

                            <div style={{ fontSize: '0.95rem', color: '#4B5563', lineHeight: '1.6', flex: 1 }}>
                                {(addr.firstname || addr.lastname) && <div style={{ fontWeight: '600', color: '#1F2937' }}>{addr.firstname} {addr.lastname}</div>}
                                {addr.company && <div style={{ fontWeight: '600', color: 'var(--primary-dark)' }}>🏢 {addr.company}</div>}
                                <div>{addr.address1}</div>
                                {addr.address2 && <div>{addr.address2}</div>}
                                <div>{addr.postcode} {addr.city}</div>
                                <div style={{ marginTop: '12px', color: '#6B7280', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    📞 {addr.phone}
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                                <button onClick={() => handleEdit(idx)} style={{ flex: 1, padding: '10px', background: '#F3F4F6', border: 'none', borderRadius: '10px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#4B5563', fontWeight: '600', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#E5E7EB'} onMouseLeave={e => e.currentTarget.style.background = '#F3F4F6'}>
                                    <Edit2 size={16} style={{ marginRight: '6px' }} /> Modifier
                                </button>
                                <button onClick={() => handleDelete(idx)} style={{ flex: 1, padding: '10px', background: '#FEF2F2', border: 'none', borderRadius: '10px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#EF4444', fontWeight: '600', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#FEE2E2'} onMouseLeave={e => e.currentTarget.style.background = '#FEF2F2'}>
                                    <Trash2 size={16} style={{ marginRight: '6px' }} /> Supprimer
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
