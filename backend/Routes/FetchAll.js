const e = require("express");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const fetchManager = require("../middleware/fetchManager");
const Admin = require("../Schema/admin");
const Manager = require("../Schema/manager");
const requestManager = require("../Schema/managerRequest");
const User = require("../Schema/user");
const UserRequest = require("../Schema/userRequest");

router.get("/allusers", fetchManager, async (req, res) => {
  const authToken = req.header("authToken");
  if (authToken) {
    const verification = jwt.verify(authToken, process.env.PRIVATE_KEY);
    const manager = await Manager.findById(verification.id);
    const admin = await Admin.findById(verification.id);
    const user = await User.findById(verification.id);
    if (admin) { 
      const user = await User.find().select("user_Name");
      return res.send(user);
    } else if (manager) {
      const user = await User.find({ manager: manager._id }).select(
        "-password"
      );
      return res.send(user);
    }
    else if (user) {
    
      const newuser = await User.find({ manager:user.manager }).select(
        "-password"
      );
      return res.send(newuser);
    }
    else {
      return res.status(401).send({ message: "Invalid Access" });
    }
  } else {
    res.status(400).send("Invalid Token");
  }
});

router.get("/allmanagers", async (req, res) => {
  const authToken = req.header("authToken");
  if (authToken) {
    try {
      const verification = jwt.verify(authToken , process.env.PRIVATE_KEY);
      if(verification){
        let admin = await Admin.findById(verification.id);
        let user = await User.findById(verification.id)
        if(admin){
          let manager = await Manager.find();
          return res.send(manager);
        }else if(user){
          let manager = await Manager.findById(user.manager);
          return res.send(manager)
        }else{
          res.status(401).send({message : 'Invalid Access...'})
        }
      }else{
        res.status(400).send({message : 'Invalid Token...'})
      }
    } catch (error) {
      res.send(error);
      console.error(error);
    }
  }
});

router.get('/alladmins',async(req,res)=>{
  try {
    let admin = await Admin.find().select('-password')
    res.send(admin)
  } catch (error) {
    res.send(error);
    console.error(error)
  }
})

router.get('/requestedmanagers' , async(req,res)=>{
  let authToken = req.header('authToken');
  if(authToken){
    try {
    let verification = jwt.verify(authToken , process.env.PRIVATE_KEY);
    let admin = await Admin.findById(verification.id);
    if(admin){
      let managerRequests = await requestManager.find();
      return res.send(managerRequests);  
    }else{
      return res.send({message : 'Invalid access...'})
    }
  } catch (error) {
      res.send(error);
      console.error(error);
  }
  }else{
    res.send({message : 'please enter valid parameters'})
  }
})

router.get('/requestedusers' , async(req,res)=>{
  let authToken = req.header('authToken');
  if(authToken){
    let verification = jwt.verify(authToken , process.env.PRIVATE_KEY);
    let requestedusers = await UserRequest.find({manager : verification.id});
    return res.send(requestedusers);

  }else{
    return res.send({message : 'not token available'})
  }
})

module.exports = router;
