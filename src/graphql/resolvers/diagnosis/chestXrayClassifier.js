import { createWriteStream } from "fs";
import path from "path";
import { NEURON_IMAGE_DIR, HOST } from "../../../config";
import { GraphQLUpload } from "graphql-upload";
import { neuronClient, appendHostToNeuronPredictionImages } from "../../../functions/";
import { ApolloError } from "apollo-server-express";
import { Op } from "sequelize";


export default {
    Upload: GraphQLUpload,
    Mutation: {
        diagnosis: async (_, { chestXray }, {  user, db }) => {



            // extract the filename and the create read stream function 
            // to create the read stream 
            const { filename, createReadStream } = await chestXray.image;

            var readStream = createReadStream();
            var newFilename = `${new Date().getTime().toString()}${path.parse(filename).ext}`;

            // create the distination path 
            // and open a write stream to it so we can copy the image 
            var distPath = path.join(NEURON_IMAGE_DIR, newFilename);
            var writeStream = createWriteStream(distPath);

            // copy the read stream to the write stream chunk by chunk 
            let stream = readStream.pipe(writeStream);

            var output = await new Promise((resolve, reject) => {
                stream.on("finish", async function () {
                    // prepare data for neuron client to send it to the neuron server 
                    const query = {
                        input: newFilename,
                        language: chestXray.language
                    };

                    // perform the neuron request inside promise to keep client waiting for the response 
                    var result = await new Promise((resolve, reject) => {
                        // create new client socket connect to the server 
                        // apply the diagnosis and wait for the result 
                        var responseEvent = neuronClient(query)
                        responseEvent.on("done", (data) => {
                            resolve(data)
                        })
                    });
                    // append the host to eaach predicted image 
                    result = appendHostToNeuronPredictionImages(result);


                    // return the prediction result to the user 
                    resolve(result);
                });
            });

            // insert  diagnosis 
            var diagnosis = await db.Diagnosis.create({
                prediction: JSON.stringify(output),
                userId: (user.id)
            });


            return {
                id: diagnosis.id,
                ...output
            }
        },
        confirmDiagnosis: async (_, { diagnosisId, confirmation }, { db, user }) => {
            try {
                // try to find diagnosis taht belongs to the user with the given id  
                let diagnosis = await db.Diagnosis.findOne({
                    where: {
                        id: diagnosisId,
                        userId: user.id
                    }
                });
                // if the diagnosis do not exists throw an error 
                if (diagnosis == null)
                    throw new Error("Diagnosis can't be found!");


                // update diagnosis confirmations 
                await db.Diagnosis.update({
                    confirmation: JSON.stringify(confirmation),
                }, {
                    where: {
                        id: diagnosisId
                    }
                });

                return diagnosisId;

            } catch (error) {
                return new ApolloError(error.message);
            }
        }
    },
    Query: {
        getAllPredictions: async (_, {offset , limit  }, { user, db }) => {
            // get all the diagnosis for the user uthenticated by login or imei
            var diagnosis = await db.Diagnosis.findAll({
                where: {
                    userId: user.id,
                },
                offset : offset , 
                limit : limit
            });
            // map throw diagnosis to parse prediction provided by AI 
            diagnosis = diagnosis.map((entry) => {
                return {
                    id: entry.id,
                    confimration: entry.confirmation,
                    ...JSON.parse(entry.prediction)
                }
            });

            return diagnosis;
        }
    }
}