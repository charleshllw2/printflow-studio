import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataPath = path.join(process.cwd(), 'data', 'featured.json');

function getProducts() {
    if (!fs.existsSync(dataPath)) {
        return [];
    }
    const fileParams = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(fileParams);
}

function saveProducts(products) {
    fs.writeFileSync(dataPath, JSON.stringify(products, null, 2));
}

export async function GET() {
    const products = getProducts();
    return NextResponse.json(products);
}

export async function POST(request) {
    try {
        const product = await request.json();
        const products = getProducts();

        // Assign new ID
        const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
        const newProduct = { ...product, id: newId };

        products.push(newProduct);
        saveProducts(products);

        return NextResponse.json(newProduct);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to add product' }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = parseInt(searchParams.get('id')); // Simple query param delete for now

        let products = getProducts();
        products = products.filter(p => p.id !== id);
        saveProducts(products);

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
    }
}
