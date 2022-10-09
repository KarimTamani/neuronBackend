import { gql } from "apollo-server-express";

export default gql`

   extend type Mutation  {
        diagnosis (chestXray : ChestXray!) : Diagnosis!
   }


   extend type Query { 
        getAllPredictions : [String!]!
   } 
    input ChestXray   { 
        image : Upload! , 
        language : String! 
    }

    type Diagnosis { 
        images : [String!]! , 
        predictions : [Prediction!]!
    }

    type Prediction { 
        disease : String! 
        prop : Float! 
    }

`