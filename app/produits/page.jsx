
import { productService } from '@/lib/services/productService';
import ProductsClient from './ProductsClient';

export const metadata = {
    title: 'Nos Fleurs CBD Premium | Les Amis du CBD',
    description: 'Découvrez notre sélection de fleurs de CBD françaises. Cultivées naturellement, sans ajout de terpènes chimiques. Livraison offerte.',
};

export default async function ProductsPage() {
    // Fetch products on the server for SEO
    const products = await productService.getProducts();

    return <ProductsClient initialProducts={products} />;
}
