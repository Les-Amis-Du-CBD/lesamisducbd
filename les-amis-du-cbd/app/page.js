import PageBuilder from '@/components/PageBuilder';
import { promises as fs } from 'fs';
import path from 'path';

async function getData() {
  const filePath = path.join(process.cwd(), 'data', 'home.json');
  const fileContents = await fs.readFile(filePath, 'utf8');
  return JSON.parse(fileContents);
}

export default async function Home() {
  const data = await getData();

  return (
    <main>
      <PageBuilder sections={data.sections} />
    </main>
  );
}
