const mongoose = require("mongoose");

const Schema = mongoose.Schema; // Create Schema

const LiveClassBundle = new Schema({
  type: {
    type: String,
    default: "liveclassmodule",
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  fakeprice: {
    type: String,
    required: true,
  },
  moduleclasses: [],
});

module.exports = mongoose.model("LiveLiveClassBundle", LiveClassBundle);
