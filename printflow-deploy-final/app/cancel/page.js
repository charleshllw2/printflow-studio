"use client";
import Link from 'next/link';
import { XCircle } from 'lucide-react';

export default function Cancel() {
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
            <XCircle size={64} color="#ef4444" />
            <h1 style={{ fontSize: '32px', fontWeight: 'bold' }}>Order Cancelled</h1>
            <p style={{ color: '#888' }}>Your payment was not processed.</p>
            <Link href="/" style={{
                marginTop: '20px',
                padding: '12px 24px',
                background: 'rgba(255,255,255,0.1)',
                color: '#fff',
                borderRadius: '50px',
                fontWeight: '600',
                textDecoration: 'none'
            }}>
                Return to Shop
            </Link>
        </div>
    );
}
