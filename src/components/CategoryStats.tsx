import type { ClauseCategory } from '../lib/types';
import { categoryLabels } from '../lib/types';

interface CategoryStatsProps {
  breakdown: Record<ClauseCategory, number>;
}

export function CategoryStats({ breakdown }: CategoryStatsProps) {
  const categories = Object.entries(breakdown)
    .filter(([, count]) => count > 0)
    .sort(([, a], [, b]) => b - a);

  if (categories.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>🎉 暂未检测到明显问题条款</p>
      </div>
    );
  }

  const maxCount = Math.max(...categories.map(([, count]) => count));

  return (
    <div className="space-y-3">
      <h3 className="font-bold text-gray-700 mb-4">问题分布</h3>
      {categories.map(([category, count]) => (
        <div key={category} className="flex items-center gap-3">
          <span className="w-24 text-sm shrink-0">
            {categoryLabels[category as ClauseCategory]}
          </span>
          <div className="flex-1 bg-gray-200 rounded-full h-4 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-red-400 to-red-600 rounded-full transition-all duration-500"
              style={{ width: `${(count / maxCount) * 100}%` }}
            />
          </div>
          <span className="text-sm font-bold text-red-600 w-8 text-right">{count}</span>
        </div>
      ))}
    </div>
  );
}
