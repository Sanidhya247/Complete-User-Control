const { Schema, default: mongoose } = require("mongoose");

const user_Schema = new Schema({
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Manager",
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  mobile: {
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