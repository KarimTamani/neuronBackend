import { gql } from "apollo-server-express";

export default gql`

   extend type Mutation  {
        diagnosis (chestXray : ChestXray!) : Diagnosis! @userAuth
        confirmDiagnosis(diagnosisId : ID! , confirmation : [String!]!) : ID! @userAuth 
   }
   extend type Query { 
        getAllPredictions(offset : Int! , limit : Int!) : [Diagnosis!]! @userAuth
   } 
    input ChestXray   { 
        image : Upload! , 
        language : String! 
    }

    type Diagnosis { 
        id : ID!
        images : [String!]! , 
        predictions : [Prediction!]!
        confirmation : [String!]
        createdAt : String!
    }

    type Prediction { 
        disease : String! 
        prop : Float! 
    }

`