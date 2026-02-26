const fs = require('fs');
const path = require('path');

const targets = {
    'app/produits/page.jsx': 'produits',
    'app/produit/[slug]/page.jsx': 'produit_detail',
    'app/essentiel/page.jsx': 'essentiel',
    'app/usages/page.jsx': 'usages',
    'app/buraliste/page.jsx': 'buraliste',
    'app/transparence/page.jsx': 'transparence',
    'app/panier/page.jsx': 'panier',
    'app/checkout/page.jsx': 'checkout',
    'app/account/page.jsx': 'account',
    'app/cgv/page.jsx': 'cgv',
    'app/livraison/page.jsx': 'livraison',
    'app/privacy/page.jsx': 'privacy',
    'app/recrutement/page.jsx': 'recrutement'
};

const importPattern = /import \{ checkVisibility \} from '@\/lib\/services\/visibilityService';\n?/g;
const callPattern = /\s*await checkVisibility\('[a-z_]+'\);\n?/g;

for (const file of Object.keys(targets)) {
    const filePath = path.join(__dirname, '..', file);
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');

        if (content.match(importPattern) || content.match(callPattern)) {
            content = content.replace(importPattern, '');
            content = content.replace(callPattern, '');
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Cleaned: ${file}`);
        } else {
            console.log(`Skipped (not found): ${file}`);
        }
    } else {
        console.log(`File missing: ${file}`);
    }
}
