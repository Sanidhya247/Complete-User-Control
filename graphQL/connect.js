const mongoose  = require('mongoose');
const connectToDataBase = ()=>{
    mongoose.connect('mongodb://localhost:27017/graphql-user' , ()=>{
        console.log('Connected To Database')
    })
}

module.exports = connectToDataBase;