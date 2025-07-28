const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    'http://localhost:5173', // Vite dev server
    'http://localhost:3000'  // React dev server
  ],
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// In-memory database simulation with realistic data
const database = {
  users: [
    // Admin users
    {
      id: 1,
      email: 'admin@venturesroom.com',
      password_hash: '$2a$10$CwTycUXWue0Thq9StjUM0uJ8KJ8XWyDBOX0Q0dbWJOJOcJ3E3Weg6',
      full_name: 'Admin User',
      role: 'admin',
      is_approved: true,
      created_at: new Date().toISOString()
    },
    {
      id: 17,
      email: 'el.hamza.hamdani@gmail.com',
      password_hash: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password: 123456
      full_name: 'Hamza El Hamdani',
      phone: '+212-6-12-34-56-78',
      country: 'Morocco',
      role: 'admin',
      is_approved: true,
      bio: 'Platform Administrator and Project Owner',
      created_at: new Date().toISOString()
    },
    // 5 Client users
    {
      id: 2,
      email: 'client1@example.com',
      password_hash: '$2a$10$CwTycUXWue0Thq9StjUM0uJ8KJ8XWyDBOX0Q0dbWJOJOcJ3E3Weg6',
      full_name: 'Sarah Johnson',
      phone: '+1-555-0101',
      country: 'USA',
      role: 'client',
      is_approved: true,
      bio: 'Tech enthusiast and early adopter of innovative solutions.',
      created_at: new Date().toISOString()
    },
    {
      id: 3,
      email: 'client2@example.com',
      password_hash: '$2a$10$CwTycUXWue0Thq9StjUM0uJ8KJ8XWyDBOX0Q0dbWJOJOcJ3E3Weg6',
      full_name: 'Ahmed Ben Ali',
      phone: '+33-6-12-34-56-78',
      country: 'France',
      role: 'client',
      is_approved: true,
      bio: 'Digital transformation consultant looking for cutting-edge tools.',
      created_at: new Date().toISOString()
    },
    {
      id: 4,
      email: 'client3@example.com',
      password_hash: '$2a$10$CwTycUXWue0Thq9StjUM0uJ8KJ8XWyDBOX0Q0dbWJOJOcJ3E3Weg6',
      full_name: 'Maria Garcia',
      phone: '+34-600-123-456',
      country: 'Spain',
      role: 'client',
      is_approved: true,
      bio: 'Business owner interested in sustainable technology solutions.',
      created_at: new Date().toISOString()
    },
    {
      id: 5,
      email: 'client4@example.com',
      password_hash: '$2a$10$CwTycUXWue0Thq9StjUM0uJ8KJ8XWyDBOX0Q0dbWJOJOcJ3E3Weg6',
      full_name: 'John Smith',
      phone: '+44-7700-900123',
      country: 'UK',
      role: 'client',
      is_approved: true,
      bio: 'Investment advisor seeking innovative financial products.',
      created_at: new Date().toISOString()
    },
    {
      id: 6,
      email: 'client5@example.com',
      password_hash: '$2a$10$CwTycUXWue0Thq9StjUM0uJ8KJ8XWyDBOX0Q0dbWJOJOcJ3E3Weg6',
      full_name: 'Lisa Chen',
      phone: '+1-555-0105',
      country: 'Canada',
      role: 'client',
      is_approved: true,
      bio: 'Healthcare professional exploring digital health solutions.',
      created_at: new Date().toISOString()
    },
    // 5 Structure users
    {
      id: 7,
      email: 'techaccel@example.com',
      password_hash: '$2a$10$CwTycUXWue0Thq9StjUM0uJ8KJ8XWyDBOX0Q0dbWJOJOcJ3E3Weg6',
      full_name: 'Michael Roberts',
      phone: '+1-555-0201',
      country: 'USA',
      role: 'structure',
      is_approved: true,
      bio: 'Managing Director at TechStart Accelerator',
      created_at: new Date().toISOString()
    },
    {
      id: 8,
      email: 'greeninnovation@example.com',
      password_hash: '$2a$10$CwTycUXWue0Thq9StjUM0uJ8KJ8XWyDBOX0Q0dbWJOJOcJ3E3Weg6',
      full_name: 'Emma Thompson',
      phone: '+49-30-12345678',
      country: 'Germany',
      role: 'structure',
      is_approved: true,
      bio: 'Director of Green Innovation Hub',
      created_at: new Date().toISOString()
    },
    {
      id: 9,
      email: 'fintechventures@example.com',
      password_hash: '$2a$10$CwTycUXWue0Thq9StjUM0uJ8KJ8XWyDBOX0Q0dbWJOJOcJ3E3Weg6',
      full_name: 'David Park',
      phone: '+44-20-7946-0958',
      country: 'UK',
      role: 'structure',
      is_approved: true,
      bio: 'Partner at FinTech Ventures',
      created_at: new Date().toISOString()
    },
    {
      id: 10,
      email: 'healthtech@example.com',
      password_hash: '$2a$10$CwTycUXWue0Thq9StjUM0uJ8KJ8XWyDBOX0Q0dbWJOJOcJ3E3Weg6',
      full_name: 'Dr. Sophie Martin',
      phone: '+33-1-42-86-83-00',
      country: 'France',
      role: 'structure',
      is_approved: true,
      bio: 'Medical Director at HealthTech Incubator',
      created_at: new Date().toISOString()
    },
    {
      id: 11,
      email: 'corporateinnovation@example.com',
      password_hash: '$2a$10$CwTycUXWue0Thq9StjUM0uJ8KJ8XWyDBOX0Q0dbWJOJOcJ3E3Weg6',
      full_name: 'Robert Johnson',
      phone: '+1-555-0205',
      country: 'USA',
      role: 'structure',
      is_approved: true,
      bio: 'Head of Corporate Innovation at Innovation Labs',
      created_at: new Date().toISOString()
    },
    // 5 Startup users
    {
      id: 12,
      email: 'founder1@aianalytics.com',
      password_hash: '$2a$10$CwTycUXWue0Thq9StjUM0uJ8KJ8XWyDBOX0Q0dbWJOJOcJ3E3Weg6',
      full_name: 'Alex Chen',
      phone: '+1-555-0301',
      country: 'USA',
      role: 'startup',
      is_approved: true,
      bio: 'AI Engineer and Founder of AI Analytics Pro',
      created_at: new Date().toISOString()
    },
    {
      id: 13,
      email: 'founder2@ecotrack.com',
      password_hash: '$2a$10$CwTycUXWue0Thq9StjUM0uJ8KJ8XWyDBOX0Q0dbWJOJOcJ3E3Weg6',
      full_name: 'Elena Rodriguez',
      phone: '+49-30-87654321',
      country: 'Germany',
      role: 'startup',
      is_approved: true,
      bio: 'Environmental Engineer and Co-founder of EcoTrack Solutions',
      created_at: new Date().toISOString()
    },
    {
      id: 14,
      email: 'founder3@fintech.com',
      password_hash: '$2a$10$CwTycUXWue0Thq9StjUM0uJ8KJ8XWyDBOX0Q0dbWJOJOcJ3E3Weg6',
      full_name: 'James Wilson',
      phone: '+44-20-1234-5678',
      country: 'UK',
      role: 'startup',
      is_approved: true,
      bio: 'Financial Technology Expert and CEO of FinTech Pro',
      created_at: new Date().toISOString()
    },
    {
      id: 15,
      email: 'founder4@healthai.com',
      password_hash: '$2a$10$CwTycUXWue0Thq9StjUM0uJ8KJ8XWyDBOX0Q0dbWJOJOcJ3E3Weg6',
      full_name: 'Dr. Priya Patel',
      phone: '+1-555-0304',
      country: 'Canada',
      role: 'startup',
      is_approved: true,
      bio: 'Medical Doctor and AI Researcher, Founder of HealthAI',
      created_at: new Date().toISOString()
    },
    {
      id: 16,
      email: 'founder5@smartsec.com',
      password_hash: '$2a$10$CwTycUXWue0Thq9StjUM0uJ8KJ8XWyDBOX0Q0dbWJOJOcJ3E3Weg6',
      full_name: 'Mohamed Al-Rashid',
      phone: '+971-4-123-4567',
      country: 'UAE',
      role: 'startup',
      is_approved: true,
      bio: 'Cybersecurity Expert and Founder of SmartSec',
      created_at: new Date().toISOString()
    }
  ],
  
  structures: [
    {
      id: 1,
      user_id: 7,
      name: 'TechStart Accelerator',
      description: 'Leading technology accelerator focusing on AI, blockchain, and IoT startups. We provide mentorship, funding, and market access.',
      structure_type: 'accelerator',
      location: 'San Francisco, CA',
      established_year: 2018,
      focus_areas: ['AI/ML', 'Blockchain', 'IoT', 'SaaS'],
      logo_url: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200',
      is_approved: true,
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      user_id: 8,
      name: 'Green Innovation Hub',
      description: 'Sustainable technology incubator supporting environmental and clean energy startups worldwide.',
      structure_type: 'incubator',
      location: 'Berlin, Germany',
      established_year: 2020,
      focus_areas: ['CleanTech', 'Sustainability', 'Renewable Energy', 'Environmental'],
      logo_url: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=200',
      is_approved: true,
      created_at: new Date().toISOString()
    },
    {
      id: 3,
      user_id: 9,
      name: 'FinTech Ventures',
      description: 'Venture capital fund specializing in financial technology and digital banking solutions.',
      structure_type: 'vc_fund',
      location: 'London, UK',
      established_year: 2015,
      focus_areas: ['FinTech', 'Digital Banking', 'Payments', 'InsurTech'],
      logo_url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=200',
      is_approved: true,
      created_at: new Date().toISOString()
    },
    {
      id: 4,
      user_id: 10,
      name: 'HealthTech Incubator',
      description: 'Specialized incubator for healthcare and medical technology startups, providing clinical expertise and regulatory guidance.',
      structure_type: 'incubator',
      location: 'Paris, France',
      established_year: 2019,
      focus_areas: ['HealthTech', 'Medical Devices', 'Digital Health', 'Biotech'],
      logo_url: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=200',
      is_approved: true,
      created_at: new Date().toISOString()
    },
    {
      id: 5,
      user_id: 11,
      name: 'Corporate Innovation Labs',
      description: 'Corporate innovation arm focusing on emerging technologies and strategic partnerships with startups.',
      structure_type: 'corporate',
      location: 'New York, NY',
      established_year: 2016,
      focus_areas: ['Enterprise Software', 'Automation', 'Data Analytics', 'Cybersecurity'],
      logo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
      is_approved: true,
      created_at: new Date().toISOString()
    }
  ],

  startups: [
    {
      id: 1,
      user_id: 12,
      name: 'AI Analytics Pro',
      description: 'Advanced AI-powered analytics platform that helps businesses make data-driven decisions with real-time insights and predictive modeling.',
      industry: 'AI/ML',
      stage: 'Seed',
      location: 'San Francisco, CA',
      team_size: 8,
      total_funding: 500000,
      founded_date: '2023-01-15',
      logo_url: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200',
      website: 'https://aianalytics.com',
      is_approved: true,
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      user_id: 13,
      name: 'EcoTrack Solutions',
      description: 'Environmental monitoring platform using IoT sensors and satellite data to track environmental changes and support sustainability initiatives.',
      industry: 'Environment',
      stage: 'Series A',
      location: 'Berlin, Germany',
      team_size: 15,
      total_funding: 1200000,
      founded_date: '2022-06-10',
      logo_url: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=200',
      website: 'https://ecotrack.com',
      is_approved: true,
      created_at: new Date().toISOString()
    },
    {
      id: 3,
      user_id: 14,
      name: 'FinTech Pro',
      description: 'Next-generation digital banking platform with AI-powered financial planning, cryptocurrency integration, and seamless international payments.',
      industry: 'FinTech',
      stage: 'Series B',
      location: 'London, UK',
      team_size: 25,
      total_funding: 2500000,
      founded_date: '2021-11-20',
      logo_url: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=200',
      website: 'https://fintechpro.com',
      is_approved: true,
      created_at: new Date().toISOString()
    },
    {
      id: 4,
      user_id: 15,
      name: 'HealthAI Diagnostics',
      description: 'AI-powered medical diagnostics platform that assists healthcare professionals in early disease detection and treatment planning.',
      industry: 'HealthTech',
      stage: 'Seed',
      location: 'Toronto, Canada',
      team_size: 12,
      total_funding: 800000,
      founded_date: '2023-03-05',
      logo_url: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=200',
      website: 'https://healthai.com',
      is_approved: true,
      created_at: new Date().toISOString()
    },
    {
      id: 5,
      user_id: 16,
      name: 'SmartSec Solutions',
      description: 'Intelligent cybersecurity platform providing real-time threat detection, automated response, and comprehensive security analytics for enterprises.',
      industry: 'Cybersecurity',
      stage: 'Pre-Seed',
      location: 'Dubai, UAE',
      team_size: 6,
      total_funding: 250000,
      founded_date: '2023-08-12',
      logo_url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=200',
      website: 'https://smartsec.com',
      is_approved: true,
      created_at: new Date().toISOString()
    }
  ],

  products: [
    // AI Analytics Pro products
    {
      id: 1,
      startup_id: 1,
      name: 'Business Intelligence Dashboard',
      description: 'Comprehensive BI dashboard with real-time analytics, predictive modeling, and custom reporting features.',
      price: 299.99,
      category: 'Analytics',
      image_urls: ['https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400'],
      stock_quantity: 100,
      is_active: true,
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      startup_id: 1,
      name: 'AI Insights API',
      description: 'RESTful API providing AI-powered data insights and machine learning predictions for developers.',
      price: 99.99,
      category: 'API',
      image_urls: ['https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=400'],
      stock_quantity: 500,
      is_active: true,
      created_at: new Date().toISOString()
    },
    // EcoTrack Solutions products
    {
      id: 3,
      startup_id: 2,
      name: 'Environmental Monitor Pro',
      description: 'IoT-based environmental monitoring system with real-time air quality, noise, and temperature tracking.',
      price: 599.99,
      category: 'IoT',
      image_urls: ['https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=400'],
      stock_quantity: 50,
      is_active: true,
      created_at: new Date().toISOString()
    },
    {
      id: 4,
      startup_id: 2,
      name: 'Sustainability Analytics Platform',
      description: 'Cloud-based platform for tracking and analyzing environmental impact and sustainability metrics.',
      price: 199.99,
      category: 'Software',
      image_urls: ['https://images.unsplash.com/photo-1569163139394-de4e4f43e4e5?w=400'],
      stock_quantity: 200,
      is_active: true,
      created_at: new Date().toISOString()
    },
    // FinTech Pro products
    {
      id: 5,
      startup_id: 3,
      name: 'Digital Banking Suite',
      description: 'Complete digital banking solution with AI-powered financial planning and multi-currency support.',
      price: 499.99,
      category: 'FinTech',
      image_urls: ['https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400'],
      stock_quantity: 75,
      is_active: true,
      created_at: new Date().toISOString()
    },
    {
      id: 6,
      startup_id: 3,
      name: 'Crypto Payment Gateway',
      description: 'Secure cryptocurrency payment processing solution for e-commerce and retail businesses.',
      price: 149.99,
      category: 'Payments',
      image_urls: ['https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=400'],
      stock_quantity: 150,
      is_active: true,
      created_at: new Date().toISOString()
    },
    // HealthAI Diagnostics products
    {
      id: 7,
      startup_id: 4,
      name: 'AI Medical Scanner',
      description: 'AI-powered medical imaging analysis tool for early disease detection and diagnostic support.',
      price: 899.99,
      category: 'Medical',
      image_urls: ['https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400'],
      stock_quantity: 25,
      is_active: true,
      created_at: new Date().toISOString()
    },
    {
      id: 8,
      startup_id: 4,
      name: 'Health Analytics Dashboard',
      description: 'Comprehensive health data analytics platform for healthcare providers and medical researchers.',
      price: 399.99,
      category: 'Healthcare',
      image_urls: ['https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400'],
      stock_quantity: 100,
      is_active: true,
      created_at: new Date().toISOString()
    },
    // SmartSec Solutions products
    {
      id: 9,
      startup_id: 5,
      name: 'Enterprise Security Suite',
      description: 'Complete cybersecurity solution with threat detection, automated response, and compliance reporting.',
      price: 799.99,
      category: 'Security',
      image_urls: ['https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400'],
      stock_quantity: 30,
      is_active: true,
      created_at: new Date().toISOString()
    },
    {
      id: 10,
      startup_id: 5,
      name: 'Smart Threat Detector',
      description: 'Real-time threat detection system using AI and machine learning for proactive security monitoring.',
      price: 249.99,
      category: 'Security',
      image_urls: ['https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400'],
      stock_quantity: 80,
      is_active: true,
      created_at: new Date().toISOString()
    }
  ]
};

