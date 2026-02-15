#!/bin/bash

# 簡單可靠的自動重啟腳本

PROJECT_DIR="/workspaces/onHeir"
LOG_FILE="$PROJECT_DIR/logs/auto-restart.log"
PID_FILE="$PROJECT_DIR/.dev-server.pid"
URL="http://localhost:3000"

# 創建日誌目錄
mkdir -p "$PROJECT_DIR/logs"

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# 檢查服務器是否正常
check_server() {
    if curl -s "$URL" > /dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

# 停止所有開發伺服器
stop_all() {
    log "🛑 停止所有開發伺服器..."
    
    # 殺死所有 next dev 進程
    pkill -9 -f "next dev" 2>/dev/null
    
    # 殺死所有 next-server 進程
    pkill -9 -f "next-server" 2>/dev/null
    
    # 清理鎖文件
    rm -f "$PROJECT_DIR/.next/dev/lock" 2>/dev/null
    rm -f "$PROJECT_DIR/.next/turbo-*.lock" 2>/dev/null
    
    # 等待進程完全停止
    sleep 3
    
    log "✅ 已停止所有伺服器"
}

# 啟動開發伺服器
start_server() {
    log "🚀 啟動開發伺服器..."
    
    cd "$PROJECT_DIR"
    
    # 使用 nohup 在後台啟動
    nohup npm run dev > "$PROJECT_DIR/logs/dev-server.log" 2>&1 &
    NEW_PID=$!
    
    echo "$NEW_PID" > "$PID_FILE"
    
    # 等待服務器啟動
    sleep 10
    
    # 檢查進程是否還在運行
    if ! ps -p "$NEW_PID" > /dev/null 2>&1; then
        log "❌ 服務器啟動失敗，進程已停止"
        return 1
    fi
    
    # 檢查服務器是否響應
    if check_server; then
        log "✅ 服務器啟動成功"
        log "📍 URL: $URL"
        log "📍 Network: http://$(hostname -I | awk '{print $2}'):3000"
        log "📊 日誌: $PROJECT_DIR/logs/dev-server.log"
        return 0
    else
        log "⚠️  服務器已啟動但無法響應"
        return 1
    fi
}

# 主監控循環
monitor() {
    log "🔄 開始監控服務器..."
    
    local fail_count=0
    local max_fails=5
    
    while true; do
        sleep 300  # 每 5 分鐘檢查一次
        
        if [ -f "$PID_FILE" ]; then
            PID=$(cat "$PID_FILE")
            
            # 檢查進程是否還在運行
            if ! ps -p "$PID" > /dev/null 2>&1; then
                log "⚠️  進程 $PID 已停止，正在重啟..."
                stop_all
                start_server
                fail_count=0
                continue
            fi
            
            # 檢查服務器是否響應
            if ! check_server; then
                fail_count=$((fail_count + 1))
                log "⚠️  服務器無響應 ($fail_count/$max_fails)"
                
                if [ "$fail_count" -ge "$max_fails" ]; then
                    log "🔄 連續無響應 $max_fails 次，正在重啟..."
                    stop_all
                    start_server
                    fail_count=0
                fi
            else
                fail_count=0
                log "✅ [$(date '+%H:%M:%S')] 服務器正常"
            fi
        else
            log "⚠️  PID 文件不存在，啟動伺服器..."
            start_server
        fi
    done
}

# 信號處理
cleanup() {
    log "🧹 清理資源..."
    stop_all
    if [ -f "$PID_FILE" ]; then
        rm "$PID_FILE"
    fi
    exit 0
}

# 設置信號處理
trap cleanup SIGTERM SIGINT

# 主程序
case "${1:-}" in
    start)
        stop_all
        start_server
        ;;
    stop)
        stop_all
        ;;
    status)
        if [ -f "$PID_FILE" ]; then
            PID=$(cat "$PID_FILE")
            if ps -p "$PID" > /dev/null 2>&1; then
                echo "✅ 開發伺服器正在運行 (PID: $PID)"
                echo "URL: $URL"
                if check_server; then
                    echo "狀態: 正常"
                else
                    echo "狀態: 無響應"
                fi
            else
                echo "❌ 開發伺服器未運行"
            fi
        else
            echo "❌ 未找到 PID 文件"
        fi
        ;;
    monitor)
        monitor
        ;;
    restart)
        stop_all
        sleep 2
        start_server
        ;;
    *)
        echo "用法: $0 {start|stop|status|monitor|restart}"
        echo "  start   - 啟動開發伺服器（強制停止現有的）"
        echo "  stop    - 停止開發伺服器"
        echo "  status  - 檢查伺服器狀態"
        echo "  monitor - 持續監控並自動重啟"
        echo "  restart - 重啟開發伺服器"
        echo ""
        echo "建議："
        echo "  1. 使用 'monitor' 模式來保持伺服器運行"
        echo "  2. 在 Codespace 設置中啟用 'Keep active'"
        echo "  3. 保持一個終端窗口打開運行 monitor"
        exit 1
        ;;
esac
