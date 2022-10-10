import { gql } from "apollo-server-express";

export default gql`

    extend type Query {
        Login(identifier : String! , password : String!) : UserToken! 
    }

    extend type Mutation { 
        SignUp(userInput : UserInput!) : UserToken!  
        editProfil(userInput : UserInput!) : UserToken! @userAuth  
    }

    input UserInput { 
        name : String! 
        lastname : String! 
        email : String! 
        password : String  
        phone : String
        occupation : String  
    }

    type User {
        id:  ID! 
        name : String! 
        lastname : String!
        email : String! 
        phone : String 
        occupation : String 
        createdAt : String! 
        updatedAt : String!
    }

    type UserToken { 
        user : User! 
        token : String!
    }
    
    
`