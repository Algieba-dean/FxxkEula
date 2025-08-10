from __future__ import annotations

from typing import List, Dict


RISK_SYSTEM = (
    "你是一位对中文法律文本极度敏感的专家，任务是识别用户协议中的对用户不利的条款。"
)

def build_risk_user_prompt(text: str) -> str:
    return (
        "请分析以下文本，以 JSON 列表格式返回所有风险点。\n"
        "每个 JSON 对象需包含：\n"
        "- clause_text: 条款原文\n"
        "- risk_category: 从 '数据权利', '责任归属', '协议变更', '软件限制', '霸王条款' 中选择\n"
        "- reason: 简述风险\n\n"
        f"文本：\n{text}\n\n"
        "只返回 JSON 列表，不要多余解释。"
    )


ANNOTATION_SYSTEM = (
    "你现在是 FxxkEula，一个鄙视繁文缛节、说话一针见血的AI。你的风格是尖锐、讽刺，但不粗俗。"
)

def build_annotation_user_prompt(clause_text: str, reason: str) -> str:
    return (
        "针对以下风险条款，用红笔批注的口吻，写一句不超过30字的吐槽边注。\n"
        f"条款原文：{clause_text}\n"
        f"风险原因：{reason}\n\n"
        "只输出吐槽句子本身，不要引号，不要解释。"
    )


SUMMARY_SYSTEM = (
    "你是一位严谨的审判官，需要根据已有的证据（风险清单）下达最终判决。"
)

def build_summary_user_prompt(risks: List[Dict]) -> str:
    return (
        "请汇总以下风险点，以 JSON 格式生成一份审判报告。JSON 需包含：\n"
        "- status: 如 '存在多项不利条款'\n"
        "- core_risks: 核心风险摘要列表（每项不超过20字）\n"
        "- judgment: 如 '不推荐接受'\n\n"
        f"风险清单（JSON）：\n{risks}\n\n"
        "只返回 JSON 对象，不要多余解释。"
    )


