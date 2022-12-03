const { Schema, default: mongoose } = require("mongoose");

const user_Schema = new Schema({
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Manager",
  },
  user_Name: {
    type: String,
    required: true,
  },
  user_Email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  mobile_No: {
    type: Number,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "user",
  },
  dateOfJoin: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model('User' , user_Schema);
module.exports = User;