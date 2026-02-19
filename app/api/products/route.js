
import { NextResponse } from 'next/server';
import { productService } from '@/lib/services/productService';

export async function GET() {
    try {
        const products = await productService.getProducts();
        return NextResponse.json(products);
    } catch (error) {
        console.error('API /products Error:', error);
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const newProduct = await request.json();
        // The service handles the creation logic (Mock: push to JSON, Presta: POST API)
        const createdProduct = await productService.createProduct(newProduct);
        return NextResponse.json({ success: true, product: createdProduct });
    } catch (error) {
        console.error('API /products POST Error:', error);
        return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url);
        const name = searchParams.get('name'); // Using name as ID for now in Mock

        if (!name) return NextResponse.json({ error: 'Name required' }, { status: 400 });

        await productService.deleteProduct(name);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('API /products DELETE Error:', error);
        return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
    }
}
