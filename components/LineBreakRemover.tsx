'use client'

import { useState } from 'react'
import { Copy, CheckCheck, RotateCcw } from 'lucide-react'
import { useLang } from './LangContext'
import ToolFooter from './ToolFooter'

const T = {
  ko: { title: '줄바꿈 제거기', desc: '줄바꿈·공백·특수문자를 한번에 정리. PDF 복사 텍스트, 이메일 본문 정리에 최적.', input: '입력', output: '결과', copy: '복사', copied: '복사됨!', clear: '초기화', useOutput: '결과→입력', actions: '정리 옵션' },
  en: { title: 'Line Break Remover', desc: 'Remove line breaks, clean whitespace, fix copied PDF text instantly.', input: 'Input', output: 'Output', copy: 'Copy', copied: 'Copied!', clear: 'Clear', useOutput: 'Output→Input', actions: 'Clean Options' }
}

const ACTIONS = [
  { key: 'remove_all', ko: '줄바꿈 모두 제거', en: 'Remove All Breaks', fn: (t: string) => t.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim() },
  { key: 'remove_extra', ko: '연속 줄바꿈→1개', en: 'Multiple Breaks→Single', fn: (t: string) => t.replace(/\n{3,}/g, '\n\n').trim() },
  { key: 'trim_lines', ko: '앞뒤 공백 제거', en: 'Trim Each Line', fn: (t: string) => t.split('\n').map((l: string) => l.trim()).join('\n') },
  { key: 'remove_empty', ko: '빈 줄 제거', en: 'Remove Empty Lines', fn: (t: string) => t.split('\n').filter((l: string) => l.trim()).join('\n') },
  { key: 'one_line', ko: '→ 한 줄로', en: 'Join to One Line', fn: (t: string) => t.split('\n').map((l: string) => l.trim()).filter(Boolean).join(' ') },
  { key: 'to_comma', ko: '줄→쉼표', en: 'Lines→Comma', fn: (t: string) => t.split('\n').map((l: string) => l.trim()).filter(Boolean).join(', ') },
  { key: 'from_comma', ko: '쉼표→줄', en: 'Comma→Lines', fn: (t: string) => t.split(',').map((l: string) => l.trim()).filter(Boolean).join('\n') },
  { key: 'one_space', ko: '연속 공백→1칸', en: 'Multiple Spaces→One', fn: (t: string) => t.replace(/[^\S\n]+/g, ' ') },
  { key: 'fix_pdf', ko: 'PDF 텍스트 정리', en: 'Fix PDF Copy', fn: (t: string) => t.replace(/(\w)-\n(\w)/g, '$1$2').replace(/\n(?=[a-z가-힣])/g, ' ').replace(/\s+/g, ' ').trim() },
  { key: 'line_num', ko: '줄번호 추가', en: 'Add Line Numbers', fn: (t: string) => t.split('\n').map((l: string, i: number) => `${i + 1}. ${l}`).join('\n') },
  { key: 'reverse', ko: '줄 뒤집기', en: 'Reverse Lines', fn: (t: string) => t.split('\n').reverse().join('\n') },
  { key: 'remove_special', ko: '특수문자 제거', en: 'Remove Special Chars', fn: (t: string) => t.replace(/[^\w\s가-힣ㄱ-ㅎㅏ-ㅣ]/g, '') },
]

