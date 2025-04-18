from typing import *
import base_init
import cv2
import os
from models.ChestXrayClassifier.classifier import chest_xray_classifier
from models.middelware.classifier import MiddleWare   

def process (command) :
    output = {
        "images" : [] , 
        "predictions" : []
    }  
    image_path = os.path.join("images", command["input"])
  
    
    image = cv2.imread(image_path) ; 

    valid = MiddleWare(image.copy()) ; 

    if (valid) : 

        classifierOutput = chest_xray_classifier.heatmap_prediction(image.copy()) ;
        
        predictions = classifierOutput["predictions"] ; 
        
        for key in predictions.keys() : 
            output["predictions"].append({
                "disease" : key , 
                "prop" : predictions[key]
            })
        output["images"].append(classifierOutput["image"]) ; 
        output["images"].append(image_path) ; 

        
        
        return output 

    else : 
        
        return { "error" : "Please provide a clear chest xray image" }

