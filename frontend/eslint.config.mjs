import js from '@eslint/js';
import stylisticJs from '@stylistic/eslint-plugin-js';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist', 'node_modules'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true }
      ],
    },
  },
  {
    plugins: {
      '@stylistic/js': stylisticJs,
      '@typescript-eslint': tseslint.plugin,
      'simple-import-sort': simpleImportSort,
      
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'warn',
      '@stylistic/js/semi': 'error',
      '@stylistic/js/indent': ['error', 2],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@stylistic/js/quotes': ['error', 'single'],
      '@stylistic/js/no-multi-spaces': 'error',
      '@stylistic/js/arrow-spacing': 'error',
      '@stylistic/js/comma-dangle': ['error', {
        objects: 'always-multiline',
      }],
      '@stylistic/js/object-curly-spacing': ['error', 'always'],
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      'no-console': 'warn',
    },
  }
);
