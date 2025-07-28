const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

// Path to SQLite database file (always in project root)
const dbPath = path.resolve(__dirname, '../../venturesroom.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Could not connect to SQLite database:', err.message);
    process.exit(-1);
  }
});

function runMigrations() {
  try {
    console.log('🔄 Running database migrations...');

    const schemaPath = path.join(__dirname, '../config/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    // Split schema into individual statements
    const statements = schema.split(';').filter(stmt => stmt.trim().length > 0);

    function execNext(i) {
      if (i >= statements.length) {
        console.log('✅ Database migrations completed successfully');
        process.exit(0);
      }
      db.exec(statements[i], (err) => {
        if (err && !/already exists|duplicate/i.test(err.message)) {
          console.error('Error executing statement:', err.message);
          process.exit(1);
        } else {
          execNext(i + 1);
        }
      });
    }
    execNext(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigrations();
