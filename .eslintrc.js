module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'prettier',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'max-len': [
      'error',
      {
        code: 120,
        tabWidth: 2,
        ignoreUrls: true,
        ignoreComments: true,
        ignorePattern: '^import\\s.+\\sfrom\\s.+;$',
        ignoreTrailingComments: true,
      },
    ],
    'operator-linebreak': ['error', 'after'],
    'prefer-promise-reject-errors': 'warn',
    eqeqeq: 'warn',
    'object-curly-newline': [
      'error',
      {
        multiline: true,
        consistent: true,
      },
    ],
    '@typescript-eslint/quotes': [
      'error',
      'single',
      {
        avoidEscape: true,
        allowTemplateLiterals: true,
      },
    ],
    'require-await': 'off',
    '@typescript-eslint/require-await': 'warn',
    'no-return-await': 'off',
    '@typescript-eslint/return-await': 'warn',
    semi: 'off',
    '@typescript-eslint/semi': 'error',
  },
};
