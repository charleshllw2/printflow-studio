"use client";
import { useState } from 'react';
import styles from "./Featured.module.css";
import { motion } from "framer-motion";
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function Featured({ items = [] }) {
    const [loadingId, setLoadingId] = useState(null);

    const handleBuy = async (item) => {
        setLoadingId(item.id);
        try {
            const stripe = await stripePromise;
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: [{
                        name: item.title,
                        price: Number(item.price),
                        image: item.image?.startsWith('http') ? item.image : window.location.origin + item.image,
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
            setLoadingId(null);
        }
    };

    return (
        <section id="gallery" className={`section ${styles.section}`}>
            <div className="container">
                <h2 className={`title-lg ${styles.heading}`}>Featured Creations</h2>
                <p className={styles.subheading}>Latest drops and community submissions.</p>

                <div className={styles.grid}>
                    {items.map((item) => (
                        <motion.div
                            key={item.id}
                            className={styles.card}
                            whileHover={{ y: -8 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >
                            <div className={styles.imageWrapper}>
                                <img src={item.image} alt={item.title} className={styles.image} />
                                <div className={styles.overlay}>
                                    <button
                                        className={styles.buyBtn}
                                        onClick={() => handleBuy(item)}
                                        disabled={loadingId === item.id}
                                    >
                                        {loadingId === item.id ? "..." : "Buy Now"}
                                    </button>
                                </div>
                            </div>
                            <div className={styles.info}>
                                <h3 className={styles.title}>{item.title}</h3>
                                <span className={styles.price}>${item.price}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
