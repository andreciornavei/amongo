module.exports = {
  extends: ['alloy', 'alloy/typescript', 'prettier'],
  rules: {
    '@typescript-eslint/consistent-type-definitions': 'off',
    'max-params': 'off',
  },
  env: {
    node: true,
  },
};
