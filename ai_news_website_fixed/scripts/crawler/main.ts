import { crawlContent, CrawlerConfig } from './crawler';
import { processArticle } from '../processor/processor';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// 配置爬蟲
const config: CrawlerConfig = {
  sources: [
    'https://openai.com/blog',
    'https://blog.research.google',
    'https://ai.meta.com/blog/',
    'https://www.microsoft.com/en-us/ai/blog',
    'https://huggingface.co/blog',
    'https://www.deeplearning.ai/blog/',
    'https://pytorch.org/blog/',
    'https://www.tensorflow.org/blog',
    'https://aws.amazon.com/blogs/machine-learning/',
    'https://blogs.nvidia.com/blog/category/deep-learning/'
  ],
  categories: ['AI', '機器學習', '深度學習', '大語言模型', '電腦視覺', '自然語言處理', '強化學習'],
  keywords: [
    'AI', '人工智能', '機器學習', 'LLM', 'GPT', '深度學習', 
    '神經網絡', '大模型', 'Transformer', '生成式AI', 
    'ChatGPT', 'Gemini', 'Claude', 'Llama', 'Mistral'
  ],
  excludeKeywords: ['廣告', '贊助', '招聘', '訂閱'],
  minWordCount: 500,
  maxArticlesPerRun: 5
};

// 主函數
async function main() {
  try {
    console.log('開始執行爬蟲任務...');
    
    // 爬取內容
    const articles = await crawlContent(config);
    console.log(`成功爬取 ${articles.length} 篇文章`);
    
    if (articles.length === 0) {
      console.log('沒有找到符合條件的文章，任務結束');
      return;
    }
    
    // 處理每篇文章
    for (const article of articles) {
      try {
        // 處理文章內容
        const processedArticle = await processArticle(article);
        
        // 生成唯一ID
        const id = uuidv4();
        
        // 生成文件名
        const date = new Date(processedArticle.pubDate);
        const dateStr = date.toISOString().split('T')[0];
        const slug = processedArticle.title
          .toLowerCase()
          .replace(/[^\w\s]/g, '')
          .replace(/\s+/g, '-')
          .substring(0, 50);
        
        const fileName = `${dateStr}-${slug}.md`;
        
        // 確保目錄存在
        const contentDir = path.join(process.cwd(), 'content', 'posts');
        if (!fs.existsSync(contentDir)) {
          fs.mkdirSync(contentDir, { recursive: true });
        }
        
        // 生成 Markdown 文件
        const filePath = path.join(contentDir, fileName);
        
        // 生成 frontmatter
        const frontmatter = `---
id: "${id}"
title: "${processedArticle.title.replace(/"/g, '\\"')}"
date: "${date.toISOString()}"
slug: "${slug}"
excerpt: "${processedArticle.excerpt.replace(/"/g, '\\"')}"
categories: [${processedArticle.categories.map(c => `"${c}"`).join(', ')}]
tags: [${processedArticle.tags.map(t => `"${t}"`).join(', ')}]
${processedArticle.coverImage ? `coverImage: "${processedArticle.coverImage}"` : ''}
source:
  name: "${processedArticle.source.name}"
  url: "${processedArticle.source.url}"
language: "zh-TW"
---

${processedArticle.content}
`;
        
        // 寫入文件
        fs.writeFileSync(filePath, frontmatter, 'utf-8');
        console.log(`文章已保存: ${filePath}`);
        
        // 更新分類和標籤數據
        updateCategoriesAndTags(processedArticle.categories, processedArticle.tags);
        
      } catch (error) {
        console.error(`處理文章時出錯:`, error);
        continue;
      }
    }
    
    console.log('爬蟲任務完成');
  } catch (error) {
    console.error('執行爬蟲任務時發生錯誤:', error);
    process.exit(1);
  }
}

// 更新分類和標籤數據
function updateCategoriesAndTags(categories: string[], tags: string[]) {
  try {
    // 更新分類
    const categoriesPath = path.join(process.cwd(), 'content', 'categories.json');
    let categoriesData: any[] = [];
    
    if (fs.existsSync(categoriesPath)) {
      categoriesData = JSON.parse(fs.readFileSync(categoriesPath, 'utf-8'));
    }
    
    for (const category of categories) {
      const existingCategory = categoriesData.find(c => c.name === category);
      
      if (existingCategory) {
        existingCategory.count += 1;
      } else {
        categoriesData.push({
          id: uuidv4(),
          name: category,
          slug: category
            .toLowerCase()
            .replace(/[^\w\s]/g, '')
            .replace(/\s+/g, '-'),
          description: `${category} 相關的文章`,
          count: 1
        });
      }
    }
    
    // 確保目錄存在
    const contentDir = path.join(process.cwd(), 'content');
    if (!fs.existsSync(contentDir)) {
      fs.mkdirSync(contentDir, { recursive: true });
    }
    
    fs.writeFileSync(categoriesPath, JSON.stringify(categoriesData, null, 2), 'utf-8');
    
    // 更新標籤
    const tagsPath = path.join(process.cwd(), 'content', 'tags.json');
    let tagsData: any[] = [];
    
    if (fs.existsSync(tagsPath)) {
      tagsData = JSON.parse(fs.readFileSync(tagsPath, 'utf-8'));
    }
    
    for (const tag of tags) {
      const existingTag = tagsData.find(t => t.name === tag);
      
      if (existingTag) {
        existingTag.count += 1;
      } else {
        tagsData.push({
          id: uuidv4(),
          name: tag,
          slug: tag
            .toLowerCase()
            .replace(/[^\w\s]/g, '')
            .replace(/\s+/g, '-'),
          count: 1
        });
      }
    }
    
    fs.writeFileSync(tagsPath, JSON.stringify(tagsData, null, 2), 'utf-8');
    
  } catch (error) {
    console.error('更新分類和標籤數據時出錯:', error);
  }
}

// 執行主函數
if (require.main === module) {
  main();
}

export { main };
