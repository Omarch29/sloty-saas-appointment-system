import type { Config } from 'tailwindcss'
import sharedConfig from '@sloty/config/tailwind'

const config: Config = {
  ...sharedConfig,
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
}

export default config
