const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '../../venturesroom.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Could not connect to SQLite database:', err.message);
    process.exit(-1);
  }
});

console.log('--- TABLES ---');
db.all("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;", [], (err, tables) => {
  if (err) {
    console.error('Error fetching tables:', err.message);
    db.close();
    return;
  }
  if (tables.length === 0) {
    console.log('No tables found.');
  } else {
    tables.forEach(table => console.log(table.name));
  }

  console.log('\n--- USERS ---');
  db.all('SELECT * FROM users', [], (err, users) => {
    if (err) {
      console.error('Error fetching users:', err.message);
    } else {
      if (users.length === 0) {
        console.log('No users found.');
      } else {
        users.forEach(user => console.log(user));
      }
    }

    console.log('\n--- PRODUCTS ---');
    db.all('SELECT * FROM products', [], (err, products) => {
      if (err) {
        console.error('Error fetching products:', err.message);
      } else {
        if (products.length === 0) {
          console.log('No products found.');
        } else {
          products.forEach(product => console.log(product));
        }
      }
      db.close();
    });
  });
}); 