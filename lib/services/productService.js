import { productServiceMock } from './productServiceMock';
import { productServicePresta } from './productServicePresta';

const dataSource = process.env.DATA_SOURCE || 'MOCK';

console.log(`[ProductService] Using Data Source: ${dataSource}`);

export const productService = dataSource === 'PRESTA'
    ? productServicePresta
    : productServiceMock;
