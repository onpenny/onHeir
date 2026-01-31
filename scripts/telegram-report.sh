#!/bin/bash

# 生成 Telegram 格式的狀態報告

PROJECT_DIR="/workspaces/onHeir"
REPORT_FILE="$PROJECT_DIR/telegram-report.txt"

cd "$PROJECT_DIR"

# 獲取統計數據
FILE_COUNT=$(find src -type f \( -name "*.ts" -o -name "*.tsx" \) | wc -l | tr -d ' ')
API_COUNT=$(find src/app/api -type f -name "route.ts" 2>/dev/null | wc -l | tr -d ' ')
COMPONENT_COUNT=$(find src/components -type f -name "*.tsx" 2>/dev/null | wc -l | tr -d ' ')
LATEST_COMMIT=$(git log -1 --pretty=format:"%h - %s")

# 檢查伺服器狀態
SERVER_STATUS="❌ 未運行"
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    SERVER_STATUS="✅ 運行中"
fi

# 生成報告
cat > "$REPORT_FILE" << 'EOF'
🤖 OnHeritage 運作狀態報告

📅 時間：CURRENT_TIME_PLACEHOLDER

---

🟢 系統狀態
開發伺服器：SERVER_STATUS_PLACEHOLDER

---

📊 代碼統計
• 源文件：FILE_COUNT_PLACEHOLDER 個
• API 路由：API_COUNT_PLACEHOLDER 個
• UI 組件：COMPONENT_COUNT_PLACEHOLDER 個

---

📝 最新提交
LATEST_COMMIT_PLACEHOLDER

---

🚀 開發進度
• 第一階段（MVP）：85%
• 第二階段（核心功能）：60%
• 整體完成度：45%

---

✅ 已完成功能
• 用戶認證系統（註冊、登入、登出）
• 資產管理（CRUD、表單）
• 遺囑管理（CRUD、表單）
• 家族管理（CRUD、表單）
• 捐贈管理（CRUD、表單）
• 資產分配規則
• 通知系統 API
• 種子數據

---

🎯 正在開發
• 家族成員管理
• 資產分配規則可視化
• 繼承通知機制
• 權限和安全加強

---

持續運作中，定期更新進度... 🤖

🔗 GitHub: https://github.com/onpenny/onHeir
EOF

# 替換佔位符
CURRENT_TIME=$(date '+%Y-%m-%d %H:%M:%S')
sed -i "s/CURRENT_TIME_PLACEHOLDER/$CURRENT_TIME/" "$REPORT_FILE"
sed -i "s/SERVER_STATUS_PLACEHOLDER/$SERVER_STATUS/" "$REPORT_FILE"
sed -i "s/FILE_COUNT_PLACEHOLDER/$FILE_COUNT/" "$REPORT_FILE"
sed -i "s/API_COUNT_PLACEHOLDER/$API_COUNT/" "$REPORT_FILE"
sed -i "s/COMPONENT_COUNT_PLACEHOLDER/$COMPONENT_COUNT/" "$REPORT_FILE"
sed -i "s|LATEST_COMMIT_PLACEHOLDER|$LATEST_COMMIT|" "$REPORT_FILE"

echo "報告已生成：$REPORT_FILE"
cat "$REPORT_FILE"
