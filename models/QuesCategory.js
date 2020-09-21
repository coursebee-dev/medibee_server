const mongoose = require("mongoose");

const Schema = mongoose.Schema;// Create Schema

const QuesCatg = new Schema({
    name: {
        type: String,
        required: true
    },
    questions : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "QuesBank"
        }
    ]
});

module.exports = mongoose.model("QuesCatg", QuesCatg);