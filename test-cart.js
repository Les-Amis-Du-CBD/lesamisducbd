async function testCart() {
    try {
        const res = await fetch('http://127.0.0.1:3000/api/checkout/prestashop', {
            method: 'POST',
            body: JSON.stringify({
                cart: [
                    { id: '12', quantity: 1, price: 10, variant: { id: 0 } }
                ]
            }),
            headers: { 'Content-Type': 'application/json' }
        });
        const data = await res.json();
        console.log("RESPONSE:", data);
    } catch (e) {
        console.error("ERROR:", e);
    }
}

testCart();
