// 本地存储键名
const STORAGE_KEY = 'agreement-analyzer-ai-settings';

// 默认配置
const DEFAULT_CONFIG = {
  apiUrl: import.meta.env.VITE_AI_API_URL || 'https://ai.huan666.de/v1',
  apiKey: import.meta.env.VITE_AI_API_KEY || '',
  model: import.meta.env.VITE_AI_MODEL || 'deepseek-v3.1',
};

// 从本地存储加载配置
function loadConfig(): typeof DEFAULT_CONFIG {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...DEFAULT_CONFIG, ...parsed };
    }
  } catch {
    // 忽略解析错误
  }
  return DEFAULT_CONFIG;
}

// 保存配置到本地存储
export function saveAIConfig(config: { apiUrl: string; apiKey: string; model: string }): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  // 更新运行时配置
  Object.assign(AI_CONFIG, config);
}

// AI 服务配置（可动态更新）
export const AI_CONFIG = loadConfig();

// 可用模型列表
export const AVAILABLE_MODELS = [
  { id: 'deepseek-v3.1', name: 'DeepSeek V3.1', description: '性价比之王' },
  { id: 'deepseek-r1', name: 'DeepSeek R1', description: '推理能力强' },
  { id: 'glm-4.1-flash', name: 'GLM 4.1 Flash', description: '智谱快速模型' },
  { id: 'kimi-k2', name: 'Kimi K2', description: '长文本处理强' },
  { id: 'claude-sonnet-4-20250514', name: 'Claude Sonnet 4', description: 'Anthropic 旗舰' },
  { id: 'grok-4.1-mini', name: 'Grok 4.1 Mini', description: 'xAI 轻量模型' },
] as const;

export type ModelId = typeof AVAILABLE_MODELS[number]['id'] | string;
