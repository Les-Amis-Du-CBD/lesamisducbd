import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import CheckoutClient from './CheckoutClient';
import styles from './Checkout.module.css';

export const metadata = {
    title: 'Paiement | Les Amis du CBD',
    description: 'Finalisez votre commande.',
};

export default async function CheckoutPage() {
    const session = await getServerSession();

    if (!session || !session.user) {
        redirect('/');
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Finalisation de la commande</h1>
            </div>

            <CheckoutClient user={session.user} />
        </div>
    );
}
