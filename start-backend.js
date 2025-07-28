// Simple script to start the backend mock server
const { spawn } = require('child_process');

console.log('Starting VenturesRoom Mock Backend...');

const backend = spawn('node', ['backend/src/server-mock.js'], {
  env: { ...process.env, PORT: '5000' },
  detached: false,
  stdio: 'inherit'
});

backend.on('error', (err) => {
  console.error('Failed to start backend:', err);
});

backend.on('close', (code) => {
  console.log(`Backend process exited with code ${code}`);
});

// Keep the process running
process.on('SIGINT', () => {
  console.log('Shutting down backend...');
  backend.kill();
  process.exit();
});
