import React from 'react';
import ArticleCard from '../common/ArticleCard';

interface Article {
  id: string;
  title: string;
  slug: string;
  date: string;
  excerpt: string;
  content: string;
  categories: string[];
  tags: string[];
  coverImage?: string;
  views?: number;
  comments?: number;
}

interface ArticleListProps {
  articles: Article[];
  title?: string;
}

const ArticleList: React.FC<ArticleListProps> = ({ articles, title }) => {
  return (
    <div className="space-y-8">
      {title && (
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          {title}
        </h2>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <ArticleCard
            key={article.id}
            title={article.title}
            excerpt={article.excerpt}
            date={article.date}
            slug={article.slug}
            coverImage={article.coverImage}
            categories={article.categories}
            tags={article.tags}
            views={article.views}
            comments={article.comments}
          />
        ))}
      </div>
    </div>
  );
};

export default ArticleList;
