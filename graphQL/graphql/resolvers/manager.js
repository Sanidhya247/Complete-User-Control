const Manager = require("../../Schema/manager");
const User = require("../../Schema/user");
const { genHashPw, fetchManager } = require("../helpers");
const { fetchUsers} = require('../helpers');


module.exports = {
  signupManager: async (args , req) => {
    if(!req.isAuth){
      throw new Error('Invald access')
    }
    const email = await Manager.findOne({
      email: args.signupManagerInput.email,
    });
    if (email) {
      throw new Error("Email already exists");
    }
    try {
      const securePW = await genHashPw(args.signupManagerInput.password);
      const newManager = {
        name: args.signupManagerInput.name,
        email: args.signupManagerInput.email,
        password: securePW,
        mobile: args.signupManagerInput.mobile,
        address: args.signupManagerInput.address,
      };
      const manager = new Manager(newManager);
      await manager.save();
      return manager;
    } catch (error) {
      console.log(error);
    }
  },
  editManager: async ({ editManagerInput  } ,req) => {
    if(!req.isAuth){
      throw new Error('Invalid access')
     }
    const manager = await Manager.findById(editManagerInput._id);
    if (!manager) {
      throw new Error("Manager not Found!");
    }
    try {
      let editManager = {
        name: editManagerInput.name,
        email: editManagerInput.email,
        address: editManagerInput.address,
        mobile: editManagerInput.mobile,
      };
      const updatedManager = await Manager.findByIdAndUpdate(
        manager._id,
        { $set: editManager },
        { new: true }
      );
      return {...updatedManager._doc , users : fetchUsers.bind(this , updatedManager._id)}
    } catch (error) {
      console.log(error);
    }
  },
  deleteManager:async(args , req)=>{
    console.log(req.isAuth)
    if(!req.isAuth){
      throw new Error('Invalid access')
     }
    const manager = await Manager.findById(args.id);
    if(!manager){
      throw new Error('Manager not found!')
    }
    try {
      const users =  await User.find({manager : manager._id});
      const deletedUsers = users.forEach(async(user)=>{
        return await User.findByIdAndDelete(user._id)
      })
      await Manager.findByIdAndDelete(args.id)
      return {...manager._doc , users : users}
    } catch (error) {
      console.log(error)
    }
  },
  managers: async () => {
  
    try {
      const managers = await Manager.find();
      return managers.map((manager) => {
        return {
          ...manager._doc,
          users: fetchUsers.bind(this, manager._id),
        };
      });
    } catch (error) {
      console.error(error);
    }
  },
  myusers:async(args)=>{
    const id  = args.id;
    try {
    const users = await User.find({manager : id});
    return users.map((user)=>{
      return {...user._doc , manager : fetchManager.bind(this , user.manager)}
    })
  } catch (error) {
   console.log(error)   
  }
  }
};
