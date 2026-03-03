'use client';

import { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import styles from './StoreLocator.module.css';
import { Search, MapPin, Loader2, Navigation } from 'lucide-react';

// Dynamic import for the Map to avoid SSR errors with Leaflet
const StoreMap = dynamic(() => import('./StoreMap'), {
    ssr: false,
    loading: () => (
        <div className={styles.loader}>
            <Loader2 className="animate-spin" size={40} />
            <p>Chargement de la carte...</p>
        </div>
    ),
});

// Helper for Distance Calculation (Haversine Formula)
function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

export default function StoreLocator({ subtitle = true }) {
    const [partners, setPartners] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [activePartner, setActivePartner] = useState(null);
    const [nearbyPartners, setNearbyPartners] = useState([]);
    const [isSearchingNearby, setIsSearchingNearby] = useState(false);
    const [isLocating, setIsLocating] = useState(false);

    useEffect(() => {
        const fetchPartners = async () => {
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
        fetchPartners();
    }, []);

    const handleLocateMe = () => {
        if (!navigator.geolocation) {
            alert("La géolocalisation n'est pas supportée par votre navigateur.");
            return;
        }

        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;

                // Sort partners by distance
                const withDistance = partners.map(p => ({
                    ...p,
                    distance: getDistance(lat, lon, p.lat, p.lng)
                })).sort((a, b) => a.distance - b.distance);

                setSearchQuery(''); // Clear manual search
                setNearbyPartners(withDistance.slice(0, 5)); // Show 5 closest
                setIsSearchingNearby(true);
                setIsLocating(false);

                // Auto-select the absolute closest one if within reasonable distance (e.g. 50km)
                if (withDistance[0].distance < 50) {
                    handlePartnerClick(withDistance[0]);
                }

                // On mobile, scroll to results
                if (window.innerWidth < 1024) {
                    document.getElementById('map-wrapper')?.scrollIntoView({ behavior: 'smooth' });
                }
            },
            (error) => {
                console.error("Geolocation error:", error);
                alert("Impossible de récupérer votre position. Veuillez vérifier vos autorisations.");
                setIsLocating(false);
            },
            { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
    };

    const filteredPartners = useMemo(() => {
        if (!searchQuery) return partners;
        const query = searchQuery.toLowerCase().trim();

        // Si on a tapé quelque chose, on désactive le mode "Autour de moi"
        // (Note: on ne peut pas appeler de setState dans useMemo, donc on gère displayPartners plus bas)

        return partners.filter(p => {
            const nameMatch = p.name.toLowerCase().includes(query);
            const cityMatch = p.city.toLowerCase().includes(query);
            const zipMatch = p.zip.includes(query);

            // Special handling for general zip codes (13000 -> Marseille)
            let prefixMatch = false;
            if (query.length >= 2 && /^\d+$/.test(query)) {
                // If query is the start of the zip code
                prefixMatch = p.zip.startsWith(query);

                // Specifically handle cases like 13000 matching 13015
                if (query.endsWith('000')) {
                    prefixMatch = p.zip.startsWith(query.substring(0, 2));
                } else if (query.endsWith('00')) {
                    prefixMatch = p.zip.startsWith(query.substring(0, 3));
                }
            }

            return nameMatch || cityMatch || zipMatch || prefixMatch;
        });
    }, [partners, searchQuery]);

    // Clear "Nearby" results if user starts typing manually
    useEffect(() => {
        if (searchQuery.length > 0 && isSearchingNearby && nearbyPartners.length > 0) {
            // We set nearbyPartners to empty when typing manually
            setNearbyPartners([]);
            setIsSearchingNearby(false);
        }
    }, [searchQuery, isSearchingNearby, nearbyPartners.length]);

    // Handle Nominatim Geocoding Fallback if 0 results
    useEffect(() => {
        const timer = setTimeout(async () => {
            // Only trigger Nominatim if we are NOT in the middle of a "Locate Me" action
            if (searchQuery.length > 2 && filteredPartners.length === 0 && !isLocating) {
                setIsSearchingNearby(true);
                try {
                    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&countrycodes=fr&limit=1`);
                    const data = await res.json();
                    if (data && data.length > 0) {
                        const lat = parseFloat(data[0].lat);
                        const lon = parseFloat(data[0].lon);

                        const withDistance = partners.map(p => ({
                            ...p,
                            distance: getDistance(lat, lon, p.lat, p.lng)
                        })).sort((a, b) => a.distance - b.distance);

                        setNearbyPartners(withDistance.slice(0, 3));
                    }
                } catch (err) {
                    console.error("Geocoding fallback failed", err);
                } finally {
                    setIsSearchingNearby(false);
                }
            }
        }, 1000);

        return () => clearTimeout(timer);
    }, [searchQuery, filteredPartners.length, partners, isLocating]);

    const handlePartnerClick = (partner) => {
        setActivePartner(partner);
        if (window.innerWidth < 1024) {
            document.getElementById('map-wrapper')?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const displayPartners = filteredPartners.length > 0 ? filteredPartners : nearbyPartners;

    return (
        <section className={styles.locatorContainer}>
            <header className={styles.header}>
                <h1 className={styles.title}>Nos Partenaires Buralistes</h1>
                {subtitle && (
                    <p className={styles.subtitle}>
                        Trouvez Les Amis du CBD près de chez vous. Recherchez par ville ou code postal.
                    </p>
                )}
            </header>

            <div className={styles.searchBox}>
                <div className={styles.searchInputWrapper}>
                    <Search className={styles.searchIcon} size={20} />
                    <input
                        type="text"
                        placeholder="Ville, code postal..."
                        className={styles.searchInput}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && displayPartners.length > 0) {
                                e.preventDefault();
                                handlePartnerClick(displayPartners[0]);
                                e.target.blur(); // Hide mobile keyboard
                            }
                        }}
                    />
                    <button
                        className={styles.locateButton}
                        onClick={handleLocateMe}
                        title="Autour de moi"
                        disabled={isLocating}
                    >
                        {isLocating ? <Loader2 className="animate-spin" size={20} /> : <MapPin size={20} />}
                    </button>
                </div>
            </div>

            <div className={styles.layout}>
                <aside className={styles.sidebar}>
                    <div className={styles.resultsCount}>
                        {isSearchingNearby ? (
                            "Recherche des points les plus proches..."
                        ) : filteredPartners.length > 0 ? (
                            `${filteredPartners.length} point(s) de vente trouvé(s)`
                        ) : nearbyPartners.length > 0 ? (
                            "Aucun résultat précis, voici les plus proches :"
                        ) : (
                            "0 point de vente trouvé"
                        )}
                    </div>

                    <div className={styles.resultsList}>
                        {isLoading ? (
                            <div className={styles.loader}>
                                <Loader2 className="animate-spin" size={30} />
                            </div>
                        ) : displayPartners.length === 0 && !isSearchingNearby ? (
                            <div className={styles.emptyState}>
                                <p>Aucun partenaire trouvé pour cette recherche.</p>
                            </div>
                        ) : (
                            displayPartners.map(partner => (
                                <div
                                    key={partner.id}
                                    className={`${styles.partnerCard} ${activePartner?.id === partner.id ? styles.active : ''}`}
                                    onClick={() => handlePartnerClick(partner)}
                                >
                                    <h3>{partner.name}</h3>
                                    <p>{partner.address}, {partner.zip} {partner.city}</p>
                                    {partner.distance && (
                                        <div className={styles.distance}>À {partner.distance.toFixed(1)} km</div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </aside>

                <main id="map-wrapper" className={styles.mapWrapper}>
                    <StoreMap
                        partners={displayPartners}
                        activePartner={activePartner}
                        onPartnerClick={setActivePartner}
                    />
                </main>
            </div>
        </section>
    );
}
