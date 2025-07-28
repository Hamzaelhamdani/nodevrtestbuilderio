-- VenturesRoom Database Schema (SQLite compatible)

-- Users table (unified for all user types)
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT,
    country TEXT,
    role TEXT NOT NULL,
    is_approved BOOLEAN DEFAULT 0,
    avatar_url TEXT,
    bio TEXT,
    website TEXT,
    linkedin_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Startups table
CREATE TABLE IF NOT EXISTS startups (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    name TEXT NOT NULL,
    description TEXT,
    logo_url TEXT,
    website TEXT,
    founded_date TEXT,
    industry TEXT,
    stage TEXT,
    location TEXT,
    team_size INTEGER,
    total_funding REAL DEFAULT 0,
    is_approved BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Support structures table
CREATE TABLE IF NOT EXISTS structures (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    name TEXT NOT NULL,
    description TEXT,
    logo_url TEXT,
    website TEXT,
    structure_type TEXT NOT NULL,
    location TEXT,
    established_year INTEGER,
    focus_areas TEXT, -- Store as JSON string
    is_approved BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    startup_id INTEGER,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    category TEXT,
    image_urls TEXT, -- Store as JSON string
    stock_quantity INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(startup_id) REFERENCES startups(id) ON DELETE CASCADE
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_id INTEGER,
    startup_id INTEGER,
    product_id INTEGER,
    quantity INTEGER NOT NULL,
    unit_price REAL NOT NULL,
    total_amount REAL NOT NULL,
    delivery_address TEXT,
    notes TEXT,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(client_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY(startup_id) REFERENCES startups(id) ON DELETE CASCADE,
    FOREIGN KEY(product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Startup-Structure relationships table
CREATE TABLE IF NOT EXISTS startup_structure_links (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    startup_id INTEGER,
    structure_id INTEGER,
    status TEXT DEFAULT 'pending',
    invited_by INTEGER,
    invitation_message TEXT,
    response_message TEXT,
    invited_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    responded_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(startup_id, structure_id),
    FOREIGN KEY(startup_id) REFERENCES startups(id) ON DELETE CASCADE,
    FOREIGN KEY(structure_id) REFERENCES structures(id) ON DELETE CASCADE,
    FOREIGN KEY(invited_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Commission tracking table
CREATE TABLE IF NOT EXISTS commissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    startup_id INTEGER,
    structure_id INTEGER,
    order_id INTEGER,
    percentage REAL NOT NULL,
    amount REAL NOT NULL,
    is_paid BOOLEAN DEFAULT 0,
    paid_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(startup_id) REFERENCES startups(id) ON DELETE CASCADE,
    FOREIGN KEY(structure_id) REFERENCES structures(id) ON DELETE CASCADE,
    FOREIGN KEY(order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- VIP Club discounts table
CREATE TABLE IF NOT EXISTS vip_club_discounts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    startup_id INTEGER,
    product_id INTEGER,
    discount_percentage REAL NOT NULL,
    description TEXT,
    valid_from DATETIME DEFAULT CURRENT_TIMESTAMP,
    valid_until DATETIME,
    is_active BOOLEAN DEFAULT 1,
    usage_limit INTEGER,
    used_count INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(startup_id) REFERENCES startups(id) ON DELETE CASCADE,
    FOREIGN KEY(product_id) REFERENCES products(id) ON DELETE CASCADE
);
