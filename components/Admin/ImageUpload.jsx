'use client';
import { useState } from 'react';
import styles from './ImageUpload.module.css';

export default function ImageUpload({ currentImage, onImageChange }) {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState(currentImage);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Preview immediate
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) throw new Error('Upload failed');

            const data = await res.json();
            onImageChange(data.url); // Send back the new URL parent
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Erreur lors de l\'upload de l\'image');
            setPreview(currentImage); // Revert preview on error
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.previewContainer}>
                {preview ? (
                    <img src={preview} alt="Preview" className={styles.image} />
                ) : (
                    <div className={styles.placeholder}>Aucune image</div>
                )}
                {uploading && <div className={styles.overlay}>Upload...</div>}
            </div>
            <label className={styles.uploadBtn}>
                {uploading ? 'Chargement...' : 'Changer l\'image'}
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={uploading}
                    style={{ display: 'none' }}
                />
            </label>
        </div>
    );
}
