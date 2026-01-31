#!/bin/bash

# 狀態報告生成腳本

PROJECT_DIR="/workspaces/onHeir"
STATUS_FILE="$PROJECT_DIR/status.md"

cd "$PROJECT_DIR"

# 獲取當前時間
CURRENT_TIME=$(date '+%Y-%m-%d %H:%M:%S')

# 檢查開發伺服器狀態
SERVER_STATUS="❌ 未運行"
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    SERVER_STATUS="✅ 運行中"
fi

# 獲取最新提交
LATEST_COMMIT=$(git log -1 --pretty=format:"%h - %s")
LAST_UPDATE=$(git log -1 --pretty=format:"%cr")

# 檢查 Git 狀態
GIT_STATUS="乾淨"
if [ -n "$(git status --porcelain)" ]; then
    GIT_STATUS="⚠️ 有未提交的變更"
fi

# 獲取文件統計
FILE_COUNT=$(find src -type f \( -name "*.ts" -o -name "*.tsx" \) | wc -l)

# 獲取 API 路由數量
API_COUNT=$(find src/app/api -type f -name "route.ts" 2>/dev/null | wc -l)

# 獲取組件數量
COMPONENT_COUNT=$(find src/components -type f -name "*.tsx" 2>/dev/null | wc -l)

# 獲取頁面數量
PAGE_COUNT=$(find src/app -type f -name "page.tsx" 2>/dev/null | wc -l)

# 生成狀態報告
cat > "$STATUS_FILE" << EOF
# OnHeritage 運作狀態報告

📅 **報告時間：** $CURRENT_TIME

---

## 🟢 系統狀態

- **開發伺服器：** $SERVER_STATUS
- **Git 工作目錄：** $GIT_STATUS

---

## 📊 代碼統計

- **源文件數量：** $FILE_COUNT 個
- **API 路由：** $API_COUNT 個
- **UI 組件：** $COMPONENT_COUNT 個
- **頁面數量：** $PAGE_COUNT 個

---

## 📝 最新活動

- **最新提交：** \`$LATEST_COMMIT\`
- **更新時間：** $LAST_UPDATE

---

## 🚀 開發進度

- **第一階段（MVP）：** 85%
- **第二階段（核心功能）：** 60%
- **整體完成度：** 45%

---

## ✅ 已完成功能

- 用戶認證系統（註冊、登入、登出）
- 資產管理（CRUD、表單）
- 遺囑管理（CRUD、表單）
- 家族管理（CRUD、表單）
- 捐贈管理（CRUD、表單）
- 資產分配規則
- 通知系統 API
- 種子數據

---

## 🎯 正在開發

- 家族成員管理
- 資產分配規則可視化
- 繼承通知機制
- 權限和安全加強

---

**持續運作中，定期更新進度...** 🤖

---

🔗 [查看專案](https://github.com/onpenny/onHeir)
EOF

echo "狀態報告已生成：$STATUS_FILE"
