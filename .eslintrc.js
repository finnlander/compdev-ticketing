/**
 * Project-wide ESlint configurations
 */
module.exports = {
    root: true,
    env: {
        es2021: true,
        'jest/globals': true,
    },
    extends: ['airbnb', 'airbnb-typescript', 'prettier'],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 13,
        sourceType: 'module',
        project: 'tsconfig.json',
        tsconfigRootDir: __dirname,
    },
    plugins: ['@typescript-eslint', 'prettier', 'jest'],
    rules: {
        // allow console logging (as there is no proper logging library required for this project)
        'no-console': 'off',
        // match indentation config between prettier and eslint
        indent: ['error', 4],
        // match parenthesis setting with prettier
        'function-paren-newline': 'off',
        '@typescript-eslint/indent': ['error', 4],
        'prettier/prettier': 'warn',
        // disable the base rule to let the typescript handle these properly
        'no-use-before-define': 'off',
        '@typescript-eslint/no-use-before-define': [
            'error',
            { functions: false, classes: false },
        ],
        'no-underscore-dangle': 'off',
        // Unify trailing commas with prettier's "es5" setting
        'comma-dangle': 'off',
        '@typescript-eslint/comma-dangle': [
            'error',
            {
                arrays: 'always-multiline',
                objects: 'always-multiline',
                imports: 'always-multiline',
                exports: 'always-multiline',
                functions: 'never',
                enums: 'always-multiline',
                generics: 'always-multiline',
                tuples: 'always-multiline',
            },
        ],
    },
    overrides: [
        {
            files: ['common/src/**/*.ts'],
            env: {
                browser: true,
                es2021: true,
            },
            rules: {
                'import/prefer-default-export': 'off',
            },
        },
        {
            files: ['client/src'],
            plugins: [
                'react',
                '@typescript-eslint',
                'prettier',
                'prettier/react',
            ],
            extends: [
                'plugin:react/recommended',
                'airbnb',
                'airbnb-typescript',
            ],
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
                ecmaVersion: 13,
                sourceType: 'module',
                project: 'tsconfig.json',
                tsconfigRootDir: __dirname,
            },
        },
    ],
};
