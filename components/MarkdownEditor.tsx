'use client'

import { useState } from 'react'
import { Copy, CheckCheck, Download, Eye, Code } from 'lucide-react'

const SAMPLE = `# 마크다운 에디터

## 기본 문법

**굵게** 또는 *기울임* 텍스트를 쓸 수 있어요.

### 목록

- 첫 번째 항목
- 두 번째 항목
  - 중첩 항목

1. 순서 있는 목록
2. 두 번째 항목

### 코드

인라인 \`코드\`와 코드 블록:

\`\`\`javascript
const hello = "Hello, World!";
console.log(hello);
\`\`\`

### 링크와 이미지

[링크 텍스트](https://example.com)

### 인용

> 인용문을 이렇게 작성합니다.

### 테이블

| 이름 | 나이 | 도시 |
|------|------|------|
| 홍길동 | 30 | 서울 |
| 김철수 | 25 | 부산 |

---

*Keyword Mixer 마크다운 에디터로 작성*
`

function parseMarkdown(md: string): string {
  let html = md
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  // Code blocks
  html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) =>
    `<pre class="md-code-block"><code class="language-${lang || 'text'}">${code.trim()}</code></pre>`)

  // Tables
  html = html.replace(/\|(.+)\|\n\|[-|\s]+\|\n((?:\|.+\|\n?)+)/g, (_, header, rows) => {
    const ths = header.split('|').filter((s: string) => s.trim()).map((h: string) => `<th>${h.trim()}</th>`).join('')
    const trs = rows.trim().split('\n').map((row: string) =>
      `<tr>${row.split('|').filter((s: string) => s.trim()).map((c: string) => `<td>${c.trim()}</td>`).join('')}</tr>`
    ).join('')
    return `<table><thead><tr>${ths}</tr></thead><tbody>${trs}</tbody></table>`
  })

  // Headings
  html = html.replace(/^######\s(.+)$/gm, '<h6>$1</h6>')
  html = html.replace(/^#####\s(.+)$/gm, '<h5>$1</h5>')
  html = html.replace(/^####\s(.+)$/gm, '<h4>$1</h4>')
  html = html.replace(/^###\s(.+)$/gm, '<h3>$1</h3>')
  html = html.replace(/^##\s(.+)$/gm, '<h2>$1</h2>')
  html = html.replace(/^#\s(.+)$/gm, '<h1>$1</h1>')

  // Blockquote
  html = html.replace(/^>\s(.+)$/gm, '<blockquote>$1</blockquote>')

  // HR
  html = html.replace(/^---$/gm, '<hr>')

  // Bold & Italic
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>')
  html = html.replace(/__(.+?)__/g, '<strong>$1</strong>')
  html = html.replace(/_(.+?)_/g, '<em>$1</em>')

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>')

  // Links
  html = html.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')

  // Unordered list
  html = html.replace(/^(\s*)-\s(.+)$/gm, (_, indent, content) => {
    const level = indent.length / 2
    return `<li data-level="${level}">${content}</li>`
  })
  html = html.replace(/(<li[^>]*>.*<\/li>\n?)+/g, match => `<ul>${match}</ul>`)

  // Ordered list
  html = html.replace(/^\d+\.\s(.+)$/gm, '<li>$1</li>')

  // Paragraphs
  html = html.replace(/^(?!<[a-z]|$)(.+)$/gm, '<p>$1</p>')

  return html
}

export default function MarkdownEditor() {
  const [markdown, setMarkdown] = useState(SAMPLE)
  const [mode, setMode] = useState<'split' | 'edit' | 'preview'>('split')
  const [copied, setCopied] = useState(false)

  const html = parseMarkdown(markdown)

  const copy = async () => {
    await navigator.clipboard.writeText(markdown)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const downloadMd = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `document_${Date.now()}.md`
    a.click(); URL.revokeObjectURL(url)
  }

  const downloadHtml = () => {
    const fullHtml = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<style>
body{font-family:system-ui,sans-serif;max-width:800px;margin:0 auto;padding:2rem;line-height:1.7;color:#1a1a1a}
h1,h2,h3{border-bottom:1px solid #eee;padding-bottom:.3em}
code{background:#f5f5f5;padding:.2em .4em;border-radius:3px;font-size:.9em}
pre{background:#f5f5f5;padding:1em;border-radius:6px;overflow:auto}
blockquote{border-left:4px solid #22c55e;margin:0;padding-left:1em;color:#666}
table{border-collapse:collapse;width:100%}
th,td{border:1px solid #ddd;padding:.5em 1em;text-align:left}
th{background:#f5f5f5}
a{color:#22c55e}
</style>
</head>
<body>${html}</body>
</html>`
    const blob = new Blob([fullHtml], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `document_${Date.now()}.html`
    a.click(); URL.revokeObjectURL(url)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-56px)]">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-surface-border bg-surface-card/50">
        <div className="flex items-center gap-3">
          <h1 className="text-sm font-bold text-white">마크다운 에디터</h1>
          <span className="text-xs text-slate-500">{markdown.length.toLocaleString()}자</span>
        </div>
        <div className="flex items-center gap-2">
          {/* View mode */}
          <div className="flex rounded-lg border border-surface-border overflow-hidden">
            {[
              { key: 'edit', icon: <Code size={13} />, label: '편집' },
              { key: 'split', icon: null, label: '분할' },
              { key: 'preview', icon: <Eye size={13} />, label: '미리보기' },
            ].map(m => (
              <button key={m.key} onClick={() => setMode(m.key as typeof mode)}
                className={`flex items-center gap-1 px-3 py-1.5 text-xs transition-all ${mode === m.key ? 'bg-brand-500 text-black font-bold' : 'text-slate-300 hover:text-white bg-surface-DEFAULT'}`}>
                {m.icon}{m.label}
              </button>
            ))}
          </div>

          <button onClick={copy} className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border transition-all ${copied ? 'bg-brand-500/20 border-brand-500/40 text-brand-400' : 'border-surface-border text-slate-300 hover:border-brand-500/40 hover:text-brand-300'}`}>
            {copied ? <CheckCheck size={12} /> : <Copy size={12} />} 복사
          </button>
          <button onClick={downloadMd} className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border border-surface-border text-slate-300 hover:border-brand-500/40 hover:text-brand-300 transition-all">
            <Download size={12} /> .md
          </button>
          <button onClick={downloadHtml} className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border border-brand-500/30 bg-brand-500/15 text-brand-400 hover:bg-brand-500/25 transition-all">
            <Download size={12} /> .html
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className={`flex-1 flex overflow-hidden ${mode === 'split' ? 'flex-row' : 'flex-col'}`}>
        {/* Edit pane */}
        {(mode === 'edit' || mode === 'split') && (
          <textarea
            value={markdown}
            onChange={e => setMarkdown(e.target.value)}
            className={`bg-surface-DEFAULT text-slate-200 font-mono text-sm p-4 focus:outline-none resize-none leading-relaxed ${mode === 'split' ? 'w-1/2 border-r border-surface-border' : 'flex-1'}`}
            placeholder="마크다운을 입력하세요..."
          />
        )}

        {/* Preview pane */}
        {(mode === 'preview' || mode === 'split') && (
          <div
            className={`overflow-y-auto p-6 ${mode === 'split' ? 'w-1/2' : 'flex-1'}`}
            style={{ background: '#0f1117' }}
            dangerouslySetInnerHTML={{ __html: `<style>
              .md-preview h1{font-size:2em;font-weight:800;color:#fff;border-bottom:1px solid #2a2d3a;padding-bottom:.3em;margin-bottom:.5em}
              .md-preview h2{font-size:1.5em;font-weight:700;color:#e2e8f0;border-bottom:1px solid #2a2d3a;padding-bottom:.2em;margin:1.2em 0 .5em}
              .md-preview h3{font-size:1.25em;font-weight:600;color:#cbd5e1;margin:1em 0 .4em}
              .md-preview p{color:#94a3b8;line-height:1.8;margin:.5em 0}
              .md-preview strong{color:#e2e8f0;font-weight:700}
              .md-preview em{color:#a5b4fc;font-style:italic}
              .md-preview code{background:#1e2130;color:#22c55e;padding:.15em .4em;border-radius:4px;font-size:.875em;font-family:monospace}
              .md-preview pre.md-code-block{background:#1e2130;border:1px solid #2a2d3a;border-radius:8px;padding:1em;overflow:auto;margin:1em 0}
              .md-preview pre code{background:none;padding:0;color:#e2e8f0}
              .md-preview ul,.md-preview ol{color:#94a3b8;padding-left:1.5em;margin:.5em 0}
              .md-preview li{margin:.25em 0}
              .md-preview blockquote{border-left:3px solid #22c55e;margin:.5em 0;padding:.5em 1em;background:#1a1d27;border-radius:0 6px 6px 0}
              .md-preview blockquote p{color:#94a3b8;margin:0}
              .md-preview hr{border:none;border-top:1px solid #2a2d3a;margin:1.5em 0}
              .md-preview table{border-collapse:collapse;width:100%;margin:1em 0}
              .md-preview th{background:#1a1d27;color:#e2e8f0;font-weight:600;padding:.5em 1em;border:1px solid #2a2d3a;text-align:left}
              .md-preview td{color:#94a3b8;padding:.5em 1em;border:1px solid #2a2d3a}
              .md-preview a{color:#22c55e;text-decoration:none}
              .md-preview a:hover{text-decoration:underline}
            </style><div class="md-preview">${html}</div>` }}
          />
        )}
      </div>
    </div>
  )
}
