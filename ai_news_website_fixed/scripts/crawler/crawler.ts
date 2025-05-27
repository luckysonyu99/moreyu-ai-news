import React from 'react';
import axios from 'axios';

interface CrawlerConfig {
  sources: string[];
  categories: string[];
  keywords: string[];
  excludeKeywords: string[];
  minWordCount: number;
  maxArticlesPerRun: number;
}

const defaultConfig: CrawlerConfig = {
  sources: [
    'https://openai.com/blog',
    'https://blog.research.google',
    'https://ai.meta.com/blog/',
    'https://www.microsoft.com/en-us/ai/blog',
    'https://huggingface.co/blog'
  ],
  categories: ['AI', '機器學習', '深度學習', '大語言模型', '電腦視覺'],
  keywords: ['AI', '人工智能', '機器學習', 'LLM', 'GPT', '深度學習'],
  excludeKeywords: ['廣告', '贊助'],
  minWordCount: 500,
  maxArticlesPerRun: 5
};

/**
 * 爬蟲主函數
 */
async function crawlContent(config: CrawlerConfig = defaultConfig): Promise<any[]> {
  const articles = [];
  
  try {
    console.log('開始爬取內容...');
    
    // 對每個來源進行爬取
    for (const source of config.sources) {
      console.log(`正在爬取來源: ${source}`);
      
      try {
        // 根據來源類型選擇適當的爬取方法
        if (source.includes('rss') || source.endsWith('.xml')) {
          const rssArticles = await crawlRssSource(source, config);
          articles.push(...rssArticles);
        } else {
          const webArticles = await crawlWebSource(source, config);
          articles.push(...webArticles);
        }
        
        // 如果已達到最大文章數，則停止爬取
        if (articles.length >= config.maxArticlesPerRun) {
          console.log(`已達到最大文章數 ${config.maxArticlesPerRun}，停止爬取`);
          break;
        }
      } catch (error) {
        console.error(`爬取來源 ${source} 時出錯:`, error);
        continue; // 繼續爬取下一個來源
      }
    }
    
    console.log(`爬取完成，共獲取 ${articles.length} 篇文章`);
    return articles;
  } catch (error) {
    console.error('爬取內容時發生錯誤:', error);
    throw error;
  }
}

/**
 * 爬取 RSS 來源
 */
async function crawlRssSource(url: string, config: CrawlerConfig): Promise<any[]> {
  try {
    const response = await axios.get(url);
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(response.data, "text/xml");
    
    const items = xmlDoc.querySelectorAll('item');
    const articles = [];
    
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      
      const title = item.querySelector('title')?.textContent || '';
      const link = item.querySelector('link')?.textContent || '';
      const pubDate = item.querySelector('pubDate')?.textContent || '';
      const description = item.querySelector('description')?.textContent || '';
      
      // 檢查是否符合關鍵詞要求
      if (!matchesKeywords(title + ' ' + description, config.keywords)) {
        continue;
      }
      
      // 檢查是否包含排除關鍵詞
      if (containsExcludeKeywords(title + ' ' + description, config.excludeKeywords)) {
        continue;
      }
      
      // 獲取完整內容
      const fullContent = await fetchArticleContent(link);
      
      // 檢查字數是否符合要求
      if (countWords(fullContent) < config.minWordCount) {
        continue;
      }
      
      // 自動分類
      const categories = categorizeContent(title + ' ' + fullContent, config.categories);
      
      articles.push({
        title,
        link,
        pubDate,
        content: fullContent,
        categories,
        source: {
          name: extractSourceName(url),
          url
        }
      });
      
      if (articles.length >= config.maxArticlesPerRun) {
        break;
      }
    }
    
    return articles;
  } catch (error) {
    console.error(`爬取 RSS 來源 ${url} 時出錯:`, error);
    return [];
  }
}

/**
 * 爬取網頁來源
 */
async function crawlWebSource(url: string, config: CrawlerConfig): Promise<any[]> {
  try {
    const response = await axios.get(url);
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(response.data, "text/html");
    
    // 尋找文章鏈接
    const links = htmlDoc.querySelectorAll('a');
    const articleLinks = [];
    
    for (let i = 0; i < links.length; i++) {
      const link = links[i];
      const href = link.getAttribute('href');
      
      if (!href) continue;
      
      // 確保是完整的 URL
      const fullUrl = new URL(href, url).href;
      
      // 檢查是否是文章鏈接
      if (isArticleLink(fullUrl, link.textContent || '')) {
        articleLinks.push(fullUrl);
      }
    }
    
    // 爬取每篇文章的內容
    const articles = [];
    
    for (const articleUrl of articleLinks) {
      try {
        const articleResponse = await axios.get(articleUrl);
        const articleDoc = parser.parseFromString(articleResponse.data, "text/html");
        
        // 提取文章標題
        const title = articleDoc.querySelector('h1')?.textContent || 
                     articleDoc.querySelector('title')?.textContent || '';
        
        // 提取文章內容
        const content = extractArticleContent(articleDoc);
        
        // 檢查是否符合關鍵詞要求
        if (!matchesKeywords(title + ' ' + content, config.keywords)) {
          continue;
        }
        
        // 檢查是否包含排除關鍵詞
        if (containsExcludeKeywords(title + ' ' + content, config.excludeKeywords)) {
          continue;
        }
        
        // 檢查字數是否符合要求
        if (countWords(content) < config.minWordCount) {
          continue;
        }
        
        // 提取發布日期
        const pubDate = extractPublishDate(articleDoc) || new Date().toISOString();
        
        // 自動分類
        const categories = categorizeContent(title + ' ' + content, config.categories);
        
        articles.push({
          title,
          link: articleUrl,
          pubDate,
          content,
          categories,
          source: {
            name: extractSourceName(url),
            url
          }
        });
        
        if (articles.length >= config.maxArticlesPerRun) {
          break;
        }
      } catch (error) {
        console.error(`爬取文章 ${articleUrl} 時出錯:`, error);
        continue;
      }
    }
    
    return articles;
  } catch (error) {
    console.error(`爬取網頁來源 ${url} 時出錯:`, error);
    return [];
  }
}

