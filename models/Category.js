const mongoose = require("mongoose");

const Schema = mongoose.Schema;// Create Schema

const Category = new Schema({
    name: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model("Category", Category);