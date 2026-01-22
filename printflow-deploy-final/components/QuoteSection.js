"use client";
import { useState, useEffect } from 'react';
import styles from './QuoteSection.module.css';
import { ArrowRight } from 'lucide-react';

export default function QuoteSection() {
    const [garment, setGarment] = useState(6);
    const [qty, setQty] = useState(1);
    const [print, setPrint] = useState(4);
    const [rush, setRush] = useState(0);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        calculateQuote();
    }, [garment, qty, print, rush]);

    const calculateQuote = () => {
        if (qty <= 0) {
            setTotal(0);
            return;
        }

        let subtotal = (Number(garment) + Number(print)) * qty;

        // Bulk Discounts
        if (qty >= 10 && qty < 25) subtotal *= 0.9;
        else if (qty >= 25 && qty < 50) subtotal *= 0.85;
        else if (qty >= 50) subtotal *= 0.8;

        // Rush Fee
        subtotal += subtotal * Number(rush);

        setTotal(subtotal);
    };

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
                        <form className={styles.form} onSubmit={(e) => e.preventDefault()}>

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

                            <div className={styles.totalBox} style={{
                                marginTop: '10px',
                                padding: '20px',
                                background: 'rgba(255,255,255,0.05)',
                                borderRadius: '12px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <span style={{ color: '#888', fontSize: '14px' }}>Estimated Total</span>
                                <span style={{ fontSize: '32px', fontWeight: '700', color: 'white' }}>
                                    ${total.toFixed(2)}
                                </span>
                            </div>

                            <button type="button" className={styles.submitBtn}>
                                Proceed with Quote <ArrowRight size={16} />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
