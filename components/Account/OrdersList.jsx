'use client';

import { useState, useEffect } from 'react';
import { Package, Truck, ExternalLink, Calendar, Loader2 } from 'lucide-react';
import styles from './OrdersList.module.css';

export default function OrdersList() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await fetch('/api/user/orders');
                const data = await res.json();

                if (data.success) {
                    setOrders(data.orders);
                } else {
                    setError(data.error);
                }
            } catch (err) {
                setError('Erreur lors du chargement des commandes.');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('fr-FR', options);
    };

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <Loader2 className={styles.spinner} size={40} />
                <p>Chargement de votre historique...</p>
            </div>
        );
    }

    if (error) {
        return <div className={styles.error}>{error}</div>;
    }

    if (orders.length === 0) {
        return (
            <div className={styles.emptyContainer}>
                <Package size={48} className={styles.emptyIcon} />
                <h3>Aucune commande pour le moment</h3>
                <p>Vous n'avez pas encore passé de commande sur notre boutique.</p>
            </div>
        );
    }

    return (
        <div className={styles.ordersList}>
            <h2 className={styles.title}>Mes Commandes</h2>

            <div className={styles.grid}>
                {orders.map((order) => (
                    <div key={order.id} className={styles.orderCard}>
                        {/* Header: Ref & Date */}
                        <div className={styles.cardHeader}>
                            <div>
                                <span className={styles.reference}>Contrat #{order.reference}</span>
                                <div className={styles.date}>
                                    <Calendar size={14} /> {formatDate(order.date)}
                                </div>
                            </div>
                            <div className={styles.total}>{order.total.replace('.', ',')} €</div>
                        </div>

                        {/* Status Badge */}
                        <div
                            className={styles.statusBadge}
                            style={{
                                backgroundColor: order.statusColor + '20', // 20% opacity background
                                color: order.statusColor,
                                border: `1px solid ${order.statusColor}40`
                            }}
                        >
                            <span
                                className={styles.statusDot}
                                style={{ backgroundColor: order.statusColor }}
                            ></span>
                            {order.status}
                        </div>

                        {/* Products Preview */}
                        <div className={styles.products}>
                            <p className={styles.productsTitle}>Articles ({order.products.length})</p>
                            <ul className={styles.productsList}>
                                {order.products.map((item, idx) => (
                                    <li key={idx}>
                                        <span className={styles.itemQty}>{item.quantity}x</span>
                                        <span className={styles.itemName}>{item.name.split('-')[0].trim()}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Tracking Section */}
                        {order.trackingNumber ? (
                            order.trackingUrl ? (
                                <a
                                    href={order.trackingUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.trackingBtn}
                                >
                                    <Truck size={18} />
                                    <span>Suivre mon colis ({order.trackingNumber})</span>
                                    <ExternalLink size={14} className={styles.extIcon} />
                                </a>
                            ) : (
                                <div className={styles.trackingNumberOnly}>
                                    <Truck size={16} />
                                    <span>N° de suivi : <strong>{order.trackingNumber}</strong></span>
                                </div>
                            )
                        ) : (
                            <div className={styles.noTracking}>
                                Pas de numéro de suivi disponible pour le moment.
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
