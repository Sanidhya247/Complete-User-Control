const jwt = require("jsonwebtoken");
const Admin = require("../Schema/admin");
const Manager = require("../Schema/manager");
const User = require("../Schema/user");

const fetchManager = async (req, res, next) => {
  try {
    let authToken = req.header("authToken");
    if (!authToken) {
      return res.send({ message: "please enter valid parameters" });
    }
    const verification = jwt.verify(authToken, process.env.PRIVATE_KEY);
    let manager = await Manager.findById(verification.id);
    let admin = await Admin.findById(verification.id);
    let user = await User.findById(verification.id);
    if(admin){
      return next();
    }
    else if(manager){
      req.manager = verification.id;
    }
    else if(user){
      return next()
    }
    else{
      return res.status(401).send({message : 'Invalid Access...'})
    }
    next();
  } catch (error) {
    res.send(error);
    console.log(error);
  }
};

module.exports = fetchManager;
