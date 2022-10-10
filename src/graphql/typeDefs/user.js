import { gql } from "apollo-server-express";

export default gql`

    extend type Query {
        Login(identifier : String! , password : String!) : User 

    }

    extend type Mutation { 
        SignUp(userInput : UserInput!) : User!
        editProfil(userInput : UserInput!) : User!
    }

    input UserInput { 
        name : String! 
        lastname : String! 
        email : String! 
        password : String  
        phone : String! 
        occupation : String  
    }

    type User {
        id:  ID! 
        name : String! 
        lastname : String!
        email : String! 
        phone : String! 
        occupation : String 
    }
    
    
`