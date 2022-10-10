import express from "express";
import { ApolloServer } from "apollo-server-express";
import { Server } from "http";
import { typeDefs, resolvers } from "./graphql";
import { PORT, NEURON_IMAGE_DIR, PREDICTION_DIR } from "./config";
import { graphqlUploadExpress } from 'graphql-upload';
import db from "../models";
import {userAuth } from "./middlewares" ; 

const app = express();
var http = Server(app);


app.use(userAuth) ; 
app.use(graphqlUploadExpress());
app.use("/images", express.static(NEURON_IMAGE_DIR));
app.use("/outputs" , express.static(PREDICTION_DIR))



async function startServer() {
    
    const apolloServer = new ApolloServer({
        csrfPrevention: false,
        typeDefs,
        resolvers , 
        context : ({req}) => { 
            const {isUserAuth , user} = req ; 
            return {
                db , 
                isUserAuth , 
                user 
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






