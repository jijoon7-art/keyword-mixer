'use client'

import ToolFooter from './ToolFooter'
import { useState } from 'react'
import { Copy, CheckCheck, RotateCcw, Download } from 'lucide-react'

const SAMPLE = `{
  "name": "Keyword Mixer",
  "version": "1.0.0",
  "tools": ["키워드 조합기", "글자수 세기", "QR코드"],
  "free": true,
  "url": "https://keyword-mixer.vercel.app"
}`

export default function JsonFormatter() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [indent, setIndent] = useState(2)
  const [copied, setCopied] = useState(false)
  const [stats, setStats] = useState<{ keys: number; depth: number; size: number } | null>(null)

  const countKeys = (obj: unknown, depth = 0): { keys: number; maxDepth: number } => {
    if (typeof obj !== 'object' || obj === null) return { keys: 0, maxDepth: depth }
    let keys = 0; let maxDepth = depth
    for (const val of Object.values(obj as Record<string, unknown>)) {
      keys++
      if (typeof val === 'object' && val !== null) {
        const child = countKeys(val, depth + 1)
        keys += child.keys
        maxDepth = Math.max(maxDepth, child.maxDepth)
      }
    }
    return { keys, maxDepth }
  }

  const format = () => {
    setError('')
    try {
      const parsed = JSON.parse(input)
      const formatted = JSON.stringify(parsed, null, indent)
      setOutput(formatted)
      const { keys, maxDepth } = countKeys(parsed)
      setStats({ keys, depth: maxDepth, size: new Blob([formatted]).size })
    } catch (e) {
      setError((e as Error).message)
      setOutput('')
      setStats(null)
    }
  }

  const minify = () => {
    setError('')
    try {
      const parsed = JSON.parse(input)
      setOutput(JSON.stringify(parsed))
    } catch (e) {
      setError((e as Error).message)
    }
  }

  const sort = () => {
    setError('')
    try {
      const parsed = JSON.parse(input)
      const sortObj = (obj: unknown): unknown => {
        if (Array.isArray(obj)) return obj.map(sortObj)
        if (typeof obj === 'object' && obj !== null) {
          return Object.fromEntries(
            Object.entries(obj as Record<string, unknown>).sort(([a], [b]) => a.localeCompare(b)).map(([k, v]) => [k, sortObj(v)])
          )
        }
        return obj
      }
      setOutput(JSON.stringify(sortObj(parsed), null, indent))
    } catch (e) {
      setError((e as Error).message)
    }
  }

  const copy = async () => {
    if (!output) return
    await navigator.clipboard.writeText(output)
    setCopied(true); setTimeout(() => setCopied(false), 1500)
  }

  const download = () => {
    if (!output) return
    const blob = new Blob([output], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = `formatted_${Date.now()}.json`
    a.click(); URL.revokeObjectURL(url)
  }

  const validate = () => {
    setError('')
    try {
      JSON.parse(input)
      setError('✅ 유효한 JSON입니다!')
    } catch (e) {
      setError(`❌ ${(e as Error).message}`)
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-mono mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
          Free Developer Tool
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-3 tracking-tight">JSON 포맷터 / 검증기</h1>
        <p className="text-slate-300 text-base max-w-lg mx-auto">
          JSON 보기 좋게 정렬·압축·키 정렬·검증. 오류 위치 표시, 통계 분석 제공.
        </p>
      </div>

      {/* 액션 버튼 */}
      <div className="flex flex-wrap gap-2 mb-4">
        {[
          { label: '들여쓰기 2', action: () => { setIndent(2); format() }, active: indent === 2 },
          { label: '들여쓰기 4', action: () => { setIndent(4); format() }, active: indent === 4 },
          { label: '탭 들여쓰기', action: () => { setIndent(1); setTimeout(format, 50) }, active: false },
        ].map(b => (
          <button key={b.label} onClick={b.action}
            className={`text-xs px-3 py-2 rounded-lg border transition-all ${b.active ? 'bg-brand-500 border-brand-500 text-white font-bold' : 'border-surface-border text-slate-300 hover:border-brand-500/40 hover:text-brand-300 bg-[#1a1d27]'}`}>
            {b.label}
          </button>
        ))}
        <button onClick={format} className="text-xs px-3 py-2 rounded-lg bg-brand-500 text-white border border-brand-500 hover:bg-brand-400 transition-all font-bold">포맷팅</button>
        <button onClick={minify} className="text-xs px-3 py-2 rounded-lg border border-blue-500/30 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-all">압축 (Minify)</button>
        <button onClick={sort} className="text-xs px-3 py-2 rounded-lg border border-purple-500/30 bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 transition-all">키 정렬</button>
        <button onClick={validate} className="text-xs px-3 py-2 rounded-lg border border-surface-border text-slate-300 hover:border-brand-500/40 hover:text-brand-300 bg-[#1a1d27] transition-all">검증</button>
        <button onClick={() => { setInput(SAMPLE); setOutput(''); setError('') }} className="text-xs px-3 py-2 rounded-lg border border-surface-border text-slate-400 hover:text-brand-400 hover:border-brand-500/40 bg-[#1a1d27] transition-all ml-auto">샘플</button>
      </div>

      {/* 에러/성공 메시지 */}
      {error && (
        <div className={`mb-4 p-3 rounded-lg border text-sm font-mono ${error.startsWith('✅') ? 'bg-brand-500/10 border-brand-500/30 text-brand-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
          {error}
        </div>
      )}

      {/* 통계 */}
      {stats && (
        <div className="flex gap-3 mb-4">
          {[
            { label: '키 수', val: stats.keys },
            { label: '최대 깊이', val: `${stats.depth}단계` },
            { label: '크기', val: `${stats.size}B` },
          ].map(s => (
            <div key={s.label} className="px-3 py-2 rounded-lg bg-[#1a1d27] border border-surface-border text-xs">
              <span className="text-slate-500">{s.label}: </span>
              <span className="text-brand-400 font-mono font-bold">{s.val}</span>
            </div>
          ))}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {/* Input */}
        <div className="rounded-xl border border-surface-border bg-[#1a1d27] overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-surface-border">
            <span className="text-sm font-medium text-slate-200">JSON 입력</span>
            <button onClick={() => { setInput(''); setOutput(''); setError(''); setStats(null) }}
              className="text-xs text-slate-500 hover:text-red-400 flex items-center gap-1 transition-all">
              <RotateCcw size={11} /> 초기화
            </button>
          </div>
          <textarea value={input} onChange={e => setInput(e.target.value)}
            placeholder='{"key": "value"}'
            rows={18}
            className="w-full bg-transparent px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none resize-none font-mono leading-relaxed" />
        </div>

        {/* Output */}
        <div className="rounded-xl border border-surface-border bg-[#1a1d27] overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-surface-border">
            <span className="text-sm font-medium text-slate-200">결과</span>
            <div className="flex gap-2">
              {output && (
                <>
                  <button onClick={copy} className={`text-xs px-2.5 py-1.5 rounded-lg border transition-all flex items-center gap-1 ${copied ? 'bg-brand-500/20 border-brand-500/40 text-brand-400' : 'border-surface-border text-slate-300 hover:border-brand-500/40 hover:text-brand-300'}`}>
                    {copied ? <CheckCheck size={11} /> : <Copy size={11} />}
                    {copied ? '복사됨' : '복사'}
                  </button>
                  <button onClick={download} className="text-xs px-2.5 py-1.5 rounded-lg border border-brand-500/30 bg-brand-500/10 text-brand-400 hover:bg-brand-500/20 transition-all flex items-center gap-1">
                    <Download size={11} /> 저장
                  </button>
                </>
              )}
            </div>
          </div>
          <textarea value={output} readOnly
            placeholder="포맷팅 결과가 여기에 표시됩니다"
            rows={18}
            className="w-full bg-transparent px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none resize-none font-mono leading-relaxed" />
        </div>
      </div>
      <ToolFooter
        toolName="JSON 포맷터"
        toolUrl="https://keyword-mixer.vercel.app/json-formatter"
        description="JSON 정렬·압축·키 정렬·검증. 오류 위치 표시."
        howToUse={[
          { step: '도구 접속', desc: 'JSON 포맷터에 접속하세요.' },
          { step: '내용 입력', desc: '필요한 내용을 입력하거나 파일을 업로드하세요.' },
          { step: '결과 확인', desc: '변환/생성된 결과를 즉시 확인하세요.' },
          { step: '복사 또는 저장', desc: '결과를 복사하거나 파일로 저장하세요.' },
        ]}
        whyUse={[
          { title: '무료 사용', desc: '로그인 없이 완전 무료로 사용할 수 있습니다.' },
          { title: '빠른 처리', desc: '브라우저에서 즉시 처리되어 빠르게 결과를 얻을 수 있습니다.' },
          { title: '개인정보 보호', desc: '서버에 데이터가 저장되지 않아 안전합니다.' },
          { title: '다양한 기능', desc: '시중 유사 도구보다 더 많은 기능을 제공합니다.' },
        ]}
        faqs={[
          { q: '이 도구는 무료인가요?', a: '네, 완전 무료입니다. 로그인도 필요 없습니다.' },
          { q: '데이터는 서버에 저장되나요?', a: '아니요. 모든 처리는 브라우저에서 이루어지며 서버에 전송되지 않습니다.' },
          { q: '모바일에서도 사용할 수 있나요?', a: '네, 모바일 브라우저에서도 동일하게 사용할 수 있습니다.' },
          { q: '오류가 발생하면 어떻게 하나요?', a: '페이지를 새로고침하거나 하단 피드백 폼으로 알려주시면 빠르게 수정하겠습니다.' },
        ]}
        keywords="JSON 포맷터 · JSON 검증기 · JSON 정렬 · JSON 압축 · JSON formatter · JSON validator · JSON beautifier · free JSON tool"
      />
    </div>
  )
}
