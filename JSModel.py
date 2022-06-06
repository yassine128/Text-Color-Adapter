"""
This script will load the python model and convert it so we can use it with javascript.
"""

import tensorflowjs as tfjs
import tensorflow as tf
from tensorflow import keras
import os

model = tf.keras.models.load_model('saved_model/model2') # Load the model

tfjs_target_dir = 'saved_model/modeljs'

tfjs.converters.save_keras_model(model, tfjs_target_dir) # Converts and save the model