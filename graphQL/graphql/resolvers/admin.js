const Admin = require("../../Schema/admin");
const { genHashPw } = require("../helpers");
module.exports = {
  signupAdmin: async (args) => {
    const email = args.signupAdminInput.email;
    try {
      const alreadyExists = await Admin.findOne({ email });
      if (alreadyExists) {
        throw new Error("Email already exists");
      }
      const securePW = await genHashPw(args.signupAdminInput.password);
      const newAdmin = {
        name: args.signupAdminInput.name,
        email: email,
        password: securePW,
      };
      const admin = new Admin(newAdmin);
      await admin.save();
      return { ...admin._doc, password: null };
    } catch (error) {
      console.log(error);
    }
  },
  admins: async () => {
    try {
      const admins = await Admin.find();
      return admins.map((admin) => {
        return { ...admin._doc, password: null };
      });
    } catch (error) {
      console.log(error);
    }
  },
};
