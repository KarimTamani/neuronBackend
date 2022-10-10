import { gql } from "apollo-server-express";

export default gql`

   extend type Mutation  {
        diagnosis (chestXray : ChestXray!) : Diagnosis! @imeiOrAuth
        confirmDiagnosis(diagnosisId : ID! , confirmation : [String!]!) : ID! @imeiOrAuth 
   }
   extend type Query { 
        getAllPredictions : [Diagnosis!]! @imeiOrAuth
   } 
    input ChestXray   { 
        image : Upload! , 
        language : String! 
    }

    type Diagnosis { 
        id : ID!
        images : [String!]! , 
        predictions : [Prediction!]!
        confirmation : String
    }

    type Prediction { 
        disease : String! 
        prop : Float! 
    }

`