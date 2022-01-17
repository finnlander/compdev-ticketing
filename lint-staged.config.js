const { ESLint } = require('eslint');

/* Helper Functions */

const removeIgnoredFiles = async (files) => {
    const eslint = new ESLint();
    const isIgnored = await Promise.all(
        files.map((file) => eslint.isPathIgnored(file))
    );
    const filteredFiles = files.filter((_, i) => !isIgnored[i]);
    return filteredFiles.join(' ');
};

/* Exported tasks */

module.exports = {
    // Always lint everything on change (move this into a service-specific config, if it becomes a bottleneck).
    '*.{ts,tsx}': async (files) => {
        const filesToLint = await removeIgnoredFiles(files);
        return [`eslint --max-warnings=0 ${filesToLint}`];
    },
    // Run typescript compilation dry-run on each of the projects that has changed files.
    'auth/**/*.ts?': () => {
        return ['tsc --skipLibCheck --noEmit -p auth'];
    },
    'client/**/*.ts(x)?': () => {
        return ['tsc --skipLibCheck --noEmit -p client'];
    },
    'common/**/*.ts?': () => {
        return ['tsc --skipLibCheck --noEmit -p common'];
    },
    'expiration/**/*.ts?': () => {
        return ['tsc --skipLibCheck --noEmit -p expiration'];
    },
    'orders/**/*.ts?': () => {
        return ['tsc --skipLibCheck --noEmit -p orders'];
    },
    'payments/**/*.ts?': () => {
        return ['tsc --skipLibCheck --noEmit -p payments'];
    },
    'tickets/**/*.ts?': () => {
        return ['tsc --skipLibCheck --noEmit -p tickets'];
    },
};
