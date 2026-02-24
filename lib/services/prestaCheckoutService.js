// PrestaShop Checkout Service
// Handles the creation of Customers, Addresses, Carts, and Orders via the PrestaShop WebService API.

import { v4 as uuidv4 } from 'uuid';

const getPrestaConfig = () => {
    const url = process.env.PRESTASHOP_API_URL;
    const key = process.env.PRESTASHOP_API_KEY;
    if (!url || !key) {
        console.warn('[PrestaCheckoutService] PrestaShop configuration is missing in environment variables.');
    }
    return { url, key };
};

/**
 * Helper to perform POST/PUT requests to PrestaShop API with XML content.
 * PrestaShop WebService generally requires XML for writes.
 */
const fetchPrestaXml = async (endpoint, xmlString, method = 'POST') => {
    const { url, key } = getPrestaConfig();
    if (!url || !key) throw new Error("Missing PrestaShop API config");

    const finalUrl = `${url}${endpoint}?ws_key=${key}&output_format=JSON`;

    try {
        console.log(`[PrestaCheckoutService] ${method} to ${finalUrl}`);
        // console.log(`Payload:`, xmlString);

        const response = await fetch(finalUrl, {
            method,
            headers: {
                'Content-Type': 'application/xml',
                'Accept': 'application/json'
            },
            body: xmlString
        });

        const responseText = await response.text();
        let data = null;
        try { data = JSON.parse(responseText); } catch (_) { }

        if (!response.ok) {
            console.error(`[PrestaCheckoutService] Error ${response.status}. Raw response:`, responseText);
            throw new Error(`PrestaShop API error: ${response.status} — ${responseText.substring(0, 300)}`);
        }

        return data;
    } catch (error) {
        console.error(`[PrestaCheckoutService] Request failed:`, error.message);
        throw error;
    }
};

/**
 * Escapes characters for XML to prevent parsing errors.
 */
const escapeXml = (unsafe) => {
    if (!unsafe) return '';
    return String(unsafe).replace(/[<>&'"]/g, (c) => {
        switch (c) {
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '&': return '&amp;';
            case '\'': return '&apos;';
            case '"': return '&quot;';
            default: return c;
        }
    });
};

