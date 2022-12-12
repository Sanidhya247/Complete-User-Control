const { buildSchema } = require("graphql");

module.exports = buildSchema(`
    type Admin {
        _id : ID!
        name : String!
        email : String!
        role : String! 
    }

    type Manager {
        _id : ID!
        name : String!
        email : String!
        role : String!
        address : String!
        mobile : String! 
        users : [User!]
    }

    type User {
        _id : ID!
        name : String!
        email : String!
        role : String!
        address : String!
        mobile : String!
        manager : Manager
    }
    type Request {
        password :String!
        _id : ID!
        name : String!
        email : String!
        role : String!
        address : String!
        mobile : String!
        manager : Manager
    }

    type authValue {
        token :String!
        _id : ID!
        administrator : String!
    }

    input signupAdminInput {
        name : String!
        email : String!
        password : String!
    }

    input signupManagerInput {
        name : String!
        email : String!
        password : String!
        mobile : String!
        address : String!
    }

    input signupUserInput {
        manager : String!
        name : String!
        email : String!
        password : String!
        mobile : String!
        address : String!
    }

    input editManagerInput {
        _id : ID!
        name : String!
        email : String!
        mobile : String!
        address : String!
    }

    input editUserInput {
        _id : ID!
        name : String!
        email : String!
        mobile : String!
        address : String!
    }
    
    type RootQuery{
        admins : [Admin!]!
        managers : [Manager!]!
        users : [User!]!

        deleteManager(id:String!) : Manager
        deleteUser(id:String!) : User

        Login(email:String! , password : String!) : authValue!
        allRequestedManagers : [Request]
        allRequestedUsers : [Request]
        deleteManagerRequest(id:ID!) : Manager 
        deleteUserRequest(id:ID!) : User

        myusers(id:String):[User]
    }

    type RootMutation{
        requestManager(signupManagerInput:signupManagerInput) : Manager
        requestUser(signupUserInput:signupUserInput) : User

        signupAdmin(signupAdminInput:signupAdminInput) : Admin
        signupManager(signupManagerInput:signupManagerInput ) : Manager
        signupUser(signupUserInput:signupUserInput ) : User

        editManager(editManagerInput:editManagerInput ) : Manager
        editUser(editUserInput:editUserInput) : User
    }

    schema{
        query:RootQuery
        mutation:RootMutation
    }
`);
