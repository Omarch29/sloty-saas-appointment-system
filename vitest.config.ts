import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./apps/web/src/test/setup.ts'],
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './apps/web/src'),
    },
  },
})
