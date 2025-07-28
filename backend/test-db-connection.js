const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function testConnection() {
  try {
    console.log('🔄 Testing database connection...');
    console.log(`Connecting to: ${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`);
    console.log(`Using user: ${process.env.DB_USER}`);
    
    const client = await pool.connect();
    console.log('✅ Successfully connected to PostgreSQL!');
    
    const result = await client.query('SELECT NOW() as current_time');
    console.log('📅 Current database time:', result.rows[0].current_time);
    
    client.release();
    await pool.end();
    
    console.log('🎉 Database connection test completed successfully!');
  } catch (error) {
    console.error('❌ Database connection failed:');
    console.error('Error details:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('📋 Troubleshooting:');
      console.error('  • Make sure PostgreSQL is running');
      console.error('  • Check if the port 5432 is correct');
      console.error('  • Verify the database host (localhost)');
    } else if (error.code === '28P01') {
      console.error('📋 Troubleshooting:');
      console.error('  • Check username and password');
      console.error('  • Make sure the user exists');
    } else if (error.code === '3D000') {
      console.error('📋 Troubleshooting:');
      console.error('  • Database "venturesroom" does not exist');
      console.error('  • Run the setup script first');
    }
    
    process.exit(1);
  }
}

testConnection();
