#!/bin/bash
# macだとlocalhostでバグる
BASE_URL="http://127.0.0.1:8000"

# 共通関数
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
    -F "total_question=5"
  )

  status_code=$(echo "$response" | tail -n1)
  body=$(echo "$response" | sed '$d')
  print_result "$status_code" 200 "$body"
}

# POST /interview/{interview_id}
test_post_answer() { :; }

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
        read -p "Enter interview_id: " interview_id
        test_post_answer "$interview_id"
        ;;
      "GET question")
        read -p "Enter interview_id: " interview_id
        test_get_question "$interview_id"
        ;;
      "GET result")
        read -p "Enter interview_id: " interview_id
        test_get_result "$interview_id"
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
