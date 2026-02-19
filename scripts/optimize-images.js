const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '../public/images');

function getAllFiles(dirPath, arrayOfFiles) {
    const files = fs.readdirSync(dirPath);

    arrayOfFiles = arrayOfFiles || [];

    files.forEach(function (file) {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
        } else {
            arrayOfFiles.push(path.join(dirPath, "/", file));
        }
    });

    return arrayOfFiles;
}

async function optimizeImages() {
    const allFiles = getAllFiles(publicDir);
    const imageFiles = allFiles.filter(file => file.match(/\.(png|jpg|jpeg)$/i));

    console.log(`Found ${imageFiles.length} images to optimize.`);

    for (const file of imageFiles) {
        const ext = path.extname(file);
        const outputFile = file.replace(ext, '.webp');

        if (fs.existsSync(outputFile)) {
            // Skip if already exists to save time, or force overwrite if needed. 
            // For now, let's skip if newer? No, let's just overwrite to be sure.
        }

        try {
            const metadata = await sharp(file).metadata();
            // Resize if huge
            let pipeline = sharp(file);
            if (metadata.width > 1200) {
                pipeline = pipeline.resize(1200, null, { withoutEnlargement: true });
            }

            await pipeline
                .webp({ quality: 80 })
                .toFile(outputFile);

            const originalSize = fs.statSync(file).size / 1024;
            const newSize = fs.statSync(outputFile).size / 1024;

            console.log(`Optimized: ${path.basename(file)} (${originalSize.toFixed(0)}KB -> ${newSize.toFixed(0)}KB)`);

        } catch (err) {
            console.error(`Failed to optimize ${file}:`, err.message);
        }
    }
}

optimizeImages();
