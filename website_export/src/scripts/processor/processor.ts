import { JSDOM } from 'jsdom';
import TurndownService from 'turndown';
import axios from 'axios';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

// 初始化 Turndown 服務，用於將 HTML 轉換為 Markdown
const turndownService = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  emDelimiter: '*'
});

// 增強 Turndown 處理能力
turndownService.addRule('codeBlocks', {
  filter: ['pre', 'code'],
  replacement: function(content, node) {
    const language = node.getAttribute('class') || '';
    const match = language.match(/language-(\w+)/);
    const lang = match ? match[1] : '';
    return '\n```' + lang + '\n' + content + '\n```\n';
  }
});

interface Article {
  title: string;
  link: string;
  pubDate: string;
  content: string;
  categories: string[];
  source: {
    name: string;
    url: string;
  };
}

interface ProcessedArticle {
  title: string;
  slug: string;
  pubDate: string;
  excerpt: string;
  content: string;
  categories: string[];
  tags: string[];
  coverImage?: string;
  source: {
    name: string;
    url: string;
  };
}

/**
 * 處理文章
 */
async function processArticle(article: Article): Promise<ProcessedArticle> {
  try {
    console.log(`處理文章: ${article.title}`);
    
    // 清理 HTML 內容
    const cleanedHtml = cleanHtml(article.content);
    
    // 將 HTML 轉換為 Markdown
    const markdown = convertToMarkdown(cleanedHtml);
    
    // 提取摘要
    const excerpt = extractExcerpt(markdown);
    
    // 生成標籤
    const tags = generateTags(article.title + ' ' + markdown);
    
    // 提取封面圖片
    const coverImage = await extractCoverImage(article.link, cleanedHtml);
    
    // 生成 slug
    const slug = article.title
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50);
    
    return {
      title: article.title,
      slug,
      pubDate: article.pubDate,
      excerpt,
      content: markdown,
      categories: article.categories,
      tags,
      coverImage,
      source: article.source
    };
  } catch (error) {
    console.error(`處理文章時出錯: ${article.title}`, error);
    throw error;
  }
}

/**
 * 清理 HTML 內容
 */
function cleanHtml(html: string): string {
  try {
    const dom = new JSDOM(html);
    const document = dom.window.document;
    
    // 移除不需要的元素
    const elementsToRemove = document.querySelectorAll(
      'script, style, iframe, nav, header, footer, .sidebar, .comments, .ad, .advertisement, .share, .social'
    );
    
    elementsToRemove.forEach(el => el.remove());
    
    // 處理圖片
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      // 確保圖片有 alt 屬性
      if (!img.getAttribute('alt')) {
        img.setAttribute('alt', 'Image');
      }
      
      // 確保圖片有完整的 src 路徑
      const src = img.getAttribute('src');
      if (src && src.startsWith('/')) {
        img.setAttribute('src', new URL(src, 'https://example.com').href);
      }
    });
    
    // 處理鏈接
    const links = document.querySelectorAll('a');
    links.forEach(link => {
      // 確保鏈接有完整的 href 路徑
      const href = link.getAttribute('href');
      if (href && href.startsWith('/')) {
        link.setAttribute('href', new URL(href, 'https://example.com').href);
      }
    });
    
    return document.body.innerHTML;
  } catch (error) {
    console.error('清理 HTML 時出錯:', error);
    return html;
  }
}

/**
 * 將 HTML 轉換為 Markdown
 */
function convertToMarkdown(html: string): string {
  try {
    return turndownService.turndown(html);
  } catch (error) {
    console.error('轉換為 Markdown 時出錯:', error);
    return html;
  }
}

/**
 * 提取摘要
 */
function extractExcerpt(markdown: string, maxLength: number = 200): string {
  try {
    // 移除 Markdown 標記
    let text = markdown
      .replace(/#+\s+/g, '') // 移除標題
      .replace(/\*\*/g, '')   // 移除粗體
      .replace(/\*/g, '')     // 移除斜體
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // 移除鏈接，保留文本
      .replace(/!\[([^\]]+)\]\([^)]+\)/g, '') // 移除圖片
      .replace(/```[\s\S]*?```/g, '') // 移除代碼塊
      .replace(/`([^`]+)`/g, '$1') // 移除行內代碼
      .replace(/\n+/g, ' ') // 將換行替換為空格
      .trim();
    
    // 截取指定長度
    if (text.length > maxLength) {
      text = text.substring(0, maxLength).trim() + '...';
    }
    
    return text;
  } catch (error) {
    console.error('提取摘要時出錯:', error);
    return markdown.substring(0, maxLength) + '...';
  }
}

/**
 * 生成標籤
 */
function generateTags(text: string): string[] {
  try {
    // 常見 AI 相關標籤
    const commonTags = [
      'OpenAI', 'GPT', 'ChatGPT', 'GPT-4', 'GPT-5',
      'Gemini', 'Claude', 'Llama', 'Mistral', 'Anthropic',
      'AI', '人工智能', '機器學習', '深度學習', '神經網絡',
      'LLM', '大語言模型', 'Transformer', '生成式AI',
      'NLP', '自然語言處理', '電腦視覺', '強化學習',
      'TensorFlow', 'PyTorch', 'Hugging Face', 'NVIDIA',
      'AGI', '通用人工智能', 'AI安全', 'AI倫理'
    ];
    
    const lowerText = text.toLowerCase();
    const tags = commonTags.filter(tag => 
      lowerText.includes(tag.toLowerCase())
    );
    
    // 去重
    return Array.from(new Set(tags)).slice(0, 5);
  } catch (error) {
    console.error('生成標籤時出錯:', error);
    return ['AI'];
  }
}

/**
 * 提取封面圖片
 */
async function extractCoverImage(url: string, html: string): Promise<string | undefined> {
  try {
    const dom = new JSDOM(html);
    const document = dom.window.document;
    
    // 嘗試找到封面圖片
    const selectors = [
      'meta[property="og:image"]',
      'meta[name="twitter:image"]',
      '.featured-image img',
      'article img',
      '.post-thumbnail img',
      '.entry-content img'
    ];
    
    let imageUrl = null;
    
    // 從 meta 標籤中查找
    for (const selector of selectors) {
      const element = document.querySelector(selector);
      if (element) {
        if (selector.includes('meta')) {
          imageUrl = element.getAttribute('content');
        } else {
          imageUrl = element.getAttribute('src');
        }
        
        if (imageUrl) break;
      }
    }
    
    // 如果沒有找到圖片，返回 undefined
    if (!imageUrl) {
      return undefined;
    }
    
    // 確保 URL 是絕對路徑
    if (imageUrl.startsWith('/')) {
      const baseUrl = new URL(url);
      imageUrl = `${baseUrl.protocol}//${baseUrl.host}${imageUrl}`;
    } else if (!imageUrl.startsWith('http')) {
      imageUrl = new URL(imageUrl, url).href;
    }
    
    // 下載並保存圖片
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const contentType = response.headers['content-type'];
    const extension = contentType.split('/')[1];
    
    const imageName = `${uuidv4()}.${extension}`;
    const imagePath = path.join(process.cwd(), 'public', 'images', 'posts', imageName);
    
    // 確保目錄存在
    const imageDir = path.join(process.cwd(), 'public', 'images', 'posts');
    if (!fs.existsSync(imageDir)) {
      fs.mkdirSync(imageDir, { recursive: true });
    }
    
    fs.writeFileSync(imagePath, response.data);
    
    return `/images/posts/${imageName}`;
  } catch (error) {
    console.error('提取封面圖片時出錯:', error);
    return undefined;
  }
}

export { processArticle, ProcessedArticle };
