'use client'

import { useState } from 'react'
import { Copy, CheckCheck, RotateCcw, ArrowLeftRight } from 'lucide-react'

type Mode = 'encode' | 'decode'

export default function Base64Tool() {
  const [mode, setMode] = useState<Mode>('encode')
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [urlSafe, setUrlSafe] = useState(false)
  const [copied, setCopied] = useState(false)

  const convert = () => {
    setError('')
    try {
      if (!input.trim()) { setError('입력값을 입력해주세요'); return }
      let result = ''
      if (mode === 'encode') {
        result = btoa(unescape(encodeURIComponent(input)))
        if (urlSafe) result = result.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
      } else {
        let decoded = input
        if (urlSafe) decoded = decoded.replace(/-/g, '+').replace(/_/g, '/')
        result = decodeURIComponent(escape(atob(decoded)))
      }
      setOutput(result)
    } catch {
      setError('변환 오류: 올바른 형식인지 확인해주세요')
      setOutput('')
    }
  }

  const copy = async () => {
    if (!output) return
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const switchMode = () => {
    setMode(m => m === 'encode' ? 'decode' : 'encode')
    setInput(output); setOutput(''); setError('')
  }

  const reset = () => { setInput(''); setOutput(''); setError('') }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Hero */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-mono mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
          Free Developer Tool
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-3 tracking-tight">Base64 인코더 / 디코더</h1>
        <p className="text-slate-300 text-base max-w-lg mx-auto">
          텍스트를 Base64로 인코딩하거나 디코딩. URL-safe 모드, 한국어 완벽 지원.
        </p>
      </div>

      {/* Mode & Options */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="flex rounded-lg border border-surface-border overflow-hidden">
          <button
            onClick={() => { setMode('encode'); reset() }}
            className={`px-4 py-2 text-sm font-medium transition-all ${mode === 'encode' ? 'bg-brand-500 text-black' : 'bg-surface-card text-slate-300 hover:text-white'}`}
          >
            인코딩 (텍스트 → Base64)
          </button>
          <button
            onClick={() => { setMode('decode'); reset() }}
            className={`px-4 py-2 text-sm font-medium transition-all ${mode === 'decode' ? 'bg-brand-500 text-black' : 'bg-surface-card text-slate-300 hover:text-white'}`}
          >
            디코딩 (Base64 → 텍스트)
          </button>
        </div>

        <label className="flex items-center gap-2 cursor-pointer ml-auto">
          <span className="text-sm text-slate-300">URL-safe 모드</span>
          <div
            onClick={() => setUrlSafe(!urlSafe)}
            className={`w-10 h-5 rounded-full relative transition-all cursor-pointer ${urlSafe ? 'bg-brand-500' : 'bg-surface-border'}`}
          >
            <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all shadow ${urlSafe ? 'left-5' : 'left-0.5'}`} />
          </div>
        </label>
      </div>

      {/* Input / Output */}
      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div className="rounded-xl border border-surface-border bg-surface-card overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-surface-border bg-surface-hover/30">
            <span className="text-sm font-medium text-slate-200">
              {mode === 'encode' ? '텍스트 입력' : 'Base64 입력'}
            </span>
            <button onClick={reset} className="text-xs text-slate-400 hover:text-red-400 flex items-center gap-1 transition-all">
              <RotateCcw size={12} /> 초기화
            </button>
          </div>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={mode === 'encode' ? '인코딩할 텍스트를 입력하세요\n한국어, 영어, 특수문자 모두 지원' : 'Base64 문자열을 입력하세요\n예: 7JWI6rWtIOyduO2EkA=='}
            rows={12}
            className="w-full bg-transparent px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none resize-none font-mono leading-relaxed"
          />
        </div>

        <div className="rounded-xl border border-surface-border bg-surface-card overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-surface-border bg-surface-hover/30">
            <span className="text-sm font-medium text-slate-200">
              {mode === 'encode' ? 'Base64 출력' : '텍스트 출력'}
            </span>
            <div className="flex gap-2">
              {output && (
                <>
                  <button onClick={switchMode} className="text-xs px-2.5 py-1.5 rounded-lg border border-surface-border text-slate-300 hover:border-brand-500/40 hover:text-brand-300 transition-all flex items-center gap-1">
                    <ArrowLeftRight size={12} /> 역변환
                  </button>
                  <button onClick={copy} className={`text-xs px-2.5 py-1.5 rounded-lg border transition-all flex items-center gap-1 ${copied ? 'bg-brand-500/20 border-brand-500/40 text-brand-400' : 'border-surface-border text-slate-300 hover:border-brand-500/40 hover:text-brand-300'}`}>
                    {copied ? <CheckCheck size={12} /> : <Copy size={12} />}
                    {copied ? '복사됨' : '복사'}
                  </button>
                </>
              )}
            </div>
          </div>
          {error ? (
            <div className="px-4 py-3 text-sm text-red-400 font-mono">{error}</div>
          ) : (
            <textarea
              value={output}
              readOnly
              placeholder="결과가 여기에 표시됩니다"
              rows={12}
              className="w-full bg-transparent px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none resize-none font-mono leading-relaxed"
            />
          )}
        </div>
      </div>

      {/* Convert button */}
      <button
        onClick={convert}
        disabled={!input.trim()}
        className="w-full py-3 rounded-xl bg-brand-500 hover:bg-brand-400 disabled:opacity-40 disabled:cursor-not-allowed text-black font-bold text-sm transition-all shadow-[0_4px_15px_rgba(34,197,94,0.3)] flex items-center justify-center gap-2"
      >
        <ArrowLeftRight size={16} />
        {mode === 'encode' ? 'Base64 인코딩' : 'Base64 디코딩'}
      </button>

      {/* Info */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { title: '한국어 완벽 지원', desc: 'UTF-8 기반 한글 인코딩' },
          { title: 'URL-safe 모드', desc: '+/= → -_로 변환' },
          { title: '브라우저 처리', desc: '서버 전송 없이 완전 로컬' },
          { title: '역변환 지원', desc: '결과를 바로 역변환' },
        ].map(f => (
          <div key={f.title} className="rounded-lg border border-surface-border bg-surface-card p-3">
            <p className="text-sm font-semibold text-slate-200 mb-1">{f.title}</p>
            <p className="text-xs text-slate-400">{f.desc}</p>
          </div>
        ))}
      </div>

      {/* SEO */}
      <div className="mt-16 p-6 rounded-xl border border-surface-border/30 bg-surface-card/20">
        <p className="text-xs text-slate-500 leading-relaxed">
          Base64 인코더 · Base64 디코더 · Base64 변환기 · Base64 인코딩 · Base64 디코딩 ·
          URL-safe Base64 · 온라인 Base64 · Base64 encoder · Base64 decoder · Base64 converter ·
          encode Base64 · decode Base64 · free Base64 tool · online Base64 encoder decoder
        </p>
      </div>
    </div>
  )
}
