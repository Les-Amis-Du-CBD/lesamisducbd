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

        if (newContent.includes('isVisible: globalContent?.visibility?.newsletter !== false')) {
            newContent = newContent.replace(
                `isVisible: globalContent?.visibility?.newsletter !== false`,
                ``
            );
            newContent = newContent.replace(`disclaimer: "Vous pouvez vous désinscrire à tout moment.",\n            `, `disclaimer: "Vous pouvez vous désinscrire à tout moment."`);
            updated = true;
        }

        if (newContent.includes('bannerVisible: globalContent?.visibility?.headerBanner !== false,')) {
            newContent = newContent.replace(
                `bannerVisible: globalContent?.visibility?.headerBanner !== false,`,
                ``
            );
            updated = true;
        }

        if (updated) {
            fs.writeFileSync(filePath, newContent, 'utf8');
            console.log(`Removed globalContent from ${filePath}`);
            filesToUpdate.push(filePath);
        }
    }
});

// Now we need to properly inject these inside the component itself.
filesToUpdate.forEach(filePath => {
    let content = fs.readFileSync(filePath, 'utf8');

    // Inject footerProps newsletter visibility inside the component render
    if (content.includes('const footerProps = {')) {
        content = content.replace(
            /const footerProps = {([^}]*)}/s,
            (match, props) => {
                if (match.includes('FOOTER_PROPS')) {
                    // It's probably spreading FOOTER_PROPS.
                    return match.replace(
                        `...FOOTER_PROPS,`,
                        `...FOOTER_PROPS,\n        newsletter: { ...FOOTER_PROPS.newsletter, isVisible: globalContent?.visibility?.newsletter !== false },`
                    );
                }
                return match;
            }
        );
    }

    // Inject headerProps banner visibility inside the component render
    if (content.includes('<Header {...HEADER_PROPS} />')) {
        content = content.replace(
            `<Header {...HEADER_PROPS} />`,
            `<Header {...HEADER_PROPS} bannerVisible={globalContent?.visibility?.headerBanner !== false} />`
        );
    }

    if (content.includes('<Header {...headerProps} />')) {
        content = content.replace(
            `const headerProps = {`,
            `const headerProps = {\n        bannerVisible: globalContent?.visibility?.headerBanner !== false,`
        );
    }

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed props in ${filePath}`);
});
