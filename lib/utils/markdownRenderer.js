import React from 'react';

/**
 * A lightweight markdown parser designed for simple text pages (CGV, Livraison, Privacy).
 * Supports ## (H2), ### (H3), and - or * (bullet lists).
 * Newlines become <p>.
 */
export function renderMarkdown(text) {
    if (!text) return null;
    const lines = text.split('\n');
    let listItems = [];
    const elements = [];

    const flushList = (flushIdx) => {
        if (listItems.length > 0) {
            elements.push(<ul key={`ul-${flushIdx}`}>{listItems}</ul>);
            listItems = [];
        }
    };

    lines.forEach((line, idx) => {
        const t = line.trim();

        if (t.startsWith('## ')) {
            flushList(idx);
            elements.push(<h2 key={`h2-${idx}`}>{t.substring(3).trim()}</h2>);
        }
        else if (t.startsWith('### ')) {
            flushList(idx);
            elements.push(<h3 key={`h3-${idx}`}>{t.substring(4).trim()}</h3>);
        }
        else if (t.startsWith('- ') || t.startsWith('* ')) {
            // It's a list item
            listItems.push(<li key={`li-${idx}`}>{t.substring(2).trim()}</li>);
        }
        else if (t.length > 0) {
            // It's a standard paragraph
            flushList(idx);
            // Support simple bolding with **text** 
            // In a real generic app we'd use regex replace, but for now we just render the raw string.
            // If we want bold, we can split by **
            const parts = t.split('**');
            if (parts.length > 1) {
                const pContent = parts.map((part, pIdx) => {
                    return pIdx % 2 === 1 ? <strong key={`strong-${idx}-${pIdx}`}>{part}</strong> : part;
                });
                elements.push(<p key={`p-${idx}`}>{pContent}</p>);
            } else {
                elements.push(<p key={`p-${idx}`}>{t}</p>);
            }
        }
    });

    flushList('end');

    return <>{elements}</>;
}
