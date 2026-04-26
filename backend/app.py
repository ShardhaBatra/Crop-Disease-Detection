from flask import Flask, request, jsonify
import tensorflow as tf
import numpy as np
from flask_cors import CORS
import json
import uuid
import os

app = Flask(__name__)
CORS(app)

@app.route("/")
def home():
    return "Crop Disease API chal rahi hai 🚀"

model = tf.keras.models.load_model("model.h5")

with open("classes.json", "r") as f:
    classes = json.load(f)

@app.route("/predict", methods=["POST"])
def predict():
    file = request.files["image"]

    file_path = f"{uuid.uuid4()}.jpg"
    file.save(file_path)

    img = tf.keras.utils.load_img(file_path, target_size=(128, 128))
    img_array = tf.keras.utils.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)

    prediction = model.predict(img_array)
    index = np.argmax(prediction)

    os.remove(file_path)

    return jsonify({"disease": classes[index]})

if __name__ == "__main__":
    app.run(debug=True)