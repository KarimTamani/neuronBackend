
import { ApolloError } from "apollo-server-express";
import { hash , compare } from "bcryptjs";
import { signUpValidator } from "../../validations/";

export default {
    Query: {
        Login: (_, { identifier, password }, { db }) => {

        }

    },
    Mutation: {

        SignUp: async (_, { userInput }, { db }) => {
            try {
                // validate user input 
                await signUpValidator.validate(userInput, { abortEarly: true });
                
                // hash user password before insert it into database 
                userInput.password = await hash(userInput.password , 10) 

                // create and return user 
                return  await db.User.create(userInput) ; 

            } catch (error) {
                return new ApolloError(error.message);
            }

        },

        editProfil: (_, { userInput }, { db }) => {

        }

    }
}