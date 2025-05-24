#!/bin/bash

# macだとlocalhostでバグる
BASE_URL="http://127.0.0.1:8000"
INTERVIEW_ID="1571bf78-84ee-4d1a-9e76-3b2e518a18a7"

is_json() {
  echo "$1" | jq empty > /dev/null 2>&1
}

print_result() {
  local status_code=$1
  local expected=$2
  local body=$3

  if [ "$status_code" -eq "$expected" ] && is_json "$body"; then
    echo "Status: $status_code ✅ Passed"
    echo "Response: $body"
  else
    echo "Status: $status_code ❌ Failed (Expected $expected)"
    echo "Response: $body"
  fi
  echo ""
}

# POST /interview
test_post_interview() {
  echo "Testing POST /interview"
  response=$(
    curl -s -w "\n%{http_code}" -X POST "$BASE_URL/interview" \
    -F "source_code=@example/archive.zip" \
    -F "difficulty=easy" \
    -F "total_question=4"
  )

  status_code=$(echo "$response" | tail -n1)
  body=$(echo "$response" | sed '$d')
  print_result "$status_code" 200 "$body"
}

# POST /interview/{interview_id}
test_post_answer() {
  echo "Testing POST /interview/:interview_id"
  response=$(
    curl -s -w "\n%{http_code}" -X POST "$BASE_URL/interview/$INTERVIEW_ID" \
    -H "Content-Type: application/json" \
    -d '{
      "question_id": 0,
      "message": "スコアで降順、IDで昇順にソートした後、スコアが前のプレイヤーと変わるまで同じランクを割り当てています。"
    }'
  )

  status_code=$(echo "$response" | tail -n1)
  body=$(echo "$response" | sed '$d')
  print_result "$status_code" 200 "$body"
}

# GET /interview/{interview_id}?question_id=1
test_get_question() { :; }

# GET /interview/{interview_id}/result
test_get_result() { :; }

# メニュー表示
menu() {
  echo "RepoInterviewer API Test CLI"
  echo "--------------------------------"
  echo ""

  PS3="Select a test to run: "
  options=("POST /interview" "POST /interview/{interview_id}" "GET question" "GET result" "Run All Tests" "Exit")
  select opt in "${options[@]}"; do
    case $opt in
      "POST /interview")
        test_post_interview
        ;;
      "POST /interview/{interview_id}")
        test_post_answer
        ;;
      "GET question")
        test_get_question
        ;;
      "GET result")
        test_get_result
        ;;
      "Run All Tests")
        test_post_interview
        ;;
      "Exit")
        break
        ;;
      *)
        echo "Invalid option"
        ;;
    esac
  done
}

menu
