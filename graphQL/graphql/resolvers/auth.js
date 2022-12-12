const Admin = require("../../Schema/admin");
const Manager = require("../../Schema/manager");
const User = require("../../Schema/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();

module.exports = {
  Login: async ({ email, password }) => {
    const admin = await Admin.findOne({ email });
    const manager = await Manager.findOne({ email });
    const user = await User.findOne({ email });
    if (admin) {
      const verification = await bcrypt.compare(password, admin.password);
      if (verification) {
        const token = jwt.sign({ id: admin._id }, process.env.PRIVATE_KEY);
        return { token, _id: admin._id, administrator: admin.role };
      } else {
        throw new Error("Invalid credentials");
      }
    } else if (manager) {
      const verification = await bcrypt.compare(password, manager.password);
      if (verification) {
        const token = jwt.sign({ id: manager._id }, process.env.PRIVATE_KEY);
        return { token, _id: manager._id, administrator: manager.role };
      } else {
        throw new Error("Invalid credentials");
      }
    } else if (user) {
      const verification = await bcrypt.compare(password, user.password);
      if (verification) {
        const token = jwt.sign({ id: user._id }, process.env.PRIVATE_KEY);
        return { token, _id: user._id, administrator: user.role };
      } else {
        throw new Error("Invalid credentials");
      }
    } else {
      console.log("invalid");
    }
  },
};
