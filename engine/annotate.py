from __future__ import annotations

import html
import re
from typing import List, Dict, Tuple


RISKY_KEYWORDS: List[str] = [
    "我们不保证",
    "单方面",
    "最终解释权",
    "不承担任何责任",
    "无需另行通知",
    "不另行通知",
    "随时修改",
    "第三方",
    "不可抗力",
    "不退不换",
    "使用即同意",
    "自动续费",
    "最高不超过",
    "责任上限",
    "免责",
]


def _strike_keywords(escaped_text: str) -> str:
    """Apply red strikethrough to predefined keywords within already-escaped text."""
    result = escaped_text
    for word in RISKY_KEYWORDS:
        # escape keyword for regex, match once per occurrence
        pattern = re.escape(html.escape(word))
        result = re.sub(
            pattern,
            lambda m: f"<span class=\"fe-strike\">{m.group(0)}</span>",
            result,
        )
    return result


def _replace_once(haystack: str, needle: str, replacement: str) -> Tuple[str, bool]:
    idx = haystack.find(needle)
    if idx == -1:
        return haystack, False
    return haystack[:idx] + replacement + haystack[idx + len(needle) :], True


def build_annotated_html(original_text: str, risky_clauses: List[Dict]) -> str:
    """Return HTML string of original text with highlighted clauses and red quips.

    risky_clauses: List of dicts including keys: clause_text, reason, quip, risk_category
    """
    escaped_doc = html.escape(original_text)

    for _, item in enumerate(risky_clauses):
        clause = (item.get("clause_text") or "").strip()
        quip = (item.get("quip") or "").strip()
        if not clause:
            continue

        escaped_clause = html.escape(clause)
        highlighted = f"<span class=\"fe-highlight\">{_strike_keywords(escaped_clause)}</span>"
        if quip:
            note_html = f"<blockquote class=\"fe-quip\">{html.escape(quip)}</blockquote>"
        else:
            note_html = ""

        replacement = highlighted + note_html
        escaped_doc, ok = _replace_once(escaped_doc, escaped_clause, replacement)
        if not ok:
            # Fallback: try fuzzy-ish replace on condensed whitespace
            compact_doc = re.sub(r"\s+", " ", escaped_doc)
            compact_clause = re.sub(r"\s+", " ", escaped_clause)
            compact_repl = re.sub(r"\s+", " ", replacement)
            compact_doc, ok2 = _replace_once(compact_doc, compact_clause, compact_repl)
            if ok2:
                escaped_doc = compact_doc

    # Convert preserved newlines to <br/>
    escaped_doc = escaped_doc.replace("\n", "<br/>")
    return escaped_doc


