module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/base',
    'plugin:vue/essential',
    'plugin:vue/strongly-recommended',
    'plugin:vue/recommended',
  ],
  parserOptions: {
    parser: 'babel-eslint',
  },
  rules: {
    'array-bracket-spacing': ['error', 'always'],
    'no-mixed-spaces-and-tabs': 'off',
    'vue/no-parsing-error': 'off',
    'arrow-spacing': 'error',
    'arrow-parens': ['error', 'as-needed'],
    'constructor-super': 'error',
    curly: ['error', 'multi-line'],
    indent: ['error', 2],
    'keyword-spacing': 'error',
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-const-assign': 'error',
    'no-duplicate-imports': 'error',
    'no-multiple-empty-lines': [2, { max: 2, maxEOF: 1 }],
    'no-this-before-super': 'error',
    'no-unreachable': 'error',
    'no-unused-vars': 0,
    'no-useless-escape': 0,
    'no-var': 'error',
    'object-curly-spacing': ['error', 'always'],
    'one-var': ['error', { var: 'never', let: 'never', const: 'never' }],
    'prefer-arrow-callback': 'error',
    'prefer-const': 'error',
    quotes: ['error', 'single', { allowTemplateLiterals: true }],
    semi: ['error', 'never'],
    'sort-imports': ['error', { ignoreDeclarationSort: true }],
    'space-before-function-paren': 'error',
    'valid-typeof': 'error',
    'vue/html-indent': ['error', 2],
    'vue/component-name-in-template-casing': [
      'error',
      'kebab-case',
      {
        ignores: ['router-link', 'router-view', 'transition'],
      },
    ],
  },
};
