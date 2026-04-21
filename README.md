# n8n-nodes-openrouter-cache

OpenRouter Chat Model node for [n8n](https://n8n.io) with **prompt caching** support. Drop-in replacement for the built-in OpenRouter Chat Model that injects `cache_control` markers to reduce costs up to 90% on Anthropic models.

## Features

- **Prompt caching** for Anthropic models via OpenRouter (system message + optional last user message)
- **Configurable TTL**: 5-minute default or 1-hour extended cache
- **Cache breakpoints**: System message only, or system + last user message
- **Caching enabled by default** — the whole point of this node
- **Tool call fix** preserved from upstream (fixes empty arguments from Anthropic-via-OpenRouter)
- Uses existing `openRouterApi` credential — no extra setup

## Install

In your n8n instance:

1. Go to **Settings → Community Nodes**
2. Click **Install**
3. Enter `n8n-nodes-openrouter-cache`
4. Click **Install**

## Usage

1. Add the **OpenRouter Cache Chat Model** node to your workflow
2. Connect it to an **AI Agent** or **AI Chain** node
3. Select your model (e.g., `anthropic/claude-sonnet-4-20250514`)
4. Caching is enabled by default — configure under Options if needed

### Options

| Option | Default | Description |
|--------|---------|-------------|
| Enable Prompt Caching | `true` | Toggle caching on/off |
| Cache TTL | 5 Minutes | `5 Minutes` or `1 Hour` (1h has 2x write cost on Anthropic) |
| Cache Breakpoints | System Message Only | `System Message Only` or `System + Last User Message` |

### How it works

The node wraps the standard `ChatOpenAI` from LangChain with a custom fetch interceptor that:

1. Intercepts outgoing API requests
2. Transforms system message content from string to content blocks with `cache_control: { type: "ephemeral" }`
3. Optionally marks the last user message for caching too
4. Sends the modified request to OpenRouter

On the response side, it also fixes empty tool call arguments (a known issue with Anthropic models via OpenRouter).

### Which models benefit?

| Provider | Caching | Notes |
|----------|---------|-------|
| Anthropic (Claude) | Explicit — this node adds it | Min 1024-4096 tokens depending on model |
| OpenAI (GPT) | Automatic | No modification needed, but node won't break anything |
| DeepSeek | Automatic | Same as OpenAI |
| Google (Gemini) | Automatic | Same as OpenAI |

### Verifying cache hits

Check the [OpenRouter Activity dashboard](https://openrouter.ai/activity) after running your workflow twice:
- First run: `cache_write_tokens > 0` (cache established)
- Second run: `cached_tokens > 0` (cache hit, reduced cost)

## Development

```bash
npm install
npm run build
```

For local testing, copy `dist/` to your n8n custom nodes directory:
```bash
cp -r dist/ ~/.n8n/custom/node_modules/n8n-nodes-openrouter-cache/dist/
cp package.json ~/.n8n/custom/node_modules/n8n-nodes-openrouter-cache/
```

## License

MIT
