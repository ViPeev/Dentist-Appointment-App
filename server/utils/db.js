const config = require('../config');

const Pool = require("pg").Pool;

const pool = new Pool({
  user: config.DB_USER,
  password: config.DB_PASSWORD || '',
  host: config.DB_HOST,
  port: config.DB_PORT,
  database: config.DB_NAME,
});

// module.exports = pool;
module.exports.query = (query, values) => {
  return new Promise((resolve, reject) => {

    pool.query(query, values, (error, response) => {
      if (error) {
        return reject(error);
      }
      resolve(response);
    });

  });
};