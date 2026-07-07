import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import vue from 'eslint-plugin-vue'
import vueParser from 'vue-eslint-parser'

export default tseslint.config(
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'coverage/**',
      'playwright-report/**',
      'test-results/**',
      'public/**',
      'eslint.config.d.ts',
      'eslint.config.js',
      'vite.config.d.ts',
      'vite.config.js',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['src/**/*.{ts,vue}'],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tseslint.parser,
        extraFileExtensions: ['.vue'],
        sourceType: 'module',
        globals: { ...globals.browser },
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
      globals: {
        ...globals.node,
        console: 'readonly',
      },
    },
  },
)
