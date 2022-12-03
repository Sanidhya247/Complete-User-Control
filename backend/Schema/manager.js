const { Schema, default: mongoose } = require("mongoose");

const manager_Schema = new Schema({
  manager_Name: {
    type: String,
    required: true,
  },
  manager_Email: {
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
  dateOfJoin: {
    type: Date,
    default: Date.now,
  },
});

const Manager = mongoose.model("Manager", manager_Schema);
module.exports = Manager;
