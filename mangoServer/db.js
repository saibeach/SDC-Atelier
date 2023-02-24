const mongoose = require("mongoose");
<<<<<<< HEAD
require('dotenv').config()

mongoose.connect(process.env.MONGO_URL);
=======
mongoose.connect("mongodb://localhost/phoenix");
>>>>>>> 7c084cc566dfc10f8ff59f239d33c8efba1b78b3

const questionSchema = new mongoose.Schema({
  id: Number,
  product_id: Number,
  question_body: String,
  date_written:Date,
  asker_name:String,
  asker_email:String,
  reported: Boolean,
  helpful: Number
});

const answerSchema = new mongoose.Schema({
  id: Number,
  question_id: Number,
  body: String,
  date_written: Date,
  answerer_name: String,
  answerer_email: String,
  reported: Boolean,
  helpful: Number
})

const answerPhotoSchema = new mongoose.Schema({
  id: Number,
  answer_id:Number,
  url:String
},  { collection: 'answers_photos' })

const Question = mongoose.model("Question", questionSchema)
const Answer = mongoose.model("Answer", answerSchema)
const AnswerPhoto = mongoose.model("AnswerPhoto", answerPhotoSchema);

module.exports.Question = Question;
module.exports.Answer = Answer;
module.exports.AnswerPhoto = AnswerPhoto;
