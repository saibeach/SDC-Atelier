const express = require('express')
const app = express()
const mongoose = require('mongoose')
const path = require("path")
const { Question, Answer, AnswerPhoto } = require('./db.js');
require('dotenv').config()


mongoose.connect(process.env.MONGO_URL)
const db = mongoose.connection

app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json())

app.get('/loaderio-1b5664f7891405365965e9c0de3f286e', (req, res) => {

  res.send('loaderio-1b5664f7891405365965e9c0de3f286e')
})

app.get('/api/questions', (req, res) => {
  // console.log(" is the request coming ?", req.query)
  const product_id = req.query.product_id;
  const count = req.query.count;

  Question.find({product_id: product_id})
    .select('id body reported helpful')
    .sort({helpful: -1})
    .limit(count)
    .exec((err, questions) => {
      if (err) {
        // console.log(err);
        res.status(500).send('Error getting questions');
      } else {
        // console.log(questions)
        res.json(questions)
      }
    })
})

app.get('/api/answers', (req, res) => {
  // console.log('get answers router now, req looks like :' ,req.query)
  const question_id = req.query.question_id;
  Answer.find({ question_id: question_id })
    .select('id body date_written answerer_name reported helpful')
    .sort({ helpful: -1}) // Sort by helpful in descending order
    .exec((err, answers) => {
      if (err) {
        // console.error(err);
        res.status(500).send('An error occurred while retrieving answers');
      } else {
        // console.log(answers)
        res.json(answers);
      }
    });
})


app.get('/api/answer_photos', (req, res) => {
  // console.log("query for the answer photos ", req.query)
  const answer_id = req.query.answer_id;
  AnswerPhoto.find({answer_id: answer_id})
    .then(result => {
      // console.log("photo query result looks like :",result)
      res.json(result);
    })
    .catch(error => {
      console.log("fetching photos failed", error);
      res.status(500);
    })
})


app.put('/quesitonhelpful', (req, res) => {
  const question_id = req.body.question_id;
  Question.updateOne(
    {id: question_id},
    {$inc: {helpful: 1}},
    (err) => {
      if (err) {
        res.status(500).send('error updating helpful votes');
      } else {
        res.send('Helpful votes updated succssfully')
      }
    }
  )
})

app.put('/answerhelpful', (req, res) => {
  const answer_id = req.body.answer_id;

  Answer.updateOne(
    {id: answer_id},
    {$inc: {helpful: 1}},
    (err) => {
      if (err) {
        res.status(500).send('error updating helpful votes');
      } else {
        res.send('Helpful votes update succssfully')
      }
    }
  )
})

app.put('/reporta', (req, res) => {
  const answer_id = req.body.answer_id;

  Answer.findOneAndUpdate(
    {id: answer_id},
    {$set: {reported: true}},
    {new: true},
    (err) => {
      if (err) {
        res.status(500).send('error updating helpful votes');
      } else {
        res.send('Answer reported')
      }
    }

  )
})


app.put('/reportq', (req, res) => {
  const question_id = req.body.question_id;
  Question.findOneAndUpdate(
    {id: question_id},
    {$set: {reported: true}},
    {new: true},
    (err) => {
      if (err) {
        res.status(500).send('error updating helpful votes');
      } else {
        res.send('Question reporeted')
      }
    }
  )

})


app.post('/addanswer', (req, res) => {
  const question_id = req.body.question_id;
  const answer_name = req.body.nickname;
  const body = req.body.answer;
  const answerer_email = req.body.email;

  const answer = new Answer({
    question_id: question_id,
    body: body,
    answerer_name: answer_name,
    answerer_email: answerer_email,
    reported: false,
    helpful: 0
  });

  // console.log("answer will be insert to answer table will be like :", answer)
  answer.save()
    .then(result => {
      console.log("answer added to this question")
    })
    .catch(err => {
      console.log("add answer failed! ", err)
    })
})


app.post('/addquestion', (req, res) => {
  const product_id = req.body.product_id;
  const asker_name = req.body.nickname;
  const body = req.body.question;
  const asker_email = req.body.email;

  const newQuestion = new Question({
    product_id: product_id,
    body: body,
    asker_name: asker_name,
    asker_email: asker_email,
    reported: false,
    helpful: 0
  })

  console.log("question adding looks like: ", newQuestion)
  newQuestion.save()
    .then(result => {
      console.log("add question to this product succeed!")
    })
    .catch(err => {
      console.log("add question failed!", err)
    })
})


app.listen(8080, () => console.log('Mongo Server Started, Listening port 8080'))
