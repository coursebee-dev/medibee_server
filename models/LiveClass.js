const mongoose = require("mongoose");

const Schema = mongoose.Schema; // Create Schema

const ClassTimes = new Schema({
  classtimestring: { type: String },
});

const LiveClass = new Schema({
  mentorId: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: "liveclass",
  },
  zoomID: {
    type: String,
    default: "untitled",
  },
  zoomJoinLink: {
    type: String,
    default: "untitled",
  },
  zoomStartLink: {
    type: String,
    default: "untitled",
  },
  zoomPassword: {
    type: String,
    default: "untitled",
  },
  topic: {
    type: String,
    required: true,
  },
  class_type: {
    type: String,
    required: true,
  },
  classtimes: [ClassTimes],
  approved: {
    type: Boolean,
    default: false,
  },
  academicExcellence: {
    type: String,
  },
  start_date: {
    type: String,
  },
  end_date: {
    type: String,
  },
  selectedliveclasslevel: [],
  selectedsubject: [],
  description: {
    type: String,
  },
  created: {
    type: Date,
    default: Date.now,
  },
  fake_price: {
    type: Number,
    default: 0,
  },
  duration: {
    type: Number,
  },
  price: {
    type: Number,
    default: 0,
  },
  participants: [],
});

module.exports = mongoose.model("LiveClass", LiveClass);
