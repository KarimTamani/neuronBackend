import express from "express";
import { ApolloServer } from "apollo-server-express";
import { Server } from "http";
import { typeDefs, resolvers, directives } from "./graphql";
import { PORT, NEURON_IMAGE_DIR, PREDICTION_DIR } from "./config";
import { graphqlUploadExpress } from 'graphql-upload';
import db from "../models";
import {userAuth } from "./middlewares" ; 
import { makeExecutableSchema } from '@graphql-tools/schema'

 


const app = express();
var http = Server(app);


app.use(userAuth) ; 


app.use(graphqlUploadExpress());
app.use("/images", express.static(NEURON_IMAGE_DIR));
app.use("/outputs" , express.static(PREDICTION_DIR))
 
var schema = makeExecutableSchema({ typeDefs , resolvers} ) 

schema = directives.userAuthDirective()(schema) ; 



async function startServer() {
    
    const apolloServer = new ApolloServer({
        csrfPrevention: false,
        schema ,  
        context : ({req}) => { 
            const {isUserAuth , user , imei , imeiValid} = req ; 
            return {
                db , 
                isUserAuth , 
                user , 
                imei , 
                imeiValid 
            }
        }
    });

    await apolloServer.start();


    http.listen(PORT, async () => {
        try {
            // apply the apollo server as middleware 
            apolloServer.applyMiddleware({ app });
            // listen 


            console.log(`Server is runing on port ${PORT}`)
        } catch (error) {
            console.log("Error : ", error)
        }
    })

}

startServer();






