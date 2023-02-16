const axios = require('axios');
const {Pool} = require('pg');
const express = require('express')
const app = express()
const path = require('path');

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const pool = new Pool({
  host: 'localhost',
  port:5432,
  database: 'phoenix',
  user: 'postgres',
  password: ''
})

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));


app.get('/api/questions', (req, res) => {

  const {product_id, count} = req.query;
  const query = 'SELECT * FROM questions WHERE product_id = $1 LIMIT $2';

  pool.query(query, [product_id, count])
    .then(result => {
      res.json(result.rows);
    })
    .catch(error => {
      res.status(500)
    })
})

app.get('/api/answers', (req, res) => {
  // console.log("am i getting request from qentry?",req.query)
  const question_id = req.query.question_id;
  const query = `SELECT * FROM answers WHERE question_id = $1`;
  pool.query(query, [question_id])
    .then(result => {
      // console.log("succeed, ", result.rows);
      res.json(result.rows);
    })
    .catch(error => {
      // console.log("qentry request failed", error);
      res.status(500);
    })
} )

app.get('/api/mergedanswers', (req, res) => {
  console.log("query for the combined table ?")
  const questionId = req.query.question_id;
  const query = `
    SELECT a.*, ap.url
    FROM answers AS a
    LEFT JOIN answers_photos AS ap ON a.id = ap.answer_id
    WHERE a.question_id = ${questionId}
    `;
  pool.query(query, (error, results) => {
    if (error) {
      console.log(error);
      res.status(500);
    } else {
      res.json(results);
    }
  })
})

app.get('/api/answer_photos', (req, res) => {
  // console.log("query for the answer photos ")
  const answer_id = req.query.answer_id;
  const query = `SELECT * FROM answers_photos WHERE answer_id = $1`;
  pool.query(query, [answer_id])
    .then(result => {
      // console.log("photo query result looks like :",result.rows)
      res.json(result.rows);
    })
    .catch(error => {
      // console.log("fetching photos failed", error);
      res.status(500);
    })
})



// handle answer helpful vote
app.put('/answerhelpful', (req, res) => {
  // console.log("am i getting the req in postgras server?", req.body)
  const answer_id = req.body.answer_id;

  pool.query('UPDATE answers SET helpful = helpful + 1 WHERE id = $1', [answer_id], (err, result) => {
    if (err){

    res.status(500).send('Error updating helpful votes');
  } else {
    // console.log("answer help done!")
    res.send('Helpful votes updated successfully')
  }
})
})

// handle answer report vote
app.put('/reporta', (req, res) => {

  const answer_id = req.body.asnwer_id;

  pool.query('UPDATE answers SET reported = NOT reported WHERE id = $1', [answer_id], (err, result) => {
    if (err) {
      res.status(500).send('Error updating answer report');
    } else {

      res.send('Answer reported')
    }
  })
})

// handle question vote helpful
app.put('/quesitonhelpful', (req, res) => {
  // console.log("am i getting the req in postgras server?", req.body)
  const question_id = req.body.question_id;

  pool.query('UPDATE answers SET helpful = helpful + 1 WHERE id = $1', [question_id], (err, result) => {
    if (err){

    res.status(500).send('Error updating helpful votes');
  } else {
    // console.log("answer help done!")
    res.send('Helpful votes updated successfully')
  }
})
})

// handle question report
app.put('/reportq', (req, res) => {

  const question_id = req.body.question_id;

  pool.query('UPDATE questions SET reported = NOT reported WHERE id = $1', [question_id], (err, result) => {
    if (err) {
      res.status(500).send('Error updating question report');
    } else {
      console.log("question report succeed! ")
      res.send('question reported! ')
    }
  })
})



app.listen(3000, () => {
  console.log('Server is running on port 3000');
});