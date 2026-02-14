#!/bin/bash

# Codespace 保持啟動腳本

echo "🔧 設定 Codespace KEEP active..."
echo ""

# 方法 1: 使用 gh CLI（如果可用）
if command -v gh &> /dev/null; then
    echo "📌 方法 1: 使用 gh CLI"
    
    # 檢查是否已經是 active
    gh codespace status 2>/dev/null | grep -i "state" && echo "當前狀態已顯示"
    
    # 檢查並設定 active
    echo "執行: codespace edit" 2>/dev/null
    
    # 在 Codespace 中，保持環境活躍
    # 可以通過以下方式：
    # 1. 頂部導航欄 -> Settings -> Codespaces -> Your codespace
    # 2. 找到 "Keep active" 選項
    # 3. 勾選 "Keep active when last tab closed"
    # 4. 保存設置
    
    echo "✅ 請在網頁界面中設置："
    echo "   1. 點擊左上角 GitHub Codespace 圖標"
    echo "   2. 選擇 Settings"
    echo "   3. 點擊 Codespaces"
    echo "   4. 找到當前 codespace"
    echo "   5. 點擊 "..." 菜單"
    echo "   6. 勾選 \"Keep active when last tab closed\""
    echo ""
fi

# 方法 2: 通過環境變量
echo "📌 方法 2: 環境變量"
echo ""
echo "Codespace 支持以下環境變量："
echo ""
echo "GITHUB_TOKEN - GitHub token（自動設置）"
echo "CODESPACE_NAME - 當前 Codespace 名稱（自動設置）"
echo ""
echo "可以嘗試在 .vscode/settings.json 中設置："
echo ""
cat << 'EOF'
{
  "codespaces.keepAlive": true,
  "codespaces.defaultRepository": "onpenny/onHeir"
}
EOF
echo ""

# 方法 3: 避免休眠的最佳實踐
echo "📌 方法 3: 最佳實踐"
echo ""
echo "✅ 保持開發伺服器運行"
echo "   - 使用 nohup 啟動: nohup npm run dev &"
echo "   - 定期訪問網頁（每小時至少一次）"
echo "   - 保持一個終端窗口打開"
echo "   - 定期執行命令"
echo ""
echo "✅ 自動化腳本"
echo "   - 我已經創建了監控腳本（scripts/server-monitor.sh）"
echo "   - 每 5 分鐘檢查一次"
echo "   - 自動重啟伺服器"
echo ""

# 啟動開發伺服器
echo "🚀 啟動開發伺服器..."
echo ""

cd /workspaces/onHeir

# 清理舊進程
pkill -f "npm run dev"
sleep 2

# 清理鎖文件
rm -f .next/dev/lock .next/turbo-*.lock 2>/dev/null

# 使用 nohup 在後台啟動
nohup npm run dev > logs/dev-server.log 2>&1 &
SERVER_PID=$!

echo "✅ 開發伺服器已啟動（PID: $SERVER_PID）"
echo ""
echo "📍 URL: http://localhost:3000"
echo "📍 Network: http://$(hostname -I | awk '{print $2}'):3000"
echo ""
echo "📊 日誌文件: logs/dev-server.log"
echo ""

# 顯示實時日誌
echo "📋 實時日誌（最近 10 行）："
tail -10 logs/dev-server.log 2>/dev/null || echo "日誌文件尚未生成..."
echo ""

# 監控循環
echo "🔄 開始監控（按 Ctrl+C 停止）..."
echo ""

# 每 30 秒檢查一次
while true; do
    sleep 30
    
    # 檢查進程是否還在
    if ! ps -p $SERVER_PID > /dev/null 2>&1; then
        echo "⚠️  檢測到伺服器停止，正在重啟..."
        
        # 清理鎖文件
        rm -f .next/dev/lock .next/turbo-*.lock 2>/dev/null
        sleep 2
        
        # 重新啟動
        nohup npm run dev > logs/dev-server.log 2>&1 &
        SERVER_PID=$!
        
        echo "✅ 伺服器已重啟（PID: $SERVER_PID）"
    fi
    
    # 檢查服務器是否響應
    if curl -s http://localhost:3000 > /dev/null 2>&1; then
        echo "✅ [$(date '+%H:%M:%S')] 伺服器正常運行"
    else
        echo "❌ [$(date '+%H:%M:%S')] 伺服器無響應"
    fi
done