// Helper function to get user by token (simplified)
let currentUserId = null;

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    mode: 'enhanced-database-simulation',
    data_counts: {
      users: database.users.length,
      startups: database.startups.length,
      structures: database.structures.length,
      products: database.products.length
    }
  });
});

// Auth endpoints
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  const user = database.users.find(u => u.email === email);
  
  if (user && bcrypt.compareSync(password, user.password_hash)) {
    currentUserId = user.id; // Simple session simulation
    res.json({
      success: true,
      message: 'Logged in successfully',
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        is_approved: user.is_approved,
        country: user.country,
        phone: user.phone,
        bio: user.bio
      },
      token: `enhanced-token-${user.id}-${Date.now()}`
    });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

app.post('/api/auth/register', (req, res) => {
  const { email, password, full_name, role, phone, country, bio } = req.body;
  
  if (database.users.find(u => u.email === email)) {
    return res.status(400).json({ error: 'Email already exists' });
  }
  
  const hashedPassword = bcrypt.hashSync(password, 10);
  const newUser = {
    id: database.users.length + 1,
    email,
    password_hash: hashedPassword,
    full_name,
    phone,
    country,
    role,
    is_approved: role === 'client',
    bio,
    created_at: new Date().toISOString()
  };
  
  database.users.push(newUser);
  
  res.status(201).json({
    success: true,
    message: role === 'client' 
      ? 'Account created successfully' 
      : 'Account created successfully. Awaiting admin approval.',
    user: {
      id: newUser.id,
      email: newUser.email,
      full_name: newUser.full_name,
      role: newUser.role,
      is_approved: newUser.is_approved
    },
    token: `enhanced-token-${newUser.id}-${Date.now()}`
  });
});