export default function LineBreakRemover() {
  const { lang } = useLang()
  const tx = T[lang]
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [lastAction, setLastAction] = useState('')
  const [copied, setCopied] = useState(false)

  const apply = (key: string, fn: (t: string) => string) => { setOutput(fn(input)); setLastAction(key) }
  const copy = async () => { await navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 1500) }

  const stats = { chars: input.length, lines: input ? input.split('\n').length : 0, words: input.trim() ? input.trim().split(/\s+/).length : 0 }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-mono mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />Free Tool
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-3">{tx.title}</h1>
        <p className="text-slate-300 text-base max-w-lg mx-auto">{tx.desc}</p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        {[{ label: lang === 'ko' ? '글자수' : 'Chars', val: stats.chars }, { label: lang === 'ko' ? '줄수' : 'Lines', val: stats.lines }, { label: lang === 'ko' ? '단어수' : 'Words', val: stats.words }].map(s => (
          <div key={s.label} className="rounded-xl border border-surface-border bg-[#1a1d27] p-3 text-center">
            <p className="text-xl font-bold text-brand-400 font-mono">{s.val.toLocaleString()}</p>
            <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4 mb-4">
        <p className="text-xs text-slate-400 mb-3 font-medium">{tx.actions}</p>
        <div className="flex flex-wrap gap-2">
          {ACTIONS.map(a => (
            <button key={a.key} onClick={() => apply(a.key, a.fn)} disabled={!input}
              className={`text-xs px-3 py-2 rounded-lg border transition-all disabled:opacity-30 ${lastAction === a.key ? 'bg-brand-500 border-brand-500 text-white font-bold' : 'border-surface-border text-slate-300 hover:border-brand-500/40 hover:text-brand-300 bg-[#0f1117]'}`}>
              {lang === 'ko' ? a.ko : a.en}
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {[
          { label: tx.input, value: input, readOnly: false, onChange: (v: string) => setInput(v), placeholder: lang === 'ko' ? 'PDF에서 복사한 텍스트를 붙여넣으세요...' : 'Paste text from PDF or any source...' },
          { label: tx.output, value: output, readOnly: true, onChange: () => {}, placeholder: lang === 'ko' ? '결과가 여기에 표시됩니다' : 'Result appears here' },
        ].map((panel, i) => (
          <div key={i} className="rounded-xl border border-surface-border bg-[#1a1d27] overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-surface-border">
              <span className="text-sm font-medium text-slate-200">{panel.label}</span>
              {i === 0 ? (
                <button onClick={() => { setInput(''); setOutput(''); setLastAction('') }} className="text-xs text-slate-500 hover:text-red-400 flex items-center gap-1 transition-all">
                  <RotateCcw size={12} /> {tx.clear}
                </button>
              ) : (
                <div className="flex gap-2">
                  {output && <button onClick={() => { setInput(output); setOutput('') }} className="text-xs text-slate-400 hover:text-brand-400 transition-all">{tx.useOutput}</button>}
                  <button onClick={copy} disabled={!output} className={`text-xs px-2.5 py-1.5 rounded-lg border flex items-center gap-1 transition-all ${copied ? 'bg-brand-500/20 border-brand-500/40 text-brand-400' : 'border-surface-border text-slate-300 hover:border-brand-500/40 disabled:opacity-30'}`}>
                    {copied ? <CheckCheck size={12} /> : <Copy size={12} />} {copied ? tx.copied : tx.copy}
                  </button>
                </div>
              )}
            </div>
            <textarea value={panel.value} readOnly={panel.readOnly} onChange={e => panel.onChange(e.target.value)}
              placeholder={panel.placeholder} rows={16}
              className="w-full bg-transparent px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none resize-none font-mono leading-relaxed" />
          </div>
        ))}
      </div>

      <ToolFooter
        toolName={lang === 'ko' ? '줄바꿈 제거기' : 'Line Break Remover'}
        toolUrl="https://keyword-mixer.vercel.app/line-break-remover"
        description={tx.desc}
        howToUse={lang === 'ko' ? [
          { step: '텍스트 붙여넣기', desc: 'PDF, 이메일 등에서 복사한 텍스트를 왼쪽에 붙여넣으세요.' },
          { step: '정리 옵션 클릭', desc: '원하는 정리 방식 버튼을 클릭하면 즉시 적용됩니다.' },
          { step: '결과 확인', desc: '오른쪽에 정리된 텍스트가 표시됩니다.' },
          { step: '복사 또는 재처리', desc: '복사 버튼으로 복사하거나 결과→입력으로 연속 정리하세요.' },
        ] : [
          { step: 'Paste text', desc: 'Paste text from PDF, email, or any source into the left panel.' },
          { step: 'Click a clean option', desc: 'Click any clean option button to instantly apply it.' },
          { step: 'Review result', desc: 'The cleaned text appears in the right panel.' },
          { step: 'Copy or chain', desc: 'Copy the result or use Output→Input for further cleaning.' },
        ]}
        whyUse={lang === 'ko' ? [
          { title: 'PDF 텍스트 정리', desc: 'PDF에서 복사 시 생기는 줄바꿈·하이픈을 자동 제거합니다.' },
          { title: '12가지 옵션', desc: '줄바꿈 제거부터 CSV 변환까지 다양한 텍스트 정리 기능.' },
          { title: '연속 적용', desc: '결과를 다시 입력으로 보내 여러 옵션을 연속 적용 가능.' },
          { title: '실시간 통계', desc: '글자수·줄수·단어수를 실시간으로 확인.' },
        ] : [
          { title: 'Fix PDF copy issues', desc: 'Removes unwanted line breaks and hyphens from PDF text.' },
          { title: '12 clean options', desc: 'From removing breaks to CSV conversion.' },
          { title: 'Chain operations', desc: 'Apply multiple cleaning operations sequentially.' },
          { title: 'Live statistics', desc: 'Real-time char, line, and word count.' },
        ]}
        faqs={lang === 'ko' ? [
          { q: 'PDF 복사 텍스트가 왜 깨지나요?', a: 'PDF는 각 줄이 독립 저장되어 복사 시 줄바꿈이 포함됩니다. "PDF 텍스트 정리" 버튼으로 자동 수정하세요.' },
          { q: '줄을 쉼표로 바꾸려면?', a: '"줄→쉼표" 버튼을 클릭하면 각 줄이 쉼표로 연결됩니다.' },
          { q: '데이터가 서버에 저장되나요?', a: '모든 처리는 브라우저에서 이루어져 서버에 전송되지 않습니다.' },
          { q: '텍스트 길이 제한이 있나요?', a: '브라우저 메모리 내에서 처리되므로 수십만 자도 처리 가능합니다.' },
        ] : [
          { q: 'Why does PDF text get broken?', a: 'PDFs store lines independently. Use "Fix PDF Copy" to automatically fix line break issues.' },
          { q: 'How to convert lines to comma-separated?', a: 'Click "Lines→Comma" to join all lines with commas.' },
          { q: 'Is my data sent to a server?', a: 'No. All processing happens locally in your browser.' },
          { q: 'Is there a text length limit?', a: 'Hundreds of thousands of characters are supported in the browser.' },
        ]}
        keywords="줄바꿈 제거 · 줄바꿈 없애기 · 텍스트 정리 · PDF 텍스트 · 공백 제거 · line break remover · remove line breaks · text cleaner · fix PDF text · whitespace remover"
      />
    </div>
  )
}
