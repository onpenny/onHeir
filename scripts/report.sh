#!/bin/bash

# 生成並發送狀態報告

PROJECT_DIR="/workspaces/onHeir"

cd "$PROJECT_DIR"

# 生成狀態報告
./scripts/status.sh

# 讀取狀態報告
STATUS_REPORT=$(cat status.md)

# 輸出到 stdout（會被 cron 捕獲並發送到 Telegram）
echo "$STATUS_REPORT"
