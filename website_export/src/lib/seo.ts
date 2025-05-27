import { NextSeoProps } from 'next-seo';

// 網站基本 SEO 配置
export const defaultSEO: NextSeoProps = {
  titleTemplate: '%s | MoreYu - AI與技術新聞教程',
  defaultTitle: 'MoreYu - 最新AI與技術新聞、教程與資源',
  description: 'MoreYu提供最新AI人工智能、機器學習、深度學習以及各種技術領域的新聞、教程與資源，每48小時更新高質量內容。',
  canonical: 'https://moreyu.eu.org',
  openGraph: {
    type: 'website',
    locale: 'zh_TW',
    url: 'https://moreyu.eu.org',
    siteName: 'MoreYu - AI與技術新聞教程',
    title: 'MoreYu - 最新AI與技術新聞、教程與資源',
    description: 'MoreYu提供最新AI人工智能、機器學習、深度學習以及各種技術領域的新聞、教程與資源，每48小時更新高質量內容。',
    images: [
      {
        url: 'https://moreyu.eu.org/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'MoreYu - AI與技術新聞教程',
      },
    ],
  },
  twitter: {
    handle: '@moreyu',
    site: '@moreyu',
    cardType: 'summary_large_image',
  },
  additionalMetaTags: [
    {
      name: 'keywords',
      content: 'AI, 人工智能, 機器學習, 深度學習, 技術教程, 編程, GPT, LLM, 大語言模型, 神經網絡',
    },
    {
      name: 'author',
      content: 'MoreYu',
    },
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1.0',
    },
    {
      name: 'robots',
      content: 'index, follow',
    },
    {
      name: 'language',
      content: 'Traditional Chinese',
    },
    {
      name: 'revisit-after',
      content: '7 days',
    },
  ],
  additionalLinkTags: [
    {
      rel: 'icon',
      href: '/favicon.ico',
    },
    {
      rel: 'apple-touch-icon',
      href: '/apple-touch-icon.png',
      sizes: '180x180',
    },
    {
      rel: 'manifest',
      href: '/site.webmanifest',
    },
  ],
};

// 文章頁面 SEO 配置生成器
export const generateArticleSEO = (article: any) => {
  return {
    title: article.title,
    description: article.excerpt,
    canonical: `https://moreyu.eu.org/posts/${article.slug}`,
    openGraph: {
      type: 'article',
      url: `https://moreyu.eu.org/posts/${article.slug}`,
      title: article.title,
      description: article.excerpt,
      images: article.coverImage
        ? [
            {
              url: `https://moreyu.eu.org${article.coverImage}`,
              width: 1200,
              height: 630,
              alt: article.title,
            },
          ]
        : defaultSEO.openGraph?.images,
      article: {
        publishedTime: article.date,
        modifiedTime: article.lastModified || article.date,
        section: article.categories[0] || 'AI',
        tags: article.tags,
      },
    },
  };
};

// 分類頁面 SEO 配置生成器
export const generateCategorySEO = (category: any) => {
  return {
    title: `${category.name} - 分類`,
    description: `瀏覽 MoreYu 網站中所有關於 ${category.name} 的文章、新聞和教程。了解 ${category.name} 領域的最新發展和技術趨勢。`,
    canonical: `https://moreyu.eu.org/categories/${category.slug}`,
    openGraph: {
      url: `https://moreyu.eu.org/categories/${category.slug}`,
      title: `${category.name} - MoreYu 分類`,
      description: `瀏覽 MoreYu 網站中所有關於 ${category.name} 的文章、新聞和教程。了解 ${category.name} 領域的最新發展和技術趨勢。`,
    },
  };
};

// 標籤頁面 SEO 配置生成器
export const generateTagSEO = (tag: any) => {
  return {
    title: `#${tag.name} - 標籤`,
    description: `瀏覽 MoreYu 網站中所有帶有 #${tag.name} 標籤的文章、新聞和教程。探索與 ${tag.name} 相關的最新內容和資源。`,
    canonical: `https://moreyu.eu.org/tags/${tag.slug}`,
    openGraph: {
      url: `https://moreyu.eu.org/tags/${tag.slug}`,
      title: `#${tag.name} - MoreYu 標籤`,
      description: `瀏覽 MoreYu 網站中所有帶有 #${tag.name} 標籤的文章、新聞和教程。探索與 ${tag.name} 相關的最新內容和資源。`,
    },
  };
};

// 歸檔頁面 SEO 配置
export const archiveSEO = {
  title: '歸檔',
  description: 'MoreYu 網站的文章歸檔，按時間順序瀏覽所有文章、新聞和教程。',
  canonical: 'https://moreyu.eu.org/archives',
  openGraph: {
    url: 'https://moreyu.eu.org/archives',
    title: '歸檔 - MoreYu',
    description: 'MoreYu 網站的文章歸檔，按時間順序瀏覽所有文章、新聞和教程。',
  },
};

// 關於頁面 SEO 配置
export const aboutSEO = {
  title: '關於我們',
  description: '了解 MoreYu 網站的使命、願景和團隊。我們致力於提供最新、最有價值的 AI 和技術領域內容。',
  canonical: 'https://moreyu.eu.org/about',
  openGraph: {
    url: 'https://moreyu.eu.org/about',
    title: '關於我們 - MoreYu',
    description: '了解 MoreYu 網站的使命、願景和團隊。我們致力於提供最新、最有價值的 AI 和技術領域內容。',
  },
};

// 隱私政策頁面 SEO 配置 (對 Adsense 很重要)
export const privacySEO = {
  title: '隱私政策',
  description: 'MoreYu 網站的隱私政策，了解我們如何收集、使用和保護您的個人信息。',
  canonical: 'https://moreyu.eu.org/privacy',
  openGraph: {
    url: 'https://moreyu.eu.org/privacy',
    title: '隱私政策 - MoreYu',
    description: 'MoreYu 網站的隱私政策，了解我們如何收集、使用和保護您的個人信息。',
  },
};

// 404 頁面 SEO 配置
export const notFoundSEO = {
  title: '頁面未找到',
  description: '很抱歉，您請求的頁面不存在。請返回首頁或使用搜索功能查找所需內容。',
  canonical: 'https://moreyu.eu.org/404',
  openGraph: {
    url: 'https://moreyu.eu.org/404',
    title: '頁面未找到 - MoreYu',
    description: '很抱歉，您請求的頁面不存在。請返回首頁或使用搜索功能查找所需內容。',
  },
};
