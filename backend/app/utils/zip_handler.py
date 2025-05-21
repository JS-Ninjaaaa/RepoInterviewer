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

# Pythonのみ対応（今後拡張）
def get_source_code(source_dir: Path) -> str:
    code = ""
    # LLMに渡せるようにレポジトリ内容を整形
    for file in source_dir.rglob("*.py"):
        with file.open("r", encoding="utf-8") as f:
            code += f"\n# --- {file.name} ---\n"
            code += f.read() + "\n"

    return code
