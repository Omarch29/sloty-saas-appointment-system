/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./test/setup.ts'],
    exclude: [
      '**/node_modules/**',
      '**/e2e/**',
      '**/*.config.*',
    ],
    typecheck: {
      tsconfig: './test/tsconfig.json',
    },
  },
  resolve: {
    alias: {
      '@sloty/ui': resolve(__dirname, './packages/ui/src'),
      '@sloty/auth': resolve(__dirname, './packages/auth/src'),
      '@sloty/db': resolve(__dirname, './packages/db/src'),
      '@sloty/config': resolve(__dirname, './packages/config/src'),
    },
  },
})
