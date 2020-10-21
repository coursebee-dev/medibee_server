const mongoose = require("mongoose");

const Schema = mongoose.Schema;// Create Schema

const Course = new Schema({
    name: {
        type: String,
        required: true
    },
    subjects : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "QuesCatg"
        }
    ]
});

module.exports = mongoose.model("QuesCourse", Course);