"use client";
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export default function Success() {
    return (
        <div style={{
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#000',
            color: '#fff',
            gap: '20px'
        }}>
            <CheckCircle size={64} color="#4ade80" />
            <h1 style={{ fontSize: '32px', fontWeight: 'bold' }}>Payment Successful!</h1>
            <p style={{ color: '#888' }}>Thank you for your order. We'll start printing your masterpiece.</p>
            <Link href="/" style={{
                marginTop: '20px',
                padding: '12px 24px',
                background: '#fff',
                color: '#000',
                borderRadius: '50px',
                fontWeight: '600',
                textDecoration: 'none'
            }}>
                Back to Home
            </Link>
        </div>
    );
}
