import tseslint from 'typescript-eslint';

export default [
  {
    ignores: ['.next/**', 'coverage/**', 'node_modules/**'],
  },
  ...tseslint.configs.recommended,
];
