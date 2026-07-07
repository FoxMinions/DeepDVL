import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import vue from 'eslint-plugin-vue'
import vueParser from 'vue-eslint-parser'

export default tseslint.config(
  { ignores: ['dist/**', 'node_modules/**', 'coverage/**', 'playwright-report/**', 'test-results/**'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tseslint.parser,
        extraFileExtensions: ['.vue'],
        sourceType: 'module',
      },
    },
    plugins: { vue },
    extends: [...vue.configs['flat/recommended']],
    rules: {
      'vue/multi-word-component-names': 'off',
    },
  },
  {
    files: ['eslint.config.ts', 'vite.config.ts'],
    languageOptions: {
      globals: { console: 'readonly' },
    },
  },
)
