import React from 'react';
import Link from 'next/link';

interface CategoryCloudProps {
  categories: {
    name: string;
    slug: string;
    count: number;
  }[];
}

const CategoryCloud: React.FC<CategoryCloudProps> = ({ categories }) => {
  // 根據文章數量排序分類
  const sortedCategories = [...categories].sort((a, b) => b.count - a.count);
  
  // 根據文章數量計算字體大小
  const getSize = (count: number): string => {
    const max = Math.max(...categories.map(c => c.count));
    const min = Math.min(...categories.map(c => c.count));
    const range = max - min || 1;
    const normalized = (count - min) / range;
    const baseSize = 0.875; // 基礎字體大小 (rem)
    const maxSize = 1.25;   // 最大字體大小 (rem)
    const size = baseSize + normalized * (maxSize - baseSize);
    return `${size}rem`;
  };

  // 隨機顏色類別（保持一致性）
  const colorClasses = [
    'text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300',
    'text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300',
    'text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300',
    'text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300',
    'text-yellow-600 dark:text-yellow-400 hover:text-yellow-800 dark:hover:text-yellow-300',
    'text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300',
  ];
  
  // 為每個分類分配一個顏色類別
  const getColorClass = (index: number): string => {
    return colorClasses[index % colorClasses.length];
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">分類</h3>
      <div className="flex flex-wrap gap-3">
        {sortedCategories.map((category, index) => (
          <Link
            key={category.slug}
            href={`/categories/${category.slug}`}
            className={`${getColorClass(index)} transition-colors`}
            style={{ fontSize: getSize(category.count) }}
          >
            {category.name} ({category.count})
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryCloud;
