module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    'plugin:vue/essential',
    'airbnb-base',
    'plugin:prettier/recommended', // 添加 prettier 插件
    'plugin:import/typescript'
    // 'plugin:@typescript-eslint/recommended' // ts 使用 eslint 插件检测语法
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    parser: '@typescript-eslint/parser',
    sourceType: 'module'
  },
  plugins: ['vue', '@typescript-eslint'],
  rules: {
    camelcase: ['error', { allow: ['parent_id'] }],
    'consistent-return': 0,
    'import/extensions': [
      'error',
      'always',
      {
        js: 'never',
        ts: 'never'
      }
    ],
    'import/no-cycle': 0,
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    'import/no-unresolved': 2,
    // 'no-console': 0,
    // 'no-debugger': 'warn',
    'no-restricted-syntax': 0,
    'no-shadow': 0,
    // 'no-unused-vars': ['error', { varsIgnorePattern: '[iI]gnored' }],
    'no-unused-vars': 0,
    'vue/multi-word-component-names': 0
  },
  settings: {
    'import/resolver': {
      alias: {
        map: [['@', './src']],
        extensions: ['.ts', '.js', '.jsx', '.json', '.vue']
      }
    }
  }
}
