import React from 'react';
import Link from 'next/link';

interface ArchiveListProps {
  archives: {
    year: number;
    months: {
      month: number;
      articles: {
        id: string;
        title: string;
        slug: string;
        date: string;
      }[];
    }[];
  }[];
}

const ArchiveList: React.FC<ArchiveListProps> = ({ archives }) => {
  return (
    <div className="space-y-8">
      {archives.map((yearData) => (
        <div key={yearData.year} className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {yearData.year}
          </h2>
          
          {yearData.months.map((monthData) => (
            <div key={`${yearData.year}-${monthData.month}`} className="ml-4 space-y-2">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                {monthData.month} 月
              </h3>
              
              <ul className="ml-4 space-y-2">
                {monthData.articles.map((article) => (
                  <li key={article.id} className="flex items-baseline">
                    <span className="text-sm text-gray-500 dark:text-gray-400 w-20">
                      {new Date(article.date).toLocaleDateString('zh-TW', {
                        month: '2-digit',
                        day: '2-digit'
                      })}
                    </span>
                    <Link 
                      href={`/posts/${article.slug}`}
                      className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      {article.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default ArchiveList;
