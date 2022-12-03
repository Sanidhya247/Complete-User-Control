const express = require("express");
const { body, validationResult } = require("express-validator");
const Admin = require("../Schema/admin");
const Manager = require("../Schema/manager");
const User = require("../Schema/user");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
router.post(
  "/login",
  [body("email").isEmail(), body("password").isLength({ min: 4 })],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      let user = await User.findOne({ user_Email: req.body.email });
      let manager = await Manager.findOne({ manager_Email: req.body.email });
      let admin = await Admin.findOne({ admin_Email: req.body.email });
      if (admin) {
        let comparePW = await bcrypt.compare(req.body.password, admin.password);
        if (comparePW) {
          let userId = {
            id: admin._id,
          };
          const PRIVATE_KEY = process.env.PRIVATE_KEY;
          const authToken = jwt.sign(userId, PRIVATE_KEY);
          return res.send({ authToken ,administrator:'admin',detail:admin});
        } else {
          return res.send({ message: "Invalid Credentials" });
        }
      } else if (manager) {
        let comparePW = await bcrypt.compare(
          req.body.password,
          manager.password
        );
        if (comparePW) {
          let userId = {
            id: manager._id,
          };
          const PRIVATE_KEY = process.env.PRIVATE_KEY;
          const authToken = jwt.sign(userId, PRIVATE_KEY);
          return res.send({ authToken,administrator:'manager',detail:manager });
        } else {
          return res.send({ message: "Invalid Credentials" });
        }
      } else if (user) {
        let comparePW = await bcrypt.compare(req.body.password, user.password);
        if (comparePW) {
          let userId = {
            id: user._id,
          };
          const PRIVATE_KEY = process.env.PRIVATE_KEY;
          const authToken = jwt.sign(userId, PRIVATE_KEY);
          return res.send({ authToken ,administrator:'user' ,detail:user});
        } else {
          return res.send({ message: "Invalid Credentials" });
        }
      } else {
        return res.send({ message: " Invalid credentials" });
      }
    } catch (error) {
      res.send(error);
      console.log(error);
    }
  }
);

module.exports = router;
