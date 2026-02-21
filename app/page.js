import PageBuilder from '@/components/PageBuilder';
import { promises as fs } from 'fs';
import path from 'path';
import { kv } from '@vercel/kv';

export const dynamic = 'force-dynamic';

async function getData() {
  try {
    const data = await kv.get('home_content');
    if (data && data.sections) {
      return data;
    }
  } catch (error) {
    console.error("Error reading from Vercel KV:", error);
  }

  // Fallback to local JSON if KV is empty or an error occurs
  const filePath = path.join(process.cwd(), 'data', 'home.json');
  const fileContents = await fs.readFile(filePath, 'utf8');
  return JSON.parse(fileContents);
}
import { SHARED_TITLE, SHARED_DESCRIPTION } from './shared-metadata';

export const metadata = {
  title: SHARED_TITLE.default,
  description: SHARED_DESCRIPTION,
  alternates: {
    canonical: '/',
  },
};

export default async function Home() {
  const data = await getData();

  return (
    <main>
      <PageBuilder sections={data.sections} />
    </main>
  );
}
