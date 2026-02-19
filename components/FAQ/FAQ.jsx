'use client';
import { useState } from 'react';
import styles from './FAQ.module.css';

export default function FAQ({ items, title }) {
    const [openIndex, setOpenIndex] = useState(null);

    const toggle = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className={styles.section}>
            {title && <h2 className={styles.title}>{title}</h2>}
            <div className={styles.container}>
                {items.map((item, index) => {
                    const isOpen = openIndex === index;
                    return (
                        <div key={index} className={`${styles.item} ${isOpen ? styles.open : ''}`}>
                            <button className={styles.question} onClick={() => toggle(index)}>
                                <span>{item.question}</span>
                                <span className={styles.icon}>{isOpen ? '-' : '+'}</span>
                            </button>
                            {isOpen && (
                                <div
                                    className={styles.answer}
                                    dangerouslySetInnerHTML={{ __html: item.answer }}
                                />
                            )}
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
