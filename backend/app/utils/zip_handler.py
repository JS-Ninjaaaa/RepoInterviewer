from zipfile import ZipFile
from pathlib import Path
import shutil
from fastapi import UploadFile

# zipファイルの解凍とtmpへの保存を行う
# .
# ├── uuid
# │├── example.zip
# │└── source
# │    └── example
# │        ├── B136.py
# │        └── B136_memo.md
# tmp/uuid に保存
def save_upload_zip(upload_file: UploadFile, dest_path: Path) -> Path:
    dest_path.mkdir(parents=True, exist_ok=True)
    zip_path = dest_path / upload_file.filename
    with open(zip_path, "wb") as f:
        shutil.copyfileobj(upload_file.file, f)
    return zip_path


def extract_zip(zip_path: Path, extract_to: Path) -> None:
    with ZipFile(zip_path, "r") as zip_ref:
        zip_ref.extractall(extract_to)
