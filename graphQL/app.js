const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const express = require('express');
const app = express();
const connectToDataBase = require('./connect');
connectToDataBase();
const cors = require('cors');
const {graphqlHTTP} = require('express-graphql');
const rootResolver = require('./graphql/resolvers');
const schema = require('./graphql/schema');
const isAuth = require('./middleware/isAuth');

app.use(isAuth);
app.use(cors());

app.use('/graphql' ,graphqlHTTP({
    rootValue:rootResolver,
    schema:schema,
    graphiql:true
}))



const PORT = 5000;
app.listen(PORT , ()=>{
    console.log(`Server Listening on ${PORT}`)
})
