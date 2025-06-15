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
    

    @staticmethod
    def rename_image(folder_prefix: str, old_name: str, new_name: str) -> str:
        upload_folder = current_app.config['UPLOAD_FOLDER']
        entity_folder = os.path.join(upload_folder, folder_prefix)

        old_safe_name = secure_filename(old_name.strip().lower().replace(" ", "_"))
        new_safe_name = secure_filename(new_name.strip().lower().replace(" ", "_"))

        for ext in ['.png', '.jpg', '.jpeg', '.webp']:
            old_path = os.path.join(entity_folder, f"{old_safe_name}{ext}")
            if os.path.exists(old_path):
                new_path = os.path.join(entity_folder, f"{new_safe_name}.webp")  
                os.rename(old_path, new_path)

                return f"/{folder_prefix}/{os.path.basename(new_path)}"
        raise FileNotFoundError("Imagem antiga não encontrada para renomear")


    @staticmethod
    def delete_image(image_url: str) -> None:
        upload_folder = current_app.config['UPLOAD_FOLDER']
        relative_path = image_url.lstrip('/') 
        full_path = os.path.join(upload_folder, relative_path)

        delete_file(full_path)

