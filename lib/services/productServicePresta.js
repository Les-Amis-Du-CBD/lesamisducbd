
// REAL API IMPLEMENTATION (PrestaShop)

const API_KEY = process.env.PRESTASHOP_API_KEY;
const API_URL = process.env.PRESTASHOP_API_URL;

export const productServicePresta = {
    async getProducts() {
        // TODO: Implement PrestaShop API Call
        // GET /api/products?display=full&output_format=JSON
        console.log('PrestaShop API: getProducts called');
        return [];
    },

    async createProduct(product) {
        // In our architecture, creation is done in PrestaShop BO usually.
        // But if we want to support it: POST /api/products
        console.log('PrestaShop API: createProduct called', product);
        return product;
    },

    async deleteProduct(id) {
        // Soft Delete: active = 0
        // PUT /api/products/{id}
        console.log('PrestaShop API: deleteProduct (Soft Disable) called for ID:', id);
        return true;
    },

    async updateProduct(id, updates) {
        // PUT /api/products/{id}
        console.log('PrestaShop API: updateProduct called for ID:', id, updates);
        return { ...updates, id };
    }
};
