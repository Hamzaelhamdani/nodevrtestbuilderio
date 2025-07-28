-- PostgreSQL setup script for VenturesRoom
-- Run this script to set up the database and user

-- Create database user (if it doesn't exist)
DO
$do$
BEGIN
   IF NOT EXISTS (
      SELECT FROM pg_catalog.pg_roles
      WHERE  rolname = 'venturesroom_user') THEN
      
      CREATE ROLE venturesroom_user LOGIN PASSWORD 'venturesroom_password';
   END IF;
END
$do$;

-- Create database (if it doesn't exist)
SELECT 'CREATE DATABASE venturesroom OWNER venturesroom_user'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'venturesroom')\gexec

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE venturesroom TO venturesroom_user;

-- Connect to the new database
\c venturesroom

-- Grant schema privileges
GRANT ALL ON SCHEMA public TO venturesroom_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO venturesroom_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO venturesroom_user;

-- Display success message
\echo 'Database setup complete! ✅'
\echo 'Database: venturesroom'
\echo 'User: venturesroom_user'
\echo 'Password: venturesroom_password'
