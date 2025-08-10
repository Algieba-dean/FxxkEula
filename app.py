import html
from typing import List, Dict, Any

import streamlit as st
from dotenv import load_dotenv

from engine.graph import run_analysis


load_dotenv()


PAGE_TITLE = "FxxkEula · 红墨水审判"

CUSTOM_CSS = """
<style>
/* 页面基调 */
.fe-app h1, .fe-app h2, .fe-app h3 { font-weight: 700; }

/* 强调色与标记 */
.fe-highlight { background: #FFF59D; padding: 0.1rem 0.15rem; border-radius: 3px; }
.fe-strike { text-decoration: line-through; color: #D32F2F; font-weight: 600; }
blockquote.fe-quip { border-left: 4px solid #D32F2F; color: #D32F2F; margin: 6px 0 12px 0; padding-left: 10px; }

/* 顶部判决卡片 */
.fe-judgment { border: 1px solid #eee; border-left: 6px solid #D32F2F; padding: 12px 14px; border-radius: 6px; background: #fff; }
.fe-judgment h3 { margin: 0 0 8px 0; }
.fe-judgment .status { color: #D32F2F; font-weight: 700; }
.fe-judgment .judgment { font-weight: 700; }

/* 文本容器 */
.fe-doc { line-height: 1.6; font-size: 15px; white-space: pre-wrap; }
</style>
"""


def render_summary_card(summary: Dict[str, Any]) -> None:
    if not summary:
        return
    status = summary.get("status")
    judgment = summary.get("judgment")
    core_risks: List[str] = summary.get("core_risks", [])

    st.markdown(
        """
        <div class="fe-judgment">
            <h3>最终审判</h3>
            <div class="status">{status}</div>
            <div style="margin:8px 0 6px 0;">核心风险：</div>
            <ul>{items}</ul>
            <div class="judgment">判决：{judgment}</div>
        </div>
        """.format(
            status=st.session_state.get("status_override", status) or "",
            items="".join(f"<li>{html.escape(item)}</li>" for item in core_risks),
            judgment=judgment or "",
        ),
        unsafe_allow_html=True,
    )


def main() -> None:
    st.set_page_config(page_title=PAGE_TITLE, layout="wide")
    st.markdown("<div class='fe-app'>" + CUSTOM_CSS + "</div>", unsafe_allow_html=True)

    st.title("FxxkEula")
    st.caption("在你点下“同意”之前，先让红墨水说话。")

    default_text = st.session_state.get("last_text", "")

    text = st.text_area(
        "请在此处粘贴协议全文（委托审判）",
        value=default_text,
        height=360,
        placeholder="粘贴 EULA/ToS/隐私政策等全文...",
    )

    col_run, col_clear = st.columns([1, 1])
    run_clicked = col_run.button("开始审判", type="primary")
    clear_clicked = col_clear.button("清空")

    if clear_clicked:
        st.session_state["last_text"] = ""
        st.rerun()

    if run_clicked and text.strip():
        st.session_state["last_text"] = text
        # 静默审理：不展示加载动画，直接产出结果
        annotated_text, final_summary = run_analysis(text)

        # 顶部渲染审判报告
        render_summary_card(final_summary)

        # 原文 + 红墨水批注
        st.markdown("<div class='fe-doc'>" + annotated_text + "</div>", unsafe_allow_html=True)

    elif not run_clicked:
        # 初始状态展示提示
        st.info("粘贴文本并点击“开始审判”。应用将自动高亮风险条款、划掉欺骗性词语，并给出最终判决。")


if __name__ == "__main__":
    main()


