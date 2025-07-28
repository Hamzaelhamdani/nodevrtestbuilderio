const bcrypt = require('bcryptjs');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Path to SQLite database file (always in project root)
const dbPath = path.resolve(__dirname, '../../venturesroom.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Could not connect to SQLite database:', err.message);
    process.exit(-1);
  }
});

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data (except admin)
    db.run('DELETE FROM commissions');
    db.run('DELETE FROM vip_club_discounts');
    db.run('DELETE FROM startup_structure_links');
    db.run('DELETE FROM orders');
    db.run('DELETE FROM products');
    db.run('DELETE FROM startups');
    db.run('DELETE FROM structures');
    db.run("DELETE FROM users WHERE role != 'admin'");

    // Hash password for all test users
    const hashedPassword = await bcrypt.hash('password123', 10);

    // 1. Create 5 Client Users
    console.log('📝 Creating client users...');
    const clientUsers = [
      {
        email: 'client1@example.com',
        full_name: 'Sarah Johnson',
        phone: '+1-555-0101',
        country: 'USA',
        bio: 'Tech enthusiast and early adopter of innovative solutions.'
      },
      {
        email: 'client2@example.com',
        full_name: 'Ahmed Ben Ali',
        phone: '+33-6-12-34-56-78',
        country: 'France',
        bio: 'Digital transformation consultant looking for cutting-edge tools.'
      },
      {
        email: 'client3@example.com',
        full_name: 'Maria Garcia',
        phone: '+34-600-123-456',
        country: 'Spain',
        bio: 'Business owner interested in sustainable technology solutions.'
      },
      {
        email: 'client4@example.com',
        full_name: 'John Smith',
        phone: '+44-7700-900123',
        country: 'UK',
        bio: 'Investment advisor seeking innovative financial products.'
      },
      {
        email: 'client5@example.com',
        full_name: 'Lisa Chen',
        phone: '+1-555-0105',
        country: 'Canada',
        bio: 'Healthcare professional exploring digital health solutions.'
      }
    ];

    const clientIds = [];
    for (const client of clientUsers) {
      db.run(
        `INSERT INTO users (email, password_hash, full_name, phone, country, role, is_approved, bio, created_at) 
         VALUES (?, ?, ?, ?, ?, 'client', true, ?, CURRENT_TIMESTAMP)`,
        [client.email, hashedPassword, client.full_name, client.phone, client.country, client.bio],
        function(err) {
          if (err) {
            console.error('Error inserting client user:', err);
            return;
          }
          clientIds.push(this.lastID);
        }
      );
    }

    // 2. Create 5 Support Structure Users and Structures
    console.log('🏢 Creating support structure users and organizations...');
    const structureUsers = [
      {
        email: 'techaccel@example.com',
        full_name: 'Michael Roberts',
        phone: '+1-555-0201',
        country: 'USA',
        bio: 'Managing Director at TechStart Accelerator',
        structure: {
          name: 'TechStart Accelerator',
          description: 'Leading technology accelerator focusing on AI, blockchain, and IoT startups. We provide mentorship, funding, and market access.',
          structure_type: 'accelerator',
          location: 'San Francisco, CA',
          established_year: 2018,
          focus_areas: ['AI/ML', 'Blockchain', 'IoT', 'SaaS'],
          logo_url: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200'
        }
      },
      {
        email: 'greeninnovation@example.com',
        full_name: 'Emma Thompson',
        phone: '+49-30-12345678',
        country: 'Germany',
        bio: 'Director of Green Innovation Hub',
        structure: {
          name: 'Green Innovation Hub',
          description: 'Sustainable technology incubator supporting environmental and clean energy startups worldwide.',
          structure_type: 'incubator',
          location: 'Berlin, Germany',
          established_year: 2020,
          focus_areas: ['CleanTech', 'Sustainability', 'Renewable Energy', 'Environmental'],
          logo_url: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=200'
        }
      },
      {
        email: 'fintechventures@example.com',
        full_name: 'David Park',
        phone: '+44-20-7946-0958',
        country: 'UK',
        bio: 'Partner at FinTech Ventures',
        structure: {
          name: 'FinTech Ventures',
          description: 'Venture capital fund specializing in financial technology and digital banking solutions.',
          structure_type: 'vc_fund',
          location: 'London, UK',
          established_year: 2015,
          focus_areas: ['FinTech', 'Digital Banking', 'Payments', 'InsurTech'],
          logo_url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=200'
        }
      },
      {
        email: 'healthtech@example.com',
        full_name: 'Dr. Sophie Martin',
        phone: '+33-1-42-86-83-00',
        country: 'France',
        bio: 'Medical Director at HealthTech Incubator',
        structure: {
          name: 'HealthTech Incubator',
          description: 'Specialized incubator for healthcare and medical technology startups, providing clinical expertise and regulatory guidance.',
          structure_type: 'incubator',
          location: 'Paris, France',
          established_year: 2019,
          focus_areas: ['HealthTech', 'Medical Devices', 'Digital Health', 'Biotech'],
          logo_url: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=200'
        }
      },
      {
        email: 'corporateinnovation@example.com',
        full_name: 'Robert Johnson',
        phone: '+1-555-0205',
        country: 'USA',
        bio: 'Head of Corporate Innovation at Innovation Labs',
        structure: {
          name: 'Corporate Innovation Labs',
          description: 'Corporate innovation arm focusing on emerging technologies and strategic partnerships with startups.',
          structure_type: 'corporate',
          location: 'New York, NY',
          established_year: 2016,
          focus_areas: ['Enterprise Software', 'Automation', 'Data Analytics', 'Cybersecurity'],
          logo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200'
        }
      }
    ];

    const structureIds = [];
    for (const structureUser of structureUsers) {
      // Create user
      db.run(
        `INSERT INTO users (email, password_hash, full_name, phone, country, role, is_approved, bio, created_at) 
         VALUES (?, ?, ?, ?, ?, 'structure', true, ?, CURRENT_TIMESTAMP)`,
        [structureUser.email, hashedPassword, structureUser.full_name, structureUser.phone, structureUser.country, structureUser.bio],
        function(err) {
          if (err) {
            console.error('Error inserting structure user:', err);
            return;
          }
          // Create structure
          db.run(
            `INSERT INTO structures (user_id, name, description, structure_type, location, established_year, focus_areas, is_approved, logo_url, created_at) 
             VALUES (?, ?, ?, ?, ?, ?, ?, true, ?, CURRENT_TIMESTAMP)`,
            [
              this.lastID, // Use this.lastID for the user_id
              structureUser.structure.name,
              structureUser.structure.description,
              structureUser.structure.structure_type,
              structureUser.structure.location,
              structureUser.structure.established_year,
              JSON.stringify(structureUser.structure.focus_areas), // Store array as JSON
              structureUser.structure.logo_url
            ],
            function(err) {
              if (err) {
                console.error('Error inserting structure:', err);
                return;
              }
              structureIds.push(this.lastID);
            }
          );
        }
      );
    }

    // 3. Create 5 Startup Users and Startups
    console.log('🚀 Creating startup users and companies...');
    const startupUsers = [
      {
        email: 'founder1@aianalytics.com',
        full_name: 'Alex Chen',
        phone: '+1-555-0301',
        country: 'USA',
        bio: 'AI Engineer and Founder of AI Analytics Pro',
        startup: {
          name: 'AI Analytics Pro',
          description: 'Advanced AI-powered analytics platform that helps businesses make data-driven decisions with real-time insights and predictive modeling.',
          industry: 'AI/ML',
          stage: 'Seed',
          location: 'San Francisco, CA',
          team_size: 8,
          total_funding: 500000,
          founded_date: '2023-01-15',
          logo_url: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200',
          website: 'https://aianalytics.com'
        }
      },
      {
        email: 'founder2@ecotrack.com',
        full_name: 'Elena Rodriguez',
        phone: '+49-30-87654321',
        country: 'Germany',
        bio: 'Environmental Engineer and Co-founder of EcoTrack Solutions',
        startup: {
          name: 'EcoTrack Solutions',
          description: 'Environmental monitoring platform using IoT sensors and satellite data to track environmental changes and support sustainability initiatives.',
          industry: 'Environment',
          stage: 'Series A',
          location: 'Berlin, Germany',
          team_size: 15,
          total_funding: 1200000,
          founded_date: '2022-06-10',
          logo_url: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=200',
          website: 'https://ecotrack.com'
        }
      },
      {
        email: 'founder3@fintech.com',
        full_name: 'James Wilson',
        phone: '+44-20-1234-5678',
        country: 'UK',
        bio: 'Financial Technology Expert and CEO of FinTech Pro',
        startup: {
          name: 'FinTech Pro',
          description: 'Next-generation digital banking platform with AI-powered financial planning, cryptocurrency integration, and seamless international payments.',
          industry: 'FinTech',
          stage: 'Series B',
          location: 'London, UK',
          team_size: 25,
          total_funding: 2500000,
          founded_date: '2021-11-20',
          logo_url: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=200',
          website: 'https://fintechpro.com'
        }
      },
      {
        email: 'founder4@healthai.com',
        full_name: 'Dr. Priya Patel',
        phone: '+1-555-0304',
        country: 'Canada',
        bio: 'Medical Doctor and AI Researcher, Founder of HealthAI',
        startup: {
          name: 'HealthAI Diagnostics',
          description: 'AI-powered medical diagnostics platform that assists healthcare professionals in early disease detection and treatment planning.',
          industry: 'HealthTech',
          stage: 'Seed',
          location: 'Toronto, Canada',
          team_size: 12,
          total_funding: 800000,
          founded_date: '2023-03-05',
          logo_url: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=200',
          website: 'https://healthai.com'
        }
      },
      {
        email: 'founder5@smartsec.com',
        full_name: 'Mohamed Al-Rashid',
        phone: '+971-4-123-4567',
        country: 'UAE',
        bio: 'Cybersecurity Expert and Founder of SmartSec',
        startup: {
          name: 'SmartSec Solutions',
          description: 'Intelligent cybersecurity platform providing real-time threat detection, automated response, and comprehensive security analytics for enterprises.',
          industry: 'Cybersecurity',
          stage: 'Pre-Seed',
          location: 'Dubai, UAE',
          team_size: 6,
          total_funding: 250000,
          founded_date: '2023-08-12',
          logo_url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=200',
          website: 'https://smartsec.com'
        }
      }
    ];

    const startupIds = [];
    for (const startupUser of startupUsers) {
      // Create user
      db.run(
        `INSERT INTO users (email, password_hash, full_name, phone, country, role, is_approved, bio, created_at) 
         VALUES (?, ?, ?, ?, ?, 'startup', true, ?, CURRENT_TIMESTAMP)`,
        [startupUser.email, hashedPassword, startupUser.full_name, startupUser.phone, startupUser.country, startupUser.bio],
        function(err) {
          if (err) {
            console.error('Error inserting startup user:', err);
            return;
          }
          // Create startup
          db.run(
            `INSERT INTO startups (user_id, name, description, industry, stage, location, team_size, total_funding, founded_date, is_approved, logo_url, website, created_at) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, true, ?, ?, CURRENT_TIMESTAMP)`,
            [
              this.lastID, // Use this.lastID for the user_id
              startupUser.startup.name,
              startupUser.startup.description,
              startupUser.startup.industry,
              startupUser.startup.stage,
              startupUser.startup.location,
              startupUser.startup.team_size,
              startupUser.startup.total_funding,
              startupUser.startup.founded_date,
              startupUser.startup.logo_url,
              startupUser.startup.website
            ],
            function(err) {
              if (err) {
                console.error('Error inserting startup:', err);
                return;
              }
              startupIds.push(this.lastID);
            }
          );
        }
      );
    }

    // 4. Create Products for each startup
    console.log('📦 Creating products...');
    const products = [
      // AI Analytics Pro products
      {
        startup_id: startupIds[0],
        name: 'Business Intelligence Dashboard',
        description: 'Comprehensive BI dashboard with real-time analytics, predictive modeling, and custom reporting features.',
        price: 299.99,
        category: 'Analytics',
        image_urls: ['https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400'],
        stock_quantity: 100
      },
      {
        startup_id: startupIds[0],
        name: 'AI Insights API',
        description: 'RESTful API providing AI-powered data insights and machine learning predictions for developers.',
        price: 99.99,
        category: 'API',
        image_urls: ['https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=400'],
        stock_quantity: 500
      },
      // EcoTrack Solutions products
      {
        startup_id: startupIds[1],
        name: 'Environmental Monitor Pro',
        description: 'IoT-based environmental monitoring system with real-time air quality, noise, and temperature tracking.',
        price: 599.99,
        category: 'IoT',
        image_urls: ['https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=400'],
        stock_quantity: 50
      },
      {
        startup_id: startupIds[1],
        name: 'Sustainability Analytics Platform',
        description: 'Cloud-based platform for tracking and analyzing environmental impact and sustainability metrics.',
        price: 199.99,
        category: 'Software',
        image_urls: ['https://images.unsplash.com/photo-1569163139394-de4e4f43e4e5?w=400'],
        stock_quantity: 200
      },
      // FinTech Pro products
      {
        startup_id: startupIds[2],
        name: 'Digital Banking Suite',
        description: 'Complete digital banking solution with AI-powered financial planning and multi-currency support.',
        price: 499.99,
        category: 'FinTech',
        image_urls: ['https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400'],
        stock_quantity: 75
      },
      {
        startup_id: startupIds[2],
        name: 'Crypto Payment Gateway',
        description: 'Secure cryptocurrency payment processing solution for e-commerce and retail businesses.',
        price: 149.99,
        category: 'Payments',
        image_urls: ['https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=400'],
        stock_quantity: 150
      },
      // HealthAI Diagnostics products
      {
        startup_id: startupIds[3],
        name: 'AI Medical Scanner',
        description: 'AI-powered medical imaging analysis tool for early disease detection and diagnostic support.',
        price: 899.99,
        category: 'Medical',
        image_urls: ['https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400'],
        stock_quantity: 25
      },
      {
        startup_id: startupIds[3],
        name: 'Health Analytics Dashboard',
        description: 'Comprehensive health data analytics platform for healthcare providers and medical researchers.',
        price: 399.99,
        category: 'Healthcare',
        image_urls: ['https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400'],
        stock_quantity: 100
      },
      // SmartSec Solutions products
      {
        startup_id: startupIds[4],
        name: 'Enterprise Security Suite',
        description: 'Complete cybersecurity solution with threat detection, automated response, and compliance reporting.',
        price: 799.99,
        category: 'Security',
        image_urls: ['https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400'],
        stock_quantity: 30
      },
      {
        startup_id: startupIds[4],
        name: 'Smart Threat Detector',
        description: 'Real-time threat detection system using AI and machine learning for proactive security monitoring.',
        price: 249.99,
        category: 'Security',
        image_urls: ['https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400'],
        stock_quantity: 80
      }
    ];

    for (const product of products) {
      db.run(
        `INSERT INTO products (startup_id, name, description, price, category, image_urls, stock_quantity, is_active, created_at) 
         VALUES (?, ?, ?, ?, ?, ?, ?, true, CURRENT_TIMESTAMP)`,
        [
          product.startup_id,
          product.name,
          product.description,
          product.price,
          product.category,
          JSON.stringify(product.image_urls), // Store array as JSON
          product.stock_quantity
        ],
        function(err) {
          if (err) {
            console.error('Error inserting product:', err);
            return;
          }
        }
      );
    }

    // 5. Create startup-structure relationships
    console.log('🤝 Creating startup-structure relationships...');
    const relationships = [
      { startup_id: startupIds[0], structure_id: structureIds[0], status: 'accepted' }, // AI Analytics + TechStart
      { startup_id: startupIds[1], structure_id: structureIds[1], status: 'accepted' }, // EcoTrack + Green Innovation
      { startup_id: startupIds[2], structure_id: structureIds[2], status: 'accepted' }, // FinTech + FinTech Ventures
      { startup_id: startupIds[3], structure_id: structureIds[3], status: 'accepted' }, // HealthAI + HealthTech
      { startup_id: startupIds[4], structure_id: structureIds[4], status: 'accepted' }, // SmartSec + Corporate Innovation
    ];

    for (const rel of relationships) {
      db.run(
        `INSERT INTO startup_structure_links (startup_id, structure_id, status, invited_at, responded_at, created_at) 
         VALUES (?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
        [rel.startup_id, rel.structure_id, rel.status],
        function(err) {
          if (err) {
            console.error('Error inserting startup-structure relationship:', err);
            return;
          }
        }
      );
    }

    console.log('✅ Database seeding completed successfully!');
    console.log(`📊 Created:`);
    console.log(`   - 5 Client users`);
    console.log(`   - 5 Support structure users and organizations`);
    console.log(`   - 5 Startup users and companies`);
    console.log(`   - 10 Products across all startups`);
    console.log(`   - 5 Startup-structure relationships`);
    console.log(`\n🔑 Test Credentials (password: password123):`);
    console.log(`   - Admin: admin@venturesroom.com`);
    console.log(`   - Client: client1@example.com`);
    console.log(`   - Startup: founder1@aianalytics.com`);
    console.log(`   - Structure: techaccel@example.com`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

// Run the seeding if this file is executed directly
if (require.main === module) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = seedDatabase;
