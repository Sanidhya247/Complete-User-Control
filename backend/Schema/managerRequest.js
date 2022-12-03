const { Schema, default: mongoose } = require("mongoose");

const manager_Request_Schema = new Schema({
  requested_manager_Name: {
    type: String,
    required: true,
  },
  requested_manager_Email: {
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
    default: "manager",
  },
  dateOfRequest: {
    type: Date,
    default: Date.now,
  },
});

const requestManager = mongoose.model("requestManager", manager_Request_Schema);
module.exports = requestManager;
