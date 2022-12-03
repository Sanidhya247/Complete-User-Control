const express = require("express");
const { body, validationResult } = require("express-validator");
const requestManager = require("../Schema/managerRequest");
const UserRequest = require("../Schema/userRequest");
const router = express.Router();

router.post(
  "/manager",
  [
    body("requested_manager_Name").isLength({ min: 2 }),
    body("requested_manager_Email").isEmail(),
    body("password").isLength({ min: 4 }),
    body("mobile_No").isLength({ min: 10 }),
    body("address").isLength({ min: 5 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    try {
      const requestmanager = await requestManager.create({
        requested_manager_Name: req.body.requested_manager_Name,
        requested_manager_Email: req.body.requested_manager_Email,
        password: req.body.password,
        mobile_No: req.body.mobile_No,
        address: req.body.address,
      });
      res.send(requestmanager);
    } catch (error) {
      res.send({ error });
      console.error(error);
    }
  }
);

router.post(
    "/user",
    [
      body("requested_user_Name").isLength({ min: 2 }),
      body("requested_user_Email").isEmail(),
      body("password").isLength({ min: 4 }),
      body("mobile_No").isLength({ min: 10 }),
      body("address").isLength({ min: 5 }),
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      try {
        const userRequest = await UserRequest.create({
          requested_user_Name: req.body.requested_user_Name,
          requested_user_Email: req.body.requested_user_Email,
          password: req.body.password,
          mobile_No: req.body.mobile_No,
          address: req.body.address,
          manager: req.body.manager,
        });
        res.send(userRequest)
      } catch (error) {
          res.send({ error });
          console.error(error);
        }
    }
  );

module.exports = router;
