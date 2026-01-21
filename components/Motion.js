"use client";
import { useState } from 'react';
import styles from './Motion.module.css';
import { Upload, Film, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Motion({ content }) {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);

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
                            />
                            <label htmlFor="motion-upload" className={styles.uploadLabel}>
                                <div className={styles.uploadIconWrapper}>
                                    <Upload size={24} />
                                </div>
                                <span className={styles.uploadText}>Upload Design File</span>
                                <span className={styles.uploadHint}>PNG recommended</span>
                            </label>
                        </div>

                        {preview && (
                            <div className={styles.fileInfo}>
                                <Sparkles size={16} className={styles.sparkle} />
                                <span>Ready to animate: {file.name}</span>
                            </div>
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
                                        <h3>Video Preview</h3>
                                        <p>Generated content will appear here</p>
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
