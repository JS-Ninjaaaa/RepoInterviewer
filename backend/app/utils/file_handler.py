from pathlib import Path

def load_text_files_from_directory(base_dir: Path) -> dict[str, str]:
    """
    指定ディレクトリ以下の全てのテキストファイルを読み取り、
    {相対パス: ファイル内容} の辞書として返す
    """
    file_map = {}

    for file_path in base_dir.rglob("*"):
        if file_path.is_file():
            try:
                text = file_path.read_text(encoding="utf-8")
                # 相対パスをキーにする
                relative_path = str(file_path.relative_to(base_dir))
                file_map[relative_path] = text
            except UnicodeDecodeError:
                continue  # テキストファイルでなければスキップ

    return file_map
