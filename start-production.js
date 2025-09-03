#!/usr/bin/env node

// Simple production starter for Render deployment
import { spawn } from 'child_process';

// Set production environment
process.env.NODE_ENV = 'production';

// Start the production server
const server = spawn('node', ['dist/index.js'], {
  stdio: 'inherit',
  env: {
    ...process.env,
    NODE_ENV: 'production',
    PORT: process.env.PORT || '10000'
  }
});

server.on('error', (err) => {
  console.error('Failed to start production server:', err);
  process.exit(1);
});

server.on('close', (code) => {
  console.log(`Production server exited with code ${code}`);
  if (code !== 0) {
    process.exit(code);
  }
});
