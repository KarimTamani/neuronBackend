import numpy as np
import cv2
import os

# create the base classifier that all neuron classifier Use
class Classifier:
    
    # the initialization of a base classifier require :
    # - the weights path so that can the model load the pre-trained weights
    # - labels or the target classes that depend on the diseases that we are trying to classify
    # - build_model_function it's a function that allow the base classifer to load a custom model
    # the custom model will be located at the same directory as the classifer
    # - input_shape most of the time we gonna work with diffrent image sizes depend on the problem that we are trying to solve

    def __init__(self, id,  weights_path, labels, build_model_function, input_shape):

        self.id = id
        self.weights_path = weights_path
        self.labels = labels
        if build_model_function != None : 
            self.model = build_model_function(input_shape)
        else : 
            self.model = None 
        self.shape = input_shape

        # loading the weights
        if self.model != None : 
            self.model.load_weights(weights_path)

    def preprocess_input(self , input, color_mode="rgb", rescale=1./255.):
        # process the input
        # most of the time we gonna work with RGB format
        # resize the image to the given size
        # and rescale it the default rescale gonna be 1/255.

        if color_mode == "rgb":
            input = cv2.cvtColor(input, cv2.COLOR_BGR2RGB)
        elif color_mode == "grayscale":
            input = cv2.cvtColor(input, cv2.COLOR_BGR2GRAY)

        input = cv2.resize(input, self.shape[:-1])
        input = np.array([input], np.float) * rescale
        return input 

    def predict(self, input, color_mode="rgb", rescale=1./255.):
        # the default prediction is preprocessing the input and return the first prediction
        return self.model.predict(self.preprocess_input(input, color_mode, rescale))[0]

    def labeld(self, prediction , binary= False):
        # labeld is a method that take the prediction and associate to
        # each class or label it's prediction
        if not binary : 
            sorting = list(np.argsort(prediction))
            sorting.reverse()
            return {self.labels[sort]: prediction[sort] * 100 for sort in sorting}
        
        return {
            self.labels[0] : (1-  prediction[0]) * 100 , 
            self.labels[1] : prediction[0] * 100 , 
            
        }
    def labeld_prediction(self, input, color_mode="rgb", rescale=1./255. , binary = False):
        # labled_prediction does the prediction and apply the labled method
        # most of the time wr gonna work with this
        prediction = self.predict(input, color_mode, rescale)
        
        return { "predictions" : self.labeld(prediction , binary= binary) }
