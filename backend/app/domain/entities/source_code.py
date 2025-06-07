class SourceCode:
    """ソースコード

    Attributes:
        source_code (dict[str, str]): ソースコード
    """

    def __init__(self, source_code: dict[str, str]):
        """コンストラクタ

        Args:
            source_code (dict[str, str]): ソースコード
        """
        self.source_code = source_code

    def format_source_code(self) -> str:
        """ソースコードを整形する

        Returns:
            str: 整形されたソースコード
        """
        formatted_code = ""
        for file_name, code in self.source_code.items():
            formatted_code += "-" * 10 + f" {file_name} " + "-" * 10 + "\n"
            formatted_code += code + "\n"

        return formatted_code
