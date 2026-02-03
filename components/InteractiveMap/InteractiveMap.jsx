'use client';

'use client';

import React, { useState } from 'react';
import styles from './InteractiveMap.module.css';

export default function InteractiveMap({ title, description, points }) {

    // Simplified France Path (Approximation)
    // ViewBox 0 0 100 100
    const francePath = "M 55,5 L 45,10 L 35,12 L 20,25 L 5,28 L 10,40 L 25,45 L 30,70 L 25,85 L 45,95 L 55,95 L 85,85 L 95,65 L 92,30 L 75,10 Z";

    // Refined Path to look a bit more organic/accurate (manual tweak)
    // Coords are roughly %, 0,0 is top left
    // More accurate shape of France (Simulated 0-100 viewBox)
    const refinedFrancePath = `
        M 55,2 
        C 65,2 75,8 85,15
        L 92,20 
        L 92,30
        C 90,35 88,40 90,45
        L 92,75 
        C 85,85 75,88 65,90
        L 55,95
        L 30,88
        C 25,75 30,65 32,55
        L 28,50 
        L 2,40 
        L 25,32 
        L 32,15 
        L 45,22 
        L 55,2 
        Z
    `;

    // Updated coordinates to match the new shape
    const defaultPoints = [
        { x: 58, y: 28, label: "Paris" },
        { x: 75, y: 62, label: "Lyon" },
        { x: 80, y: 82, label: "Marseille" },
        { x: 32, y: 70, label: "Bordeaux" },
        { x: 28, y: 45, label: "Nantes" },
        { x: 58, y: 8, label: "Lille" },
        { x: 92, y: 22, label: "Strasbourg" },
        { x: 55, y: 55, label: "Clermont-Ferrand" },
        { x: 45, y: 85, label: "Toulouse" },
        { x: 88, y: 78, label: "Nice" },
        { x: 6, y: 40, label: "Brest" }
    ];

    const displayPoints = points || defaultPoints;

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <h2 className={styles.title}>{title}</h2>
                <p className={styles.description}>{description}</p>

                <div className={styles.mapWrapper}>
                    <svg
                        className={styles.mapSvg}
                        viewBox="0 0 100 100"
                        preserveAspectRatio="xMidYMid meet"
                    >
                        {/* France Shape */}
                        <path
                            d={refinedFrancePath}
                            className={styles.francePath}
                        />

                        {/* City Points */}
                        {displayPoints.map((point, index) => (
                            <g key={index} className={styles.cityGroup}>
                                <circle
                                    cx={point.x}
                                    cy={point.y}
                                    r="1"
                                    className={styles.cityDot}
                                />
                                <text
                                    x={point.x}
                                    y={point.y - 3}
                                    textAnchor="middle"
                                    className={styles.cityLabel}
                                >
                                    {point.label}
                                </text>
                            </g>
                        ))}
                    </svg>
                </div>
            </div>
        </section>
    );
}
