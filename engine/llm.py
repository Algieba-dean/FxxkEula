from __future__ import annotations

import json
import os
import re
from typing import Any, Optional

from openai import OpenAI
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type


class LLMClient:
    """A thin wrapper around OpenAI-compatible Chat Completions for DeepSeek.

    Defaults:
      - base_url: env `DEEPSEEK_API_BASE` or `https://api.deepseek.com`
      - api_key: env `DEEPSEEK_API_KEY`
      - model:   env `DEEPSEEK_MODEL` or `deepseek-chat`
    """

    def __init__(
        self,
        *,
        api_key: Optional[str] = None,
        base_url: Optional[str] = None,
        model: Optional[str] = None,
    ) -> None:
        self.api_key = api_key or os.getenv("DEEPSEEK_API_KEY", "")
        self.base_url = base_url or os.getenv("DEEPSEEK_API_BASE", "https://api.deepseek.com")
        self.model = model or os.getenv("DEEPSEEK_MODEL", "deepseek-chat")

        if not self.api_key:
            raise RuntimeError("DEEPSEEK_API_KEY is required. Set it in environment or .env file.")

        self.client = OpenAI(api_key=self.api_key, base_url=self.base_url)

    @retry(
        reraise=True,
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=0.8, min=0.5, max=4),
        retry=retry_if_exception_type(Exception),
    )
    def complete(self, *, system: str, user: str, temperature: float = 0.2, max_tokens: int = 2048) -> str:
        response = self.client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": system},
                {"role": "user", "content": user},
            ],
            temperature=temperature,
            max_tokens=max_tokens,
        )
        return (response.choices[0].message.content or "").strip()

    def _extract_first_json(self, text: str) -> Optional[str]:
        """Extract the first JSON object or array substring from free-form text."""
        # Prefer fenced code block containing json
        code_block = re.search(r"```(?:json)?\s*([\s\S]*?)\s*```", text)
        if code_block:
            candidate = code_block.group(1).strip()
            try:
                json.loads(candidate)
                return candidate
            except json.JSONDecodeError:
                pass

        # Fallback: find first balanced {...} or [...]
        for open_c, close_c in (("{", "}"), ("[", "]")):
            start = text.find(open_c)
            if start == -1:
                continue
            depth = 0
            for i in range(start, len(text)):
                if text[i] == open_c:
                    depth += 1
                elif text[i] == close_c:
                    depth -= 1
                    if depth == 0:
                        candidate = text[start : i + 1]
                        try:
                            json.loads(candidate)
                            return candidate
                        except json.JSONDecodeError:
                            break
        return None

    @retry(
        reraise=True,
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=0.8, min=0.5, max=4),
        retry=retry_if_exception_type(Exception),
    )
    def complete_json(self, *, system: str, user: str, temperature: float = 0.0, max_tokens: int = 2048) -> Any:
        content = self.complete(system=system, user=user, temperature=temperature, max_tokens=max_tokens)
        candidate = self._extract_first_json(content) or content
        try:
            return json.loads(candidate)
        except json.JSONDecodeError as exc:
            raise ValueError(f"Model did not return valid JSON. Raw: {content[:400]}...") from exc


