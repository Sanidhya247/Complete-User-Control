const express = require("express");
const User = require("../Schema/user");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Manager = require("../Schema/manager");
const Admin = require("../Schema/admin");

router.put("/user/:id", async (req, res) => {
  let id = req.params.id;
  if (id) {
    let user = await User.findById(id);
    if (!user) {
      return res.status(404).send({ message: "Not Found !" });
    }
    let updatedUser = {};
    if (user) {
      try {
        const authToken = req.header("authToken");
        const verification = jwt.verify(authToken, process.env.PRIVATE_KEY);
        if (verification.id === user._id.toString() || verification.id === user.manager.toString()) {
          updatedUser = req.body;
          try {
            let newUser = await User.findByIdAndUpdate(
              id,
              { $set: updatedUser },
              { new: true }
            );
            return res.send(newUser);
          } catch (error) {
            console.error(error);
            res.send(error);
          }
        } else {
          return res.status(401).send({ message: "Unauthorized Access" });
        }
      } catch (error) {
        res.send(error);
        console.error(error);
      }
    } else {
      return res.status(400).send({ message: "invalid" });
    }
  } else {
    return res.send("enter valid parameters");
  }
});

router.put("/manager/:id", async (req, res) => {
  const id = req.params.id;
  let updatedManager = {};
  try {
    const manager = await Manager.findById(id);
    if (!manager) {
      return res.status(404).send({ message: "Not Found !" });
    }
    if (manager) {
      let authToken = req.header("authToken");
      const verification = jwt.verify(authToken, process.env.PRIVATE_KEY);
      let admin = await Admin.findById(verification.id);
      if (admin || verification.id === manager._id.toString()) {
        updatedManager = req.body;
        let uManager = await Manager.findByIdAndUpdate(
          id,
          { $set: updatedManager },
          { new: true }
        );
        return res.send(uManager);
      } else {
        return res.status(401).send({ message: "Unauthorized Access" });
      }
    } else {
      return res.send("invalid parameters");
    }
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;
