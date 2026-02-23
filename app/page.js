import PageBuilder from '@/components/PageBuilder';
import { kv } from '@vercel/kv';
import homeData from '@/data/home.json';

export const dynamic = 'force-dynamic';

async function getData() {
  try {
    const data = await kv.get('home_content');
    if (data && data.sections && data.sections.length > 0) {
      return data;
    }
  } catch (error) {
    console.error("Error reading from Vercel KV:", error);
  }

  // Fallback to local JSON if KV is empty, malformed, or an error occurs
  return homeData;
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
