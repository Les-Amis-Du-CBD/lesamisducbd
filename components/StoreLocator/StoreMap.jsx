'use client';

import { useRef, useEffect, useMemo, useCallback } from 'react';
import Map, { Source, Layer, Marker, Popup, NavigationControl } from 'react-map-gl/maplibre';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json';
const BRAND_ICON_URL = '/icon.png';

// Cluster layer styles
const clusterLayer = {
    id: 'clusters',
    type: 'circle',
    source: 'partners',
    filter: ['has', 'point_count'],
    paint: {
        'circle-color': ['step', ['get', 'point_count'], '#10B981', 10, '#059669', 50, '#047857'],
        'circle-radius': ['step', ['get', 'point_count'], 22, 10, 28, 50, 35],
        'circle-stroke-width': 3,
        'circle-stroke-color': 'rgba(255, 255, 255, 0.4)',
        'circle-opacity': 0.9
    }
};

const clusterCountLayer = {
    id: 'cluster-count',
    type: 'symbol',
    source: 'partners',
    filter: ['has', 'point_count'],
    layout: {
        'text-field': '{point_count_abbreviated}',
        'text-size': 14,
        'text-allow-overlap': true
    },
    paint: {
        'text-color': '#ffffff'
    }
};

// INVISIBLE CLICK TARGET (Large hit area)
const unclusteredHitLayer = {
    id: 'unclustered-hit',
    type: 'circle',
    source: 'partners',
    filter: ['!', ['has', 'point_count']],
    paint: {
        'circle-color': '#10B981',
        'circle-radius': 18,
        'circle-opacity': 0 // Keep it invisible but clickable
    }
};

// VISIBLE LOGO (The actual brand pin)
const pinIconLayer = {
    id: 'pin-icon',
    type: 'symbol',
    source: 'partners',
    filter: ['!', ['has', 'point_count']],
    layout: {
        'icon-image': 'brand-pin',
        'icon-size': 0.9,
        'icon-allow-overlap': true,
        'icon-ignore-placement': true
    }
};

export default function StoreMap({ partners, activePartner, onPartnerClick }) {
    const mapRef = useRef();

    // Convert partners to GeoJSON for clustering
    const geojsonData = useMemo(() => ({
        type: 'FeatureCollection',
        features: partners.map(p => ({
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [p.lng, p.lat]
            },
            properties: {
                id: p.id
            }
        }))
    }), [partners]);

    // Fly to active partner
    useEffect(() => {
        if (activePartner && mapRef.current) {
            const map = mapRef.current.getMap();
            const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;

            map.flyTo({
                center: [activePartner.lng, activePartner.lat],
                zoom: 14,
                duration: 1500,
                essential: true,
                padding: { top: isMobile ? 80 : 0 }
            });
        }
    }, [activePartner]);

    const handleMapLoad = (e) => {
        const map = e.target;
        map.resize();

        // Load brand icon
        map.loadImage(BRAND_ICON_URL, (error, image) => {
            if (error) return;
            if (!map.hasImage('brand-pin')) map.addImage('brand-pin', image);
        });
    };

    const onMapClick = useCallback((event) => {
        const feature = event.features && event.features[0];
        if (!feature) return;

        if (feature.layer.id === 'clusters') {
            const clusterId = feature.properties.cluster_id;
            const source = mapRef.current.getMap().getSource('partners');

            source.getClusterExpansionZoom(clusterId, (err, zoom) => {
                if (err) return;
                mapRef.current.getMap().easeTo({
                    center: feature.geometry.coordinates,
                    zoom: zoom,
                    duration: 500
                });
            });
        } else if (feature.layer.id === 'unclustered-hit') {
            const partnerId = feature.properties.id;
            const partner = partners.find(p => p.id == partnerId);
            if (partner) onPartnerClick(partner);
        }
    }, [partners, onPartnerClick]);

    return (
        <Map
            ref={mapRef}
            mapLib={maplibregl}
            reuseMaps
            initialViewState={{
                longitude: 2.5,
                latitude: 46.5,
                zoom: 5.2,
                bearing: 0,
                pitch: 0
            }}
            onLoad={handleMapLoad}
            mapStyle={MAP_STYLE}
            style={{ width: '100%', height: '100%', padding: 0, margin: 0 }}
            onClick={onMapClick}
            interactiveLayerIds={['clusters', 'unclustered-hit']}
            maxZoom={18}
            minZoom={4}
        >
            <NavigationControl position="top-right" showCompass={false} />

            <Source
                id="partners"
                type="geojson"
                data={geojsonData}
                cluster={true}
                clusterMaxZoom={14}
                clusterRadius={50}
            />

            <Layer {...clusterLayer} />
            <Layer {...clusterCountLayer} />
            <Layer {...unclusteredHitLayer} />
            <Layer {...pinIconLayer} />

            {/* Premium Active Marker - Elegant White & Green Design */}
            {activePartner && (
                <>
                    <Marker
                        longitude={activePartner.lng}
                        latitude={activePartner.lat}
                        anchor="bottom"
                        onClick={() => onPartnerClick(activePartner)}
                    >
                        <div style={{
                            width: '40px',
                            height: '40px',
                            backgroundImage: `url(${BRAND_ICON_URL})`,
                            backgroundSize: '80%',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                            backgroundColor: 'white',
                            border: '3px solid #10B981',
                            borderRadius: '50%',
                            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                            cursor: 'pointer',
                            transform: 'scale(1.2)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 20
                        }} />
                    </Marker>

                    <Popup
                        longitude={activePartner.lng}
                        latitude={activePartner.lat}
                        anchor="bottom"
                        offset={45}
                        closeButton={true}
                        closeOnClick={false}
                        onClose={() => onPartnerClick(null)}
                        maxWidth="280px"
                        style={{ zIndex: 100 }}
                    >
                        <div style={{ padding: '12px 15px', backgroundColor: 'white' }}>
                            <h4 style={{ margin: '0 0 5px 0', color: '#1F4B40', fontSize: '14px', fontWeight: 700 }}>{activePartner.name}</h4>
                            <p style={{ margin: '0 0 2px 0', fontSize: '12px', color: '#555' }}>{activePartner.address}</p>
                            <p style={{ margin: 0, fontSize: '12px', color: '#777', fontWeight: 600 }}>{activePartner.zip} {activePartner.city}</p>
                        </div>
                    </Popup>
                </>
            )}
        </Map>
    );
}