/**
 * 獲取文章完整內容
 */
async function fetchArticleContent(url: string): Promise<string> {
  try {
    const response = await axios.get(url);
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(response.data, "text/html");
    
    return extractArticleContent(htmlDoc);
  } catch (error) {
    console.error(`獲取文章內容 ${url} 時出錯:`, error);
    return '';
  }
}

/**
 * 從 HTML 文檔中提取文章內容
 */
function extractArticleContent(doc: Document): string {
  // 嘗試找到主要內容區域
  const contentSelectors = [
    'article',
    '.article',
    '.post',
    '.content',
    '.entry-content',
    '#content',
    'main'
  ];
  
  let contentElement = null;
  
  for (const selector of contentSelectors) {
    contentElement = doc.querySelector(selector);
    if (contentElement) break;
  }
  
  if (!contentElement) {
    contentElement = doc.body;
  }
  
  // 移除不需要的元素
  const elementsToRemove = contentElement.querySelectorAll(
    'script, style, nav, header, footer, .sidebar, .comments, .ad, .advertisement'
  );
  
  elementsToRemove.forEach(el => el.remove());
  
  return contentElement.textContent?.trim() || '';
}

/**
 * 檢查是否符合關鍵詞要求
 */
function matchesKeywords(text: string, keywords: string[]): boolean {
  const lowerText = text.toLowerCase();
  return keywords.some(keyword => lowerText.includes(keyword.toLowerCase()));
}

/**
 * 檢查是否包含排除關鍵詞
 */
function containsExcludeKeywords(text: string, excludeKeywords: string[]): boolean {
  const lowerText = text.toLowerCase();
  return excludeKeywords.some(keyword => lowerText.includes(keyword.toLowerCase()));
}

/**
 * 計算文本字數
 */
function countWords(text: string): number {
  return text.trim().split(/\s+/).length;
}

/**
 * 從 URL 中提取來源名稱
 */
function extractSourceName(url: string): string {
  try {
    const hostname = new URL(url).hostname;
    const parts = hostname.split('.');
    
    if (parts.length >= 2) {
      return parts[parts.length - 2].charAt(0).toUpperCase() + parts[parts.length - 2].slice(1);
    }
    
    return hostname;
  } catch (error) {
    return url;
  }
}

/**
 * 檢查是否是文章鏈接
 */
function isArticleLink(url: string, linkText: string): boolean {
  // 排除社交媒體、登錄、註冊等鏈接
  const excludePatterns = [
    'login', 'signin', 'signup', 'register',
    'facebook', 'twitter', 'instagram', 'linkedin',
    'contact', 'about', 'terms', 'privacy',
    'javascript:', 'mailto:', 'tel:'
  ];
  
  if (excludePatterns.some(pattern => url.toLowerCase().includes(pattern))) {
    return false;
  }
  
  // 檢查是否包含常見的文章路徑
  const articlePatterns = [
    '/article/', '/post/', '/blog/', '/news/',
    '/20', '/read/', '/story/', '/content/'
  ];
  
  if (articlePatterns.some(pattern => url.includes(pattern))) {
    return true;
  }
  
  // 檢查鏈接文本長度，通常文章標題較長
  if (linkText && linkText.length > 20) {
    return true;
  }
  
  return false;
}

/**
 * 從 HTML 文檔中提取發布日期
 */
function extractPublishDate(doc: Document): string | null {
  // 嘗試從 meta 標籤中獲取
  const metaSelectors = [
    'meta[property="article:published_time"]',
    'meta[name="pubdate"]',
    'meta[name="publishdate"]',
    'meta[name="date"]',
    'meta[name="DC.date.issued"]'
  ];
  
  for (const selector of metaSelectors) {
    const meta = doc.querySelector(selector);
    if (meta && meta.getAttribute('content')) {
      return meta.getAttribute('content') || null;
    }
  }
  
  // 嘗試從時間元素中獲取
  const timeElement = doc.querySelector('time');
  if (timeElement && timeElement.getAttribute('datetime')) {
    return timeElement.getAttribute('datetime') || null;
  }
  
  // 嘗試從常見的日期容器中獲取
  const dateSelectors = [
    '.date',
    '.published',
    '.pubdate',
    '.post-date',
    '.entry-date'
  ];
  
  for (const selector of dateSelectors) {
    const dateElement = doc.querySelector(selector);
    if (dateElement && dateElement.textContent) {
      const dateText = dateElement.textContent.trim();
      const date = new Date(dateText);
      
      if (!isNaN(date.getTime())) {
        return date.toISOString();
      }
    }
  }
  
  return null;
}

/**
 * 自動分類內容
 */
function categorizeContent(text: string, categories: string[]): string[] {
  const lowerText = text.toLowerCase();
  return categories.filter(category => 
    lowerText.includes(category.toLowerCase())
  );
}

export { crawlContent, CrawlerConfig, defaultConfig };
