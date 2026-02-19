import { SITE_URL } from './shared-metadata';

export default function sitemap() {
    const routes = [
        '',
        '/buraliste',
        '/essentiel',
        '/usages',
        '/recrutement',
        '/qui-sommes-nous',
        '/produits', // Assuming this exists or will exist
    ].map((route) => ({
        url: `${SITE_URL}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: route === '' ? 1 : 0.8,
    }));

    return routes;
}
