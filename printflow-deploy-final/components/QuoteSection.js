"use client";
import { useState, useEffect } from 'react';
import styles from './QuoteSection.module.css';
import { ArrowRight, Sparkles } from 'lucide-react';

import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function QuoteSection() {
    const [garment, setGarment] = useState(6);
    const [qty, setQty] = useState(1);
    const [print, setPrint] = useState(4);
    const [rush, setRush] = useState(0);
    const [total, setTotal] = useState(0);

    // Contact State
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        calculateQuote();
    }, [garment, qty, print, rush]);

    const calculateQuote = () => {
        if (qty <= 0) {
            setTotal(0);
            return;
        }

        let garmentPrice = Number(garment);
        let printPrice = Number(print);
        let quantity = Number(qty);

        let subtotal = (garmentPrice + printPrice) * quantity;

        // Bulk Discounts
        if (quantity >= 10 && quantity < 25) subtotal *= 0.9;
        else if (quantity >= 25 && quantity < 50) subtotal *= 0.85;
        else if (quantity >= 50) subtotal *= 0.8;

        // Rush Fee
        subtotal += subtotal * Number(rush);

        setTotal(subtotal);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !email) {
            alert("Please provide your name and email to proceed.");
            return;
        }

        setSubmitting(true);
        try {
            await addDoc(collection(db, "quotes"), {
                name,
                email,
                garment: garment == 6 ? 'T-Shirt' : garment == 14 ? 'Hoodie' : garment == 12 ? 'Crewneck' : 'Long Sleeve',
                quantity: Number(qty),
                print: print == 4 ? 'Left Chest' : print == 6 ? 'Full Front' : 'Front + Back',
                turnaround: rush == 0 ? 'Standard' : 'Rush',
                totalEstimated: total,
                createdAt: serverTimestamp(),
                status: 'new'
            });
            setSubmitted(true);
        } catch (error) {
            console.error("Error submitting quote:", error);
            alert("Something went wrong. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <section className={styles.section}>
                <div className="container">
                    <div className={styles.successCard}>
                        <Sparkles className={styles.successIcon} />
                        <h2>Request Received!</h2>
                        <p>We've received your quote request for ${total.toFixed(2)}. An account manager will reach out to <strong>{email}</strong> within 24 hours.</p>
                        <button onClick={() => setSubmitted(false)} className={styles.submitBtn}>
                            Calculate Another
                        </button>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className={styles.section}>
            <div className="container">
                <div className={styles.grid}>
                    <div className={styles.content}>
                        <span className={styles.label}>For Bulk & Custom Orders</span>
                        <h2 className={styles.title}>Scale Your Brand.</h2>
                        <p className={styles.description}>
                            Need more than 50 units? Or have a complex project?
                            Get a custom quote tailored to your business needs with tailored pricing and priority support.
                        </p>
                        <div className={styles.features}>
                            <div className={styles.feature}>
                                <div className={styles.dot}></div>
                                <span>Volume Discounts</span>
                            </div>
                            <div className={styles.feature}>
                                <div className={styles.dot}></div>
                                <span>Dedicated Account Manager</span>
                            </div>
                            <div className={styles.feature}>
                                <div className={styles.dot}></div>
                                <span>48hr Turnaround Available</span>
                            </div>
                        </div>
                    </div>

                    <div className={styles.formCard}>
                        <h3 className={styles.formTitle}>Instant Quote Calculator</h3>
                        <form className={styles.form} onSubmit={handleSubmit}>

                            <div className={styles.row}>
                                <div className={styles.group}>
                                    <label>Garment Type</label>
                                    <select
                                        className={styles.input}
                                        value={garment}
                                        onChange={(e) => setGarment(e.target.value)}
                                    >
                                        <option value="6">T-Shirt ($6)</option>
                                        <option value="14">Hoodie ($14)</option>
                                        <option value="12">Crewneck ($12)</option>
                                        <option value="9">Long Sleeve ($9)</option>
                                    </select>
                                </div>
                                <div className={styles.group}>
                                    <label>Quantity</label>
                                    <input
                                        type="number"
                                        min="1"
                                        className={styles.input}
                                        value={qty}
                                        onChange={(e) => setQty(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className={styles.row}>
                                <div className={styles.group}>
                                    <label>Print Location</label>
                                    <select
                                        className={styles.input}
                                        value={print}
                                        onChange={(e) => setPrint(e.target.value)}
                                    >
                                        <option value="4">Left Chest ($4)</option>
                                        <option value="6">Full Front ($6)</option>
                                        <option value="10">Front + Back ($10)</option>
                                    </select>
                                </div>
                                <div className={styles.group}>
                                    <label>Turnaround Time</label>
                                    <select
                                        className={styles.input}
                                        value={rush}
                                        onChange={(e) => setRush(e.target.value)}
                                    >
                                        <option value="0">Standard (7-10 Days)</option>
                                        <option value="0.2">Rush (+20%)</option>
                                    </select>
                                </div>
                            </div>

                            <div className={styles.divider}></div>

                            <div className={styles.row}>
                                <div className={styles.group}>
                                    <label>Your Name</label>
                                    <input
                                        type="text"
                                        className={styles.input}
                                        placeholder="Full Name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className={styles.group}>
                                    <label>Email Address</label>
                                    <input
                                        type="email"
                                        className={styles.input}
                                        placeholder="hello@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className={styles.totalBox}>
                                <span className={styles.totalLabel}>Estimated Total</span>
                                <span className={styles.totalAmount}>
                                    ${total.toFixed(2)}
                                </span>
                            </div>

                            <button type="submit" className={styles.submitBtn} disabled={submitting}>
                                {submitting ? "Sending..." : "Request Official Quote"} <ArrowRight size={16} />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}

