const { Schema, default: mongoose } = require("mongoose")

const admin_Schema = new Schema({
    name:{
        type : String,
        required:true
    },
    email:{
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
    },
    managers : [
        {
            type : Schema.Types.ObjectId,
            ref : "Manager"
        }
    ]
}) 

const Admin= mongoose.model('Admin' , admin_Schema);
module.exports = Admin;  