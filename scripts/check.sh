#!/bin/bash

# 運作檢查腳本 - 自我監控和恢復

PROJECT_DIR="/workspaces/onHeir"
LOG_FILE="$PROJECT_DIR/logs/check.log"

# 創建日誌目錄
mkdir -p "$PROJECT_DIR/logs"

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$LOG_FILE"
}

log "===== 開始運作檢查 ====="

# 檢查開發伺服器是否運行
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    log "✓ 開發伺服器運行正常"
else
    log "✗ 開發伺服器未運行，正在重啟..."
    cd "$PROJECT_DIR" && nohup npm run dev > logs/dev.log 2>&1 &
    sleep 15
    if curl -s http://localhost:3000 > /dev/null 2>&1; then
        log "✓ 開發伺服器重啟成功"
    else
        log "✗ 開發伺服器重啟失敗"
    fi
fi

# 檢查 Git 狀態
cd "$PROJECT_DIR"
if [ -n "$(git status --porcelain)" ]; then
    log "⚠ 有未提交的變更"
    git status >> "$LOG_FILE" 2>&1
else
    log "✓ Git 工作目錄乾淨"
fi

log "===== 運作檢查完成 ====="
