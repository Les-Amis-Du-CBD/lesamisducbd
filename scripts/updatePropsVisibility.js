const fs = require('fs');
const path = require('path');

const appDir = path.join(__dirname, '..', 'app');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
    });
}

const filesToUpdate = [];

walkDir(appDir, (filePath) => {
    if (filePath.endsWith('Client.jsx') || filePath.endsWith('page.js') || filePath.endsWith('page.jsx')) {
        const content = fs.readFileSync(filePath, 'utf8');

        let updated = false;
        let newContent = content;

        // Check for footerProps newsletter
        if (newContent.includes('newsletter: {') && newContent.includes('disclaimer: "Vous pouvez vous désinscrire à tout moment."') && !newContent.includes('isVisible: globalContent?.visibility?.newsletter')) {
            newContent = newContent.replace(
                `disclaimer: "Vous pouvez vous désinscrire à tout moment."`,
                `disclaimer: "Vous pouvez vous désinscrire à tout moment.",\n            isVisible: globalContent?.visibility?.newsletter !== false`
            );
            updated = true;
        }

        // Check for headerProps bannerVisible
        if (newContent.includes('const headerProps = {') && !newContent.includes('bannerVisible: globalContent?.visibility?.headerBanner')) {
            newContent = newContent.replace(
                `const headerProps = {`,
                `const headerProps = {\n        bannerVisible: globalContent?.visibility?.headerBanner !== false,`
            );
            updated = true;
        }

        if (updated) {
            fs.writeFileSync(filePath, newContent, 'utf8');
            console.log(`Updated props in ${filePath}`);
        }
    }
});
