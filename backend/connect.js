const mongoose  = require('mongoose');

const conectToDatabase = () =>{
    mongoose.connect('mongodb://localhost:27017/user-control' , ()=>{
        console.log('connected to database...')
    })
}

module.exports= conectToDatabase;