# data_loader.py
import csv


class DataLoadError(Exception):
    """ファイル読み込みやパースに関するカスタムエラー"""

    pass


# ヘッダーの期待値
EXPECTED_ENTRY_HEADER = ["player_id", "handle_name"]
EXPECTED_SCORE_LOG_HEADER = ["create_timestamp", "player_id", "score"]


def load_entries(file_path: str) -> dict:
    """
    エントリーファイルを読み込み、プレイヤーIDをキー、ハンドルネームを値とする辞書を返す。
    Args:
        file_path (str): エントリーファイルのパス
    Returns:
        dict: {player_id: handle_name}
    Raises:
        DataLoadError: ファイル形式が不正な場合やファイルが見つからない場合
    """
    enrolled_players = {}
    try:
        with open(file_path, "r", encoding="utf-8", newline="") as f:
            reader = csv.reader(f)
            try:
                header = next(reader)
            except StopIteration:  # ファイルが空、またはヘッダーがない
                raise DataLoadError(
                    f"エラー: エントリーファイル '{file_path}' が空か、ヘッダー行がありません。"
                )

            if header != EXPECTED_ENTRY_HEADER:
                raise DataLoadError(
                    f"エラー: エントリーファイル '{file_path}' のヘッダーが不正です。\n"
                    f"期待値: {','.join(EXPECTED_ENTRY_HEADER)}\n"
                    f"実際値: {','.join(header)}"
                )

            for i, row in enumerate(reader, 2):  # データ行は2行目から
                if len(row) != len(EXPECTED_ENTRY_HEADER):
                    raise DataLoadError(
                        f"エラー: エントリーファイル '{file_path}' の {i}行目の列数が不正です。\n"
                        f"期待値: {len(EXPECTED_ENTRY_HEADER)}, 実際値: {len(row)}"
                    )
                player_id, handle_name = row
                # player_idの重複は仕様上ないと保証されている
                enrolled_players[player_id] = handle_name
        return enrolled_players
    except FileNotFoundError:
        # main.pyでもチェックしているが、ここで明示的に補足も可能
        raise DataLoadError(
            f"エラー: エントリーファイル '{file_path}' が見つかりません。"
        )
    except csv.Error as e:  # CSVのパースエラー
        raise DataLoadError(
            f"エラー: エントリーファイル '{file_path}' のCSV形式が不正です: {e}"
        )


def load_player_scores(file_path: str, enrolled_players: dict) -> dict:
    """
    プレイログファイルを読み込み、エントリー済みプレイヤーの最高スコアを記録した辞書を返す。
    Args:
        file_path (str): プレイログファイルのパス
        enrolled_players (dict): エントリー済みプレイヤーの情報 {player_id: handle_name}
    Returns:
        dict: {player_id: max_score}
    Raises:
        DataLoadError: ファイル形式が不正な場合やファイルが見つからない場合
    """
    player_max_scores = {}
    try:
        with open(file_path, "r", encoding="utf-8", newline="") as f:
            reader = csv.reader(f)
            try:
                header = next(reader)
            except StopIteration:  # ファイルが空、またはヘッダーがない
                raise DataLoadError(
                    f"エラー: プレイログファイル '{file_path}' が空か、ヘッダー行がありません。"
                )

            if header != EXPECTED_SCORE_LOG_HEADER:
                raise DataLoadError(
                    f"エラー: プレイログファイル '{file_path}' のヘッダーが不正です。\n"
                    f"期待値: {','.join(EXPECTED_SCORE_LOG_HEADER)}\n"
                    f"実際値: {','.join(header)}"
                )

            for i, row in enumerate(reader, 2):  # データ行は2行目から
                if len(row) != len(EXPECTED_SCORE_LOG_HEADER):
                    raise DataLoadError(
                        f"エラー: プレイログファイル '{file_path}' の {i}行目の列数が不正です。\n"
                        f"期待値: {len(EXPECTED_SCORE_LOG_HEADER)}, 実際値: {len(row)}"
                    )

                _timestamp, player_id, score_str = row  # create_timestampは集計に不要

                if player_id not in enrolled_players:
                    continue  # エントリーしていないプレイヤーはスキップ

                try:
                    score = int(score_str)
                    if score < 0:  # スコアは0以上
                        raise ValueError("スコアは0以上の整数である必要があります。")
                except ValueError as e_val:
                    raise DataLoadError(
                        f"エラー: プレイログファイル '{file_path}' の {i}行目のスコア '{score_str}' が不正です: {e_val}"
                    )

                # 最高スコアを更新
                if (
                    player_id not in player_max_scores
                    or score > player_max_scores[player_id]
                ):
                    player_max_scores[player_id] = score
        return player_max_scores
    except FileNotFoundError:
        raise DataLoadError(
            f"エラー: プレイログファイル '{file_path}' が見つかりません。"
        )
    except csv.Error as e:
        raise DataLoadError(
            f"エラー: プレイログファイル '{file_path}' のCSV形式が不正です: {e}"
        )
