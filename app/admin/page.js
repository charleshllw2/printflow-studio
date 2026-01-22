"use client";
import { useState, useEffect } from 'react';
import { Trash2, Plus, Upload, ArrowLeft, Layout, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import styles from './page.module.css';

export default function Admin() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [passwordInput, setPasswordInput] = useState('');

    const [activeTab, setActiveTab] = useState('products'); // 'products' or 'content'

    // Product State
    const [products, setProducts] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const [desc, setDesc] = useState('');
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    // Content State
    const [siteContent, setSiteContent] = useState(null);
    const [contentLoading, setContentLoading] = useState(true);
    const [savingContent, setSavingContent] = useState(false);

    useEffect(() => {
        if (isAuthenticated) {
            fetchProducts();
            fetchContent();
        }
    }, [isAuthenticated]);

    // Auth Logic
    const handleLogin = (e) => {
        e.preventDefault();
        const correctPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;
        if (passwordInput === correctPassword) {
            setIsAuthenticated(true);
        } else {
            alert("Incorrect Password");
        }
    };

    // --- Product Logic ---
    async function fetchProducts() {
        const res = await fetch('/api/products');
        const data = await res.json();
        setProducts(data);
        setLoadingProducts(false);
    }

    async function handleDeleteProduct(id) {
        if (!confirm("Are you sure you want to delete this product?")) return;
        await fetch(`/api/products?id=${id}`, { method: 'DELETE' });
        fetchProducts();
    }

    async function handleProductSubmit(e) {
        e.preventDefault();
        if (!title || !price || !file) {
            alert("Please fill in all required fields and upload an image.");
            return;
        }

        setUploading(true);

        try {
            const formData = new FormData();
            formData.append('file', file);

            const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData });
            const uploadData = await uploadRes.json();

            if (!uploadData.success) throw new Error('Upload failed');

            const newProduct = {
                title,
                price: parseFloat(price),
                description: desc,
                image: uploadData.url
            };

            await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newProduct)
            });

            setTitle('');
            setPrice('');
            setDesc('');
            setFile(null);
            fetchProducts();
            alert("Product added successfully!");

        } catch (error) {
            console.error(error);
            alert("Failed to save product.");
        } finally {
            setUploading(false);
        }
    }

    // --- Content Logic ---
    async function fetchContent() {
        try {
            const res = await fetch('/api/content');
            const data = await res.json();
            setSiteContent(data);
            setContentLoading(false);
        } catch (e) {
            console.error("Failed to load content", e);
        }
    }

    async function handleContentImageUpload(section, key, file) {
        if (!file) return;

        // Optimistic update for UI feedback
        const tempUrl = URL.createObjectURL(file);
        setSiteContent(prev => ({
            ...prev,
            [section]: { ...prev[section], [key]: tempUrl }
        }));

        try {
            const formData = new FormData();
            formData.append('file', file);
            const res = await fetch('/api/upload', { method: 'POST', body: formData });
            const data = await res.json();

            if (data.success) {
                // Update state with real server URL
                const updatedContent = {
                    ...siteContent,
                    [section]: { ...siteContent[section], [key]: data.url }
                };
                setSiteContent(updatedContent);
                // Auto-save changes
                await saveContent(updatedContent);
            }
        } catch (error) {
            console.error("Upload failed", error);
            alert("Image upload failed");
            fetchContent(); // Revert
        }
    }

    async function saveContent(contentToSave) {
        setSavingContent(true);
        try {
            await fetch('/api/content', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(contentToSave)
            });
        } catch (e) {
            alert("Failed to save changes");
        } finally {
            setSavingContent(false);
        }
    }

    if (!isAuthenticated) {
        return (
            <div className={styles.adminPage}>
                <div className="container" style={{ maxWidth: '400px', marginTop: '100px' }}>
                    <div className={styles.card}>
                        <h2 className={styles.cardTitle}>Admin Access</h2>
                        <form onSubmit={handleLogin} className={styles.form}>
                            <div className={styles.inputGroup}>
                                <label>Password</label>
                                <input
                                    type="password"
                                    value={passwordInput}
                                    onChange={e => setPasswordInput(e.target.value)}
                                    className={styles.input}
                                    placeholder="Enter admin password"
                                />
                            </div>
                            <button type="submit" className={styles.submitBtn}>Login</button>
                        </form>
                        <Link href="/" className={styles.backLink} style={{ marginTop: '20px', display: 'block', textAlign: 'center' }}>
                            <ArrowLeft size={16} /> Back to Store
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.adminPage}>
            <div className="container">

                <header className={styles.header}>
                    <div className={styles.headerTop}>
                        <Link href="/" className={styles.backLink}>
                            <ArrowLeft size={16} /> Back to Store
                        </Link>
                        <h1 className="title-lg">Admin Dashboard</h1>
                    </div>

                    <div className={styles.tabs}>
                        <button
                            className={`${styles.tab} ${activeTab === 'products' ? styles.activeTab : ''}`}
                            onClick={() => setActiveTab('products')}
                        >
                            <ShoppingBag size={18} /> Product Manager
                        </button>
                        <button
                            className={`${styles.tab} ${activeTab === 'content' ? styles.activeTab : ''}`}
                            onClick={() => setActiveTab('content')}
                        >
                            <Layout size={18} /> Site Content
                        </button>
                    </div>
                </header>

                <div className={styles.grid}>

                    {activeTab === 'products' && (
                        <>
                            {/* Add Product Form */}
                            <div className={styles.card}>
                                <h2 className={styles.cardTitle}>Add New Product</h2>
                                <form onSubmit={handleProductSubmit} className={styles.form}>
                                    <div className={styles.inputGroup}>
                                        <label>Product Title</label>
                                        <input
                                            type="text"
                                            value={title}
                                            onChange={e => setTitle(e.target.value)}
                                            placeholder="e.g. Neon Cyber Tee"
                                            className={styles.input}
                                        />
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <label>Price ($)</label>
                                        <input
                                            type="number"
                                            value={price}
                                            onChange={e => setPrice(e.target.value)}
                                            placeholder="35"
                                            className={styles.input}
                                        />
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <label>Description</label>
                                        <input
                                            type="text"
                                            value={desc}
                                            onChange={e => setDesc(e.target.value)}
                                            placeholder="Details about the design..."
                                            className={styles.input}
                                        />
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <label>Design Image</label>
                                        <div className={styles.fileUpload}>
                                            <label>
                                                <input
                                                    type="file"
                                                    onChange={e => setFile(e.target.files[0])}
                                                    accept="image/*"
                                                    hidden
                                                />
                                                <div className={styles.uploadBtn}>
                                                    <Upload size={18} />
                                                    <span>{file ? file.name : "Select Image"}</span>
                                                </div>
                                            </label>
                                        </div>
                                    </div>
                                    <button type="submit" className={styles.submitBtn} disabled={uploading}>
                                        {uploading ? "Uploading..." : "Add to Gallery"}
                                    </button>
                                </form>
                            </div>

                            {/* Product List */}
                            <div className={styles.card}>
                                <h2 className={styles.cardTitle}>Current Gallery ({products.length})</h2>
                                <div className={styles.list}>
                                    {loadingProducts ? <p>Loading...</p> : products.map(p => (
                                        <div key={p.id} className={styles.listItem}>
                                            <img src={p.image} alt={p.title} className={styles.thumb} />
                                            <div className={styles.details}>
                                                <h4>{p.title}</h4>
                                                <span>${p.price}</span>
                                            </div>
                                            <button onClick={() => handleDeleteProduct(p.id)} className={styles.deleteBtn}>
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))}
                                    {products.length === 0 && !loadingProducts && (
                                        <p className={styles.empty}>No products yet.</p>
                                    )}
                                </div>
                            </div>
                        </>
                    )}

                    {activeTab === 'content' && (
                        <div className={styles.fullWidthCard}>
                            <h2 className={styles.cardTitle}>Site Images Manager</h2>
                            {contentLoading ? <p>Loading content...</p> : (
                                <div className={styles.contentGrid}>

                                    {/* Hero Section */}
                                    <div className={styles.contentSection}>
                                        <h3>Hero Section</h3>
                                        <div className={styles.imagePreviewBox}>
                                            <img src={siteContent?.hero?.backgroundImage || '/assets/hero-bg.jpg'} alt="Hero" />
                                            <label className={styles.changeOverlay}>
                                                <input
                                                    type="file"
                                                    hidden
                                                    onChange={(e) => handleContentImageUpload('hero', 'backgroundImage', e.target.files[0])}
                                                />
                                                <span>Change Image</span>
                                            </label>
                                        </div>
                                    </div>

                                    {/* Customizer Section */}
                                    <div className={styles.contentSection}>
                                        <h3>Customizer Preview</h3>
                                        <div className={styles.imagePreviewBox}>
                                            <img src={siteContent?.customizer?.previewImage || '/assets/customizer-preview.png'} alt="Customizer" />
                                            <label className={styles.changeOverlay}>
                                                <input
                                                    type="file"
                                                    hidden
                                                    onChange={(e) => handleContentImageUpload('customizer', 'previewImage', e.target.files[0])}
                                                />
                                                <span>Change Image</span>
                                            </label>
                                        </div>
                                    </div>

                                    {/* Motion Section */}
                                    <div className={styles.contentSection}>
                                        <h3>Motion Art Section</h3>
                                        <div className={styles.imagePreviewBox}>
                                            {siteContent?.motion?.previewImage ? (
                                                <img src={siteContent.motion.previewImage} alt="Motion" />
                                            ) : (
                                                <div className={styles.emptyCmsPlaceholder}>No Image Set</div>
                                            )}
                                            <label className={styles.changeOverlay}>
                                                <input
                                                    type="file"
                                                    hidden
                                                    onChange={(e) => handleContentImageUpload('motion', 'previewImage', e.target.files[0])}
                                                />
                                                <span>Change Image</span>
                                            </label>
                                        </div>
                                    </div>

                                    {/* Quote Section */}
                                    {/* <div className={styles.contentSection}>
                                        <h3>Quote Background</h3>
                                         Using similar pattern if needed
                                    </div> */}

                                </div>
                            )}
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
