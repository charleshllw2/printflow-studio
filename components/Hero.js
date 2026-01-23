"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import styles from "./Hero.module.css";
import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";

export default function Hero({ content }) {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
    const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

    const bgImage = content?.backgroundImage || "/assets/hero-bg.jpg"; // Fallback

    return (
        <section ref={containerRef} className={styles.hero}>
            <motion.div
                className={styles.bgImage}
                style={{
                    y,
                    scale,
                    backgroundImage: `url('${bgImage}')`
                }}
            >
                <div className={styles.overlay} />
            </motion.div>

            <motion.div
                className={styles.content}
                style={{ opacity }}
            >
                <div className="container">
                    <div className={styles.badge}>
                        <span>EST. 2024 • PRINTFLOW STUDIO</span>
                    </div>

                    <h1 className={styles.title}>
                        Wear Your <br />
                        <span className="text-gradient">Imagination.</span>
                    </h1>

                    <p className={styles.subtitle}>
                        Premium Direct-to-Film (DTF) technology for visionary creators.
                        Upload your art, work with our experts, and watch it come to life on museum-quality apparel.
                    </p>

                    <div className={styles.actions}>
                        <Link href="/studio" className={styles.secondaryBtn}>
                            AI Studio
                        </Link>
                        <Link href="#customizer" className={styles.primaryBtn}>
                            Start Creating
                        </Link>
                    </div>
                </div>
            </motion.div>

            <div className={styles.scrollIndicator}>
                <ArrowRight size={24} className={styles.arrowDown} />
            </div>
        </section>
    );
}
