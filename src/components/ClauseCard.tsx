import { AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import type { AnalyzedClause } from '../lib/types';
import { categoryLabels, severityLabels } from '../lib/types';

interface ClauseCardProps {
  clause: AnalyzedClause;
  index: number;
}

export function ClauseCard({ clause, index }: ClauseCardProps) {
  const [expanded, setExpanded] = useState(false);
  const { matchedPattern, originalText } = clause;
  const severity = severityLabels[matchedPattern.severity];
  const category = categoryLabels[matchedPattern.category];

  return (
    <div
      className={`border-2 rounded-xl overflow-hidden transition-all duration-300 ${
        expanded ? 'shadow-lg' : 'shadow-sm hover:shadow-md'
      } ${severity.color.replace('bg-', 'border-').split(' ')[0]} bg-white`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* 头部 */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-3 flex items-center justify-between gap-3 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className={`shrink-0 p-2 rounded-lg ${severity.color}`}>
            <AlertTriangle size={18} />
          </div>
          <div className="text-left min-w-0">
            <h3 className="font-bold text-gray-800 truncate">{matchedPattern.title}</h3>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className={`text-xs px-2 py-0.5 rounded-full ${severity.color}`}>
                {severity.label}
              </span>
              <span className="text-xs text-gray-500">{category}</span>
            </div>
          </div>
        </div>
        <div className="shrink-0 text-gray-400">
          {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </button>

      {/* 展开内容 */}
      {expanded && (
        <div className="px-4 pb-4 space-y-3 animate-fadeIn">
          {/* 原文 */}
          <div className="bg-gray-100 rounded-lg p-3">
            <p className="text-xs text-gray-500 mb-1">📄 原文条款</p>
            <p className="text-sm text-gray-700 leading-relaxed">
              "{originalText.length > 200 ? originalText.substring(0, 200) + '...' : originalText}"
            </p>
          </div>

          {/* 人话翻译 */}
          <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
            <p className="text-xs text-blue-600 mb-1">💬 人话翻译</p>
            <p className="text-sm text-blue-800 font-medium">{matchedPattern.humanTranslation}</p>
          </div>

          {/* 吐槽 */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-3 border border-purple-200">
            <p className="text-sm text-purple-800">{matchedPattern.roastComment}</p>
          </div>

          {/* 扣分 */}
          <div className="flex justify-end">
            <span className="text-sm text-red-500 font-bold">
              扣分：{matchedPattern.scoreImpact} 分
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
