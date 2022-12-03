const { Schema, default: mongoose } = require("mongoose");

const user_Request_Schema = new Schema({
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Manager",
  },
  requested_user_Name: {
    type: String,
    required: true,
  },
  requested_user_Email: {
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
  dateOfRequest: {
    type: Date,
    default: Date.now,
  },
});

const UserRequest = mongoose.model('UserRequest' , user_Request_Schema);
module.exports = UserRequest;