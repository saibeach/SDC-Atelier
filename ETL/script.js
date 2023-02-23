const {Pool} = require('pg');
const fs = require('fs')
const fastcsv = require('fast-csv')
const path = require('path')
require('dotenv').config();

const pool = new Pool({
  host: 'localhost',
  user: 'postgres',
  password: '',
  database:'phoenix',
  port:5432,
})

const createAnPhotoTable = `CREATE TABLE IF NOT EXISTS answers_photos
    (
        id SERIAL,
        answer_id integer,
        url TEXT
    );`

const csvFilePath = path.join(__dirname, '/data/answers_photos.csv');

pool.query(createAnPhotoTable)
      .then(() => {
        console.log('Table created successfully');
        return loadDataFromCSV(csvFilePath);
      })
      .catch((err) => {
        pool.end();
      })

async function loadDataFromCSV(filePath) {
  const client = await pool.connect();
  const stream = fs.createReadStream(filePath);
  const csvData = [];
  let count = 0;

  const csvStream = fastcsv
    .parse({headers: true})
    .on('data', (data) => {
      csvData.push(data);
      count ++;

      if (count % 5000 === 0) {
        const query = buildInsertQuery(csvData);
        client.query(query);
        csvData.length = 0;
      }
    })
    .on('end', () => {
      if (csvData.length > 0) {
        const query = buildInsertQuery(csvData);
        client.query(query)
      }
      console.log('Data loaded successfully');
      client.release();
    })

    stream.pipe(csvStream);
    console.log("data write in done")
}

function buildInsertQuery(rows) {
  const values = rows.map((row) => {
    const columnValues = Object.values(row).map((value) => `'${value}'`);
    return `(${columnValues.join(', ')})`
  });

  const columns = Object.keys(rows[0]).join(', ');
  const query = `INSERT INTO answers_photos (${columns}) VALUES ${values.join(', ')};`;

  return query;
}