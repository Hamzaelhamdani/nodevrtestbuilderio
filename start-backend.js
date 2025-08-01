// Start the real backend server with tsx
const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting VenturesRoom Backend Server...');

const backendPath = path.join(__dirname, 'backend');
console.log('📁 Backend directory:', backendPath);

const backend = spawn('npm', ['run', 'dev'], {
  cwd: backendPath,
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, PORT: '5003' }
});

backend.on('error', (err) => {
  console.error('❌ Failed to start backend:', err);
});

backend.on('close', (code) => {
  console.log(`🛑 Backend process exited with code ${code}`);
});

// Keep the process running
process.on('SIGINT', () => {
  console.log('🛑 Shutting down backend...');
  backend.kill();
  process.exit();
});
