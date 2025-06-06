from abc import ABC, abstractmethod
from pathlib import Path

from app.domain.entities.source_code import SourceCode


class SourceCodeRepository(ABC):
    """ソースコードリポジトリのインタフェース"""

    @abstractmethod
    def extract_zip(self, zip_bytes: bytes, extract_to: Path) -> SourceCode:
        """zipファイルを解凍する

        Args:
            zip_bytes (bytes): zipファイルのバイト列
            extract_to (Path): 解凍先のパス

        Returns:
            SourceCode: 解凍されたソースコード
        """
        pass

    @abstractmethod
    def get_source_code(self, source_dir: Path) -> SourceCode:
        """ソースコードを取得する

        Args:
            source_dir (Path): ソースコードのパス

        Returns:
            SourceCode: ソースコード
        """
        pass
