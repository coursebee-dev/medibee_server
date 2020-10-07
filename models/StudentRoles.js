const mongoose = require("mongoose");

const Schema = mongoose.Schema; // Create Schema

const StudentRoles = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("StudentRoles", StudentRoles);
