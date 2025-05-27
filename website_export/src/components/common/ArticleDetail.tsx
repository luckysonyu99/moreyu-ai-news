import React from 'react';
import { useRouter } from 'next/router';
import { MDXRemote } from 'next-mdx-remote';
import Image from 'next/image';
import Link from 'next/link';
import CommentSection from '../common/CommentSection';

interface ArticleDetailProps {
  article: {
    title: string;
    date: string;
    lastModified?: string;
    content: any; // MDX content
    categories: string[];
    tags: string[];
    coverImage?: string;
    author?: string;
    source?: {
      name: string;
      url: string;
    };
    readingTime?: number;
    views?: number;
    comments?: number;
  };
  darkMode: boolean;
}

const ArticleDetail: React.FC<ArticleDetailProps> = ({ article, darkMode }) => {
  const router = useRouter();
  
  // 自定義 MDX 組件
  const components = {
    img: (props: any) => (
      <div className="my-6">
        <Image
          {...props}
          alt={props.alt || ''}
          width={800}
          height={450}
          className="rounded-lg mx-auto"
        />
        {props.alt && (
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
            {props.alt}
          </p>
        )}
      </div>
    ),
    a: (props: any) => (
      <Link 
        {...props} 
        href={props.href}
        className="text-blue-600 dark:text-blue-400 hover:underline"
      />
    ),
    // 其他自定義組件...
  };

  return (
    <article className="max-w-4xl mx-auto">
      {/* 文章頭部 */}
      <header className="mb-8">
        {article.coverImage && (
          <div className="relative h-80 w-full mb-6">
            <Image
              src={article.coverImage}
              alt={article.title}
              fill
              className="object-cover rounded-lg"
              priority
            />
          </div>
        )}
        
        <div className="flex flex-wrap gap-2 mb-4">
          {article.categories.map((category) => (
            <Link 
              key={category} 
              href={`/categories/${category}`}
              className="text-sm font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-md"
            >
              {category}
            </Link>
          ))}
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          {article.title}
        </h1>
        
        <div className="flex flex-wrap items-center text-sm text-gray-500 dark:text-gray-400 gap-4 mb-4">
          <time dateTime={article.date}>
            發布於 {new Date(article.date).toLocaleDateString('zh-TW', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </time>
          
          {article.lastModified && (
            <time dateTime={article.lastModified}>
              更新於 {new Date(article.lastModified).toLocaleDateString('zh-TW', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
          )}
          
          {article.author && (
            <span>作者: {article.author}</span>
          )}
          
          {article.readingTime && (
            <span>閱讀時間: {article.readingTime} 分鐘</span>
          )}
        </div>
        
        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span>{article.views || 0}</span>
          </div>
          
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
            <span>{article.comments || 0}</span>
          </div>
        </div>
      </header>
      
      {/* 文章內容 */}
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <MDXRemote {...article.content} components={components} />
      </div>
      
      {/* 來源信息 */}
      {article.source && (
        <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-600 dark:text-gray-300">
            來源: <a href={article.source.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">{article.source.name}</a>
          </p>
        </div>
      )}
      
      {/* 標籤 */}
      {article.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-8">
          {article.tags.map((tag) => (
            <Link 
              key={tag} 
              href={`/tags/${tag}`}
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full"
            >
              #{tag}
            </Link>
          ))}
        </div>
      )}
      
      {/* 分享按鈕 */}
      <div className="flex space-x-4 mt-8">
        <button 
          onClick={() => window.navigator.share?.({
            title: article.title,
            url: window.location.href
          })}
          className="flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          分享
        </button>
      </div>
      
      {/* 評論區 */}
      <CommentSection darkMode={darkMode} />
    </article>
  );
};

export default ArticleDetail;
