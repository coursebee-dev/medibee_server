const mongoose = require("mongoose");

const Schema = mongoose.Schema; // Create Schema

const Coupon = new Schema({
  name: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  discounttype: {
    type: String,
    required: true,
  },
  discount: {
    type: Number,
    required: true,
  },
  distribution: {
    type: String,
    required: true,
  },
  roles: [],
  students: [],
});

module.exports = mongoose.model("Coupon", Coupon);
