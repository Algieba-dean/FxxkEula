## FxxkEula

一个用“红墨水审判”风格审阅 EULA/ToS 的极简应用。前端基于 Streamlit，后端用 LangGraph 组织工作流，并通过 DeepSeek API 驱动中文文本分析。

### 快速开始（使用 uv 包管理）

1) 安装依赖

```bash
uv sync
```

2) 配置 API Key

复制 `.env.template` 为 `.env`，填入你的 DeepSeek API Key：

```
DEEPSEEK_API_KEY=sk-***
DEEPSEEK_API_BASE=https://api.deepseek.com
DEEPSEEK_MODEL=deepseek-chat
```

3) 运行应用

```bash
uv run streamlit run app.py
```

### 项目结构

```
FxxkEula/
  app.py               # 前端 UI（Streamlit）
  engine/
    __init__.py
    llm.py             # DeepSeek/OpenAI 兼容客户端封装
    prompts.py         # 提示词模板
    annotate.py        # “红墨水”批注渲染工具
    graph.py           # LangGraph 工作流（风险识别 → 批注 → 报告）
  .env.template
  README.md
```

### 说明

- 默认使用 DeepSeek 的 OpenAI 兼容接口（`openai` Python SDK 设置 `base_url`）。
- 首版将“边注”以内联红色引用块呈现，已预留样式挂点，后续可优化为右侧悬浮注解布局。

