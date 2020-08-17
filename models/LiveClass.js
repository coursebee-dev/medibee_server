const mongoose = require("mongoose");

const Schema = mongoose.Schema;// Create Schema

const LiveClass = new Schema({
    mentorId: {
        type: String,
        required: true
    },
    zoomID: {
        type: String,
        default: "untitled"
    },
    zoomJoinLink: {
        type: String,
        default: "untitled"
    },
    zoomStartLink: {
        type: String,
        default: "untitled"
    },
    zoomPassword: {
        type: String,
        default: "untitled"
    },
    topic: {
        type: String,
        required: true
    },
    class_type: {
        type: String,
        required: true
    },
    start_time: {
        type: Date,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    approved: {
        type: Boolean,
        default: false
    },
    academicExcellence: {
        type: String,
    },
    selectedliveclasslevel: [],
    selectedsubject: [],
    description: {
        type: String,
    },
    created: {
        type: Date,
        default: Date.now
    },
    fake_price: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        default: 0
    },
    participants: []
})

module.exports = mongoose.model("LiveClass", LiveClass);
