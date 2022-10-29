from imutils import paths
from numpy import negative 
import pandas as pd 
from sklearn.model_selection import train_test_split 
from tensorflow.keras.preprocessing.image import ImageDataGenerator 
from tensorflow.keras.layers import GlobalAveragePooling2D,Dropout,Dense
from tensorflow.keras.callbacks import ModelCheckpoint,ReduceLROnPlateau , EarlyStopping
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.models import Model


import efficientnet.keras as efn 


POSITIVE = "./images" ; 
NEGATIVE = "./Monkeypox Skin Image Dataset" ; 

LEARNING_RATE = 1e-3 
IMAGE_SIZE = (224,224,3) 
BATCH_SIZE = 32 
EPOCHS = 20 


positive_images = list( paths.list_images(POSITIVE) )   
negative_images = list( paths.list_images(NEGATIVE) )

positive_df = pd.DataFrame( [ [x , "1"] for x in positive_images ] , columns=["path" , "label"])
negative_df = pd.DataFrame( [ [x , "0"] for x in negative_images ] , columns=["path" , "label"])

positive_df = pd.concat([positive_df , positive_df]) 

df = pd.concat([positive_df , negative_df]) 

train, val = train_test_split  ( df , test_size = 0.25 , random_state = 2018) 

base_generator = ImageDataGenerator(rescale = 1./255 ,
  horizontal_flip = True, 
  vertical_flip = False, 
  height_shift_range= 0.05, 
  width_shift_range=0.1, 
  rotation_range=5, 
  shear_range = 0.1,
  fill_mode = 'reflect',
  zoom_range=0.15
)

def flow_from_dataframe(image_generator, dataframe, batch_size):
  df_gen = image_generator.flow_from_dataframe(
    dataframe,x_col='path',y_col="label",
    target_size=IMAGE_SIZE[:-1],
    color_mode='rgb',
    class_mode='binary',
    shuffle=True,
    batch_size=batch_size) 

  return df_gen

train_gen = flow_from_dataframe(
  image_generator=base_generator, 
  dataframe= train,
  batch_size = BATCH_SIZE)

valid_gen = flow_from_dataframe(
  image_generator=base_generator, 
  dataframe=val,
  batch_size = BATCH_SIZE)

import efficientnet.tfkeras as efn
model =efn.EfficientNetB3(weights= None, include_top=False, input_shape = IMAGE_SIZE)

x = model.output
x = GlobalAveragePooling2D()(x)
x = Dropout(0.3)(x)
x = Dense(128, activation="relu")(x)
x = Dropout(0.3)(x)
x = Dense(64, activation="relu")(x)

predictions = Dense(1, activation="sigmoid")(x)
model = Model(inputs=model.input, outputs=predictions)

model.compile(optimizer=Adam(LEARNING_RATE), loss='binary_crossentropy', metrics=['accuracy'])

callbacks = [
  ModelCheckpoint("weights.h5" , save_best_only = True , save_weights_only  = True , verbose = 1) , 
  ReduceLROnPlateau(monitor = "val_loss" , patience = 1 , verbose = 1 , factor = 0.1, mode = "min" , min_lr = 1e-8) ,
  EarlyStopping(monitor="val_loss" , patience=3 , verbose = 1)  
] 

# train out network 
model.fit(train_gen , 
  epochs = EPOCHS , 
  steps_per_epoch = train_gen.n / BATCH_SIZE ,  
  validation_data = valid_gen  , 
  shuffle = False , 
  callbacks = callbacks
)
