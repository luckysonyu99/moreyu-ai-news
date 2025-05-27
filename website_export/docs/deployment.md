# 網站部署指南

## GitHub 部署步驟

1. 創建 GitHub 倉庫
   - 登錄 GitHub 帳戶 (luckysongyu99)
   - 創建新倉庫 `moreyu.eu.org`
   - 設置為公開倉庫
   - 初始化時添加 README.md

2. 推送代碼到 GitHub
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/luckysongyu99/moreyu.eu.org.git
   git push -u origin main
   ```

3. 配置 GitHub Pages
   - 進入倉庫設置 -> Pages
   - 設置來源分支為 `gh-pages`
   - 保存設置

4. 綁定自定義域名
   - 在 DNS 提供商處添加 CNAME 記錄，指向 `luckysongyu99.github.io`
   - 在 GitHub Pages 設置中輸入自定義域名 `moreyu.eu.org`
   - 勾選 "Enforce HTTPS" 選項

5. 驗證部署
   - 等待 DNS 生效 (可能需要幾分鐘到幾小時)
   - 訪問 `https://moreyu.eu.org` 確認網站正常運行

## 自動化部署流程

我們已經設置了兩個 GitHub Actions 工作流：

1. **部署工作流** (`deploy.yml`)
   - 觸發條件：推送到 main 分支或手動觸發
   - 功能：構建網站並部署到 GitHub Pages
   - 步驟：
     - 檢出代碼
     - 設置 Node.js
     - 安裝依賴
     - 運行爬蟲 (可選)
     - 構建網站
     - 導出靜態文件
     - 部署到 gh-pages 分支
     - 設置自定義域名

2. **內容爬蟲工作流** (`crawler.yml`)
   - 觸發條件：每 48 小時自動運行或手動觸發
   - 功能：爬取新內容並提交到倉庫
   - 步驟：
     - 檢出代碼
     - 設置 Node.js
     - 安裝依賴
     - 運行爬蟲
     - 提交並推送變更

## 維護說明

1. **手動觸發爬蟲**
   - 進入 GitHub 倉庫 -> Actions -> Content Crawler
   - 點擊 "Run workflow" 按鈕

2. **手動觸發部署**
   - 進入 GitHub 倉庫 -> Actions -> GitHub Pages Deployment
   - 點擊 "Run workflow" 按鈕

3. **監控自動化任務**
   - 定期檢查 GitHub Actions 運行日誌
   - 確保爬蟲正常獲取新內容
   - 確保網站正常部署

4. **故障排除**
   - 如果爬蟲失敗，檢查目標網站是否更改了結構
   - 如果部署失敗，檢查構建日誌中的錯誤信息
   - 如果域名訪問失敗，檢查 DNS 設置和 GitHub Pages 配置
