import js from '@eslint/js'
import globals from 'globals'

export default [
    js.configs.recommended,
    {
        files: ['**/*.js', '**/*.jsx'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            parserOptions: {
                ecmaFeatures: { jsx: true }
            },
            globals: {
                ...globals.browser,
                React: 'readonly',
                ReactRouter: 'readonly',
                ReactRouterDOM: 'readonly'
            }
        },
        rules: {
            quotes: ['error', 'single'],
            semi: ['error', 'never'],
            'no-unused-vars': 'warn'
        }
    }
]
