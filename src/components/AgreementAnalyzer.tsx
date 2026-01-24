import { useState } from 'react';
import { FileText, Sparkles, AlertCircle, Trash2, Copy, CheckCircle, Bot, Cpu, ChevronDown, Settings } from 'lucide-react';
import { analyzeAgreement, sampleAgreement } from '../lib/analyzer';
import { analyzeWithAI, isAIAvailable } from '../lib/ai-service';
import { AVAILABLE_MODELS, AI_CONFIG, saveAIConfig, type ModelId } from '../lib/ai-config';
import type { AnalysisResult } from '../lib/types';
import { ScoreGauge } from './ScoreGauge';
import { ClauseCard } from './ClauseCard';
import { CategoryStats } from './CategoryStats';
import { SettingsPanel, type AISettings } from './SettingsPanel';

type AnalyzeMode = 'local' | 'ai';

export function AgreementAnalyzer() {
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [mode, setMode] = useState<AnalyzeMode>(isAIAvailable() ? 'ai' : 'local');
  const [selectedModel, setSelectedModel] = useState<ModelId>(AI_CONFIG.model);
  const [showModelSelect, setShowModelSelect] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;
    
    setIsAnalyzing(true);
    setError(null);

    try {
      if (mode === 'ai') {
        const analysisResult = await analyzeWithAI({
          agreementText: inputText,
          model: selectedModel,
        });
        setResult(analysisResult);
      } else {
        // 本地模式，模拟延迟
        await new Promise(resolve => setTimeout(resolve, 500));
        const analysisResult = analyzeAgreement(inputText);
        setResult(analysisResult);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '分析失败，请稍后重试');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleLoadSample = () => {
    setInputText(sampleAgreement.trim());
    setResult(null);
  };

  const handleClear = () => {
    setInputText('');
    setResult(null);
    setError(null);
  };

  const currentModel = AVAILABLE_MODELS.find(m => m.id === selectedModel);

  const handleSaveSettings = (settings: AISettings) => {
    saveAIConfig(settings);
    setSelectedModel(settings.model);
  };

  const handleCopyResult = () => {
    if (!result) return;
    const summary = `【协议照妖镜分析结果】\n评分：${result.score}/100 (${result.grade}级)\n${result.summary}\n发现${result.clauses.length}个问题条款`;
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* 头部 */}
      <header className="py-8 px-4 text-center relative">
        {/* 设置按钮 */}
        <button
          onClick={() => setShowSettings(true)}
          className="absolute right-4 top-4 p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          title="API 设置"
        >
          <Settings size={20} />
        </button>

        <div className="inline-flex items-center gap-3 mb-4">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-500 bg-clip-text text-transparent">
            协议照妖镜
          </h1>
        </div>
        <p className="text-gray-400 max-w-2xl mx-auto">
          把那些让律师都头疼的用户协议，翻译成你能看懂的人话。<br />
          <span className="text-amber-400 text-sm">纯属娱乐，不构成法律建议</span>
        </p>

        {/* 模式切换 */}
        <div className="mt-6 flex items-center justify-center gap-2">
          <div className="bg-white/10 rounded-xl p-1 flex gap-1">
            <button
              onClick={() => setMode('local')}
              className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${
                mode === 'local'
                  ? 'bg-white text-purple-900'
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Cpu size={16} />
              本地规则
            </button>
            <button
              onClick={() => setMode('ai')}
              disabled={!isAIAvailable()}
              className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${
                mode === 'ai'
                  ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <Bot size={16} />
              AI 深度分析
            </button>
          </div>

          {/* AI 模型选择 */}
          {mode === 'ai' && (
            <div className="relative">
              <button
                onClick={() => setShowModelSelect(!showModelSelect)}
                className="px-3 py-2 rounded-lg bg-white/10 text-gray-300 text-sm flex items-center gap-2 hover:bg-white/20 transition-colors"
              >
                {currentModel?.name || selectedModel}
                <ChevronDown size={14} className={`transition-transform ${showModelSelect ? 'rotate-180' : ''}`} />
              </button>
              {showModelSelect && (
                <div className="absolute top-full mt-2 right-0 bg-slate-800 rounded-xl border border-slate-700 shadow-xl z-50 min-w-[240px] overflow-hidden">
                  {AVAILABLE_MODELS.map((model) => (
                    <button
                      key={model.id}
                      onClick={() => {
                        setSelectedModel(model.id);
                        setShowModelSelect(false);
                      }}
                      className={`w-full px-4 py-3 text-left hover:bg-slate-700 transition-colors ${
                        selectedModel === model.id ? 'bg-slate-700/50' : ''
                      }`}
                    >
                      <div className="text-white text-sm font-medium">{model.name}</div>
                      <div className="text-gray-400 text-xs">{model.description}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
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
                      <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {mode === 'ai' ? 'AI 分析中...' : '分析中...'}
                    </>
                  ) : (
                    <>
                      {mode === 'ai' ? <Bot size={20} /> : <Sparkles size={20} />}
                      {mode === 'ai' ? 'AI 深度分析' : '开始分析'}
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* 错误提示 */}
            {error && (
              <div className="bg-red-500/10 rounded-xl p-4 border border-red-500/30">
                <div className="flex gap-3">
                  <AlertCircle className="text-red-400 shrink-0" size={20} />
                  <div className="text-sm text-red-200">
                    <p className="font-bold text-red-300 mb-1">分析出错</p>
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* 使用提示 */}
            <div className="bg-yellow-500/10 rounded-xl p-4 border border-yellow-500/30">
              <div className="flex gap-3">
                <AlertCircle className="text-yellow-400 shrink-0" size={20} />
                <div className="text-sm text-yellow-200/80">
                  <p className="font-bold text-yellow-300 mb-1">使用小贴士</p>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>复制完整的用户协议文本效果最佳</li>
                    {mode === 'ai' ? (
                      <>
                        <li>AI 模式分析更深入，可识别隐晦的不合理条款</li>
                        <li>可切换不同 AI 模型，获得不同视角的分析</li>
                      </>
                    ) : (
                      <li>本地模式使用预设规则，速度快但覆盖有限</li>
                    )}
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
                    <h2 className="font-bold text-gray-800">
                      分析结果
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
                    <h2 className="text-white font-bold mb-4">
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
                <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-4">
                  <FileText className="text-gray-500" size={32} />
                </div>
                <p className="text-gray-400 text-lg mb-2">等待分析</p>
                <p className="text-gray-500 text-sm">粘贴用户协议，点击"开始分析"</p>
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
            Made for fun
          </p>
        </footer>
      </main>

      {/* 设置面板 */}
      <SettingsPanel
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        onSave={handleSaveSettings}
        currentSettings={{
          apiUrl: AI_CONFIG.apiUrl,
          apiKey: AI_CONFIG.apiKey,
          model: selectedModel,
        }}
      />
    </div>
  );
}
