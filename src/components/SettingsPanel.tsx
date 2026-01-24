import { useState, useEffect } from 'react';
import { X, Save, Key, Server, Cpu } from 'lucide-react';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (settings: AISettings) => void;
  currentSettings: AISettings;
}

export interface AISettings {
  apiUrl: string;
  apiKey: string;
  model: string;
}

const DEFAULT_MODELS = [
  'deepseek-v3.1',
  'deepseek-r1',
  'glm-4.1-flash',
  'kimi-k2',
  'claude-sonnet-4-20250514',
  'grok-4.1-mini',
];

export function SettingsPanel({ isOpen, onClose, onSave, currentSettings }: SettingsPanelProps) {
  const [settings, setSettings] = useState<AISettings>(currentSettings);
  const [customModel, setCustomModel] = useState('');
  const [useCustomModel, setUseCustomModel] = useState(false);

  useEffect(() => {
    setSettings(currentSettings);
    const isCustom = !DEFAULT_MODELS.includes(currentSettings.model);
    setUseCustomModel(isCustom);
    if (isCustom) {
      setCustomModel(currentSettings.model);
    }
  }, [currentSettings, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    const finalSettings = {
      ...settings,
      model: useCustomModel ? customModel : settings.model,
    };
    onSave(finalSettings);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* 头部 */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-6 py-4 flex items-center justify-between">
          <h2 className="text-white font-bold text-lg">API 设置</h2>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* 内容 */}
        <div className="p-6 space-y-5">
          {/* API 地址 */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Server size={16} />
              API 地址
            </label>
            <input
              type="text"
              value={settings.apiUrl}
              onChange={(e) => setSettings({ ...settings, apiUrl: e.target.value })}
              placeholder="https://api.example.com/v1"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">支持 OpenAI 兼容的 API 接口</p>
          </div>

          {/* API 密钥 */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Key size={16} />
              API 密钥
            </label>
            <input
              type="password"
              value={settings.apiKey}
              onChange={(e) => setSettings({ ...settings, apiKey: e.target.value })}
              placeholder="sk-..."
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">密钥将保存在本地浏览器中</p>
          </div>

          {/* 模型选择 */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Cpu size={16} />
              模型
            </label>
            
            {!useCustomModel ? (
              <select
                value={settings.model}
                onChange={(e) => setSettings({ ...settings, model: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-sm bg-white"
              >
                {DEFAULT_MODELS.map((model) => (
                  <option key={model} value={model}>{model}</option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={customModel}
                onChange={(e) => setCustomModel(e.target.value)}
                placeholder="输入自定义模型名称"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-sm"
              />
            )}

            <button
              onClick={() => setUseCustomModel(!useCustomModel)}
              className="text-xs text-blue-600 hover:text-blue-700 mt-2"
            >
              {useCustomModel ? '使用预设模型' : '使用自定义模型'}
            </button>
          </div>
        </div>

        {/* 底部按钮 */}
        <div className="px-6 py-4 bg-gray-50 flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-200 transition-colors text-sm font-medium"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2"
          >
            <Save size={16} />
            保存设置
          </button>
        </div>
      </div>
    </div>
  );
}
