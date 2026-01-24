import { useState } from 'react';
import { FileText, Sparkles, AlertCircle, Trash2, Copy, CheckCircle } from 'lucide-react';
import { analyzeAgreement, sampleAgreement } from '../lib/analyzer';
import type { AnalysisResult } from '../lib/types';
import { ScoreGauge } from './ScoreGauge';
import { ClauseCard } from './ClauseCard';
import { CategoryStats } from './CategoryStats';

export function AgreementAnalyzer() {
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleAnalyze = () => {
    if (!inputText.trim()) return;
    
    setIsAnalyzing(true);
    // 模拟分析延迟，增加戏剧效果
    setTimeout(() => {
      const analysisResult = analyzeAgreement(inputText);
      setResult(analysisResult);
      setIsAnalyzing(false);
    }, 800);
  };

  const handleLoadSample = () => {
    setInputText(sampleAgreement.trim());
    setResult(null);
  };

  const handleClear = () => {
    setInputText('');
    setResult(null);
  };

  const handleCopyResult = () => {
    if (!result) return;
    const summary = `【协议照妖镜分析结果】\n评分：${result.score}/100 (${result.grade}级)\n${result.summary}\n发现${result.clauses.length}个问题条款`;
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* 头部 */}
      <header className="py-8 px-4 text-center">
        <div className="inline-flex items-center gap-3 mb-4">
          <span className="text-5xl">🔮</span>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-yellow-200 via-pink-300 to-purple-400 bg-clip-text text-transparent">
            协议照妖镜
          </h1>
        </div>
        <p className="text-gray-400 max-w-2xl mx-auto">
          把那些让律师都头疼的用户协议，翻译成你能看懂的人话。<br />
          <span className="text-yellow-400">⚠️ 纯属娱乐，不构成法律建议</span>
        </p>
      </header>

      <main className="max-w-6xl mx-auto px-4 pb-12">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* 左侧：输入区域 */}
          <div className="space-y-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-white font-bold flex items-center gap-2">
                  <FileText size={20} />
                  粘贴用户协议
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={handleLoadSample}
                    className="text-xs px-3 py-1.5 rounded-lg bg-purple-500/30 text-purple-300 hover:bg-purple-500/50 transition-colors"
                  >
                    载入示例
                  </button>
                  <button
                    onClick={handleClear}
                    className="text-xs px-3 py-1.5 rounded-lg bg-red-500/30 text-red-300 hover:bg-red-500/50 transition-colors flex items-center gap-1"
                  >
                    <Trash2 size={14} />
                    清空
                  </button>
                </div>
              </div>

              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="把那份让你头大的用户协议粘贴到这里..."
                className="w-full h-64 p-4 rounded-xl bg-slate-800 text-gray-200 placeholder-gray-500 border border-slate-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none resize-none text-sm leading-relaxed"
              />

              <div className="flex items-center justify-between mt-4">
                <span className="text-xs text-gray-500">
                  {inputText.length} 字符
                </span>
                <button
                  onClick={handleAnalyze}
                  disabled={!inputText.trim() || isAnalyzing}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold flex items-center gap-2 hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/30"
                >
                  {isAnalyzing ? (
                    <>
                      <span className="animate-spin">⏳</span>
                      正在照妖...
                    </>
                  ) : (
                    <>
                      <Sparkles size={20} />
                      开始照妖
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* 使用提示 */}
            <div className="bg-yellow-500/10 rounded-xl p-4 border border-yellow-500/30">
              <div className="flex gap-3">
                <AlertCircle className="text-yellow-400 shrink-0" size={20} />
                <div className="text-sm text-yellow-200/80">
                  <p className="font-bold text-yellow-300 mb-1">使用小贴士</p>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>复制完整的用户协议文本效果最佳</li>
                    <li>支持中文协议，英文协议识别效果有限</li>
                    <li>结果仅供娱乐参考，重要决策请咨询专业人士</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* 右侧：结果区域 */}
          <div className="space-y-4">
            {result ? (
              <>
                {/* 评分卡片 */}
                <div className="bg-white rounded-2xl p-6 shadow-xl">
                  <div className="flex items-start justify-between mb-4">
                    <h2 className="font-bold text-gray-800 flex items-center gap-2">
                      <span className="text-2xl">📊</span>
                      照妖结果
                    </h2>
                    <button
                      onClick={handleCopyResult}
                      className="text-xs px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors flex items-center gap-1"
                    >
                      {copied ? <CheckCircle size={14} /> : <Copy size={14} />}
                      {copied ? '已复制' : '复制结果'}
                    </button>
                  </div>

                  <div className="flex flex-col items-center mb-6">
                    <ScoreGauge
                      score={result.score}
                      grade={result.grade}
                      gradeEmoji={result.gradeEmoji}
                    />
                  </div>

                  <div className="bg-gray-100 rounded-xl p-4 text-center">
                    <p className="text-gray-700 font-medium">{result.summary}</p>
                  </div>

                  {/* 问题分类统计 */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <CategoryStats breakdown={result.categoryBreakdown} />
                  </div>
                </div>

                {/* 问题条款列表 */}
                {result.clauses.length > 0 && (
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                    <h2 className="text-white font-bold mb-4 flex items-center gap-2">
                      <span className="text-xl">🚨</span>
                      发现 {result.clauses.length} 个问题条款
                    </h2>
                    <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                      {result.clauses.map((clause, index) => (
                        <ClauseCard key={index} clause={clause} index={index} />
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              /* 占位状态 */
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-12 border border-white/10 flex flex-col items-center justify-center text-center min-h-[400px]">
                <span className="text-6xl mb-4 opacity-50">🔍</span>
                <p className="text-gray-400 text-lg mb-2">等待照妖中...</p>
                <p className="text-gray-500 text-sm">粘贴用户协议，点击"开始照妖"</p>
              </div>
            )}
          </div>
        </div>

        {/* 底部声明 */}
        <footer className="mt-12 text-center text-gray-500 text-sm">
          <p>
            本工具纯属娱乐，不构成任何法律建议。
            <br />
            如需专业法律意见，请咨询执业律师。
          </p>
          <p className="mt-2 text-gray-600">
            Made with 💜 for fun • 2024
          </p>
        </footer>
      </main>
    </div>
  );
}
