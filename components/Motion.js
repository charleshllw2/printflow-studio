"use client";
import { useState } from 'react';
import styles from './Motion.module.css';
import { Upload, Film, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function Motion({ content }) {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    // Use CMS image if available and no user file is uploaded yet
    const defaultPreview = content?.previewImage || null;

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (selected) {
            setFile(selected);
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result);
            reader.readAsDataURL(selected);
        }
    };

    const handleGenerate = async () => {
        if (!file) {
            alert("Please upload a design file first.");
            return;
        }

        setUploading(true);
        try {
            // 1. Upload to Storage via API
            const formData = new FormData();
            formData.append('file', file);
            const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData });
            const uploadData = await uploadRes.json();

            if (!uploadData.success) throw new Error('Upload failed');

            // 2. Save Request to Firestore
            await addDoc(collection(db, "motions"), {
                fileName: file.name,
                imageUrl: uploadData.url,
                createdAt: serverTimestamp(),
                status: 'pending' // pending, processing, completed
            });

            setSubmitted(true);
        } catch (error) {
            console.error(error);
            alert("Generation failed. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    if (submitted) {
        return (
            <section id="motion" className={styles.section}>
                <div className="container">
                    <div className={styles.successState}>
                        <Sparkles size={48} className={styles.successIcon} />
                        <h2>Request Received!</h2>
                        <p>Our AI (and humans) are working on your motion art. Check back in a few hours or look for an email.</p>
                        <button onClick={() => setSubmitted(false)} className={styles.resetBtn}>Upload Another</button>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section id="motion" className={styles.section}>
            <div className="container">
                <div className={styles.grid}>
                    {/* Left Content */}
                    <div className={styles.content}>
                        <div className={styles.header}>
                            <h2 className={styles.title}>
                                <span className={styles.accent}>Motion</span> Art
                            </h2>
                            <p className={styles.description}>
                                Turn your art into mesmerizing videos for social.
                                Choose your format, and let Veo perfect your vision.
                            </p>
                        </div>

                        <div className={styles.uploadCard}>
                            <input
                                type="file"
                                id="motion-upload"
                                className={styles.fileInput}
                                accept="image/png, image/jpeg"
                                onChange={handleFileChange}
                                disabled={uploading}
                            />
                            <label htmlFor="motion-upload" className={styles.uploadLabel}>
                                <div className={styles.uploadIconWrapper}>
                                    <Upload size={24} />
                                </div>
                                <span className={styles.uploadText}>{file ? file.name : "Upload Design File"}</span>
                                <span className={styles.uploadHint}>PNG recommended</span>
                            </label>
                        </div>

                        {preview && (
                            <button
                                className={styles.generateBtn}
                                onClick={handleGenerate}
                                disabled={uploading}
                            >
                                {uploading ? "Uploading..." : "Generate AI Video"}
                            </button>
                        )}
                    </div>

                    {/* Right Preview (Video/Result) */}
                    <div className={styles.previewArea}>
                        <div className={styles.videoCard}>
                            {preview || defaultPreview ? (
                                <div className={styles.videoPlaceholder}>
                                    <img src={preview || defaultPreview} alt="Preview" className={styles.bgPreview} />
                                    <div className={styles.processingOverlay}>
                                        <Film size={48} className={styles.filmIcon} />
                                        <h3>{uploading ? "Uploading Artwork..." : "Video Preview"}</h3>
                                        <p>{uploading ? "Preparing your pixels for motion" : "Generated content will appear here"}</p>
                                    </div>
                                </div>
                            ) : (
                                <div className={styles.emptyState}>
                                    <div className={styles.emptyIcon}>
                                        <Film size={32} />
                                    </div>
                                    <h3>Video Preview</h3>
                                    <p>Generated content will appear here</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

