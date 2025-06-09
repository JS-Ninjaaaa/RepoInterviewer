class SourceCode:
    """ソースコード

    Attributes:
        source_code (dict[str, str]): ソースコード
    """

    @property
    def source_code(self) -> dict[str, str]:
        return self._source_code

    def __init__(self, source_code: dict[str, str]):
        """コンストラクタ

        Args:
            source_code (dict[str, str]): ソースコード
        """
        self._source_code = source_code

    def format(self) -> str:
        """ソースコードを整形する

        Returns:
            str: 整形されたソースコード
        """
        formatted_code = ""
        for file_name, code in self._source_code.items():
            formatted_code += "-" * 10 + f" {file_name} " + "-" * 10 + "\n"
            formatted_code += code + "\n"

        return formatted_code
