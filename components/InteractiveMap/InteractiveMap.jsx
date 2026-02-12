'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps';
import styles from './InteractiveMap.module.css';

// France GeoJSON URL (Local file in public folder)
const GEO_URL = "/france-departments.geojson";

// Seeded random number generator for deterministic stability
function mulberry32(a) {
    return function () {
        var t = a += 0x6D2B79F5;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
}

// Major French cities coordinates [lon, lat]
// Used as seeds for clustering
const CITIES = [
    { name: "Paris", coords: [2.3522, 48.8566], weight: 60 },
    { name: "Lyon", coords: [4.8357, 45.7640], weight: 30 },
    { name: "Marseille", coords: [5.3698, 43.2965], weight: 30 },
    { name: "Toulouse", coords: [1.4442, 43.6047], weight: 20 },
    { name: "Nice", coords: [7.2690, 43.7102], weight: 15 },
    { name: "Nantes", coords: [-1.5536, 47.2184], weight: 20 },
    { name: "Strasbourg", coords: [7.7521, 48.5734], weight: 15 },
    { name: "Montpellier", coords: [3.8767, 43.6108], weight: 15 },
    { name: "Bordeaux", coords: [-0.5792, 44.8378], weight: 25 },
    { name: "Lille", coords: [3.0573, 50.6292], weight: 20 },
    { name: "Rennes", coords: [-1.6778, 48.1173], weight: 15 },
    { name: "Reims", coords: [4.0317, 49.2583], weight: 10 },
    { name: "Le Havre", coords: [0.1079, 49.4944], weight: 10 },
    { name: "Saint-Étienne", coords: [4.3871, 45.4397], weight: 10 },
    { name: "Toulon", coords: [5.9304, 43.1242], weight: 10 },
    { name: "Grenoble", coords: [5.7245, 45.1885], weight: 10 },
    { name: "Dijon", coords: [5.0415, 47.3220], weight: 8 },
    { name: "Angers", coords: [-0.56, 47.47], weight: 8 },
    { name: "Nîmes", coords: [4.36, 43.83], weight: 8 },
    { name: "Clermont-Ferrand", coords: [3.08, 45.77], weight: 10 },
    { name: "Le Mans", coords: [0.19, 48.00], weight: 8 },
    { name: "Aix-en-Provence", coords: [5.44, 43.52], weight: 8 },
    { name: "Brest", coords: [-4.48, 48.39], weight: 8 },
    { name: "Tours", coords: [0.68, 47.39], weight: 8 },
    { name: "Amiens", coords: [2.29, 49.89], weight: 8 },
    { name: "Limoges", coords: [1.26, 45.83], weight: 5 },
    { name: "Annecy", coords: [6.12, 45.89], weight: 8 },
    { name: "Perpignan", coords: [2.89, 42.68], weight: 8 },
    { name: "Metz", coords: [6.17, 49.11], weight: 10 },
    { name: "Besançon", coords: [6.02, 47.23], weight: 8 },
    { name: "Orléans", coords: [1.90, 47.90], weight: 8 },
    { name: "Mulhouse", coords: [7.33, 47.75], weight: 8 },
    { name: "Rouen", coords: [1.09, 49.44], weight: 10 },
    { name: "Caen", coords: [-0.37, 49.18], weight: 10 },
    { name: "Nancy", coords: [6.18, 48.69], weight: 10 },
    { name: "Pau", coords: [-0.37, 43.30], weight: 5 },
    { name: "La Rochelle", coords: [-1.15, 46.16], weight: 5 },
    { name: "Calais", coords: [1.85, 50.95], weight: 5 }
];

// Generate deterministic points clustered around cities
const generateStablePoints = (totalPoints = 350) => {
    const random = mulberry32(123456); // Fixed seed for identical results every render
    const points = [];

    // Distribute points based on weights
    const totalWeight = CITIES.reduce((acc, city) => acc + city.weight, 0);

    CITIES.forEach(city => {
        // Calculate number of points for this city based on weight share
        const count = Math.floor((city.weight / totalWeight) * totalPoints) + 1; // +1 to ensure coverage

        for (let i = 0; i < count; i++) {
            // Gaussian-like distribution (Box-Muller transform approximation or just simple centralized random)
            // Using simpler logic: random offset decreasing with distance
            // Spread factor: stricter for some to keep shape
            const spread = 0.4; // degrees (~20-30km radius visual spread)

            // Random offset
            const u = random();
            const v = random();
            // Use something roughly normal distributed
            const offsetX = (u - 0.5) * spread * 2;
            const offsetY = (v - 0.5) * spread * 1.5; // Correction for aspect ratio of lat/lon

            points.push({
                coordinates: [city.coords[0] + offsetX, city.coords[1] + offsetY]
            });
        }
    });

    return points;
};

// Markers generated ONCE
const STABLE_MARKERS = generateStablePoints(150);

export default function InteractiveMap() {
    // Memoize the marker elements to prevent re-rendering during zoom/pan
    const markers = useMemo(() => (
        STABLE_MARKERS.map((point, index) => (
            <Marker key={index} coordinates={point.coordinates}>
                <circle
                    r={1.5}
                    className={styles.marker}
                    style={{
                        animationDelay: `${Math.random() * 4}s`
                    }}
                />
            </Marker>
        ))
    ), []);

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2 className={styles.title}>Où nous retrouver ?</h2>
                    <p className={styles.subtitle}>
                        Retrouvez nos produits dans une sélection de points de vente partenaires partout en France : <span className={styles.highlight}>plus de 300 bureaux de tabac, shops spécialisés et adresses de confiance.</span>
                    </p>
                </div>

                <div className={styles.mapMapWrapper}>
                    <ComposableMap
                        projection="geoMercator"
                        projectionConfig={{
                            scale: 2200,
                            center: [2.5, 46.5]
                        }}
                        className={styles.mapSvg}
                    >
                        <ZoomableGroup center={[2.83, 44.77]} zoom={1} minZoom={1} maxZoom={4}>
                            <Geographies geography={GEO_URL}>
                                {({ geographies }) =>
                                    geographies.map((geo) => (
                                        <Geography
                                            key={geo.rsmKey}
                                            geography={geo}
                                            className={styles.department}
                                            style={{
                                                default: { outline: "none" },
                                                hover: { outline: "none" },
                                                pressed: { outline: "none" },
                                            }}
                                        />
                                    ))
                                }
                            </Geographies>

                            {markers}
                        </ZoomableGroup>
                    </ComposableMap>

                    <div className={styles.infoCard}>
                        <div className={styles.liveIndicator}>
                            <span className={styles.dot}></span>
                            EN DIRECT
                        </div>
                        <p className={styles.infoText}>300+ Partenaires</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
