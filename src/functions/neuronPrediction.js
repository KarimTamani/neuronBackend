import { HOST } from "../config";

var diseases = require("../../assets/diseases.json");


function appendHostToNeuronPredictionImages(prediction) {
    // parse the result to json format so we can process it 
    prediction = JSON.parse(prediction);

    // loop over each model prediction in result 
    // and check if the output is an image 
    // if so append the host to the prediction image 

    for (let index = 0; index < prediction.images.length; index++)

        prediction.images[index] = HOST + prediction.images[index];




    return prediction;
}
function translatePredictions(predictions) {

    var translatedPredictions = [];
    for (let index = 0; index < predictions.length; index++) {
        translatedPredictions.push({
            "disease": diseases[predictions[index].disease],
            "prop": predictions[index].prop
        });
    }
    return translatedPredictions;
}

function translateConfirmationsToEnglish(confirmations) {
    var translatedConfirmations = [];
   
    for (let index = 0; index < confirmations.length; index++) {

        var diseaseIndex = Object.values(diseases).findIndex(disease => disease == confirmations[index]);
        console.log(diseaseIndex) ; 
        if (diseaseIndex >= 0)
            translatedConfirmations.push(Object.keys(diseases)[diseaseIndex]);

    }

    return translatedConfirmations;
}

function translateConfirmationsToFrensh(confirmations) {
    var translatedConfirmations = [];
    
    for (let index = 0; index < confirmations.length; index++) {
        translatedConfirmations.push(diseases[confirmations[index]]);

    }
    return translatedConfirmations;
}


function getConfirmationlanguage(confirmations) {
    var englishDiseases = Object.keys(diseases);
    var frenshDiseases = Object.values(diseases);


    if (englishDiseases.find(disease => disease == confirmations[0])) {
        return "EN";
    }
    if (frenshDiseases.find(disease => disease == confirmations[0])) {
        return "FR";
    }
    return "EN" ; 
}



export { appendHostToNeuronPredictionImages, getConfirmationlanguage , translatePredictions, translateConfirmationsToEnglish, translateConfirmationsToFrensh };

