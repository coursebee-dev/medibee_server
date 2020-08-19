const mongoose = require("mongoose");

const Schema = mongoose.Schema;// Create Schema

const SubCategory = new Schema({
    name: {
        type: String
    }
})

const SubjectSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true
    },
    subcategory: []
});

module.exports = mongoose.model("Subject", SubjectSchema);