export const prestaCheckoutService = {
    // --- CUSTOMERS ---

    /**
     * Retrieves a customer by email. Returns the customer ID if found.
     */
    async getCustomerByEmail(email) {
        if (!email) return null;
        try {
            const { url, key } = getPrestaConfig();
            const fetchUrl = `${url}/customers?ws_key=${key}&output_format=JSON&filter[email]=${email}`;
            const res = await fetch(fetchUrl);
            const data = await res.json();

            if (data?.customers?.length > 0) {
                return data.customers[0].id;
            }
            return null;
        } catch (err) {
            console.error('[PrestaCheckoutService] Error finding customer:', err);
            return null;
        }
    },

    /**
     * Creates a new customer (or guest) in PrestaShop.
     */
    async createGuestCustomer(userData) {
        // 1. Check if they already exist
        const existingId = await this.getCustomerByEmail(userData.email);
        if (existingId) return existingId;

        // 2. Generate random password for guest (PrestaShop requires one)
        const password = uuidv4().slice(0, 10);

        // 3. Prepare XML
        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<prestashop xmlns:xlink="http://www.w3.org/1999/xlink">
    <customer>
        <id_default_group>3</id_default_group> <!-- 3 is usually Customer group -->
        <passwd><![CDATA[${password}]]></passwd>
        <lastname><![CDATA[${escapeXml(userData.lastname || 'Guest')}]]></lastname>
        <firstname><![CDATA[${escapeXml(userData.firstname || 'User')}]]></firstname>
        <email><![CDATA[${escapeXml(userData.email)}]]></email>
        <is_guest>1</is_guest>
        <active>1</active>
    </customer>
</prestashop>`;

        const res = await fetchPrestaXml('/customers', xml, 'POST');
        if (res?.customer?.id) {
            return res.customer.id;
        }

        throw new Error("Failed to create customer");
    },

    // --- ADDRESSES ---

    /**
     * Creates an address for a specific customer in PrestaShop.
     */
    async createAddress(customerId, addressData) {
        if (!customerId) throw new Error("Customer ID required for address");

        // Use default IDs if not provided (e.g., France = 8 for country_id)
        const countryId = addressData.country_id || 8;
        const alias = addressData.alias || 'Mon Adresse';

        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<prestashop xmlns:xlink="http://www.w3.org/1999/xlink">
    <address>
        <id_customer>${customerId}</id_customer>
        <id_country>${countryId}</id_country>
        <alias><![CDATA[${escapeXml(alias)}]]></alias>
        <lastname><![CDATA[${escapeXml(addressData.lastname)}]]></lastname>
        <firstname><![CDATA[${escapeXml(addressData.firstname)}]]></firstname>
        <address1><![CDATA[${escapeXml(addressData.address1)}]]></address1>
        <address2><![CDATA[${escapeXml(addressData.address2 || '')}]]></address2>
        <postcode><![CDATA[${escapeXml(addressData.postcode)}]]></postcode>
        <city><![CDATA[${escapeXml(addressData.city)}]]></city>
        <phone><![CDATA[${escapeXml(addressData.phone || '')}]]></phone>
        <company><![CDATA[${escapeXml(addressData.company || '')}]]></company>
    </address>
</prestashop>`;

        const res = await fetchPrestaXml('/addresses', xml, 'POST');
        if (res?.address?.id) {
            return res.address.id;
        }

        throw new Error("Failed to create address");
    },

    // --- CARTS ---

    /**
     * Creates a new cart in PrestaShop.
     */
    async createCart(customerId = 0, addressId = 0, cartItems) {
        if (!cartItems || cartItems.length === 0) {
            throw new Error("Missing required parameters for cart creation (cartItems empty)");
        }

        const idCurrency = 1; // 1 is usually EUR

        // Build Cartesian rows for products
        const cartRowsXml = cartItems.map(item => `
            <cart_row>
                <id_product>${item.id}</id_product>
                <id_product_attribute>${item.variant?.id || 0}</id_product_attribute>
                <id_address_delivery>${addressId}</id_address_delivery>
                <quantity>${item.quantity}</quantity>
            </cart_row>
        `).join('\n');

        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<prestashop xmlns:xlink="http://www.w3.org/1999/xlink">
    <cart>
        <id_customer>${customerId}</id_customer>
        <id_address_delivery>${addressId}</id_address_delivery>
        <id_address_invoice>${addressId}</id_address_invoice>
        <id_currency>${idCurrency}</id_currency>
        <id_lang>1</id_lang> <!-- 1 is usually French -->
        <associations>
            <cart_rows>
                ${cartRowsXml}
            </cart_rows>
        </associations>
    </cart>
</prestashop>`;

        const res = await fetchPrestaXml('/carts', xml, 'POST');
        if (res?.cart?.id) {
            return res.cart.id;
        }

        throw new Error("Failed to create cart");
    },

    // --- ORDERS ---

    /**
     * Creates a new order in PrestaShop based on a Cart ID.
     */
    async createOrder({ cartId, customerId, addressId, totalPaid }) {
        if (!cartId || !customerId || !addressId || totalPaid === undefined) {
            throw new Error("Missing parameters for order creation");
        }

        const idCurrency = 1; // EUR
        const idLang = 1; // French
        const currentStatusId = 2; // "Payment accepted" — more compatible status
        const moduleName = 'ps_wirepayment';
        const paymentMethod = 'Virement bancaire';

        // A secure_key is required by PrestaShop for orders — generate one via MD5-like random hex
        const secureKey = Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

        // Format prices to 6 decimal places as PS expects
        const price = parseFloat(totalPaid).toFixed(6);

        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<prestashop xmlns:xlink="http://www.w3.org/1999/xlink">
    <order>
        <id_address_delivery>${addressId}</id_address_delivery>
        <id_address_invoice>${addressId}</id_address_invoice>
        <id_cart>${cartId}</id_cart>
        <id_currency>${idCurrency}</id_currency>
        <id_lang>${idLang}</id_lang>
        <id_customer>${customerId}</id_customer>
        <id_carrier>1</id_carrier>
        <id_shop_group>1</id_shop_group>
        <id_shop>1</id_shop>
        <secure_key>${secureKey}</secure_key>
        <current_state>${currentStatusId}</current_state>
        <module><![CDATA[${moduleName}]]></module>
        <payment><![CDATA[${paymentMethod}]]></payment>
        <recyclable>0</recyclable>
        <gift>0</gift>
        <mobile_theme>0</mobile_theme>
        <total_discounts>0.000000</total_discounts>
        <total_discounts_tax_incl>0.000000</total_discounts_tax_incl>
        <total_discounts_tax_excl>0.000000</total_discounts_tax_excl>
        <total_paid>${price}</total_paid>
        <total_paid_tax_incl>${price}</total_paid_tax_incl>
        <total_paid_tax_excl>${price}</total_paid_tax_excl>
        <total_paid_real>${price}</total_paid_real>
        <total_products>${price}</total_products>
        <total_products_wt>${price}</total_products_wt>
        <total_shipping>0.000000</total_shipping>
        <total_shipping_tax_incl>0.000000</total_shipping_tax_incl>
        <total_shipping_tax_excl>0.000000</total_shipping_tax_excl>
        <total_wrapping>0.000000</total_wrapping>
        <total_wrapping_tax_incl>0.000000</total_wrapping_tax_incl>
        <total_wrapping_tax_excl>0.000000</total_wrapping_tax_excl>
        <conversion_rate>1.000000</conversion_rate>
    </order>
</prestashop>`;

        const res = await fetchPrestaXml('/orders', xml, 'POST');
        if (res?.order?.id) {
            return {
                orderId: res.order.id,
                reference: res.order.reference
            };
        }

        throw new Error("Failed to create order — PS did not return an order ID");
    }
};
