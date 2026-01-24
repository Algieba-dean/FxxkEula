import { clausePatterns, dangerKeywords } from './patterns';
import type { AnalysisResult, AnalyzedClause, ClauseCategory } from './types';

// 分析用户协议
export function analyzeAgreement(text: string): AnalysisResult {
  const clauses: AnalyzedClause[] = [];
  const matchedPositions = new Set<string>();

  // 按句子分割文本
  const sentences = text.split(/[。；;！!？?\n]+/).filter(s => s.trim().length > 5);

  // 对每个句子进行模式匹配
  for (const sentence of sentences) {
    const trimmedSentence = sentence.trim();
    if (!trimmedSentence) continue;

    for (const pattern of clausePatterns) {
      for (const regex of pattern.patterns) {
        if (regex.test(trimmedSentence)) {
          const posKey = `${pattern.id}-${trimmedSentence.substring(0, 30)}`;
          if (!matchedPositions.has(posKey)) {
            matchedPositions.add(posKey);
            const startIndex = text.indexOf(trimmedSentence);
            clauses.push({
              originalText: trimmedSentence,
              matchedPattern: pattern,
              position: {
                start: startIndex,
                end: startIndex + trimmedSentence.length,
              },
            });
          }
          break;
        }
      }
    }
  }

  // 计算危险关键词额外扣分
  let keywordPenalty = 0;
  for (const { keyword, weight } of dangerKeywords) {
    const count = (text.match(new RegExp(keyword, 'g')) || []).length;
    keywordPenalty += count * weight;
  }

  // 计算分数
  const baseScore = 100;
  const clausePenalty = clauses.reduce((sum, c) => sum + c.matchedPattern.scoreImpact, 0);
  const rawScore = baseScore + clausePenalty + keywordPenalty;
  const score = Math.max(0, Math.min(100, rawScore));

  // 计算分类统计
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

  for (const clause of clauses) {
    categoryBreakdown[clause.matchedPattern.category]++;
  }

  // 生成评级
  const { grade, summary } = getGradeInfo(score, clauses.length);

  return {
    clauses,
    score,
    grade,
    summary,
    categoryBreakdown,
  };
}

function getGradeInfo(score: number, issueCount: number): { grade: string; summary: string } {
  if (score >= 90) {
    return {
      grade: 'S',
      summary: '这协议简直是业界良心！要么是慈善机构，要么是你看漏了什么。',
    };
  }
  if (score >= 80) {
    return {
      grade: 'A',
      summary: '还算厚道，只有一些小坑。在当今互联网环境下，已经算是积德行善了。',
    };
  }
  if (score >= 70) {
    return {
      grade: 'B',
      summary: '中规中矩，该有的坑都有，但还没丧心病狂。建议谨慎使用。',
    };
  }
  if (score >= 60) {
    return {
      grade: 'C',
      summary: '坑比较多了，使用前请三思。建议阅读重点条款，保护好自己。',
    };
  }
  if (score >= 40) {
    return {
      grade: 'D',
      summary: `检测到${issueCount}个问题条款，这份协议堪比卖身契。除非必须，否则建议换一家。`,
    };
  }
  if (score >= 20) {
    return {
      grade: 'E',
      summary: '极度危险！这份协议是法律界的恐怖片。签了等于把灵魂抵押出去。',
    };
  }
  return {
    grade: 'F',
    summary: '这不是用户协议，这是抢劫宣言！建议截图保留，公开曝光。',
  };
}

// 生成示例协议文本（用于演示）
export const sampleAgreement = `
【用户服务协议】

一、信息收集与使用
我们会收集您的个人信息，包括但不限于姓名、手机号、身份证号、地理位置、设备信息、浏览记录、通讯录等。我们可能会与第三方合作伙伴共享您的部分信息，以便为您提供更好的服务。

二、数据保留
即使您注销账号后，我们仍然保留权利继续保存您的相关数据，用于商业分析和产品改进。这些数据将用于训练和优化我们的AI模型。

三、服务条款
本服务按"现状"提供，我们不保证服务的准确性、完整性和及时性。因系统故障、网络问题等技术原因造成的任何损失，我们概不负责。

四、付费服务
付费会员服务将自动续费，到期后自动从您的账户扣款。虚拟商品一经购买，不予退款。我们保留随时调整价格的权利。

五、账号管理
我们有权随时终止或暂停您的账号，无需提前通知或说明理由。您同意放弃因此产生的任何索赔权利。

六、内容权利
您在本平台发布的任何内容，即授予我们永久、不可撤销、免费、可再许可的全球使用权。我们可以将您的内容用于商业推广目的。

七、争议解决
任何争议应通过仲裁解决，您放弃通过法院诉讼的权利。争议由本公司所在地法院管辖。

八、协议变更
我们有权随时修改本协议，修改后继续使用本服务即视为同意新协议。本公司对本协议拥有最终解释权。
`;
