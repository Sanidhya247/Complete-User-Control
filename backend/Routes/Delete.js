const express = require("express");
const Admin = require("../Schema/admin");
const Manager = require("../Schema/manager");
const User = require("../Schema/user");
const router = express.Router();
const jwt = require("jsonwebtoken");
const UserRequest = require("../Schema/userRequest");
const ManagerRequest = require("../Schema/managerRequest");
router.delete("/manager/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const manager = await Manager.findById(id);
    if (!manager) {
      return res.status(404).send({ message: "Manager not found !" });
    }
    const authToken = req.header("authToken");
    const verification = jwt.verify(authToken, process.env.PRIVATE_KEY);
    const admin = await Admin.findById(verification.id);
    if (manager._id === verification.id || admin) {
      const users = await User.find({ manager: manager._id });
      const deletedManager = await Manager.findByIdAndDelete(id);

      users.forEach(async (user) => {
        await User.findByIdAndDelete(user._id.toString());
      });

      res.send(deletedManager);
    } else {
      return res.status(401).send("Unauthorized Access...");
    }
  } catch (error) {
    res.send(error);
    console.error(error);
  }
});

router.delete("/user/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).send({ message: "User Not found" });
    }
    const authToken = req.header("authToken");
    const verification = jwt.verify(authToken, process.env.PRIVATE_KEY);
    const manager = await Manager.findById(verification.id);

    if (user._id === verification.id) {
      const deletedUser = await User.findByIdAndDelete(id);
      return res.send(deletedUser);
    } else if (user.manager.toString() === manager._id.toString()) {
      const deletedUser = await User.findByIdAndDelete(id);
      return res.send(deletedUser);
    } else {
      return res.status(401).send({ Message: "Unauthorized access" });
    }
  } catch (error) {
    res.send(error);
    console.error(error);
  }
});

router.delete("/request/user/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const user = await UserRequest.findById(id);
    if (!user) {
      return res.status(404).send({ message: "User Not found" });
    }
    const authToken = req.header("authToken");
    const verification = jwt.verify(authToken, process.env.PRIVATE_KEY);
    const manager = await Manager.findById(verification.id);

    if (user._id === verification.id) {
      const deletedUser = await UserRequest.findByIdAndDelete(id);
      return res.send(deletedUser);
    } else if (user.manager.toString() === manager._id.toString()) {
      const deletedUser = await UserRequest.findByIdAndDelete(id);
      return res.send(deletedUser);
    } else {
      return res.status(401).send({ Message: "Unauthorized access" });
    }
  } catch (error) {
    res.send(error);
    console.error(error);
  }
});

router.delete("/request/manager/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const manager = await ManagerRequest.findById(id);
    if (!manager) {
      return res.status(404).send({ message: "Manager not found !" });
    }
    const authToken = req.header("authToken");
    const verification = jwt.verify(authToken, process.env.PRIVATE_KEY);
    const admin = await Admin.findById(verification.id);
    if (manager._id === verification.id || admin) {
      const deletedManager = await ManagerRequest.findByIdAndDelete(id);

      res.send(deletedManager);
    } else {
      return res.status(401).send("Unauthorized Access...");
    }
  } catch (error) {
    res.send(error);
    console.error(error);
  }
});

module.exports = router;