app.get('/api/auth/me', (req, res) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  const user = database.users.find(u => u.id === currentUserId);
  if (!user) {
    return res.status(401).json({ error: 'Invalid token' });
  }
  
  res.json({
    user: {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      role: user.role,
      is_approved: user.is_approved,
      country: user.country,
      phone: user.phone,
      bio: user.bio
    }
  });
});

// Startups endpoints
app.get('/api/startups', (req, res) => {
  const approvedStartups = database.startups
    .filter(startup => startup.is_approved)
    .map(startup => {
      const user = database.users.find(u => u.id === startup.user_id);
      return {
        ...startup,
        user: user ? { 
          full_name: user.full_name, 
          email: user.email,
          country: user.country,
          bio: user.bio 
        } : null
      };
    });
  
  res.json(approvedStartups);
});

app.get('/api/startups/:id', (req, res) => {
  const startup = database.startups.find(s => s.id === parseInt(req.params.id));
  if (!startup) {
    return res.status(404).json({ error: 'Startup not found' });
  }
  
  const user = database.users.find(u => u.id === startup.user_id);
  const products = database.products.filter(p => p.startup_id === startup.id);
  
  res.json({
    ...startup,
    user: user ? { 
      full_name: user.full_name, 
      email: user.email,
      country: user.country,
      bio: user.bio 
    } : null,
    products
  });
});

