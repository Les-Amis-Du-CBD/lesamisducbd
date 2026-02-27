import PageBuilder from '@/components/PageBuilder';
import { kv } from '@vercel/kv';
import homeData from '@/data/home.json';
import { productService } from '@/lib/services/productService';
import { SHARED_TITLE, SHARED_DESCRIPTION } from './shared-metadata';

export const revalidate = 60;

export const metadata = {
  title: SHARED_TITLE.default,
  description: SHARED_DESCRIPTION,
  alternates: {
    canonical: '/',
  },
};

async function getData() {
  try {
    const data = await kv.get('home_content');
    if (data && data.sections && data.sections.length > 0) return data;
  } catch (error) {
    console.error('Error reading from Vercel KV:', error);
  }
  return homeData;
}

/** Maps a vitrine pinned entry + PrestaShop product to a ProductList-compatible card object */
const toCard = (vitrineEntry, product) => ({
  name: product.name,
  slug: product.slug,
  image: product.image,
  quoteTitle: '',
  tag: vitrineEntry.badge || (product.onSale ? 'Promo' : ''),
  badgeColor: vitrineEntry.badgeColor || null,
  pillLeft: product.formattedPrice,
  pillRight: '',
  price: product.priceTTC,
  formattedPrice: product.formattedPrice,
  rawProduct: product // Passed down so ProductList client component can calculate group discounts
});

export default async function Home() {
  // Fetch CMS content, PrestaShop products and vitrine config in parallel
  const [data, allProducts, vitrineConfig, globalConfig] = await Promise.all([
    getData(),
    productService.getProducts().catch(() => []),
    kv.get('vitrine_config').catch(() => null),
    kv.get('global_content').catch(() => null)
  ]);

  const bySlug = Object.fromEntries(allProducts.map(p => [p.slug, p]));

  // ── Resolve flowers ──────────────────────────────────────────────
  let flowers = [];

  if (vitrineConfig?.flowers?.length > 0) {
    // Use admin-configured vitrine (KV)
    flowers = vitrineConfig.flowers
      .map(entry => bySlug[entry.slug] ? toCard(entry, bySlug[entry.slug]) : null)
      .filter(Boolean)
      .slice(0, 4);
  } else {
    // Fallback: hardcoded 4g flower selection
    const RESIN_KEYWORDS = ['hash', 'pollen', 'resin', 'résine', 'harsh', 'golden'];
    const isResin = (p) => RESIN_KEYWORDS.some(k => p.name.toLowerCase().includes(k));
    const FEATURED = ['super skunk', 'amn', 'gorilla', 'remedy'];
    const is4g = (p) => /\b4\s*g\b/i.test(p.name);
    const order = (p) => { const i = FEATURED.findIndex(k => p.name.toLowerCase().includes(k)); return i === -1 ? 999 : i; };

    flowers = allProducts
      .filter(p => !isResin(p) && is4g(p) && FEATURED.some(k => p.name.toLowerCase().includes(k)))
      .sort((a, b) => order(a) - order(b))
      .slice(0, 4)
      .map(p => toCard({}, p));
  }

  // ── Resolve resins ───────────────────────────────────────────────
  let resins = [];

  if (vitrineConfig?.resins?.length > 0) {
    // Use admin-configured vitrine (KV)
    resins = vitrineConfig.resins
      .map(entry => bySlug[entry.slug] ? toCard(entry, bySlug[entry.slug]) : null)
      .filter(Boolean)
      .slice(0, 4);
  } else {
    // Fallback: first resins found in catalogue
    const RESIN_KEYWORDS = ['hash', 'pollen', 'resin', 'résine', 'harsh', 'golden'];
    resins = allProducts
      .filter(p => RESIN_KEYWORDS.some(k => p.name.toLowerCase().includes(k)))
      .slice(0, 4)
      .map(p => toCard({}, p));
  }

  // ── Inject into sections ─────────────────────────────────────────
  const sections = data.sections.map(section => {
    if (section.id === 'featured-products' && flowers.length > 0) {
      return { ...section, props: { ...section.props, products: flowers } };
    }

    // Inject global content into Header and Footer
    if (section.type === 'Footer' && globalConfig) {
      return {
        ...section,
        props: {
          ...section.props,
          columnLinks: globalConfig.footerLinks || section.props.columnLinks,
          contactInfo: globalConfig.contact || section.props.contactInfo
        }
      };
    }

    // If you plan to apply global content to Header later (like phone number)
    if (section.type === 'Header' && globalConfig) {
      return { ...section };
    }

    return section;
  });

  // Insert resins section between WhyChooseUs and FAQ
  if (resins.length > 0) {
    const whyIdx = sections.findIndex(s => s.type === 'WhyChooseUs');
    if (whyIdx !== -1) {
      sections.splice(whyIdx + 1, 0, {
        id: 'resins-section',
        type: 'ProductList',
        props: {
          title: 'Nos résines phares, pour chaque moment.',
          description: 'Des résines de CBD soigneusement sélectionnées pour leur qualité et leur authenticité.<br />Black Harsh, Golden Pollen… chaque résine est un voyage pour les amateurs d\'expériences naturelles et pures.',
          linkLabel: 'Voir toutes les résines',
          linkHref: '/produits',
          products: resins,
        }
      });
    }
  }

  return (
    <main>
      <PageBuilder sections={sections} />
    </main>
  );
}
