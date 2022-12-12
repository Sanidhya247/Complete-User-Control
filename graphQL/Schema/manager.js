const { Schema, default: mongoose } = require("mongoose");

const manager_Schema = new Schema({
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
    default: "manager",
  },
  dateOfJoin: {
    type: Date,
    default: Date.now,
  },
  users : [
    {
      type : Schema.Types.ObjectId,
      ref : "User"
    }
  ]
});

const Manager = mongoose.model("Manager", manager_Schema);
module.exports = Manager;
