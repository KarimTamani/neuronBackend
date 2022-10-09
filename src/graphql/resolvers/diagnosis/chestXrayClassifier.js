import { createWriteStream } from "fs";
import path from "path";
import { NEURON_IMAGE_DIR, HOST } from "../../../config";
import { GraphQLUpload } from "graphql-upload";
import { neuronClient, appendHostToNeuronPredictionImages } from "../../../functions/";

export default {
    Upload: GraphQLUpload,
    Mutation: {
        diagnosis: async (_, { chestXray }, { }) => {

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
            return output
        }
    } , 
    Query : {
        getAllPredictions : ( _ , { } , { } ) => { 
            return ["hello " , "dshdkjshdjs"] ; 
        }
    }
}