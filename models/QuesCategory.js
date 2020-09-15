const mongoose = require("mongoose");

const Schema = mongoose.Schema;// Create Schema

const QuesCatg = new Schema({
    name: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("QuesCatg", QuesCatg);