// Structures endpoints
app.get('/api/structures', (req, res) => {
  const approvedStructures = database.structures
    .filter(structure => structure.is_approved)
    .map(structure => {
      const user = database.users.find(u => u.id === structure.user_id);
      const linkedStartups = database.startups.filter(s => 
        // Simplified: assume each structure has one startup per position
        database.structures.findIndex(str => str.id === structure.id) === 
        database.startups.findIndex(st => st.id === s.id)
      );
      
      return {
        ...structure,
        user: user ? { 
          full_name: user.full_name, 
          email: user.email,
          country: user.country,
          bio: user.bio 
        } : null,
        startups_count: linkedStartups.length,
        linked_startups: linkedStartups
      };
    });
  
  res.json(approvedStructures);
});

// Products endpoints
app.get('/api/products', (req, res) => {
  const products = database.products
    .filter(product => product.is_active)
    .map(product => {
      const startup = database.startups.find(s => s.id === product.startup_id);
      return {
        ...product,
        startup: startup ? {
          id: startup.id,
          name: startup.name,
          logo_url: startup.logo_url,
          industry: startup.industry
        } : null
      };
    });
  
  res.json(products);
});

app.get('/api/products/:id', (req, res) => {
  const product = database.products.find(p => p.id === parseInt(req.params.id));
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  
  const startup = database.startups.find(s => s.id === product.startup_id);
  
  res.json({
    ...product,
    startup: startup ? {
      id: startup.id,
      name: startup.name,
      logo_url: startup.logo_url,
      industry: startup.industry
    } : null
  });
});

