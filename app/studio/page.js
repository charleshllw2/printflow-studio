"use client";
import { useState } from 'react';
import styles from './page.module.css';
import { Sparkles, Image as ImageIcon, Loader2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

import { analyzeTrends, generateDTFDesign } from '../../services/geminiService';

export default function Studio() {
    const [status, setStatus] = useState('idle'); // idle, analyzing, generating, complete
    const [topic, setTopic] = useState('');
    const [images, setImages] = useState([]);
    const [trendData, setTrendData] = useState(null);
    const [uploadedImage, setUploadedImage] = useState(null);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setUploadedImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };


    const handleGenerate = async (e) => {
        e.preventDefault();
        if (!topic) return;

        setStatus('analyzing');
        setTrendData(null);
        setImages([]);

        try {
            // Step 1: Analyze
            const trends = await analyzeTrends(topic);
            setTrendData(trends);

            // Step 2: Generate
            setStatus('generating');
            const newImages = await generateDTFDesign(topic, trends, uploadedImage);
            setImages(newImages);
            setStatus('complete');
        } catch (error) {
            console.error(error);
            setStatus('idle');
        }
    };

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <div className="container">
                    <Link href="/" className={styles.backLink}>← Back to Store</Link>
                    <h1 className="title-lg">AI Creator Studio</h1>
                    <p className={styles.subtitle}>Powered by Google Gemini 2.0</p>
                </div>
            </header>

            <div className={`container ${styles.grid}`}>
                {/* Input Section */}
                <div className={styles.controls}>
                    <div className={styles.card}>
                        <h2 className={styles.cardTitle}>Create New Design</h2>
                        <form onSubmit={handleGenerate} className={styles.form}>

                            {/* Image Upload Area */}
                            <div className={styles.uploadArea}>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className={styles.fileInput}
                                    id="studio-upload"
                                />
                                <label htmlFor="studio-upload" className={styles.uploadLabel}>
                                    {uploadedImage ? (
                                        <div className={styles.previewContainer}>
                                            <img src={uploadedImage} alt="Upload preview" className={styles.previewImage} />
                                            <div className={styles.changeOverlay}>Change Image</div>
                                        </div>
                                    ) : (
                                        <>
                                            <ImageIcon size={24} className={styles.uploadIcon} />
                                            <span>Upload Reference Image (Optional)</span>
                                        </>
                                    )}
                                </label>
                            </div>


                            <div className={styles.inputGroup}>
                                <label>Design Topic / Prompt</label>
                                <textarea
                                    value={topic}
                                    onChange={(e) => setTopic(e.target.value)}
                                    placeholder="e.g. Cyberpunk samurai cat in neon city"
                                    className={styles.textarea}
                                    rows={4}
                                />
                            </div>

                            <div className={styles.statusDisplay}>
                                {status === 'analyzing' && (
                                    <div className={styles.statusItem}>
                                        <Sparkles className={styles.spin} size={16} /> Analyzing Trends...
                                    </div>
                                )}
                                {status === 'generating' && (
                                    <div className={styles.statusItem}>
                                        <Loader2 className={styles.spin} size={16} /> Generating Artwork...
                                    </div>
                                )}
                            </div>

                            <button
                                type="submit"
                                className={styles.generateBtn}
                                disabled={status === 'analyzing' || status === 'generating'}
                            >
                                {status === 'idle' || status === 'complete' ? "Generate Magic" : "Processing..."}
                            </button>
                        </form>
                    </div>

                    {trendData && (
                        <div className={`${styles.card} ${styles.trendCard}`}>
                            <h3 className={styles.cardTitle}>Trend Insights</h3>
                            <p className={styles.trendSummary}>{trendData.summary}</p>
                            <div className={styles.passions}>
                                {trendData.keywords.map(k => (
                                    <span key={k} className={styles.tag}>#{k}</span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Results Section */}
                <div className={styles.results}>
                    {images.length > 0 ? (
                        <div className={styles.gallery}>
                            {images.map((img, i) => (
                                <div key={i} className={styles.resultCard}>
                                    <img src={img} alt={`Generated ${i}`} className={styles.genImage} />
                                    <div className={styles.actions}>
                                        <button className={styles.actionBtn}>Save to Gallery</button>
                                        <button className={styles.actionBtn}>Edit</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className={styles.emptyState}>
                            <div className={styles.placeholderIcon}>
                                <ImageIcon size={48} />
                            </div>
                            <h3>Ready to Create</h3>
                            <p>Enter a prompt to generate premium DTF-ready artwork.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
