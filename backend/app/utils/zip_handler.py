import io
from pathlib import Path
from zipfile import ZipFile


def extract_zip(zip_bytes: bytes, extract_to: Path) -> dict[str, str]:
    """
    zipファイルをディレクトリに解凍する
    """
    # 解凍に成功したファイル
    saved_files = {}

    with ZipFile(io.BytesIO(zip_bytes)) as zip_file:
        for file_info in zip_file.infolist():
            if not file_info.is_dir():
                file_data = zip_file.read(file_info.filename)
                try:
                    # テキストファイルとしてデコード
                    file_text = file_data.decode("utf-8")
                except UnicodeDecodeError:
                    # デコードできない場合はスキップ
                    continue

                saved_files[file_info.filename] = file_text

                # 解凍したファイルを保存
                file_path = extract_to / file_info.filename
                file_path.parent.mkdir(parents=True, exist_ok=True)
                with open(file_path, "w") as f:
                    f.write(file_text)

    return saved_files
