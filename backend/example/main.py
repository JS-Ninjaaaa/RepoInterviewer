# main.py
import sys
import os
from data_loader import load_entries, load_player_scores, DataLoadError
from ranker import calculate_ranking
from cli_formatter import format_ranking_to_csv

# 定数
EXPECTED_ARG_COUNT = 3  # スクリプト名 + 2つのファイルパス
HEADER_RANKING_OUTPUT = "rank,player_id,handle_name,score"

def print_error_and_exit(message: str):
    """標準エラー出力にメッセージを表示し、終了コード1でプログラムを終了する。"""
    sys.stderr.write(message + "\n")
    sys.exit(1)

def main():
    """メイン処理"""
    if len(sys.argv) != EXPECTED_ARG_COUNT:
        script_name = os.path.basename(sys.argv[0])
        print_error_and_exit(
            f"入力引数の数が不正です。2つのファイルパスを指定してください。\n"
            f"実行例: python {script_name} game_entry_log.csv game_score_log.csv"
        )

    entry_file_path = sys.argv[1]
    score_log_file_path = sys.argv[2]

    # ファイル存在チェック (より明示的なエラーメッセージのため)
    if not os.path.exists(entry_file_path):
        print_error_and_exit(f"エラー: エントリーファイル '{entry_file_path}' が見つかりません。")
    if not os.path.exists(score_log_file_path):
        print_error_and_exit(f"エラー: プレイログファイル '{score_log_file_path}' が見つかりません。")

    try:
        # 1. エントリーファイルの読み込み
        enrolled_players = load_entries(entry_file_path)

        # 2. プレイログの読み込みとプレイヤー毎の最高スコア集計
        player_max_scores = load_player_scores(score_log_file_path, enrolled_players)

        # 3. ランキング計算
        # player_max_scoresが空でも calculate_ranking は空リストを返す設計
        ranked_list_data = calculate_ranking(player_max_scores, enrolled_players)

        # 4. 結果の出力
        print(HEADER_RANKING_OUTPUT)  # ヘッダーは必ず出力
        
        if ranked_list_data:
            output_csv_lines = format_ranking_to_csv(ranked_list_data)
            for line in output_csv_lines:
                print(line)
        # ranked_list_dataが空の場合 (対象者なし)、ヘッダーのみが出力される

    except DataLoadError as e:
        print_error_and_exit(str(e))
    except Exception as e:
        # 予期せぬエラーのキャッチ
        print_error_and_exit(f"予期せぬエラーが発生しました: {e}")

if __name__ == "__main__":
    main()
