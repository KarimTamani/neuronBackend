import warnings
warnings.filterwarnings("ignore")

import sys 
sys.path.append("../")

import os
os.environ["CUDA_VISIBLE_DEVICES"]="-1"
os.environ["TF_CPP_MIN_LOG_LEVEL"]="3"