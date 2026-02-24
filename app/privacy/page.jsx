import PrivacyClient from './PrivacyClient';
import { kv } from '@vercel/kv';

export const metadata = {
    title: 'Politique de confidentialité | Les Amis du CBD',
    description: 'Consultez la Politique de confidentialité de la boutique Les Amis du CBD.',
};

export default async function PrivacyPage() {
    let globalContent = null;
    try {
        const data = await kv.get('global_content');
        if (data) globalContent = data;
    } catch (e) {
        console.error('KV error (privacy):', e);
    }

    return <PrivacyClient globalContent={globalContent} />;
}
