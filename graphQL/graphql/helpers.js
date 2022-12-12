const bcrypt = require('bcryptjs');
const Manager = require('../Schema/manager')
const User = require('../Schema/user')

const genHashPw = async(password)=>{
    const salt  =await bcrypt.genSalt(10);
    const genPW = await bcrypt.hash(password,salt);
    return genPW
}

const fetchManager = async (managerID) => {
    const manager = await Manager.findById(managerID);
    return { ...manager._doc, users: fetchUsers.bind(this, manager._doc._id) };
  };

const fetchUsers = async (managerID) => {
    const manager = await Manager.findById(managerID);
    if (!manager) {
      throw new Error("Manager not found!");
    }
    try {
      const users = await User.find({ manager: managerID });
      return users.map((user) => {
        return { ...user._doc, manager: fetchManager.bind(this , user.manager) };
      });
    } catch (error) {
      console.error(error);
    }
  };

exports.genHashPw =genHashPw 
exports.fetchManager = fetchManager
exports.fetchUsers = fetchUsers