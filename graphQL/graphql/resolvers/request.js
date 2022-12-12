const Manager = require("../../Schema/manager");
const RequestManager = require("../../Schema/managerRequest");
const RequestUser = require("../../Schema/userRequest");
const { fetchManager } = require("../helpers");

const noValue = {
  name : null,
  mobile : null,
  address : null , 
  _id : null,
  email : null , 
  role : null , 
  manager : null
}

module.exports = {
  requestManager: async ({ signupManagerInput }) => {
    let managerRequest = {
      name: signupManagerInput.name,
      email: signupManagerInput.email,
      password: signupManagerInput.password,
      mobile: signupManagerInput.mobile,
      address: signupManagerInput.address,
    };
    try {
      let newRequest = new RequestManager(managerRequest);
      await newRequest.save();
      return newRequest;
    } catch (error) {
      throw new Error("Server Error !");
    }
  },
  requestUser: async ({ signupUserInput }) => {
    const manager = await Manager.findById(signupUserInput.manager);
    if (!manager) {
      throw new Error("Manager not found!");
    }
    const alreadyRequested  = await RequestUser.findOne({email : signupUserInput.email});
    if(alreadyRequested){
      throw new Error("Email already exists")
    }
    try {
      let userRequest = {
        manager: signupUserInput.manager,
        name: signupUserInput.name,
        email: signupUserInput.email,
        password: signupUserInput.password,
        mobile: signupUserInput.mobile,
        address: signupUserInput.address,
      };
      let newRequest = new RequestUser(userRequest);
      await newRequest.save();
      return {
        ...newRequest._doc,
        manager: fetchManager.bind(this, newRequest.manager),
      };
    } catch (error) {
      console.log(error);
    }
  },
  deleteManagerRequest:async(args , req)=>{
    if(!req.isAuth){
      throw new Error('Invalid access')
    }
    try {
      const managerRequest = await RequestManager.findById(args.id);
      if(!managerRequest){
        throw new Error('Request not found')
      }   
      const deletdManager = await RequestManager.findByIdAndDelete(args.id);
      return deletdManager
    } catch (error) {
        console.log(error)
    }
  },
  deleteUserRequest:async(args , req)=>{
    if(!req.isAuth){
      throw new Error('Invalid access')
    }
    try {
      const userRequest = await RequestUser.findById(args.id);
      if(!userRequest){
        throw new Error('Request not found')
      }   
      const deletdUser = await RequestUser.findByIdAndDelete(args.id);
      return {...deletdUser._doc , manager: fetchManager.bind(this  , deletdUser.manager)}
    } catch (error) {
        console.log(error)
    }
  },
  allRequestedUsers : async()=>{
    try {
      const userRequest = await RequestUser.find();
      
      return userRequest.map((request)=>{
        return {...request._doc , manager: fetchManager.bind(this  , request.manager)}
      })
    } catch (error) {
      console.log(error)
    }
  },
  allRequestedManagers : async()=>{
    try {
      const managerRequest = await RequestManager.find();
      return managerRequest
    } catch (error) {
      console.log(error)
    }
  }
};
