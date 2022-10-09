from modules.classifier import Classifier
import torchxrayvision as xrv
import matplotlib.pyplot as plt
import torch
import numpy as np
import cv2
import os
import time


class ChestXRayClassifier(Classifier):
    def __init__(self, id, weights_path, labels, build_model_function, input_shape, last_layer_name, output_path):


        self.last_layer_name = last_layer_name
        self.output_path = output_path



        super().__init__(id, weights_path, labels, build_model_function,
                         input_shape)


        self.model = xrv.models.DenseNet(weights="all")
        self.model.eval()
        self.model.float()

    def heatmap_prediction(self, input, rescale=1./255., show_heatmap=False):
        img = input.copy()

        input = cv2.cvtColor(input, cv2.COLOR_BGR2GRAY)
        input = cv2.resize(input, self.shape[:-1])

        input = np.array([input])
        input = (2 * (input.astype(np.float32) / 255.) - 1.) * 1024
        input = torch.from_numpy(input).float().unsqueeze(0)

        prediction = self.model(input).detach().numpy()[0]

        params = list(self.model.parameters())
        weight_softmax = np.squeeze(params[-2].data.numpy())
        features = self.model.features(input).detach()

        size_upsample = (256, 256)
        bz, nc, h, w = features.shape

        cam = weight_softmax[np.argsort(
            prediction)[-1]].dot(features.reshape((nc, h*w)))
        cam = cam.reshape(h, w)
        cam = cam - np.min(cam)
        cam_img = cam / np.max(cam)
        cam_img = np.uint8(255 * cam_img)

        heatmap_shape = list(img.shape[:-1])
        heatmap_shape.reverse()
        heatmap_shape = tuple(heatmap_shape)

        heatmap = cv2.resize(cam_img, heatmap_shape)
        heatmap = cv2.applyColorMap(heatmap, cv2.COLORMAP_JET)
        heatmap = cv2.cvtColor(heatmap, cv2.COLOR_BGR2RGB)

        img = heatmap * 0.4 + img

        array = np.resize(np.array(img, np.float), (-1))
        array[np.argwhere(array > 255.)] = 255

        img = np.resize(array, img.shape)
        img = np.array(img, np.uint8)

        current_time = str(time.time())
        output_path = os.path.join(
            self.output_path, "{}.jpg".format(current_time))
        plt.imsave(output_path, img)
        if show_heatmap == True:
            plt.imshow(img)
            plt.show()

        return {"predictions": self.labeld(prediction), "image": output_path}


labels = ['Atélectasie', 'Consolidation', 'Infiltrat', 'Pneumothorax', 'oedème', 'Emphysème', 'Fibrose', 'Épanchement', 'Pneumonie',
          'Épaississement pleural', 'Cardiomégalie', 'Nodule', 'Masse', 'Hernie', 'Lésion pulmonaire', 'Fracture', 'Opacité pulmonaire', 'Elargissement mediastinal']
IMG_SHAPE = (224, 224, 1)

ID = "ChestXrayClassifier"
LAST_CONV_LAYER = None

chest_xray_classifier = ChestXRayClassifier(
    ID,
    f"weights/{ID}.pt",
    labels,
    None,
    IMG_SHAPE,
    LAST_CONV_LAYER,
    f"outputs/{ID}"
)
