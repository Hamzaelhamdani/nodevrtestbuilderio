const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:5174'
  ],
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    mode: 'mock' 
  });
});

// Mock auth endpoints
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // Test accounts
  const testAccounts = [
    { email: 'admin@venturesroom.com', password: 'password', role: 'admin' },
    { email: 'startup@venturesroom.com', password: 'password', role: 'startup' },
    { email: 'client@venturesroom.com', password: 'password', role: 'client' },
    { email: 'structure@venturesroom.com', password: 'password', role: 'structure' },
  ];
  
  const account = testAccounts.find(acc => acc.email === email && acc.password === password);
  
  if (account) {
    res.json({
      success: true,
      message: 'Logged in successfully',
      user: {
        id: `mock-${account.role}`,
        email: account.email,
        full_name: `Demo ${account.role.charAt(0).toUpperCase() + account.role.slice(1)}`,
        role: account.role,
        is_approved: true
      },
      token: `mock-token-${account.role}-${Date.now()}`
    });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

app.post('/api/auth/register', (req, res) => {
  const { email, full_name, role } = req.body;
  
  res.status(201).json({
    success: true,
    message: role === 'client' 
      ? 'Account created successfully' 
      : 'Account created successfully. Awaiting admin approval.',
    user: {
      id: `mock-${Date.now()}`,
      email,
      full_name,
      role,
      is_approved: role === 'client'
    },
    token: `mock-token-${role}-${Date.now()}`
  });
});

app.get('/api/auth/me', (req, res) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  res.json({
    user: {
      id: 'mock-user',
      email: 'demo@venturesroom.com',
      full_name: 'Demo User',
      role: 'client',
      is_approved: true
    }
  });
});

// Mock startups endpoint
app.get('/api/startups', (req, res) => {
  res.json([
    {
      id: "1",
      name: "AI Analytics Pro",
      description: "Advanced AI-powered analytics platform",
      logo_url: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200",
      website: "https://aianalytics.com",
      industry: "AI/ML",
      stage: "Seed",
      location: "San Francisco, CA"
    },
    {
      id: "2", 
      name: "EcoTrack Solutions",
      description: "Environmental monitoring platform",
      logo_url: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=200",
      website: "https://ecotrack.com",
      industry: "Environment",
      stage: "Series A",
      location: "Berlin, Germany"
    }
  ]);
});

// Mock products endpoint
app.get('/api/products', (req, res) => {
  res.json([
    {
      id: "1",
      name: "Business Intelligence Dashboard",
      description: "Comprehensive BI dashboard with real-time analytics",
      price: 299.99,
      category: "Analytics",
      image_urls: ["https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400"],
      startup: {
        id: "1",
        name: "AI Analytics Pro"
      }
    },
    {
      id: "2",
      name: "Environmental Monitor",
      description: "Real-time environmental data tracking",
      price: 199.99,
      category: "IoT",
      image_urls: ["https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=400"],
      startup: {
        id: "2",
        name: "EcoTrack Solutions"
      }
    }
  ]);
});

// Catch all
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 VenturesRoom Mock Backend running on port ${PORT}`);
  console.log(`📖 Test API: http://localhost:${PORT}/health`);
  console.log(`🎭 Mode: Mock (no database required)`);
  console.log(`🔑 Test accounts: admin@venturesroom.com / password`);
});
