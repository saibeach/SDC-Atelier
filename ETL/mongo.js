const csv = require('csv-parser');
const fs = require('fs');
const mongoose = require('mongoose');
require("dotenv").config();

// const username = process.env.MONGO_USER;
// const password = process.env.MONGO_PASSWORD;
// const host = process.env.MONGO_HOST;
// const port = '27017';
// const database = process.env.MONGO_DATABASE;
// const url = `mongodb://${username}:${password}@${host}:${port}/${database}`;


// Connection URL
const url = 'mongodb://localhost:27017/phoenix';

// Database Name
const dbName = 'phoenix';

// Collection Names
const questionsCollectionName = 'questions';
const answersCollectionName = 'answers';
const answersPhotosCollectionName = 'answers_photos';

// Connect to the MongoDB database
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

// Create a new Mongoose schema for questions
const questionSchema = new mongoose.Schema({
  id: Number,
  product_id: Number,
  body: String,
  date_written: Date,
  asker_name: String,
  asker_email: String,
  reported: Boolean,
  helpful: Number,
});

// Create a new Mongoose model for questions
const Question = mongoose.model(questionsCollectionName, questionSchema);

// Read questions CSV file
const questionsStream = fs.createReadStream('./data/questions.csv').pipe(csv());

// // Define a batch size
const batchSize = 10000;

// // Initialize a batch array for questions
let questionsBatch = [];

// Loop through each question and add it to the batch array
questionsStream.on('data', function(question) {
  // console.log(question)
  questionsBatch.push({

    id: Number(question.id),
    product_id: Number(question.product_id),
    body: question.body,
    date_written: new Date(question.date_written),
    asker_name: question.asker_name,
    asker_email: question.asker_email,
    reported: question.reported === 'false',
    helpful: Number(question.helpful)
  });

  // If the batch array reaches the defined batch size, insert it into the database and reset the batch array
  if (questionsBatch.length === batchSize) {
    Question.insertMany(questionsBatch, function(err, result) {
      if (err) {
        console.error(err);
      } else {

        console.log(`${result.length} questions inserted`);
      }
    });
    questionsBatch = [];
  }
});

// When the questions stream ends, insert any remaining questions in the batch array into the database
questionsStream.on('end', function() {
  if (questionsBatch.length > 0) {
    Question.insertMany(questionsBatch, function(err, result) {
      console.log(`${result.length} questions inserted`);
    });
  }
});

const answersSchema = new mongoose.Schema({
  id: Number,
  question_id: Number,
  body: String,
  date_written: Date,
  answerer_name: String,
  answerer_email: String,
  reported: Boolean,
  helpful: Number,
})

const Answers = mongoose.model(answersCollectionName, answersSchema)
const answersStream = fs.createReadStream('./data/answers.csv').pipe(csv());

let answersBatch = [];
answersStream.on('data', function(answer) {
  answersBatch.push({
    id: Number(answer.id),
    question_id: Number(answer.question_id),
    body: answer.body,
    date_written: new Date(answer.date_written),
    answerer_name: answer.answerer_name,
    answerer_email: answer.answerer_email,
    reported: answer.reported === 'false',
    helpful: Number(answer.helpful)
  });

  if (answersBatch.length === batchSize) {
    Answers.insertMany(answersBatch, function(err, result) {
      console.log(`${result.length} answers inserted`);
    });
    answersBatch = [];
  }
})

answersStream.on('end', function() {
  if (answersBatch.length > 0) {
    Answers.insertMany(answersBatch, function(err, result) {
      console.log(`${result.length} answers inserted`);
    });
  }
});

const answersPhotos = new mongoose.Schema({
  id: Number,
  answer_id: Number,
  url: String,
})

const AnswersPhoto = mongoose.model(answersPhotosCollectionName, answersPhotos)
const answersPhototsStream = fs.createReadStream('./data/answers_photos.csv').pipe(csv());

let answersPhotosBatch = [];

answersPhototsStream.on('data', function(answerPhoto) {
  answersPhotosBatch.push({
    id: Number(answerPhoto.id),
    answer_id: Number(answerPhoto.answer_id),
    url: answerPhoto.url
  });

  if (answersPhotosBatch.length === batchSize) {
    AnswersPhoto.insertMany(answersPhotosBatch, function(err, result) {
      console.log(`${result.length} answers_photos inserted`);
    });
    answersPhotosBatch = [];
  }
})

answersPhototsStream.on('end', function() {
  if (answersPhotosBatch.length > 0) {
    AnswersPhoto.insertMany(answersPhotosBatch, function(err, result) {
      console.log(`${result.length} answers_photos inserted`);
    });
  }
});