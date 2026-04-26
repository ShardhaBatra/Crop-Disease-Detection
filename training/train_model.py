import tensorflow as tf
from tensorflow.keras import layers, models
import json

img_size = 128

train_dir = "dataset/train"
test_dir = "dataset/test"

train_ds = tf.keras.utils.image_dataset_from_directory(
    train_dir,
    image_size=(img_size, img_size),
    batch_size=32
)

test_ds = tf.keras.utils.image_dataset_from_directory(
    test_dir,
    image_size=(img_size, img_size),
    batch_size=32
)

model = models.Sequential([
    layers.Rescaling(1./255),

    layers.Conv2D(32, (3,3), activation='relu'),
    layers.MaxPooling2D(),

    layers.Conv2D(64, (3,3), activation='relu'),
    layers.MaxPooling2D(),

    layers.Conv2D(128, (3,3), activation='relu'),
    layers.MaxPooling2D(),

    layers.Flatten(),
    layers.Dense(128, activation='relu'),
    layers.Dense(3, activation='softmax')
])

model.compile(
    optimizer='adam',
    loss='sparse_categorical_crossentropy',
    metrics=['accuracy']
)

model.fit(train_ds, validation_data=test_ds, epochs=5)

# 💾 SAVE MODEL
model.save("model.h5")

# 🧠 CLASS NAMES
class_names = list(train_ds.class_names)

print("Model training complete 🚀")
print("CLASS ORDER:", class_names)

# 💾 SAVE CLASSES
with open("classes.json", "w") as f:
    json.dump(class_names, f)

print("Classes saved successfully 🚀")