const { Pool } = require('pg');
const dotenv = require('dotenv');
dotenv.config();
const Promise = require("bluebird");

const pool = new Pool({
  host: 'http://ec2-3-90-84-84.compute-1.amazonaws.com',
  user: 'postgres',
  password: '123',
  database: 'phoenix',
  port: 5432,
});

const db = Promise.promisifyAll({
  query: function () {
    const queryArgs = Array.prototype.slice.call(arguments);
    return pool.query.apply(pool, queryArgs);
  },
});

db.connectAsync()
  .then(() => console.log(`Connected to Postgres database`))
  .then(() => {
    return db.queryAsync(`
      CREATE TABLE IF NOT EXISTS questions (
        id SERIAL,
        product_id INTEGER NOT NULL,
        body VARCHAR(1000),
        date_written TIMESTAMP WITHOUT TIME ZONE,
        asker_name VARCHAR(100),
        asker_email VARCHAR(100),
        reported BOOLEAN NOT NULL DEFAULT FALSE,
        helpful INTEGER NOT NULL DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS answers (
        id SERIAL,
        question_id INTEGER,
        body VARCHAR(1000) NOT NULL,
        date_written  TIMESTAMP WITHOUT TIME ZONE,
        answerer_name VARCHAR(100) NOT NULL,
        answerer_email VARCHAR(100) NOT NULL,
        reported BOOLEAN NOT NULL DEFAULT FALSE,
        helpful INTEGER NOT NULL DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS answers_photos (
        id SERIAL,
        answer_id INTEGER NOT NULL,
        url VARCHAR(255)
      );
    `);
  })
  .catch((err) => console.log(err));

module.exports = db;
