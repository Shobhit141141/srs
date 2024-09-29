import prettierConfig from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';

export default [
  {
    ignores: ['node_modules'], // Ignoring specific folders
  },
  {
    files: ['**/*.js', '**/*.mjs'], // Specify the file types to lint
    plugins: {
      prettier: prettierPlugin, // Prettier plugin
    },
    languageOptions: {
      ecmaVersion: 'latest', // ECMAScript version
      sourceType: 'module', // ES Modules
    },
    rules: {
      ...prettierConfig.rules, // Import Prettier's rules
      'prettier/prettier': 'error', // Show Prettier formatting issues as ESLint errors
      'no-console': 'off', // Customize other rules if needed
      'prettier/prettier': [
        'error',
        {
          endOfLine: 'auto',
          printWidth: 80,
          singleQuote: true,
          trailingComma: 'es5',
        },
      ], // Prettier formatting rules
      'no-console': 'off', // Allow console logs during development
      'no-unused-vars': 'warn', // Warn on unused variables
      'no-multiple-empty-lines': ['error', { max: 1 }], // Limit multiple empty lines
      'eol-last': ['error', 'always'], // Enforce newline at end of file
      'no-trailing-spaces': 'error', // Disallow trailing whitespace at the end of lines
      indent: ['error', 2], // Enforce 2 spaces for indentation
    },
  },
];
