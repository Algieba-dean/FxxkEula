// 协议条款类型
export interface ClausePattern {
  id: string;
  patterns: RegExp[];
  category: ClauseCategory;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  humanTranslation: string;
  roastComment: string;
  scoreImpact: number;
}

export type ClauseCategory = 
  | 'privacy'      // 隐私相关
  | 'liability'    // 免责条款
  | 'rights'       // 权利剥夺
  | 'payment'      // 付费陷阱
  | 'termination'  // 单方终止
  | 'data'         // 数据使用
  | 'arbitration'  // 仲裁条款
  | 'modification' // 单方修改
  | 'content';     // 内容权利

export interface AnalyzedClause {
  originalText: string;
  matchedPattern: ClausePattern;
  position: { start: number; end: number };
}

export interface AnalysisResult {
  clauses: AnalyzedClause[];
  score: number;
  grade: string;
  summary: string;
  categoryBreakdown: Record<ClauseCategory, number>;
}

export const categoryLabels: Record<ClauseCategory, string> = {
  privacy: '隐私窥探',
  liability: '甩锅免责',
  rights: '权利剥夺',
  payment: '付费陷阱',
  termination: '随时踢人',
  data: '数据榨取',
  arbitration: '霸王仲裁',
  modification: '说改就改',
  content: '内容霸占',
};

export const severityLabels: Record<string, { label: string; color: string }> = {
  low: { label: '小坑', color: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
  medium: { label: '中坑', color: 'bg-orange-100 text-orange-800 border-orange-300' },
  high: { label: '大坑', color: 'bg-red-100 text-red-800 border-red-300' },
  critical: { label: '天坑', color: 'bg-red-200 text-red-900 border-red-500' },
};
