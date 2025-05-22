from pathlib import Path


def get_source_code(source_dir: Path) -> dict[str, str]:
    source_code = {}
    for file in source_dir.rglob("*"):
        if file.is_file():
            try:
                with file.open("r", encoding="utf-8") as f:
                    # LLMに渡せるようにファイルの内容を整形
                    relative_path = file.relative_to(source_dir)
                    source_code[relative_path] = f.read()
            except UnicodeDecodeError:
                # デコードできない場合はスキップ
                continue

    return source_code
