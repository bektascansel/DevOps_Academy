const { Pool } = require('pg');

const connection = new Pool({
  user: 'user',
  host: 'host.docker.internal',
  database: 'db',
  password: 'password',
  port: 5432,
});

module.exports = connection;