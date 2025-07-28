#!/bin/bash

echo "🚀 VenturesRoom Backend Setup"
echo "================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Check if PostgreSQL is installed
echo ""
print_info "Checking PostgreSQL installation..."

if command -v psql &> /dev/null; then
    print_status "PostgreSQL is installed"
    psql --version
else
    print_error "PostgreSQL is not installed"
    print_info "Please install PostgreSQL first:"
    echo "  • Windows: https://www.postgresql.org/download/windows/"
    echo "  • macOS: brew install postgresql@15"
    echo "  • Ubuntu: sudo apt install postgresql postgresql-contrib"
    exit 1
fi

# Check if PostgreSQL is running
echo ""
print_info "Checking if PostgreSQL is running..."

if pg_isready -q; then
    print_status "PostgreSQL is running"
else
    print_error "PostgreSQL is not running"
    print_info "Start PostgreSQL service:"
    echo "  • Windows: Start 'postgresql' service"
    echo "  • macOS: brew services start postgresql@15"
    echo "  • Ubuntu: sudo systemctl start postgresql"
    exit 1
fi

# Set up database
echo ""
print_info "Setting up database..."

# Try to run the setup script
if psql -h localhost -U postgres -f setup-database.sql; then
    print_status "Database setup completed successfully"
else
    print_warning "Database setup with postgres user failed, trying alternative..."
    
    # Alternative: try with default user
    if psql -f setup-database.sql; then
        print_status "Database setup completed successfully"
    else
        print_error "Database setup failed"
        print_info "Manual setup required:"
        echo "  1. Connect to PostgreSQL: psql -U postgres"
        echo "  2. Run: CREATE DATABASE venturesroom;"
        echo "  3. Run: CREATE USER venturesroom_user WITH PASSWORD 'venturesroom_password';"
        echo "  4. Run: GRANT ALL PRIVILEGES ON DATABASE venturesroom TO venturesroom_user;"
        exit 1
    fi
fi

# Test database connection
echo ""
print_info "Testing database connection..."

if node test-db-connection.js; then
    print_status "Database connection test passed"
else
    print_error "Database connection test failed"
    exit 1
fi

# Run migrations
echo ""
print_info "Running database migrations..."

if npm run migrate; then
    print_status "Database migrations completed"
else
    print_error "Database migrations failed"
    exit 1
fi

# Final success message
echo ""
echo "🎉 Setup completed successfully!"
echo "================================"
print_status "Database: venturesroom"
print_status "User: venturesroom_user"
print_status "Host: localhost:5432"
echo ""
print_info "You can now start the backend server with:"
echo "  npm run dev"
echo ""
print_info "Test the API at:"
echo "  http://localhost:5000/health"
