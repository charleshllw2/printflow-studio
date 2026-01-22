"use client";
import Link from "next/link";
import { ShoppingBag, Menu } from "lucide-react";
import styles from "./Navbar.module.css";

export default function Navbar() {
    return (
        <nav className={styles.nav}>
            <div className={`container ${styles.container}`}>
                <Link href="/" className={styles.logo}>
                    PrintFlow Studio
                </Link>

                <div className={styles.links}>
                    <Link href="#customizer" className={styles.link}>Customizer</Link>
                    <Link href="#motion" className={styles.link}>Voo Motion</Link>
                    <Link href="#gallery" className={styles.link}>Gallery</Link>
                    <Link href="#business" className={styles.link}>Business</Link>
                </div>

                <div className={styles.actions}>
                    <button aria-label="Cart" className={styles.iconBtn}>
                        <ShoppingBag size={20} />
                    </button>
                    <button aria-label="Menu" className={styles.menuBtn}>
                        <Menu size={20} />
                    </button>
                </div>
            </div>
        </nav>
    );
}
