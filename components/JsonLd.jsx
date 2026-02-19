import { SITE_URL, SHARED_DESCRIPTION } from '@/app/shared-metadata';

export default function JsonLd() {
    const organizationData = {
        '@context': 'https://schema.org',
        '@type': 'Organization', // Can be LocalBusiness if address is public and visitable
        name: 'Les Amis Du CBD',
        url: SITE_URL,
        logo: `${SITE_URL}/images/logo.webp`,
        description: SHARED_DESCRIPTION,
        address: {
            '@type': 'PostalAddress',
            streetAddress: '25 rue principale',
            addressLocality: 'Chauzon',
            postalCode: '07120',
            addressCountry: 'FR',
        },
        contactPoint: {
            '@type': 'ContactPoint',
            telephone: '+33 6 71 82 42 87',
            contactType: 'customer service',
            email: 'lesamisducbd@gmail.com',
        },
        sameAs: [
            'https://www.facebook.com/lesamisducbd',
            'https://www.instagram.com/lesamisducbd',
            // Add other social links if available
        ],
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }}
        />
    );
}
