# MoreYu - AI與技術新聞網站

一個專注於AI和技術領域的新聞和教程網站，每48小時自動更新高質量內容。

## 特點

- **多語言支持**：支持繁體中文（默認）、簡體中文和英文
- **夜間模式**：提供舒適的閱讀體驗
- **評論系統**：基於GitHub Discussions的Giscus評論系統
- **響應式設計**：適配各種設備尺寸
- **SEO優化**：針對搜索引擎優化，便於接入Google Adsense
- **自動化內容**：每48小時自動抓取和發布AI及技術領域的最新內容

## 技術棧

- **前端框架**：Next.js + React + TypeScript
- **樣式**：Tailwind CSS
- **內容管理**：基於文件系統的Markdown內容
- **自動化**：自定義爬蟲和內容處理腳本
- **部署**：Vercel
- **CI/CD**：GitHub Actions

## 快速開始

### 本地開發

1. 克隆倉庫
```bash
git clone https://github.com/yourusername/moreyu-ai-news.git
cd moreyu-ai-news
```

2. 安裝依賴
```bash
npm install
```

3. 運行開發服務器
```bash
npm run dev
```

4. 在瀏覽器中訪問 `http://localhost:3000`

### 運行爬蟲

```bash
npm install jsdom turndown uuid axios
node -r ts-node/register src/scripts/crawler/main.ts
```

### 構建和導出

```bash
npm run build
```

## 部署

本項目已配置為可直接部署到 Vercel。只需將代碼推送到 GitHub 倉庫，然後在 Vercel 中導入該倉庫即可。

## 自動化內容更新

網站設置了自動化工作流，每 48 小時自動運行爬蟲腳本，從互聯網抓取 AI 和技術領域的最新內容。

## 許可證

MIT
