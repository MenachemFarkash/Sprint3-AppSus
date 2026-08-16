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
            'jsx-quotes': ['error', 'prefer-double'],
            semi: ['error', 'never'],
            'no-unused-vars': 'warn',
            'no-restricted-imports': ['error', {
                paths: [
                    { name: 'react', message: 'Use \'const { useX } = React\' instead of importing from react.' },
                    { name: 'react-router', message: 'Use \'const { useX } = ReactRouter\' instead of importing from react-router.' },
                    { name: 'react-router-dom', message: 'Use \'const { X } = ReactRouterDOM\' instead of importing from react-router-dom.' }
                ]
            }]
        }
    }
]
