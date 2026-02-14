#!/bin/bash

# 伺服器監控和自動重啟腳本

PROJECT_DIR="/workspaces/onHeir"
LOG_FILE="$PROJECT_DIR/logs/server-monitor.log"
PID_FILE="$PROJECT_DIR/.dev-server.pid"

# 創建日誌目錄
mkdir -p "$PROJECT_DIR/logs"

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$LOG_FILE"
    echo "$1"
}

# 檢查並停止現有進程
check_and_stop() {
    if [ -f "$PID_FILE" ]; then
        OLD_PID=$(cat "$PID_FILE")
        if ps -p "$OLD_PID" > /dev/null 2>&1; then
            log "停止舊進程 $OLD_PID"
            kill "$OLD_PID" 2>/dev/null
            sleep 2
        fi
    fi
}

# 啟動開發伺服器
start_server() {
    cd "$PROJECT_DIR"
    
    # 啟動後台進程並記錄 PID
    nohup npm run dev > "$PROJECT_DIR/logs/dev-server.log" 2>&1 &
    NEW_PID=$!
    
    echo "$NEW_PID" > "$PID_FILE"
    
    log "開發伺服器已啟動，PID: $NEW_PID"
    
    # 等待伺服器啟動
    sleep 10
    
    # 檢查進程是否還在運行
    if ps -p "$NEW_PID" > /dev/null 2>&1; then
        log "伺服器正常運行"
        log "URL: http://localhost:3000"
        log "Network: http://$(hostname -I | awk '{print $2}'):3000"
        return 0
    else
        log "伺服器啟動失敗，嘗試重新啟動..."
        return 1
    fi
}

# 監控循環
monitor_loop() {
    while true; do
        sleep 300  # 每 5 分鐘檢查一次
        
        if [ -f "$PID_FILE" ]; then
            PID=$(cat "$PID_FILE")
            
            # 檢查進程是否還在運行
            if ! ps -p "$PID" > /dev/null 2>&1; then
                log "⚠️  檢測到伺服器已停止，正在重啟..."
                start_server
            else
                # 檢查伺服器是否正常響應
                if curl -s http://localhost:3000 > /dev/null 2>&1; then
                    log "✓ 伺服器正常"
                else
                    log "⚠️  伺服器無響應，正在重啟..."
                    check_and_stop
                    start_server
                fi
            fi
        else
            log "⚠️  PID 文件不存在，啟動伺服器..."
            start_server
        fi
    done
}

# 信號處理
cleanup() {
    log "清理資源..."
    check_and_stop
    if [ -f "$PID_FILE" ]; then
        rm "$PID_FILE"
    fi
    exit 0
}

# 註置信號處理
trap cleanup SIGTERM SIGINT

# 主程序
case "${1:-}" in
    start)
        check_and_stop
        start_server
        ;;
    stop)
        check_and_stop
        ;;
    status)
        if [ -f "$PID_FILE" ]; then
            PID=$(cat "$PID_FILE")
            if ps -p "$PID" > /dev/null 2>&1; then
                echo "✅ 開發伺服器正在運行 (PID: $PID)"
                echo "URL: http://localhost:3000"
            else
                echo "❌ 開發伺服器未運行"
            fi
        else
            echo "❌ 未找到 PID 文件"
        fi
        ;;
    monitor)
        monitor_loop
        ;;
    *)
        echo "用法: $0 {start|stop|status|monitor}"
        echo "  start  - 啟動開發伺服器"
        echo "  stop   - 停止開發伺服器"
        echo "  status - 檢查伺服器狀態"
        echo "  monitor - 持續監控並自動重啟"
        exit 1
        ;;
esac
