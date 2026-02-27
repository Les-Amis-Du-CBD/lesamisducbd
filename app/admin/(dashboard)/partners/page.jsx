'use client';

import { useState, useEffect } from 'react';
import styles from './Partners.module.css';
import { MapPin, Plus, Trash2, Edit2, Search, Loader2, Save, X } from 'lucide-react';

export default function PartnersAdmin() {
    const [partners, setPartners] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isGeocoding, setIsGeocoding] = useState(false);
    const [editingPartner, setEditingPartner] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        zip: '',
        city: '',
        lat: '',
        lng: ''
    });

    useEffect(() => {
        fetchPartners();
    }, []);

    const fetchPartners = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/admin/partners');
            const data = await res.json();
            setPartners(data);
        } catch (error) {
            console.error('Error fetching partners:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleGeocode = async () => {
        if (!formData.address || !formData.city) {
            alert("Veuillez saisir une adresse et une ville pour géocoder.");
            return;
        }

        setIsGeocoding(true);
        try {
            const query = `${formData.address}, ${formData.zip} ${formData.city}, France`;
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`);
            const data = await res.json();

            if (data && data.length > 0) {
                setFormData(prev => ({
                    ...prev,
                    lat: parseFloat(data[0].lat),
                    lng: parseFloat(data[0].lon)
                }));
            } else {
                alert("Aucun résultat trouvé pour cette adresse. Veuillez entrer les coordonnées manuellement.");
            }
        } catch (error) {
            console.error('Geocoding error:', error);
            alert("Erreur lors du géocodage.");
        } finally {
            setIsGeocoding(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            const res = await fetch('/api/admin/partners', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    id: editingPartner ? editingPartner.id : undefined,
                    lat: parseFloat(formData.lat),
                    lng: parseFloat(formData.lng)
                })
            });

            if (res.ok) {
                setEditingPartner(null);
                setFormData({ name: '', address: '', zip: '', city: '', lat: '', lng: '' });
                fetchPartners();
            } else {
                const data = await res.json();
                alert(`Erreur: ${data.error}`);
            }
        } catch (error) {
            console.error('Save error:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Voulez-vous vraiment supprimer ce partenaire ?')) return;

        try {
            const res = await fetch(`/api/admin/partners?id=${id}`, { method: 'DELETE' });
            if (res.ok) fetchPartners();
        } catch (error) {
            console.error('Delete error:', error);
        }
    };

    const startEdit = (partner) => {
        setEditingPartner(partner);
        setFormData(partner);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelEdit = () => {
        setEditingPartner(null);
        setFormData({ name: '', address: '', zip: '', city: '', lat: '', lng: '' });
    };

    return (
        <div className={styles.adminContainer}>
            <div className={styles.header}>
                <div className={styles.titleGroup}>
                    <MapPin className={styles.titleIcon} />
                    <div>
                        <h1>Gestion des Buralistes Partenaires</h1>
                        <p>Ajoutez et gérez les points de vente sur la carte</p>
                    </div>
                </div>
            </div>

            <div className={styles.grid}>
                {/* Formulaire */}
                <div className={styles.card}>
                    <h2 className={styles.cardTitle}>
                        {editingPartner ? 'Modifier le partenaire' : 'Ajouter un buraliste'}
                    </h2>
                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.field}>
                            <label>Nom du commerce</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="ex: Tabac de la Place"
                                required
                            />
                        </div>

                        <div className={styles.field}>
                            <label>Adresse</label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                placeholder="12 rue de la Paix"
                                required
                            />
                        </div>

                        <div className={styles.row}>
                            <div className={styles.field}>
                                <label>Code Postal</label>
                                <input
                                    type="text"
                                    name="zip"
                                    value={formData.zip}
                                    onChange={handleInputChange}
                                    placeholder="75000"
                                    required
                                />
                            </div>
                            <div className={styles.field}>
                                <label>Ville</label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleInputChange}
                                    placeholder="Paris"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handleGeocode}
                            disabled={isGeocoding}
                            className={styles.geocodeBtn}
                        >
                            {isGeocoding ? <Loader2 className="animate-spin" size={18} /> : <Search size={18} />}
                            Géocoder l'adresse (Lat/Lng)
                        </button>

                        <div className={styles.row}>
                            <div className={styles.field}>
                                <label>Latitude</label>
                                <input
                                    type="number"
                                    step="any"
                                    name="lat"
                                    value={formData.lat}
                                    onChange={handleInputChange}
                                    placeholder="48.8566"
                                    required
                                />
                            </div>
                            <div className={styles.field}>
                                <label>Longitude</label>
                                <input
                                    type="number"
                                    step="any"
                                    name="lng"
                                    value={formData.lng}
                                    onChange={handleInputChange}
                                    placeholder="2.3522"
                                    required
                                />
                            </div>
                        </div>

                        <div className={styles.formActions}>
                            {editingPartner && (
                                <button type="button" onClick={cancelEdit} className={styles.cancelBtn}>
                                    <X size={18} /> Annuler
                                </button>
                            )}
                            <button type="submit" disabled={isSaving} className={styles.submitBtn}>
                                {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                                {editingPartner ? 'Mettre à jour' : 'Enregistrer'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Liste */}
                <div className={styles.listContainer}>
                    <h2 className={styles.cardTitle}>Liste des Partenaires ({partners.length})</h2>
                    {isLoading ? (
                        <div className={styles.loader}><Loader2 className="animate-spin" /></div>
                    ) : partners.length === 0 ? (
                        <div className={styles.empty}>Aucun partenaire enregistré.</div>
                    ) : (
                        <div className={styles.list}>
                            {partners.map(partner => (
                                <div key={partner.id} className={styles.partnerItem}>
                                    <div className={styles.partnerInfo}>
                                        <h3>{partner.name}</h3>
                                        <p>{partner.address}, {partner.zip} {partner.city}</p>
                                        <span className={styles.coords}>{partner.lat.toFixed(4)}, {partner.lng.toFixed(4)}</span>
                                    </div>
                                    <div className={styles.actions}>
                                        <button onClick={() => startEdit(partner)} className={styles.editBtn}>
                                            <Edit2 size={16} />
                                        </button>
                                        <button onClick={() => handleDelete(partner.id)} className={styles.deleteBtn}>
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