// Admin endpoints
app.get('/api/admin/stats', (req, res) => {
  res.json({
    total_users: database.users.length,
    total_startups: database.startups.length,
    total_structures: database.structures.length,
    total_products: database.products.length,
    pending_approvals: {
      startups: database.startups.filter(s => !s.is_approved).length,
      structures: database.structures.filter(s => !s.is_approved).length,
      users: database.users.filter(u => !u.is_approved && u.role !== 'client').length
    }
  });
});

// Catch all
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 VenturesRoom Enhanced Backend running on port ${PORT}`);
  console.log(`📖 Test API: http://localhost:${PORT}/health`);
  console.log(`🗄️  Mode: Enhanced Database Simulation`);
  console.log(`👥 Sample Data Loaded:`);
  console.log(`   - ${database.users.length} Users (5 clients, 5 structures, 5 startups, 1 admin)`);
  console.log(`   - ${database.startups.length} Startups`);
  console.log(`   - ${database.structures.length} Support Structures`);
  console.log(`   - ${database.products.length} Products`);
  console.log(`\n🔑 Test Credentials (password: password123):`);
  console.log(`   - Admin: admin@venturesroom.com`);
  console.log(`   - Client: client1@example.com`);
  console.log(`   - Startup: founder1@aianalytics.com`);
  console.log(`   - Structure: techaccel@example.com`);
});
