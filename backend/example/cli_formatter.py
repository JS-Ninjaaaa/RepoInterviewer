# cli_formatter.py


def format_ranking_to_csv(ranked_list_data: list) -> list:
    """
    ランキングデータリストをCSV文字列のリストに変換する（ヘッダーなし）。
    Args:
        ranked_list_data (list): 各要素は以下の辞書
            {'rank': int, 'player_id': str, 'handle_name': str, 'score': int}
    Returns:
        list: CSV形式の文字列のリスト
    """
    csv_lines = []
    for item in ranked_list_data:
        line = (
            f"{item['rank']},{item['player_id']},{item['handle_name']},{item['score']}"
        )
        csv_lines.append(line)
    return csv_lines
