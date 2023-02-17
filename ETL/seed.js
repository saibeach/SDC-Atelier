const {Pool} = require('pg');
const fs = require('fs');
require('dotenv').config();


// set up databse conncetion configuration
const pool = new Pool({
  host: 'localhost',
  user: 'postgres',
  password: '',
  database: 'phoenix',
  port: 5432,
});



const createAnPhotoTable = `CREATE TABLE IF NOT EXISTS answers_photos
    (
        id SERIAL,
        answer_id integer,
        url TEXT
    );`;

const createQuestionsTable = `CREATE TABLE IF NOT EXISTS questions (
  id integer,
  product_id INTEGER,
  body varchar(255),
  date_written TIMESTAMP WITHOUT TIME ZONE,
  asker_name varchar(255),
  asker_email varchar(255),
  reported BOOLEAN,
  helpful INTEGER
);`

const createAnswersTable = `CREATE TABLE IF NOT EXISTS answers (
  id integer,
  question_id INTEGER,
  body varchar(255),
  date_written TIMESTAMP WITHOUT TIME ZONE,
  answerer_name varchar(255),
  answerer_email varchar(255),
  reported BOOLEAN,
  helpful INTEGER
);`

const csvAnPhotoFilePath = '/data/answers_photos.csv';
const csvAnswersFilePath = '/data/answers.csv';
const csvQuestionFilePath = '/data/questions.csv';

pool.query(createAnPhotoTable)
  .then(res => {
    console.log('Answers Photos Table created successfully');
    return readAphotocsv(csvAnPhotoFilePath)
  })
  .catch(err => {
    console.error(err);
    pool.end(); // Close the connection pool in case of error
  });

pool.query(createAnswersTable)
  .then(res => {
    console.log('Answers Table created successfully');
    return readAnswerscsv(csvAnswersFilePath)
  })
  .catch(err => {
    console.error(err);
    pool.end(); // Close the connection pool in case of error
  });

pool.query(createQuestionsTable)
  .then(res => {
    console.log('Questions Table created successfully');
    return readQuestionscsv(csvQuestionFilePath);
  })
  .catch(err => {
    console.error(err);
    pool.end(); // Close the connection pool in case of error
  });
/*****************CSV DATA WRITE IN Funcs*****************************/

// write in anphoto files

// writing csv data into answers_photos table
async function readAphotocsv(csvFile) {
  const filePath = __dirname + csvFile;
  const sql = `COPY answers_photos FROM '${filePath}' DELIMITER ',' CSV HEADER`;
  const client = await pool.connect();
  try {
    await client.query(sql);
    console.log('Data writing to answers_photos table...');
  } catch (err) {
    console.error(err);
  } finally {
    client.release();
    console.log("csv data written finished in answers_photos table.")
  }
}

/*******************************************************/
async function readAnswerscsv(csvFile) {
  const filePath = __dirname + csvFile;
  const sql = `COPY answers FROM '${filePath}' DELIMITER ',' CSV HEADER`;
  const client = await pool.connect();
  try {
    await client.query(sql);
    console.log('Data writing to answers table...');
  } catch (err) {
    console.error(err);
  } finally {
    client.release();
    console.log("csv data written finished in answers table.")
  }
}

/*******************************************************/
async function readQuestionscsv(csvFile) {
  const filePath = __dirname + csvFile;
  const sql = `COPY questions FROM '${filePath}' DELIMITER ',' CSV HEADER`;
  const client = await pool.connect();
  try {
    await client.query(sql);
    console.log('Data writing to questions table...');
  } catch (err) {
    console.error(err);
  } finally {
    client.release();
    console.log("csv data written finished in questions table.")
  }
}

/*******************************************************/