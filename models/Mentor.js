const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');

const Schema = mongoose.Schema;// Create Schema

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  emailVerify: {
    type: Boolean,
    default: false
  },
  password: {
    type: String,
    required: true
  },
  mentortype: {
    type: String,
    required: true
  },
  adminVerify: {
    type: Boolean,
    default: false
  },
  mobileNo: {
    type: String,
    required: true,
    unique: true
  },
  medicalcollege: {
    type: String,
    required: true
  },
  session: {
    type: String,
    required: true
  },
  position: {
    type: String,
    required: true
  },
  sponsored: {
    type: Boolean,
    default: false
  },
  subject: [],
  category: [],
  subcategory: [],
  propicurl: { type: String },
  mbbsuel: [],
  idurl: [],
  nidurl: [],
  bmdcurl: [],
  date: {
    type: Date,
    default: Date.now
  }
});

UserSchema.pre('save', async function (next) {
  const user = this;
  //Hash the password with a salt round of 10, the higher the rounds the more secure, but the slower
  //your application becomes.
  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;
  next();
});

UserSchema.methods.isValidPassword = async function (password) {
  const user = this;
  const compare = await bcrypt.compare(password, user.password);
  return compare;
}


module.exports = mongoose.model("Mentor", UserSchema);