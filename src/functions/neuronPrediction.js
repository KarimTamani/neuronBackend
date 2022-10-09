import { HOST } from "../config";


function appendHostToNeuronPredictionImages(prediction) {
    // parse the result to json format so we can process it 
    prediction = JSON.parse(prediction);

    // loop over each model prediction in result 
    // and check if the output is an image 
    // if so append the host to the prediction image 

    for (let index = 0; index < prediction.images.length ; index++) 
     
        prediction.images[index] = HOST + prediction.images[index];

    console.log(prediction.images);

    return prediction;
}
export { appendHostToNeuronPredictionImages };