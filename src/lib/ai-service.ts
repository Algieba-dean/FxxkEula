import { AI_CONFIG, type ModelId } from './ai-config';
import type { AnalysisResult, ClauseCategory } from './types';

// AI 分析请求参数
interface AIAnalyzeRequest {
  agreementText: string;
  model?: ModelId;
}

// AI 原始响应中的条款
interface AIClauseResponse {
  originalText: string;
  category: ClauseCategory;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  humanTranslation: string;
  roastComment: string;
  scoreImpact: number;
}

// AI 原始响应
interface AIRawResponse {
  score: number;
  grade: string;
  summary: string;
  clauses: AIClauseResponse[];
}

// 系统提示词
const SYSTEM_PROMPT = `你是一个专业的用户协议分析专家，同时具有幽默风趣的吐槽能力。你的任务是分析用户协议中的不合理条款，并以戏谑的方式翻译成普通人能理解的"人话"。

## 分析维度
请从以下9个维度分析协议条款：
- privacy: 隐私窥探（信息收集、共享、监控等）
- liability: 甩锅免责（服务质量、损失责任等）
- rights: 权利剥夺（单方面决定、用户权利限制等）
- payment: 付费陷阱（自动续费、不退款、价格变动等）
- termination: 随时踢人（账号终止、服务暂停等）
- data: 数据榨取（商业使用、AI训练等）
- arbitration: 霸王仲裁（强制仲裁、管辖权等）
- modification: 说改就改（协议变更、默认同意等）
- content: 内容霸占（用户内容权利、授权转让等）

## 严重程度
- low: 小坑（轻微不合理，扣5-8分）
- medium: 中坑（一般不合理，扣10-12分）
- high: 大坑（严重不合理，扣15-20分）
- critical: 天坑（极度不合理，扣25-30分）

## 评分标准
- 满分100分，根据发现的问题条款扣分
- 90-100: S级（业界良心）
- 80-89: A级（还算厚道）
- 70-79: B级（中规中矩）
- 60-69: C级（坑比较多）
- 40-59: D级（堪比卖身契）
- 20-39: E级（极度危险）
- 0-19: F级（抢劫宣言）

## 输出要求
请严格按照以下JSON格式输出（不要输出其他内容，不要使用任何emoji表情）：
{
  "score": 数字(0-100),
  "grade": "S/A/B/C/D/E/F",
  "summary": "一句话总结评价，要幽默犀利，不要使用emoji",
  "clauses": [
    {
      "originalText": "原文摘录（简短）",
      "category": "分类ID",
      "severity": "严重程度",
      "title": "问题标题（4-6字，要有趣）",
      "humanTranslation": "翻译：用大白话翻译这条的真实含义",
      "roastComment": "一句戏谑吐槽，不要使用emoji",
      "scoreImpact": 负数扣分
    }
  ]
}`;

// 调用 AI 分析协议
export async function analyzeWithAI(request: AIAnalyzeRequest): Promise<AnalysisResult> {
  const { agreementText, model = AI_CONFIG.model } = request;

  if (!AI_CONFIG.apiKey) {
    throw new Error('未配置 AI API 密钥，请检查 .env 文件');
  }

  const response = await fetch(`${AI_CONFIG.apiUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${AI_CONFIG.apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: `请分析以下用户协议：\n\n${agreementText}` },
      ],
      temperature: 0.7,
      max_tokens: 4096,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`AI 请求失败: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error('AI 返回内容为空');
  }

  // 解析 AI 返回的 JSON
  const aiResult = parseAIResponse(content);
  
  // 转换为标准结果格式
  return convertToAnalysisResult(aiResult);
}

// 解析 AI 响应
function parseAIResponse(content: string): AIRawResponse {
  // 尝试提取 JSON（AI 可能会在 JSON 前后添加说明文字）
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('无法从 AI 响应中提取 JSON');
  }

  try {
    return JSON.parse(jsonMatch[0]);
  } catch {
    throw new Error('AI 响应 JSON 解析失败');
  }
}

// 转换为标准分析结果
function convertToAnalysisResult(aiResult: AIRawResponse): AnalysisResult {
  const categoryBreakdown: Record<ClauseCategory, number> = {
    privacy: 0,
    liability: 0,
    rights: 0,
    payment: 0,
    termination: 0,
    data: 0,
    arbitration: 0,
    modification: 0,
    content: 0,
  };

  const clauses = aiResult.clauses.map((c) => {
    categoryBreakdown[c.category]++;
    return {
      originalText: c.originalText,
      matchedPattern: {
        id: `ai-${c.category}-${Date.now()}`,
        patterns: [],
        category: c.category,
        severity: c.severity,
        title: c.title,
        humanTranslation: c.humanTranslation,
        roastComment: c.roastComment,
        scoreImpact: c.scoreImpact,
      },
      position: { start: 0, end: 0 },
    };
  });

  return {
    clauses,
    score: Math.max(0, Math.min(100, aiResult.score)),
    grade: aiResult.grade,
    summary: aiResult.summary,
    categoryBreakdown,
  };
}

// 检查 AI 服务是否可用
export function isAIAvailable(): boolean {
  return Boolean(AI_CONFIG.apiKey);
}
