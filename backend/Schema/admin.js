const { Schema, default: mongoose } = require("mongoose")

const admin_Schema = new Schema({
    admin_Name:{
        type : String,
        required:true
    },
    admin_Email:{
        unique:true,
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    role : {
        type : String,
        default : 'admin'
    }
}) 

const Admin= mongoose.model('Admin' , admin_Schema);
module.exports = Admin;  