import { SITE_URL } from './shared-metadata';

export default function sitemap() {
    const routes = [
        '',
        '/professionnel',
        '/essentiel',
        '/usages',
        '/recrutement',
        '/qui-sommes-nous',
        '/produits', // Assuming this exists or will exist
    ].map((route) => {
        if (route === '/professionnel') {
            return {
                url: `${SITE_URL}/professionnel`,
                lastModified: new Date(),
                changeFrequency: 'monthly',
                priority: 0.5,
            };
        }
        return {
            url: `${SITE_URL}${route}`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: route === '' ? 1 : 0.8,
        };
    });

    return routes;
}
