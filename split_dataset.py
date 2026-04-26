import os
import shutil
import random

# 📁 Original dataset folder (jahan images hain)
source_dir = os.path.join("dataset_original", "PlantVillage")

# 📁 Destination folders
base_dir = "dataset"
train_dir = os.path.join(base_dir, "train")
test_dir = os.path.join(base_dir, "test")

# 🧠 Classes (tumhare dataset ke names)
classes = ["Early Blight", "Late Blight", "Healthy"]

# 📂 Create folders automatically
for split in [train_dir, test_dir]:
    for cls in classes:
        os.makedirs(os.path.join(split, cls.lower().replace(" ", "_")), exist_ok=True)

# 🔥 Split ratio
split_ratio = 0.8

for cls in classes:
    cls_path = os.path.join(source_dir, cls)

    images = os.listdir(cls_path)
    random.shuffle(images)

    split_point = int(len(images) * split_ratio)

    train_images = images[:split_point]
    test_images = images[split_point:]

    # 📌 Train copy
    for img in train_images:
        src = os.path.join(cls_path, img)
        dst = os.path.join(train_dir, cls.lower().replace(" ", "_"), img)
        shutil.copy(src, dst)

    # 📌 Test copy
    for img in test_images:
        src = os.path.join(cls_path, img)
        dst = os.path.join(test_dir, cls.lower().replace(" ", "_"), img)
        shutil.copy(src, dst)

print("✅ Dataset split complete ho gaya!")