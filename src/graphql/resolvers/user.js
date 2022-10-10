
import { ApolloError } from "apollo-server-express";
import { hash, compare } from "bcryptjs";
import { Op } from "sequelize";
import { createToken } from "../../functions/jwt";
import { signUpValidator, loginValidator, editProfilValidator } from "../../validations/";

export default {
    Query: {
        Login: async (_, { identifier, password }, { db }) => {

            try {
                await loginValidator.validate({ identifier, password }, { abortEarly: true });
                // get user that identifier match his email or phone number 
                var user = await db.User.findOne({
                    where: {

                        [Op.or]: [
                            { email: identifier },
                            { phone: identifier }
                        ]
                    }
                });
                // there is no user with the given identifier 
                if (user == null)
                    throw new Error("Identifier not valid");


                // check the password 
                var isMath = await compare(password, user.password);

                if (!isMath)
                    throw new Error("Wrong password");

                // create token 
                var token = createToken(user.email, user.password);
                
                return { 
                    user : user , 
                    token : token 
                }
            } catch (error) {
                return new ApolloError(error.message);
            }
        }

    },
    Mutation: {

        SignUp: async (_, { userInput }, { db }) => {
            try {
                // validate user input 
                await signUpValidator.validate(userInput, { abortEarly: true });

                // hash user password before insert it into database 
                userInput.password = await hash(userInput.password, 10) ; 
                // create token 
                var token = await createToken(userInput.email, userInput.password);
                // create and return user 
                var user = await db.User.create(userInput);

                return {
                    user: user,
                    token: token,
                }
            } catch (error) {
                return new ApolloError(error.message);
            }

        },

        editProfil: async (_, { userInput }, { db , user  }) => {

            try { 
                // validate user input 
                await editProfilValidator(user.id).validate(userInput , { abortEarly : true}) ; 
            
                // update user 
                await db.User.update(userInput , {
                    where : { 
                        id : user.id
                    }
                })

                // create new token 
                var token = createToken(userInput.email , user.password) ; 

                return {
                    user : db.User.findOne({
                        where : { 
                            id : user.id
                        }
                    }) , 
                    token : token 
                }

                return {

                }

            }catch(error) {
                return new ApolloError(error.message) ; 
            }
            
        }

    }
}