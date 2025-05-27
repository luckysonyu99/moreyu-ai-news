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
- **部署**：GitHub Pages
- **CI/CD**：GitHub Actions

## 目錄結構

```
├── .github/workflows/    # GitHub Actions工作流配置
├── docs/                 # 文檔
├── public/               # 靜態資源
├── src/
│   ├── app/              # Next.js應用入口
│   ├── components/       # React組件
│   ├── content/          # 內容文件
│   ├── hooks/            # React鉤子
│   ├── lib/              # 工具庫
│   ├── pages/            # 頁面
│   ├── scripts/          # 爬蟲和處理腳本
│   ├── styles/           # 樣式文件
│   ├── types/            # TypeScript類型定義
│   └── utils/            # 工具函數
└── content/              # 生成的內容
```

## 快速開始

### 本地開發

1. 克隆倉庫
```bash
git clone https://github.com/luckysongyu99/moreyu.eu.org.git
cd moreyu.eu.org
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
npm run export
```

## 部署

詳細的部署指南請參考 [部署文檔](docs/deployment.md)。

## 文檔

- [用戶指南](docs/user_guide.md)
- [部署指南](docs/deployment.md)
- [SEO優化指南](docs/seo_guide.md)
- [功能驗證清單](docs/validation_checklist.md)

## 自動化流程

網站設置了兩個自動化工作流：

1. **內容抓取工作流**：每48小時自動運行，從互聯網抓取AI和技術領域的最新內容
2. **部署工作流**：當有新內容或代碼更新時，自動構建和部署網站

## 許可證

MIT
