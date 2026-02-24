import ConnexionForm from './ConnexionForm';

export const metadata = {
    title: 'Connexion | Les Amis du CBD',
    description: 'Connectez-vous ou créez un compte sur Les Amis du CBD.',
};

export default function ConnexionPage() {
    return (
        <div style={{
            minHeight: '80vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '120px 20px 60px',
            background: 'var(--background-light)',
            position: 'relative'
        }}>
            {/* Décoration de fond optionnelle */}
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '120vw',
                height: '120vw',
                background: 'radial-gradient(circle, rgba(16, 185, 129, 0.03) 0%, rgba(255,255,255,0) 70%)',
                zIndex: 0,
                pointerEvents: 'none'
            }} />

            <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '420px' }}>
                <ConnexionForm />
            </div>
        </div>
    );
}
