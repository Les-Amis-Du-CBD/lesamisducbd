'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default Leaflet icons in Next.js
const defaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Component to handle map view updates
function MapUpdater({ center, zoom }) {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.setView(center, zoom || 13, { animate: true });
        }
    }, [center, zoom, map]);
    return null;
}

export default function StoreMap({ partners, activePartner, onPartnerClick }) {
    const [mapCenter, setMapCenter] = useState([46.5, 2.5]); // France center
    const [zoom, setZoom] = useState(6);

    useEffect(() => {
        if (activePartner) {
            setMapCenter([activePartner.lat, activePartner.lng]);
            setZoom(15);
        }
    }, [activePartner]);

    return (
        <MapContainer
            center={mapCenter}
            zoom={zoom}
            style={{ height: '100%', width: '100%' }}
            scrollWheelZoom={true}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <MapUpdater center={mapCenter} zoom={zoom} />

            {partners.map((partner) => (
                <Marker
                    key={partner.id}
                    position={[partner.lat, partner.lng]}
                    icon={defaultIcon}
                    eventHandlers={{
                        click: () => onPartnerClick(partner),
                    }}
                >
                    <Popup>
                        <strong>{partner.name}</strong><br />
                        {partner.address}<br />
                        {partner.zip} {partner.city}
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}
