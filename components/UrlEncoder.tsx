'use client'

import { useState } from 'react'
import { Copy, CheckCheck, ArrowDownUp } from 'lucide-react'
import { useLang } from './LangContext'
import ToolFooter from './ToolFooter'

const T = {
  ko: {
    title: 'URL 인코더 / 디코더',
    desc: 'URL 인코딩·디코딩·Base64·HTML 엔티티 변환. 개발자 필수 도구.',
    encode: '인코딩',
    decode: '디코딩',
    input: '입력',
    output: '결과',
    copy: '복사',
    copied: '복사됨',
    swap: '입출력 교환',
    clear: '초기화',
    mode: '변환 방식',
  },
  en: {
    title: 'URL Encoder / Decoder',
    desc: 'URL encode/decode, Base64, HTML entity conversion. Essential developer tool.',
    encode: 'Encode',
    decode: 'Decode',
    input: 'Input',
    output: 'Output',
    copy: 'Copy',
    copied: 'Copied!',
    swap: 'Swap',
    clear: 'Clear',
    mode: 'Mode',
  }
}

type Mode = 'url-encode' | 'url-decode' | 'base64-encode' | 'base64-decode' | 'html-encode' | 'html-decode' | 'uri-encode' | 'uri-decode'

const MODES: { key: Mode; label: string; labelEn: string }[] = [
  { key: 'url-encode', label: 'URL 인코딩', labelEn: 'URL Encode' },
  { key: 'url-decode', label: 'URL 디코딩', labelEn: 'URL Decode' },
  { key: 'base64-encode', label: 'Base64 인코딩', labelEn: 'Base64 Encode' },
  { key: 'base64-decode', label: 'Base64 디코딩', labelEn: 'Base64 Decode' },
  { key: 'html-encode', label: 'HTML 엔티티 변환', labelEn: 'HTML Encode' },
  { key: 'html-decode', label: 'HTML 엔티티 복원', labelEn: 'HTML Decode' },
  { key: 'uri-encode', label: 'URI 인코딩', labelEn: 'URI Encode' },
  { key: 'uri-decode', label: 'URI 디코딩', labelEn: 'URI Decode' },
]

function convert(text: string, mode: Mode): string {
  try {
    switch (mode) {
      case 'url-encode': return encodeURIComponent(text)
      case 'url-decode': return decodeURIComponent(text)
      case 'base64-encode': return btoa(unescape(encodeURIComponent(text)))
      case 'base64-decode': return decodeURIComponent(escape(atob(text)))
      case 'html-encode': return text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;')
      case 'html-decode': return text.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#039;/g,"'")
      case 'uri-encode': return encodeURI(text)
      case 'uri-decode': return decodeURI(text)
      default: return text
    }
  } catch (e) {
    return `오류: ${(e as Error).message}`
  }
}

const SAMPLES: Record<Mode, string> = {
  'url-encode': 'https://example.com/검색?q=안녕 세상&lang=ko',
  'url-decode': 'https%3A%2F%2Fexample.com%2F%EA%B2%80%EC%83%89%3Fq%3D%EC%95%88%EB%85%95',
  'base64-encode': 'Hello, 안녕하세요! This is a test.',
  'base64-decode': '5LiA5Liq5L2T5YmN',
  'html-encode': '<script>alert("XSS & injection")</script>',
  'html-decode': '&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;',
  'uri-encode': 'https://example.com/path with spaces/파일.pdf',
  'uri-decode': 'https://example.com/path%20with%20spaces/%ED%8C%8C%EC%9D%BC.pdf',
}

