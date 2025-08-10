from __future__ import annotations

from typing import Any, Dict, List, TypedDict, Tuple

from langgraph.graph import StateGraph, END

from .llm import LLMClient
from .prompts import (
    RISK_SYSTEM,
    ANNOTATION_SYSTEM,
    SUMMARY_SYSTEM,
    build_risk_user_prompt,
    build_annotation_user_prompt,
    build_summary_user_prompt,
)
from .annotate import build_annotated_html


class AnalysisState(TypedDict, total=False):
    original_text: str
    risky_clauses: List[Dict[str, Any]]
    annotated_text: str
    final_summary: Dict[str, Any]


def _identify_risks(state: AnalysisState) -> AnalysisState:
    llm = LLMClient()
    text = state["original_text"]
    risks = llm.complete_json(system=RISK_SYSTEM, user=build_risk_user_prompt(text))
    # Normalize structure and add ids
    normalized: List[Dict[str, Any]] = []
    if isinstance(risks, list):
        for i, r in enumerate(risks):
            if not isinstance(r, dict):
                continue
            normalized.append(
                {
                    "id": i,
                    "clause_text": (r.get("clause_text") or "").strip(),
                    "risk_category": (r.get("risk_category") or "").strip(),
                    "reason": (r.get("reason") or "").strip(),
                }
            )
    return {"risky_clauses": normalized}


def _generate_annotations(state: AnalysisState) -> AnalysisState:
    llm = LLMClient()
    risky = state.get("risky_clauses", [])
    enriched: List[Dict[str, Any]] = []
    for item in risky:
        clause_text = item.get("clause_text") or ""
        reason = item.get("reason") or ""
        if not clause_text:
            enriched.append(item)
            continue
        quip = llm.complete(system=ANNOTATION_SYSTEM, user=build_annotation_user_prompt(clause_text, reason), temperature=0.4, max_tokens=80)
        enriched.append({**item, "quip": quip})

    annotated = build_annotated_html(state["original_text"], enriched)
    return {"risky_clauses": enriched, "annotated_text": annotated}


def _create_final_summary(state: AnalysisState) -> AnalysisState:
    llm = LLMClient()
    risks = state.get("risky_clauses", [])
    summary = llm.complete_json(system=SUMMARY_SYSTEM, user=build_summary_user_prompt(risks))
    if not isinstance(summary, dict):
        summary = {
            "status": "分析完成",
            "core_risks": [r.get("reason", "")[:20] for r in risks[:5]],
            "judgment": "谨慎对待",
        }
    return {"final_summary": summary}


def build_graph() -> StateGraph:
    graph = StateGraph(AnalysisState)
    graph.add_node("identify_risks", _identify_risks)
    graph.add_node("generate_annotations", _generate_annotations)
    graph.add_node("create_final_summary", _create_final_summary)

    graph.set_entry_point("identify_risks")
    graph.add_edge("identify_risks", "generate_annotations")
    graph.add_edge("generate_annotations", "create_final_summary")
    graph.add_edge("create_final_summary", END)
    return graph


_GRAPH = build_graph().compile()


def run_analysis(original_text: str) -> Tuple[str, Dict[str, Any]]:
    """Convenience API for the Streamlit app. Returns (annotated_html, final_summary_dict)."""
    initial: AnalysisState = {"original_text": original_text}
    result: AnalysisState = _GRAPH.invoke(initial)
    return result.get("annotated_text", ""), result.get("final_summary", {})


