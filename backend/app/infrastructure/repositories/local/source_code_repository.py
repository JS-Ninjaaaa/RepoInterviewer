import io
from pathlib import Path
from zipfile import ZipFile

from app.domain.entities.source_code import SourceCode
from app.domain.repositories.source_code_repository import SourceCodeRepository


class LocalSourceCodeRepository(SourceCodeRepository):
    def __init__(self) -> None:
        """コンストラクタ"""
        pass

    def extract_zip(self, zip_bytes: bytes, extract_to: Path) -> SourceCode:
        """zipファイルを解凍する

        Args:
            zip_bytes (bytes): zipファイルのバイト列
            extract_to (Path): 解凍先のパス

        Returns:
            SourceCode: 解凍されたソースコード
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

        return SourceCode(saved_files)

    def get_source_code(self, source_dir: Path) -> SourceCode:
        """ソースコードを取得する

        Args:
            source_dir (Path): ソースコードのパス

        Returns:
            SourceCode: ソースコード
        """
        source_code = {}
        for file in source_dir.rglob("*"):
            if file.is_file():
                try:
                    with file.open("r", encoding="utf-8") as f:
                        # LLMに渡せるようにファイルの内容を整形
                        relative_path = file.relative_to(source_dir)
                        source_code[str(relative_path)] = f.read()
                except UnicodeDecodeError:
                    # デコードできない場合はスキップ
                    continue

        return SourceCode(source_code)
