const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuesBank = new Schema({
    question: {
        type: String,
        required: true
    },
    questionType: {
        type: String,
        required: true
    },
    questionPic: {
        type: String
    },
    answerSelectionType: {
        type: String,
        required: true
    },
    answers: [],
    correctAnswer: [],
    messageForCorrectAnswer: {
        type: String,
        default: "Correct answer. Good job."
    },
    messageForIncorrectAnswer: {
        type: String,
        default: "Incorrect answer. Please try again."
    },
    explanation: {
        type: String,
        required: true
    },
    questionCatgegory: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('QuesBank',QuesBank)