"use client";
import styles from './QuoteSection.module.css';
import { ArrowRight, MessageSquare } from 'lucide-react';

export default function QuoteSection() {
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
                        <h3 className={styles.formTitle}>Request a Quote</h3>
                        <form className={styles.form}>
                            <div className={styles.row}>
                                <div className={styles.group}>
                                    <label>Name</label>
                                    <input type="text" placeholder="Jane Doe" className={styles.input} />
                                </div>
                                <div className={styles.group}>
                                    <label>Email</label>
                                    <input type="email" placeholder="jane@brand.com" className={styles.input} />
                                </div>
                            </div>
                            <div className={styles.group}>
                                <label>Project Details</label>
                                <textarea rows={4} placeholder="Tell us about your needs..." className={styles.textarea}></textarea>
                            </div>
                            <button type="button" className={styles.submitBtn}>
                                Send Request <ArrowRight size={16} />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
