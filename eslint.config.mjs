import eslint from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier/flat';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['**/dist/**', '**/build/**', '**/coverage/**', '**/node_modules/**']
  },
  eslint.configs.recommended,
  tseslint.configs.recommended,
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest'
    },
    linterOptions: {
      reportUnusedDisableDirectives: 'error'
    }
  },
  {
    files: ['apps/frontend/src/**/*.{js,jsx,ts,tsx}'],
    extends: [reactHooks.configs.flat.recommended, reactRefresh.configs.vite]
  },
  eslintConfigPrettier
);
