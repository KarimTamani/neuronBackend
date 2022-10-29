from tensorflow.keras.layers import GlobalAveragePooling2D, Dropout, Dense
import cv2
import numpy as np
import efficientnet.tfkeras as efn
from tensorflow.keras.models import Model
import os

os.environ['TF_CPP_MIN_LOG_LEVEL'] = "2"
os.environ["CUDA_VISIBLE_DEVICES"] = "0"



IMAGE_SIZE = (224, 224, 3)

model = efn.EfficientNetB3(weights=None, include_top=False, input_shape=IMAGE_SIZE)

x = model.output
x = GlobalAveragePooling2D()(x)
x = Dropout(0.3)(x)
x = Dense(128, activation="relu")(x)
x = Dropout(0.3)(x)
x = Dense(64, activation="relu")(x)

predictions = Dense(1, activation="sigmoid")(x)
model = Model(inputs=model.input, outputs=predictions)

model.load_weights("weights/middleware.h5")


def MiddleWare(image):

    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    image = cv2.resize(image, IMAGE_SIZE[:-1])
    image = np.array([image], np.float) / 255.

    output = model.predict(image)
    output = output[0][0]
    print (output) 

    return output > 0.75 ; 
