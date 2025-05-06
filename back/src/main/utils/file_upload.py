import os
from uuid import uuid4

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

def allowed_file(filename: str) -> bool:
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def save_file(file, upload_folder, filename=None):
    if not allowed_file(file.filename):
        raise ValueError("Tipo de arquivo inválido")


    if filename is None:
        extension = os.path.splitext(file.filename)[1]
        filename = f"default_{uuid4()}{extension}"

    filepath = os.path.join(upload_folder, filename)
    file.save(filepath)
    return f"/produto/images/{filename}"  


def delete_file(file_path: str) -> None:
    if os.path.exists(file_path):
        os.remove(file_path)