import React from 'react';
import Link from 'next/link';

interface TagCloudProps {
  tags: {
    name: string;
    slug: string;
    count: number;
  }[];
}

const TagCloud: React.FC<TagCloudProps> = ({ tags }) => {
  // 根據文章數量排序標籤
  const sortedTags = [...tags].sort((a, b) => b.count - a.count);
  
  // 根據文章數量計算字體大小
  const getSize = (count: number): string => {
    const max = Math.max(...tags.map(t => t.count));
    const min = Math.min(...tags.map(t => t.count));
    const range = max - min || 1;
    const normalized = (count - min) / range;
    const baseSize = 0.75; // 基礎字體大小 (rem)
    const maxSize = 1.125; // 最大字體大小 (rem)
    const size = baseSize + normalized * (maxSize - baseSize);
    return `${size}rem`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">標籤</h3>
      <div className="flex flex-wrap gap-2">
        {sortedTags.map((tag) => (
          <Link
            key={tag.slug}
            href={`/tags/${tag.slug}`}
            className="inline-block px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
            style={{ fontSize: getSize(tag.count) }}
          >
            #{tag.name} <span className="text-xs">({tag.count})</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TagCloud;
