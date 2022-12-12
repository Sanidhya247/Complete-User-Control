const User = require("../../Schema/user");
const Manager = require("../../Schema/manager");
const { genHashPw , fetchManager  , fetchUsers } = require("../helpers");

module.exports = {
  signupUser: async (args) => {
    const email = await User.findOne({ email: args.signupUserInput.email });
    if (email) {
      throw new Error("Email already exists");
    }
    try {
      const securePW = await genHashPw(args.signupUserInput.password);
      const newUser = {
        manager : args.signupUserInput.manager , 
        name: args.signupUserInput.name,
        email: args.signupUserInput.email,
        password: securePW,
        mobile: args.signupUserInput.mobile,
        address: args.signupUserInput.address,
      };
      const user = new User(newUser);  
      const manager = await Manager.findById(user.manager);
      if(!manager){
        throw new Error('Manager not found!');
      } 
      manager.users.push(user.manager);
      await manager.save()
      await user.save();
      return({...user._doc , manager:fetchManager.bind(this , user._doc.manager)}) 
    } catch (error) {
      console.log(error);
    }
  },
  editUser: async ({ editUserInput } , req ) => {
    if(!req.isAuth){
      throw new Error("INVALID ACCESS")
    }
    const user = await User.findById(editUserInput._id);
    if (!user) {
      throw new Error("User not Found!");
    }

    try {
      let editUser = {
        name: editUserInput.name,
        email: editUserInput.email,
        address: editUserInput.address,
        mobile: editUserInput.mobile,
      };
      const updatedUser = await User.findByIdAndUpdate(
        user._id,
        { $set: editUser },
        { new: true }
      );
      return {...updatedUser._doc , manager : fetchManager.bind(this , updatedUser.manager)}
    } catch (error) {
      console.log(error);
    }
  },
  deleteUser:async(args , req)=>{
    if(!req.isAuth){
      throw new Error('Invalid access')
    }
    console.log(req.userId)

    const user = await User.findById(args.id);
    if(!user){
      throw new Error('User not found')
    }
    try {
      const deletedUser = await User.findByIdAndDelete(args.id);
      return {...deletedUser._doc , manager : fetchManager.bind(this , deletedUser.manager)}
    } catch (error) {
        console.log(error)
    }
  }, 
  users : async()=>{
    try {
    const users = await User.find();
    return users.map((user)=>{
        return {...user._doc  , manager:fetchManager.bind(this , user.manager)};
    })
  } catch (error) {
       console.error(error) 
  }
  }
};
