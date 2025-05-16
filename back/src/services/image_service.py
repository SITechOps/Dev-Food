import os
from werkzeug.datastructures import FileStorage
from werkzeug.utils import secure_filename
from flask import current_app
from src.main.utils.file_upload import save_file, delete_file, allowed_file

class ImageService:
    @staticmethod
    def update_image(file: FileStorage, folder_prefix: str, entity_name: str) -> str:
        if not allowed_file(file.filename):
            raise ValueError("Tipo de arquivo inválido")

        upload_folder = current_app.config['UPLOAD_FOLDER']
        entity_folder = os.path.join(upload_folder, folder_prefix)
        os.makedirs(entity_folder, exist_ok=True)

        safe_name = secure_filename(entity_name.strip().lower().replace(" ", "_"))

        for ext in ['.png', '.jpg', '.jpeg', '.webp']:
            existing_path = os.path.join(entity_folder, f"{safe_name}{ext}")
            if os.path.exists(existing_path):
                delete_file(existing_path)

        relative_path = save_file(file, entity_folder, filename=safe_name)

        return f"/{folder_prefix}/{os.path.basename(relative_path)}"
