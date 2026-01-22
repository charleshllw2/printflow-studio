import { promises as fs } from 'fs';
import path from 'path';

import Hero from "../components/Hero";
import Customizer from "../components/Customizer";
import Featured from "../components/Featured";
import QuoteSection from "../components/QuoteSection";
import Motion from '../components/Motion';

async function getContent() {
    const contentPath = path.join(process.cwd(), 'data', 'content.json');
    try {
        const data = await fs.readFile(contentPath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        return {};
    }
}

export default async function Home() {
    const content = await getContent();

    return (
        <main>
            <Hero content={content.hero} />
            <Customizer content={content.customizer} />
            <Motion content={content.motion} />
            <Featured />
            <QuoteSection />
        </main>
    );
}
