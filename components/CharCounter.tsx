'use client'

import { useState } from 'react'
import { Copy, CheckCheck, RotateCcw } from 'lucide-react'

const LIMITS = [
  { label: '트위터/X', limit: 280, color: 'text-blue-400' },
  { label: '인스타그램', limit: 2200, color: 'text-pink-400' },
  { label: '네이버 블로그 제목', limit: 50, color: 'text-green-400' },
  { label: 'YouTube 제목', limit: 100, color: 'text-red-400' },
  { label: 'Meta 설명', limit: 160, color: 'text-purple-400' },
  { label: 'Google 제목', limit: 60, color: 'text-yellow-400' },
]

export default function CharCounter() {
  const [text, setText] = useState('')
  const [copied, setCopied] = useState(false)

  const withSpace = text.length
  const withoutSpace = text.replace(/\s/g, '').length
  const bytes = new TextEncoder().encode(text).length
  const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length
  const sentences = text.trim() === '' ? 0 : text.split(/[.!?]+/).filter(s => s.trim()).length
  const lines = text === '' ? 0 : text.split('\n').length

  const copy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Hero */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-mono mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
          Free Tool
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-3 tracking-tight">글자수 세기</h1>
        <p className="text-slate-400 text-base max-w-lg mx-auto">
          공백 포함·제외 글자수, 바이트, 단어수 실시간 계산. SNS·블로그·SEO 글자수 제한 확인.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-6">
        {[
          { label: '글자수 (공백포함)', value: withSpace },
          { label: '글자수 (공백제외)', value: withoutSpace },
          { label: '바이트', value: bytes },
          { label: '단어수', value: words },
          { label: '문장수', value: sentences },
          { label: '줄수', value: lines },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-surface-border bg-surface-card p-3 text-center">
            <p className="text-2xl font-bold text-brand-400 font-mono">{stat.value.toLocaleString()}</p>
            <p className="text-xs text-slate-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Textarea */}
      <div className="rounded-xl border border-surface-border bg-surface-card overflow-hidden mb-6">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-surface-border bg-surface-hover/30">
          <span className="text-sm text-slate-400">텍스트 입력</span>
          <div className="flex gap-2">
            <button
              onClick={copy}
              className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-all ${
                copied
                  ? 'bg-brand-500/20 border-brand-500/40 text-brand-400'
                  : 'border-surface-border text-slate-400 hover:border-brand-500/40 hover:text-brand-300'
              }`}
            >
              {copied ? <CheckCheck size={13} /> : <Copy size={13} />}
              {copied ? '복사됨!' : '복사'}
            </button>
            <button
              onClick={() => setText('')}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-surface-border text-slate-400 hover:text-red-400 hover:border-red-500/40 transition-all"
            >
              <RotateCcw size={13} />
              초기화
            </button>
          </div>
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="여기에 텍스트를 입력하세요..."
          rows={12}
          className="w-full bg-transparent px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none resize-none leading-relaxed"
        />
      </div>

      {/* Platform limits */}
      <div className="rounded-xl border border-surface-border bg-surface-card p-5">
        <h2 className="text-sm font-semibold text-slate-200 mb-4">플랫폼별 글자수 제한</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {LIMITS.map((p) => {
            const pct = Math.min((withSpace / p.limit) * 100, 100)
            const over = withSpace > p.limit
            return (
              <div key={p.label} className="rounded-lg border border-surface-border p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-400">{p.label}</span>
                  <span className={`text-xs font-mono ${over ? 'text-red-400' : p.color}`}>
                    {withSpace}/{p.limit}
                  </span>
                </div>
                <div className="h-1.5 bg-surface-border rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${over ? 'bg-red-500' : 'bg-brand-500'}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                {over && (
                  <p className="text-xs text-red-400 mt-1">{withSpace - p.limit}자 초과</p>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* SEO block */}
      <div className="mt-16 p-6 rounded-xl border border-surface-border/30 bg-surface-card/20">
        <p className="text-xs text-slate-600 leading-relaxed">
          글자수 세기 · 글자수 계산기 · 바이트 계산기 · 공백 포함 글자수 · 공백 제외 글자수 ·
          네이버 블로그 글자수 · 인스타그램 글자수 · 유튜브 제목 글자수 · SEO 메타 설명 글자수 ·
          character counter · word counter · byte counter · text length calculator
        </p>
      </div>
    </div>
  )
}
