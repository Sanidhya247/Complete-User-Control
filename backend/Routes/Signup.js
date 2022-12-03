const express = require("express");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const Admin = require("../Schema/admin");
const Manager = require("../Schema/manager");
const User = require("../Schema/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchManager = require("../middleware/fetchManager");
require("dotenv").config();

router.post(
  "/admin",
  [
    body("admin_Name").isLength({ min: 2 }),
    body("admin_Email").isEmail(),
    body("password").isLength({ min: 4 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const salt = await bcrypt.genSalt(10);
    const securePw = await bcrypt.hash(req.body.password, salt);
    try {
      const admin = await Admin.create({
        admin_Name: req.body.admin_Name,
        admin_Email: req.body.admin_Email,
        password: securePw,
      });
      let userId = {
        id: admin._id,
      };
      const PRIVATE_KEY = process.env.PRIVATE_KEY;
      const authToken = jwt.sign(userId, PRIVATE_KEY);
      res.send({ authToken });
    } catch (error) {
      res.send({ error });
      console.error(error);
    }
  }
);

router.post(
  "/manager",
  [
    body("manager_Name").isLength({ min: 2 }),
    body("manager_Email").isEmail(),
    body("password").isLength({ min: 4 }),
    body("mobile_No").isLength({ min: 10 }),
    body("address").isLength({ min: 5 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const salt = await bcrypt.genSalt(10);
    const securePw = await bcrypt.hash(req.body.password, salt);
    try {
      const manager = await Manager.create({
        manager_Name: req.body.manager_Name,
        manager_Email: req.body.manager_Email,
        password: securePw,
        mobile_No: req.body.mobile_No,
        address: req.body.address,
      });
      let userId = {
        id: manager._id,
      };
      const PRIVATE_KEY = process.env.PRIVATE_KEY;
      const authToken = jwt.sign(userId, PRIVATE_KEY);
      res.send({ authToken });
    } catch (error) {
        res.send({ error });
        console.error(error);
      }
  }
);

router.post(
  "/user",
  [
    body("user_Name").isLength({ min: 2 }),
    body("user_Email").isEmail(),
    body("password").isLength({ min: 4 }),
    body("mobile_No").isLength({ min: 10 }),
    body("address").isLength({ min: 5 }),
  ],
  fetchManager,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const salt = await bcrypt.genSalt(10);
    const securePw = await bcrypt.hash(req.body.password, salt);
    try {
      const user = await User.create({
        user_Name: req.body.user_Name,
        user_Email: req.body.user_Email,
        password: securePw,
        mobile_No: req.body.mobile_No,
        address: req.body.address,
        manager: req.manager,
      });
      res.send(user)
    } catch (error) {
        res.send({ error });
        console.error(error);
      }
  }
);

module.exports = router;
