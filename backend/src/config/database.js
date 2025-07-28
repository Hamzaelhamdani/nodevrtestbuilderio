const { Pool } = require('pg');

const pool = new Pool({
  user: 'hourak',
  host: 'votre_hôte',
  database: 'venturesroom',
  password: '123456',
  port: 5432,
});

module.exports = pool;