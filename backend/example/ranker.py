# ranker.py

def calculate_ranking(player_max_scores: dict, enrolled_players: dict) -> list:
    """
    プレイヤー毎の最高スコアとエントリー情報からランキングリストを生成する。
    Args:
        player_max_scores (dict): {player_id: max_score}
        enrolled_players (dict): {player_id: handle_name}
    Returns:
        list: 上位10位（同点含む）までのランキング情報。各要素は以下の辞書。
              {'rank': int, 'player_id': str, 'handle_name': str, 'score': int}
    """
    if not player_max_scores:
        return []

    # ランキング計算用のデータ構造に変換: {'player_id', 'handle_name', 'score'} のリスト
    player_data_for_ranking = []
    for player_id, score in player_max_scores.items():
        # enrolled_playersにplayer_idが存在することはload_player_scoresで保証済み
        handle_name = enrolled_players.get(player_id, "UNKNOWN_HANDLE") #念のため
        player_data_for_ranking.append({
            "player_id": player_id,
            "handle_name": handle_name,
            "score": score
        })

    # ソート: 1. scoreの降順, 2. player_idの昇順
    # scoreを負数にすることで昇順ソートで降順を実現し、タプルの第2要素でplayer_id昇順
    sorted_players = sorted(
        player_data_for_ranking,
        key=lambda p: (-p["score"], p["player_id"])
    )

    # 上位10名のスコアを閾値とする
    # (10名に満たない場合は全員が対象)
    if not sorted_players:
        return []
    
    threshold_score = -1 # 最小スコアのプレイヤーも含むための初期値
    # 10人目のプレイヤーのスコアを決定
    # (プレイヤーが10人未満の場合は、全員がランキング対象)
    if len(sorted_players) >= 10:
        threshold_score = sorted_players[9]["score"] # 10番目のプレイヤーのスコア(0-indexed)
    else:
        # 10人未満の場合は全員が対象なので、最も低いスコアを閾値にすればよい
        # (実際には、この後のフィルタリングで全員が残る)
        if sorted_players: # 空でないことを確認
             threshold_score = sorted_players[-1]["score"] # 最も低いスコア

    # 閾値スコア以上のプレイヤーをフィルタリング
    top_players_for_ranking = [
        p for p in sorted_players if p["score"] >= threshold_score
    ]
    
    # ランク付け
    output_ranking = []
    current_rank = 0
    last_score = -1 # ありえないスコアで初期化
    
    if not top_players_for_ranking:
        return []

    # 最初のプレイヤーのランクを設定
    current_rank = 1
    last_score = top_players_for_ranking[0]["score"]
    output_ranking.append({
        "rank": current_rank,
        "player_id": top_players_for_ranking[0]["player_id"],
        "handle_name": top_players_for_ranking[0]["handle_name"],
        "score": top_players_for_ranking[0]["score"]
    })

    for i in range(1, len(top_players_for_ranking)):
        player_info = top_players_for_ranking[i]
        # 前のプレイヤーとスコアが異なれば、ランクを更新 (現在のインデックス + 1)
        if player_info["score"] < last_score:
            current_rank = i + 1 
        # スコアが同じなら、ランクはそのまま
        
        output_ranking.append({
            "rank": current_rank,
            "player_id": player_info["player_id"],
            "handle_name": player_info["handle_name"],
            "score": player_info["score"]
        })
        last_score = player_info["score"]
        
    return output_ranking
