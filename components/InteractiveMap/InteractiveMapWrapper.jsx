'use client';

import dynamic from 'next/dynamic';

const InteractiveMap = dynamic(() => import('./InteractiveMap'), {
    ssr: false,
    loading: () => <div style={{ height: '600px', background: '#f0f0f0', borderRadius: '20px' }}></div>
});

export default function InteractiveMapWrapper(props) {
    return <InteractiveMap {...props} />;
}
