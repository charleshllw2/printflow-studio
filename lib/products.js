import fs from 'fs';
import path from 'path';

const dataPath = path.join(process.cwd(), 'data', 'featured.json');

export function getFeaturedProducts() {
    if (!fs.existsSync(dataPath)) {
        return [];
    }
    try {
        const fileParams = fs.readFileSync(dataPath, 'utf8');
        return JSON.parse(fileParams);
    } catch (err) {
        console.error('Error reading featured products:', err);
        return [];
    }
}
