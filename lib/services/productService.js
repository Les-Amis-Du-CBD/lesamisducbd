
import { productServiceMock } from './productServiceMock';
import { productServicePresta } from './productServicePresta';

// Environment variable to switch data sources
// "MOCK" (default) or "PRESTA"
const DATA_SOURCE = process.env.DATA_SOURCE || 'MOCK';

console.log(`[ProductService] Using Data Source: ${DATA_SOURCE}`);

const getService = () => {
    if (DATA_SOURCE === 'PRESTA') {
        return productServicePresta;
    }
    return productServiceMock;
};

export const productService = getService();
