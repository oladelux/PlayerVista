module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
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
        ignoreStrings: true
      }
    ],
    indent: ['warn', 2, { SwitchCase: 1, flatTernaryExpressions: true }],
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
    'no-prototype-builtins': 'off'
  },
}
