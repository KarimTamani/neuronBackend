from typing import *
import base_init
import cv2
import os
from models.ChestXrayClassifier.classifier import chest_xray_classifier
 

def process (command) :
    output = {
        "images" : [] , 
        "predictions" : []
    }  
    image_path = os.path.join("images", command["input"])
  
    
    image = cv2.imread(image_path) ; 
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



#import tensorflow as tf 
'''
def process(command):
    
    
    models = get_models(command["models"])
    outputs = []
    image_path = os.path.join("images", command["input"])
    
    for model in models:
        
        if isinstance(model, NLPSymptomsClassifier):
            outputs.append({
                "id": model.id,
                "output": model.labled_prediction(command["input"]),
                "type": "NLP_CLASSIFIER"
            })
        elif isinstance(model, ApiClassifier):
            outputs.append({
                "id": model.id,
                "output": model.predict(image_path),
                "type": "CLASSIFIER"
            })
        else:
            image = cv2.imread(image_path)
            if isinstance(model, HeatMapClassifier):
                outputs.append({
                    "id": model.id,
                    "output": model.heatmap_prediction(image.copy()),
                    "type": "HEATMAP_CLASSIFIER"
                })
            elif isinstance(model, YoloDetector):
                outputs.append({
                    "id": model.id,
                    "output": model.detect(image_path),
                    "type": "DETECTOR",
                    "width": image.shape[1],
                    "height": image.shape[0]
                })
            elif isinstance(model, Generator):
                image = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
                outputs.append({
                    "id": model.id,
                    "output": model.generate(image.copy()),
                    "type": "GENERATOR"
                })
            elif isinstance(model, Segmentor):
                outputs.append({
                    "id": model.id,
                    "output": model.segment_prediction(image.copy()),
                    "type": "SEGMENTOR"
                })
            elif isinstance(model, Classifier):
                outputs.append({
                    "id": model.id,
                    "output": model.labeld_prediction(image.copy()),
                    "type": "CLASSIFIER"
                })

    return outputs
'''



