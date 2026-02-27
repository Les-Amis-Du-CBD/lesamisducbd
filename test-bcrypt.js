const bcrypt = require('bcryptjs');

async function testBcrypt() {
    const plain = "password123";
    const hash2a = await bcrypt.hash(plain, 10);
    console.log("Original 2a:", hash2a);

    // Simulate a $2y$ hash from PHP
    const phpHash = hash2a.replace(/^\$2a\$/, '$2y$');
    console.log("Simulated PHP hash:", phpHash);

    // To verify in Node:
    const hashToTest = phpHash.replace(/^\$2y\$/, '$2a$');
    console.log("Testing:", hashToTest);

    const isValid = await bcrypt.compare(plain, hashToTest);
    console.log("Valid?", isValid);
}
testBcrypt();
