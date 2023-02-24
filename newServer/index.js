const axios = require('axios');
const {Pool} = require('pg');
const express = require('express')
const app = express()
const path = require('path');
const fs = require('fs');
require('dotenv').config()


const axiosInstance = axios.create({
  baseURL: process.env.POS_HOST,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const pool = new Pool({
  host: process.env.POS_URL,
  port:5432,
  database: process.env.POS_DATABASE,
  user: process.env.USER,
  password: process.env.PASSWORD
})

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));



app.get('/loaderio-0bb0e538dcf3ed212dd9b041ee8b3eb2', (req, res) => {
  console.log("io verify coming! ")
  res.send('loaderio-0bb0e538dcf3ed212dd9b041ee8b3eb2')
})



app.get('/api/questions', (req, res) => {

  const {product_id, count} = req.query;
  // const query = 'SELECT * FROM questions WHERE product_id = $1 LIMIT $2';
  const query = 'SELECT * FROM questions WHERE product_id = $1 ORDER BY helpful DESC LIMIT $2';
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

// handle add answer to question
app.post('/addanswer', (req, res) => {
  console.log("is req passing to addanswer ?", req.body)
  const question_id = req.body.question_id;
  const answerer_name = req.body.nickname;
  const body = req.body.answer;
  const answerer_email = req.body.email;

  const query = 'INSERT INTO answers (question_id, body, answerer_name, answerer_email) VALUES ($1, $2, $3, $4) RETURNING id';

  const values = [question_id, body, answerer_name, answerer_email]

  pool.query(query, values)
    .then(result => {
      const newId = result.rows[0].id;
      console.log("add answer to this question succeed!")
    })
    .catch(err => {
      console.log("add answer failed! ", err)
    })

})

// handle add question to cur product
app.post('/addquestion', (req, res) => {
  console.log("is req passing to addquestion ?", req.body)
  const product_id = req.body.product_id;
  const asker_name = req.body.nickname;
  const body = req.body.question;
  const asker_email = req.body.email;

  const query = 'INSERT INTO questions (product_id, body, asker_name, asker_email) VALUES ($1, $2, $3, $4) RETURNING id';

  const values = [product_id, body, asker_name, asker_email]

  pool.query(query, values)
    .then(result => {

      console.log("add question to this question succeed!")
    })
    .catch(err => {
      console.log("add question failed! ", err)
    })
})

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});