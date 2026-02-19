
import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data/home.json');

function getHomeData() {
    // Re-read file every time to get fresh data
    const fileContent = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(fileContent);
}

function saveHomeData(data) {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
}

// MOCK IMPLEMENTATION (Reads/Writes to data/home.json)
export const productServiceMock = {
    async getProducts() {
        const data = getHomeData();
        const section = data.sections.find(s => s.id === 'featured-products');
        if (!section) return [];

        // Ensure every product has an ID
        return section.props.products.map(p => ({
            ...p,
            id: p.id || p.slug || p.name // Fallback ID generation
        }));
    },

    async createProduct(product) {
        const data = getHomeData();
        const sectionIndex = data.sections.findIndex(s => s.id === 'featured-products');

        if (sectionIndex === -1) throw new Error('Product section not found');

        // Allow passing an image URL directly (from Cloudinary)
        // ensure ID or unique key if possible, for now we use name as key in this JSON structure
        data.sections[sectionIndex].props.products.push(product);
        saveHomeData(data);
        return product;
    },

    async deleteProduct(idOrName) {
        // In Mock (JSON), we delete physically because we don't have an 'active' flag schema yet
        // and we want visual feedback in the dev environment.
        const data = getHomeData();
        const sectionIndex = data.sections.findIndex(s => s.id === 'featured-products');

        if (sectionIndex !== -1) {
            data.sections[sectionIndex].props.products = data.sections[sectionIndex].props.products.filter(p => p.name !== idOrName);
            saveHomeData(data);
        }
        return true;
    },

    async updateProduct(idOrName, updates) {
        const data = getHomeData();
        const sectionIndex = data.sections.findIndex(s => s.id === 'featured-products');

        if (sectionIndex === -1) return null;

        const products = data.sections[sectionIndex].props.products;
        const productIndex = products.findIndex(p => p.name === idOrName);

        if (productIndex !== -1) {
            products[productIndex] = { ...products[productIndex], ...updates };
            saveHomeData(data);
            return products[productIndex];
        }
        return null;
    }
};
