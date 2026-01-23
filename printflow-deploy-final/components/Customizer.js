"use client";
import { useState } from "react";
import { Upload, Check, ChevronDown } from "lucide-react";
import styles from "./Customizer.module.css";
import { motion } from "framer-motion";

const GARMENTS = [
    { id: "tee", name: "Premium Heavyweight Tee", price: 35, image: "/assets/uploaded_image_1_1768848184048.png" }, // Assuming img 1 is tee
    { id: "hoodie", name: "Urban Pullover Hoodie", price: 65, image: "/assets/model-hoodie.jpg" } // Updated with user model shot
];

import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const SIZES = ["S", "M", "L", "XL", "2XL"];

export default function Customizer({ content }) {
    const [selectedGarment, setSelectedGarment] = useState(GARMENTS[0]);
    const [size, setSize] = useState("L");
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const previewImage = content?.previewImage || "/assets/customizer-preview.png";

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleCheckout = async () => {
        setLoading(true);
        try {
            const stripe = await stripePromise;

            // In a real app, we'd upload the 'file' here first
            // For now, we just pass the product details
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: [{
                        name: `${selectedGarment.name} (${size})`,
                        price: selectedGarment.price,
                        image: window.location.origin + selectedGarment.image, // Use absolute URL for Stripe
                        quantity: 1
                    }]
                }),
            });

            const { sessionId } = await response.json();
            const result = await stripe.redirectToCheckout({ sessionId });

            if (result.error) {
                alert(result.error.message);
            }
        } catch (error) {
            console.error(error);
            alert("Checkout failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section id="customizer" className={`section ${styles.section}`}>
            <div className="container">
                {/* ... existing header ... */}
                <div className={styles.header}>
                    <h2 className="title-lg">Design Your Masterpiece</h2>
                    <p className={styles.subtitle}>Select your canvas, upload your artwork, and let our expert design team perfect your vision before print.</p>
                </div>

                <div className={styles.layout}>
                    {/* ... existing controls ... */}
                    <div className={styles.controls}>
                        {/* ... Steps 1, 2, 3 ... */}
                        <div className={styles.step}>
                            <span className={styles.stepLabel}>1. Choose Garment</span>
                            <div className={styles.garmentGrid}>
                                {GARMENTS.map((g) => (
                                    <button
                                        key={g.id}
                                        onClick={() => setSelectedGarment(g)}
                                        className={`${styles.garmentBtn} ${selectedGarment.id === g.id ? styles.active : ''}`}
                                    >
                                        <span className={styles.garmentName}>{g.name}</span>
                                        <span className={styles.garmentPrice}>${g.price}</span>
                                        {selectedGarment.id === g.id && <Check size={16} className={styles.checkIcon} />}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className={styles.step}>
                            <span className={styles.stepLabel}>2. Upload & Edit</span>
                            <label className={styles.uploadBox}>
                                <input type="file" onChange={handleFileChange} accept="image/*" hidden />
                                <div className={styles.uploadContent}>
                                    <Upload size={24} className={styles.uploadIcon} />
                                    <span className={styles.uploadText}>
                                        {file ? file.name : "Click to upload artwork"}
                                    </span>
                                    <span className={styles.uploadHint}>PNG, JPG up to 10MB</span>
                                </div>
                            </label>
                        </div>

                        <div className={styles.step}>
                            <span className={styles.stepLabel}>3. Select Size</span>
                            <div className={styles.sizeGrid}>
                                {SIZES.map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => setSize(s)}
                                        className={`${styles.sizeBtn} ${size === s ? styles.activeSize : ''}`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            className={styles.addToCartBtn}
                            onClick={handleCheckout}
                            disabled={loading}
                        >
                            {loading ? "Processing..." : `Buy Now - $${selectedGarment.price}`}
                        </button>

                    </div>

                    {/* Preview - Right side (Static User Image) */}
                    <motion.div
                        className={styles.preview}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4 }}
                    >
                        <img
                            src={previewImage}
                            alt="Custom Preview"
                            className={styles.previewImage}
                        />
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
