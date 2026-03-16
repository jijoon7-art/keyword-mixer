'use client'

import ToolFooter from './ToolFooter'
import { useState } from 'react'
import { Copy, CheckCheck, RotateCcw } from 'lucide-react'

const ACTIONS = [
  { key: 'upper', label: '대문자 변환', desc: 'UPPERCASE', fn: (t: string) => t.toUpperCase() },
  { key: 'lower', label: '소문자 변환', desc: 'lowercase', fn: (t: string) => t.toLowerCase() },
  { key: 'title', label: '첫글자 대문자', desc: 'Title Case', fn: (t: string) => t.replace(/\b\w/g, c => c.toUpperCase()) },
  { key: 'reverse', label: '텍스트 뒤집기', desc: '!gnisreveR', fn: (t: string) => t.split('').reverse().join('') },
  { key: 'linenum', label: '줄번호 추가', desc: '1. 첫줄...', fn: (t: string) => t.split('\n').map((l, i) => `${i + 1}. ${l}`).join('\n') },
  { key: 'rmlinenum', label: '줄번호 제거', desc: '번호 제거', fn: (t: string) => t.split('\n').map(l => l.replace(/^\d+\.\s*/, '')).join('\n') },
  { key: 'dedup', label: '중복 줄 제거', desc: '같은 줄 삭제', fn: (t: string) => { const seen = new Set<string>(); return t.split('\n').filter(l => { if (seen.has(l)) return false; seen.add(l); return true }).join('\n') } },
  { key: 'sort', label: '줄 정렬 (가→나)', desc: '알파벳순', fn: (t: string) => t.split('\n').sort((a, b) => a.localeCompare(b, 'ko')).join('\n') },
  { key: 'rsort', label: '줄 정렬 (나→가)', desc: '역순', fn: (t: string) => t.split('\n').sort((a, b) => b.localeCompare(a, 'ko')).join('\n') },
  { key: 'shuffle', label: '줄 순서 섞기', desc: '랜덤 정렬', fn: (t: string) => { const arr = t.split('\n'); for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[arr[i], arr[j]] = [arr[j], arr[i]] } return arr.join('\n') } },
  { key: 'rmempty', label: '빈 줄 제거', desc: '빈 줄 삭제', fn: (t: string) => t.split('\n').filter(l => l.trim() !== '').join('\n') },
  { key: 'trim', label: '앞뒤 공백 제거', desc: 'trim lines', fn: (t: string) => t.split('\n').map(l => l.trim()).join('\n') },
  { key: 'rmspace', label: '모든 공백 제거', desc: '공백 전체 삭제', fn: (t: string) => t.replace(/\s/g, '') },
  { key: 'onespace', label: '연속 공백→1칸', desc: '  → 공백1칸', fn: (t: string) => t.replace(/[^\S\n]+/g, ' ') },
  { key: 'comma', label: '줄→쉼표 변환', desc: '줄바꿈→,', fn: (t: string) => t.split('\n').filter(l => l.trim()).join(', ') },
  { key: 'commatolines', label: '쉼표→줄 변환', desc: ',→줄바꿈', fn: (t: string) => t.split(',').map(l => l.trim()).join('\n') },
  { key: 'count', label: '줄 수 세기', desc: '총 줄수 표시', fn: (t: string) => `총 ${t.split('\n').length}줄\n\n${t}` },
  { key: 'html', label: 'HTML 이스케이프', desc: '< > & 변환', fn: (t: string) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;') },
  { key: 'unhtml', label: 'HTML 언이스케이프', desc: '&lt; → <', fn: (t: string) => t.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"') },
  { key: 'slug', label: 'URL 슬러그 변환', desc: 'Hello → hello-world', fn: (t: string) => t.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim() },
]

export default function TextTools() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [lastAction, setLastAction] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const apply = (key: string, fn: (t: string) => string) => {
    const result = fn(input)
    setOutput(result)
    setLastAction(key)
  }

  const copy = async () => {
    if (!output) return
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const useOutput = () => { setInput(output); setOutput('') }

  const stats = {
    chars: input.length,
    noSpace: input.replace(/\s/g, '').length,
    words: input.trim() ? input.trim().split(/\s+/).length : 0,
    lines: input ? input.split('\n').length : 0,
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-mono mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
          Free Tool
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-3 tracking-tight">텍스트 도구 모음</h1>
        <p className="text-slate-300 text-base max-w-lg mx-auto">
          대소문자 변환, 줄번호 추가/제거, 중복 제거, 정렬, 공백 처리 등 20가지 텍스트 변환 도구.
        </p>
      </div>

      {/* Action buttons */}
      <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-5 mb-5">
        <p className="text-xs text-slate-400 mb-3 font-medium">변환 도구 — 클릭하면 즉시 적용</p>
        <div className="flex flex-wrap gap-2">
          {ACTIONS.map(a => (
            <button key={a.key} onClick={() => apply(a.key, a.fn)} disabled={!input}
              className={`flex flex-col items-start px-3 py-2 rounded-lg border text-xs transition-all disabled:opacity-30 disabled:cursor-not-allowed ${
                lastAction === a.key
                  ? 'bg-brand-500 border-brand-500 text-white font-bold'
                  : 'border-surface-border text-slate-300 hover:border-brand-500/40 hover:text-brand-300 bg-[#0f1117]'
              }`}>
              <span className="font-medium">{a.label}</span>
              <span className={`text-xs mt-0.5 ${lastAction === a.key ? 'text-white/70' : 'text-slate-600'}`}>{a.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        {[
          { label: '글자수', val: stats.chars },
          { label: '공백제외', val: stats.noSpace },
          { label: '단어수', val: stats.words },
          { label: '줄수', val: stats.lines },
        ].map(s => (
          <div key={s.label} className="rounded-xl border border-surface-border bg-[#1a1d27] p-3 text-center">
            <p className="text-xl font-bold text-brand-400 font-mono">{s.val.toLocaleString()}</p>
            <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Editor */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="rounded-xl border border-surface-border bg-[#1a1d27] overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-surface-border bg-surface-hover/20">
            <span className="text-sm font-medium text-slate-200">입력</span>
            <button onClick={() => { setInput(''); setOutput(''); setLastAction(null) }}
              className="text-xs text-slate-500 hover:text-red-400 flex items-center gap-1 transition-all">
              <RotateCcw size={12} /> 초기화
            </button>
          </div>
          <textarea value={input} onChange={e => setInput(e.target.value)}
            placeholder="텍스트를 입력하세요..." rows={14}
            className="w-full bg-transparent px-4 py-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none resize-none font-mono leading-relaxed" />
        </div>

        <div className="rounded-xl border border-surface-border bg-[#1a1d27] overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-surface-border bg-surface-hover/20">
            <span className="text-sm font-medium text-slate-200">결과</span>
            <div className="flex gap-2">
              {output && (
                <>
                  <button onClick={useOutput}
                    className="text-xs px-2.5 py-1.5 rounded-lg border border-surface-border text-slate-300 hover:border-brand-500/40 hover:text-brand-300 transition-all">
                    결과→입력
                  </button>
                  <button onClick={copy}
                    className={`text-xs px-2.5 py-1.5 rounded-lg border transition-all flex items-center gap-1 ${copied ? 'bg-brand-500/20 border-brand-500/40 text-brand-400' : 'border-surface-border text-slate-300 hover:border-brand-500/40 hover:text-brand-300'}`}>
                    {copied ? <CheckCheck size={12} /> : <Copy size={12} />}
                    {copied ? '복사됨' : '복사'}
                  </button>
                </>
              )}
            </div>
          </div>
          <textarea value={output} readOnly
            placeholder="변환 결과가 여기에 표시됩니다" rows={14}
            className="w-full bg-transparent px-4 py-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none resize-none font-mono leading-relaxed" />
        </div>
      </div>
      <ToolFooter
        toolName="텍스트 도구 모음"
        toolUrl="https://keyword-mixer.vercel.app/text-tools"
        description="대소문자 변환, 줄번호, 중복제거, 정렬 등 20가지 텍스트 변환."
        howToUse={[
          { step: '도구 접속', desc: '텍스트 도구 모음에 접속하세요.' },
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
        keywords="텍스트 변환기 · 대문자 변환 · 소문자 변환 · 줄번호 추가 · 중복 줄 제거 · text converter · uppercase lowercase · remove duplicates · text tools"
      />
    </div>
  )
}
