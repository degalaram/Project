#!/usr/bin/env node

import { build } from 'vite'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

console.log('🚀 Starting Vite build process...')

try {
  await build({
    // Use the existing vite config
    configFile: resolve(__dirname, 'vite.config.ts'),
    mode: 'production',
    logLevel: 'info'
  })
  console.log('✅ Build completed successfully!')
} catch (error) {
  console.error('❌ Build failed:', error)
  process.exit(1)
}
