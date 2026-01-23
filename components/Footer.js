import styles from './Footer.module.css';
import Link from 'next/link';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className="container">
                <div className={styles.grid}>
                    {/* Column 1: Brand */}
                    <div className={styles.colBrand}>
                        <h3 className={styles.brandTitle}>PrintFlow Studio</h3>
                        <p className={styles.description}>
                            Redefining custom apparel with expert craftsmanship
                            and premium Direct-to-Film transfer technology.
                            Built for creators, brands, and visionaries.
                        </p>
                    </div>

                    {/* Column 2: Studio */}
                    <div className={styles.colLinks}>
                        <h4 className={styles.colTitle}>Studio</h4>
                        <ul className={styles.linkList}>
                            <li><Link href="/about">About Us</Link></li>
                            <li><Link href="/technology">Technology</Link></li>
                            <li><Link href="/sustainability">Sustainability</Link></li>
                            <li><Link href="/careers">Careers</Link></li>
                        </ul>
                    </div>

                    {/* Column 3: Support */}
                    <div className={styles.colLinks}>
                        <h4 className={styles.colTitle}>Support</h4>
                        <ul className={styles.linkList}>
                            <li><Link href="/help">Help Center</Link></li>
                            <li><Link href="/track">Track Order</Link></li>
                            <li><Link href="/returns">Returns</Link></li>
                            <li><Link href="/contact">Contact</Link></li>
                        </ul>
                    </div>
                </div>

                <div className={styles.bottomBar}>
                    <div className={styles.copyright}>
                        &copy; 2024 PrintFlow Studio. All rights reserved.
                    </div>
                    <div className={styles.legalLinks}>
                        <Link href="/privacy">Privacy</Link>
                        <Link href="/terms">Terms</Link>
                        <Link href="/sitemap">Sitemap</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
