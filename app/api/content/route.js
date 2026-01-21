import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

const contentFilePath = path.join(process.cwd(), 'data', 'content.json');

export async function GET() {
    try {
        const data = await fs.readFile(contentFilePath, 'utf8');
        return NextResponse.json(JSON.parse(data));
    } catch (error) {
        return NextResponse.json({ error: 'Failed to read content data' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const newContent = await request.json();

        // Read existing to merge (optional, but safer)
        const existingData = await fs.readFile(contentFilePath, 'utf8');
        const mergedContent = { ...JSON.parse(existingData), ...newContent };

        await fs.writeFile(contentFilePath, JSON.stringify(mergedContent, null, 2));
        return NextResponse.json({ success: true, content: mergedContent });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update content data' }, { status: 500 });
    }
}
