const fs = require('fs');
const path = require('path');

const directory = path.join(__dirname, 'client/src');

const replacements = [
    { regex: /text-red-\d{3}/g, replace: 'text-brand-primary' },
    { regex: /bg-red-\d{3}(\/\d+)?/g, replace: 'bg-brand-primary' },
    { regex: /border-red-\d{3}/g, replace: 'border-brand-primary' },
    { regex: /hover:text-red-\d{3}/g, replace: 'hover:text-brand-primary' },
    { regex: /hover:bg-red-\d{3}(\/\d+)?/g, replace: 'hover:bg-brand-primary' },
    { regex: /hover:border-red-\d{3}/g, replace: 'hover:border-brand-primary' },
    { regex: /shadow-red-\d{3}(\/\d+)?/g, replace: 'shadow-brand-primary' },
    { regex: /from-red-\d{3}(\/\d+)?/g, replace: 'from-brand-primary' },
    { regex: /to-red-\d{3}(\/\d+)?/g, replace: 'to-brand-primary' },
    { regex: /via-red-\d{3}(\/\d+)?/g, replace: 'via-brand-primary' },
    { regex: /ring-red-\d{3}/g, replace: 'ring-brand-primary' },
    { regex: /focus:ring-red-\d{3}/g, replace: 'focus:ring-brand-primary' },
    { regex: /focus:border-red-\d{3}/g, replace: 'focus:border-brand-primary' },
    // Also map dark colors (mostly zinc-900 or zinc-950) to brand-secondary if they represent primary dark backgrounds
    { regex: /bg-zinc-950/g, replace: 'bg-brand-secondary' },
    { regex: /text-zinc-950/g, replace: 'text-brand-secondary' }
];

function processDirectory(dir) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            processDirectory(fullPath);
        } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let modified = false;

            replacements.forEach(({ regex, replace }) => {
                if (regex.test(content)) {
                    content = content.replace(regex, replace);
                    modified = true;
                }
            });

            if (modified) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Updated: ${fullPath}`);
            }
        }
    }
}

processDirectory(directory);
console.log('Color replacement complete.');
