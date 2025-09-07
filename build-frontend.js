
#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔨 Building frontend for deployment...');

try {
  // Install root dependencies first
  console.log('📦 Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });

  // Build using vite from root directory
  console.log('🏗️ Building frontend with Vite...');
  execSync('npx vite build', { stdio: 'inherit' });

  // Verify build output in client/dist
  const distDir = path.join(__dirname, 'client', 'dist');
  if (!fs.existsSync(distDir)) {
    throw new Error('Build failed - client/dist directory not created');
  }

  const indexFile = path.join(distDir, 'index.html');
  if (!fs.existsSync(indexFile)) {
    throw new Error('Build failed - index.html not found in client/dist');
  }

  console.log('✅ Frontend build completed successfully');
  console.log(`📁 Build output: ${distDir}`);

} catch (error) {
  console.error('❌ Frontend build failed:', error.message);
  process.exit(1);
}
