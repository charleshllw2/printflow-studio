import { NextResponse } from 'next/server';
import { storage } from '../../../lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export async function POST(request) {
    const data = await request.formData();
    const file = data.get('file');

    if (!file) {
        return NextResponse.json({ success: false, message: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = new Uint8Array(bytes);

    // Create unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = `uploads/product-${uniqueSuffix}-${file.name}`;

    try {
        const storageRef = ref(storage, filename);
        const snapshot = await uploadBytes(storageRef, buffer);
        const url = await getDownloadURL(snapshot.ref);

        return NextResponse.json({ success: true, url });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({ success: false, message: "Upload failed: " + error.message }, { status: 500 });
    }
}