export default function UrlEncoder() {
  const { lang } = useLang()
  const tx = T[lang]

  const [mode, setMode] = useState<Mode>('url-encode')
  const [input, setInput] = useState('')
  const [copied, setCopied] = useState(false)

  const output = input ? convert(input, mode) : ''

  const copy = async () => {
    if (!output) return
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const swap = () => setInput(output)
  const loadSample = () => setInput(SAMPLES[mode])

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-mono mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
          Free Developer Tool
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-3 tracking-tight">{tx.title}</h1>
        <p className="text-slate-300 text-base max-w-lg mx-auto">{tx.desc}</p>
      </div>

      {/* 모드 선택 */}
      <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4 mb-5">
        <p className="text-xs text-slate-400 mb-2 font-medium">{tx.mode}</p>
        <div className="flex flex-wrap gap-1.5">
          {MODES.map(m => (
            <button key={m.key} onClick={() => { setMode(m.key); setInput('') }}
              className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${mode === m.key ? 'bg-brand-500 border-brand-500 text-white font-bold' : 'border-surface-border text-slate-300 hover:border-brand-500/40 hover:text-brand-300 bg-[#0f1117]'}`}>
              {lang === 'ko' ? m.label : m.labelEn}
            </button>
          ))}
        </div>
      </div>

      {/* 입출력 */}
      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div className="rounded-xl border border-surface-border bg-[#1a1d27] overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-surface-border">
            <span className="text-sm font-medium text-slate-200">{tx.input}</span>
            <button onClick={loadSample} className="text-xs text-slate-500 hover:text-brand-400 transition-all">
              {lang === 'ko' ? '샘플' : 'Sample'}
            </button>
          </div>
          <textarea value={input} onChange={e => setInput(e.target.value)}
            placeholder={lang === 'ko' ? '변환할 텍스트를 입력하세요...' : 'Enter text to convert...'}
            rows={10}
            className="w-full bg-transparent px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none resize-none font-mono leading-relaxed" />
        </div>

        <div className="rounded-xl border border-surface-border bg-[#1a1d27] overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-surface-border">
            <span className="text-sm font-medium text-slate-200">{tx.output}</span>
            <div className="flex gap-2">
              {output && (
                <button onClick={swap} className="text-xs text-slate-400 hover:text-brand-400 transition-all flex items-center gap-1">
                  <ArrowDownUp size={11} /> {tx.swap}
                </button>
              )}
              <button onClick={copy} className={`text-xs px-2.5 py-1.5 rounded-lg border transition-all flex items-center gap-1 ${copied ? 'bg-brand-500/20 border-brand-500/40 text-brand-400' : 'border-surface-border text-slate-300 hover:border-brand-500/40'}`}>
                {copied ? <CheckCheck size={11} /> : <Copy size={11} />}
                {copied ? tx.copied : tx.copy}
              </button>
            </div>
          </div>
          <textarea value={output} readOnly
            placeholder={lang === 'ko' ? '변환 결과가 여기에 표시됩니다' : 'Converted result will appear here'}
            rows={10}
            className="w-full bg-transparent px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none resize-none font-mono leading-relaxed" />
        </div>
      </div>

      {/* 빠른 참고 */}
      <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4">
        <p className="text-xs text-slate-400 mb-2 font-medium">
          {lang === 'ko' ? '자주 사용하는 URL 인코딩 문자' : 'Common URL Encoded Characters'}
        </p>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-1.5">
          {[
            [' ', '%20'], ['!', '%21'], ['"', '%22'], ['#', '%23'],
            ['$', '%24'], ['&', '%26'], ["'", '%27'], ['(', '%28'],
            [')', '%29'], ['+', '%2B'], [',', '%2C'], ['/', '%2F'],
            [':', '%3A'], [';', '%3B'], ['=', '%3D'], ['?', '%3F'],
          ].map(([char, enc]) => (
            <div key={char} className="text-center p-1.5 rounded bg-[#0f1117] border border-surface-border">
              <p className="text-xs font-bold text-brand-400">{char}</p>
              <p className="text-xs text-slate-500 font-mono">{enc}</p>
            </div>
          ))}
        </div>
      </div>

      <ToolFooter
        toolName={lang === 'ko' ? 'URL 인코더 / 디코더' : 'URL Encoder / Decoder'}
        toolUrl="https://keyword-mixer.vercel.app/url-encoder"
        description={tx.desc}
        howToUse={lang === 'ko' ? [
          { step: '변환 방식 선택', desc: 'URL 인코딩/디코딩, Base64, HTML 엔티티 중 원하는 방식을 선택하세요.' },
          { step: '텍스트 입력', desc: '변환할 텍스트를 입력창에 붙여넣거나 입력하세요.' },
          { step: '즉시 결과 확인', desc: '입력과 동시에 오른쪽에 변환 결과가 표시됩니다.' },
          { step: '결과 복사', desc: '복사 버튼으로 변환된 텍스트를 클립보드에 복사하세요.' },
        ] : [
          { step: 'Select conversion mode', desc: 'Choose URL encode/decode, Base64, or HTML entity.' },
          { step: 'Enter text', desc: 'Paste or type the text you want to convert.' },
          { step: 'Get instant result', desc: 'Conversion result appears in real-time on the right.' },
          { step: 'Copy result', desc: 'Click copy to save the converted text to clipboard.' },
        ]}
        whyUse={lang === 'ko' ? [
          { title: '8가지 변환 지원', desc: 'URL, Base64, HTML 엔티티 등 개발에서 자주 쓰는 8가지 변환을 지원합니다.' },
          { title: '실시간 변환', desc: '입력하는 즉시 결과가 표시되어 빠르게 확인할 수 있습니다.' },
          { title: '인코딩 참조표', desc: '자주 사용하는 URL 인코딩 문자 대응표를 함께 제공합니다.' },
          { title: '결과 재입력 기능', desc: '결과를 입력창으로 전환해 연속 변환이 가능합니다.' },
        ] : [
          { title: '8 conversion modes', desc: 'URL, Base64, HTML entities — all the encoding tools developers need.' },
          { title: 'Real-time conversion', desc: 'Instant results as you type, no button needed.' },
          { title: 'Reference chart', desc: 'Common URL encoding characters reference table included.' },
          { title: 'Chain conversions', desc: 'Swap output to input for sequential conversions.' },
        ]}
        faqs={lang === 'ko' ? [
          { q: 'URL 인코딩이 필요한 경우는?', a: 'URL에 한글, 특수문자, 공백이 포함될 때 인코딩이 필요합니다. 쿼리 파라미터나 API 호출 시 자주 사용합니다.' },
          { q: 'encodeURIComponent vs encodeURI 차이는?', a: 'encodeURIComponent는 /, :, ?, # 등도 인코딩합니다. encodeURI는 URL 구조를 유지하며 경로 구분자는 인코딩하지 않습니다.' },
          { q: 'Base64는 암호화인가요?', a: '아니요. Base64는 인코딩이지 암호화가 아닙니다. 누구나 디코딩할 수 있으니 보안 목적으로 사용하지 마세요.' },
          { q: 'HTML 엔티티 변환이 필요한 이유는?', a: '<, >, &, " 같은 문자는 HTML에서 태그나 속성으로 해석될 수 있습니다. 엔티티로 변환하면 XSS 공격을 방지할 수 있습니다.' },
        ] : [
          { q: 'When do I need URL encoding?', a: 'URL encoding is needed when URLs contain spaces, Korean characters, or special characters in query strings.' },
          { q: 'encodeURIComponent vs encodeURI?', a: 'encodeURIComponent encodes everything including /, :, ?. encodeURI preserves URL structure characters.' },
          { q: 'Is Base64 encryption?', a: 'No. Base64 is encoding, not encryption. Anyone can decode it. Do not use it for security purposes.' },
          { q: 'Why use HTML entity encoding?', a: 'Characters like <, >, & can be interpreted as HTML tags. Entity encoding prevents XSS vulnerabilities.' },
        ]}
        keywords="URL 인코더 · URL 디코더 · URL 인코딩 · URL 디코딩 · Base64 인코딩 · HTML 엔티티 · URL encode · URL decode · Base64 encoder · Base64 decoder · HTML entity encoder · URI encoding · percent encoding · free URL tool"
      />
    </div>
  )
}
