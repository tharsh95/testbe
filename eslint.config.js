import js from '@eslint/js';

export default [
  {
    ignores: [
      'node_modules/',
      'docs/',
      'dist/',
      'coverage/',
    ],
  },
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'commonjs',
    },
    rules: {
      // Add your preferred rules here
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'eqeqeq': ['error', 'always'],
      'curly': ['error', 'all'],
    },
  },
];