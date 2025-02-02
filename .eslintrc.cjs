module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:tailwindcss/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh', 'import', 'tailwindcss'],
  rules: {
    'import/no-named-as-default': 'off',
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    semi: ['warn', 'never'],
    'jsx-quotes': ['warn', 'prefer-single'],
    quotes: ['warn', 'single'],
    'max-len': [
      'warn', 100, 2, {
        ignoreUrls: true,
        ignoreComments: false,
        ignoreRegExpLiterals: true,
        ignoreTemplateLiterals: true,
        ignoreStrings: true,
      }
    ],
    indent: ['warn', 2, { SwitchCase: 1, flatTernaryExpressions: true }],
    'import/order': [
      'warn',
      {
        'groups': [
          // First group: packages
          ['builtin', 'external'],
          // Second group: internal components
          ['internal', 'parent', 'sibling'],
          // Third group: types (e.g., types, interfaces)
          ['type'],
          // Fourth group: index files (could be your styles or default imports)
          ['index'],
        ],
        'newlines-between': 'always', // Ensure newlines between groups
        'alphabetize': {
          'order': 'asc', // Ascending order
          'caseInsensitive': true, // Case-insensitive sorting
        },
      }
    ],
    'import/no-unresolved': 'error',
    // Empty blocks
    'no-empty-function': 'off',

    // Spaces
    'func-call-spacing': ['warn', 'never'],
    'no-multi-spaces': 'warn',
    'arrow-spacing': 'warn',
    'comma-spacing': 'warn',
    'key-spacing': 'warn',
    'object-curly-spacing': ['warn', 'always'],
    'no-trailing-spaces': 'warn',
    'block-spacing': 'warn',

    // Smells
    'no-param-reassign': 'error',
    'no-eval': 'error',
    'no-extend-native': 'error',
    'no-duplicate-imports': 'error',
    'no-new-wrappers': 'error',
    'no-underscore-dangle': 'error',
    'no-var': 'error',
    'no-unreachable': 'error',
    'no-fallthrough': 'error',
    'one-var': ['error', 'never'],
    'no-whitespace-before-property': 'error',

    // Trailing commas
    'comma-dangle': ['warn', 'always-multiline'],

    // Rules unneeded by us
    'no-prototype-builtins': 'off',
    'tailwindcss/no-custom-classname': 'off',
  },
  settings: {
    'import/resolver': {
      typescript: {
        // This ensures that ESLint uses the paths defined in tsconfig.json
        project: './tsconfig.json',
      },
    },
  },
};
