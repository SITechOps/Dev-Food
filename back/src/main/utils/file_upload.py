from PIL import Image
import os
from uuid import uuid4

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}


def allowed_file(filename: str) -> bool:
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def convert_to_webp(file, save_path):
    image = Image.open(file)
    image = image.convert("RGB")  
    image.save(save_path, format="WEBP", quality=85)


def save_file(file, upload_folder, filename=None):
    if not allowed_file(file.filename):
        raise ValueError("Tipo de arquivo inválido")

    os.makedirs(upload_folder, exist_ok=True)

    if filename is None:
        filename = f"default_{uuid4()}.webp"
    else:
        filename = os.path.splitext(filename)[0] + ".webp"

    filepath = os.path.join(upload_folder, filename)

    convert_to_webp(file, filepath)

    return f"/produto/{filename}"


def delete_file(file_path: str) -> None:
    if os.path.exists(file_path):
        os.remove(file_path)