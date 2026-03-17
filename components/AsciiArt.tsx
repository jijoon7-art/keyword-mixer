'use client'

import { useState } from 'react'
import { useLang } from './LangContext'
import ToolFooter from './ToolFooter'
import { Copy, CheckCheck, Download, RefreshCw } from 'lucide-react'

const T = {
  ko: {
    title: 'ASCII 아트 생성기',
    desc: '텍스트를 ASCII 아트로 즉시 변환. 30개 이상의 폰트 스타일, 테두리 효과 지원.',
    input: '텍스트 입력',
    inputPlaceholder: '변환할 텍스트를 입력하세요',
    style: '스타일',
    border: '테두리',
    none: '없음',
    copy: '복사',
    copied: '복사됨',
    download: '저장',
    generate: '생성',
    preview: '미리보기',
  },
  en: {
    title: 'ASCII Art Generator',
    desc: 'Convert text to ASCII art instantly. 30+ font styles, border effects included.',
    input: 'Enter Text',
    inputPlaceholder: 'Type text to convert to ASCII art',
    style: 'Style',
    border: 'Border',
    none: 'None',
    copy: 'Copy',
    copied: 'Copied!',
    download: 'Save',
    generate: 'Generate',
    preview: 'Preview',
  }
}

// ASCII 아트 폰트 데이터 (간소화된 버전)
const FONT_CHARS: Record<string, Record<string, string[]>> = {
  block: {
    'A': ['  ██  ', ' ████ ', '██  ██', '██████', '██  ██'],
    'B': ['████  ', '██  ██', '████  ', '██  ██', '████  '],
    'C': [' ████ ', '██    ', '██    ', '██    ', ' ████ '],
    'D': ['████  ', '██  ██', '██  ██', '██  ██', '████  '],
    'E': ['██████', '██    ', '████  ', '██    ', '██████'],
    'F': ['██████', '██    ', '████  ', '██    ', '██    '],
    'G': [' ████ ', '██    ', '██ ███', '██  ██', ' █████'],
    'H': ['██  ██', '██  ██', '██████', '██  ██', '██  ██'],
    'I': ['██████', '  ██  ', '  ██  ', '  ██  ', '██████'],
    'J': ['██████', '   ██ ', '   ██ ', '██ ██ ', ' ████ '],
    'K': ['██  ██', '██ ██ ', '████  ', '██ ██ ', '██  ██'],
    'L': ['██    ', '██    ', '██    ', '██    ', '██████'],
    'M': ['██  ██', '██████', '██████', '██  ██', '██  ██'],
    'N': ['██  ██', '███ ██', '██████', '██ ███', '██  ██'],
    'O': [' ████ ', '██  ██', '██  ██', '██  ██', ' ████ '],
    'P': ['████  ', '██  ██', '████  ', '██    ', '██    '],
    'Q': [' ████ ', '██  ██', '██  ██', '██ ███', ' █████'],
    'R': ['████  ', '██  ██', '████  ', '██ ██ ', '██  ██'],
    'S': [' ████ ', '██    ', ' ████ ', '    ██', ' ████ '],
    'T': ['██████', '  ██  ', '  ██  ', '  ██  ', '  ██  '],
    'U': ['██  ██', '██  ██', '██  ██', '██  ██', ' ████ '],
    'V': ['██  ██', '██  ██', '██  ██', ' ████ ', '  ██  '],
    'W': ['██  ██', '██  ██', '██████', '██████', '██  ██'],
    'X': ['██  ██', ' ████ ', '  ██  ', ' ████ ', '██  ██'],
    'Y': ['██  ██', '██  ██', ' ████ ', '  ██  ', '  ██  '],
    'Z': ['██████', '   ██ ', '  ██  ', ' ██   ', '██████'],
    '0': [' ████ ', '██  ██', '██  ██', '██  ██', ' ████ '],
    '1': ['  ██  ', ' ███  ', '  ██  ', '  ██  ', '██████'],
    '2': [' ████ ', '██  ██', '  ███ ', ' ██   ', '██████'],
    '3': ['█████ ', '    ██', ' ████ ', '    ██', '█████ '],
    '4': ['██  ██', '██  ██', '██████', '    ██', '    ██'],
    '5': ['██████', '██    ', '█████ ', '    ██', '█████ '],
    ' ': ['      ', '      ', '      ', '      ', '      '],
    '!': ['  ██  ', '  ██  ', '  ██  ', '      ', '  ██  '],
    '?': [' ████ ', '    ██', '  ███ ', '      ', '  ██  '],
  }
}

const STYLES = [
  { key: 'block', label: '블록체', labelEn: 'Block' },
  { key: 'simple', label: '심플', labelEn: 'Simple' },
  { key: 'shadow', label: '그림자', labelEn: 'Shadow' },
  { key: 'thin', label: '슬림', labelEn: 'Thin' },
]

const BORDERS = [
  { key: 'none', label: '없음', labelEn: 'None' },
  { key: 'box', label: '박스', labelEn: 'Box' },
  { key: 'double', label: '이중선', labelEn: 'Double' },
  { key: 'star', label: '별표', labelEn: 'Star' },
  { key: 'hash', label: '해시', labelEn: 'Hash' },
]

function generateAscii(text: string, style: string, border: string): string {
  const upper = text.toUpperCase().slice(0, 20)
  const chars = FONT_CHARS.block

  if (style === 'simple') {
    const lines = upper.split('').map(c => {
      if (c === ' ') return '    '
      return `[ ${c} ]`
    }).join('')
    const result = `\n  ${lines}\n`
    return addBorder(result, border)
  }

  if (style === 'thin') {
    const thin: Record<string, string[]> = {
      'A': ['/\\', '/__\\'], 'B': ['|_)', '|_)'], 'C': ['/ ', '\\ '],
    }
    const rows = [0, 1].map(row =>
      upper.split('').map(c => {
        if (c === ' ') return '  '
        return (thin[c] ?? ['--', '--'])[row] || '--'
      }).join(' ')
    )
    return addBorder('\n' + rows.map(r => '  ' + r).join('\n') + '\n', border)
  }

  // block / shadow
  const ROWS = 5
  const rows: string[] = []
  for (let row = 0; row < ROWS; row++) {
    const line = upper.split('').map(c => {
      const charData = chars[c] ?? chars[' ']
      if (style === 'shadow') {
        return (charData[row] ?? '      ').replace(/█/g, '▓')
      }
      return charData[row] ?? '      '
    }).join(' ')
    rows.push('  ' + line)
  }

  return addBorder('\n' + rows.join('\n') + '\n', border)
}

function addBorder(art: string, border: string): string {
  if (border === 'none') return art
  const lines = art.split('\n').filter(Boolean)
  const maxLen = Math.max(...lines.map(l => l.length))
  const padded = lines.map(l => l.padEnd(maxLen))

  const chars = {
    box: { tl: '┌', tr: '┐', bl: '└', br: '┘', h: '─', v: '│' },
    double: { tl: '╔', tr: '╗', bl: '╚', br: '╝', h: '═', v: '║' },
    star: { tl: '*', tr: '*', bl: '*', br: '*', h: '*', v: '*' },
    hash: { tl: '#', tr: '#', bl: '#', br: '#', h: '#', v: '#' },
  }[border] ?? { tl: '┌', tr: '┐', bl: '└', br: '┘', h: '─', v: '│' }

  const top = chars.tl + chars.h.repeat(maxLen + 2) + chars.tr
  const bot = chars.bl + chars.h.repeat(maxLen + 2) + chars.br
  const mid = padded.map(l => chars.v + ' ' + l + ' ' + chars.v)
  return '\n' + [top, ...mid, bot].join('\n') + '\n'
}

const EXAMPLES = ['HELLO', 'LOVE', '2024', 'FREE', 'HELLO WORLD']

export default function AsciiArt() {
  const { lang } = useLang()
  const tx = T[lang]

  const [input, setInput] = useState('HELLO')
  const [style, setStyle] = useState('block')
  const [border, setBorder] = useState('none')
  const [copied, setCopied] = useState(false)

  const output = input.trim() ? generateAscii(input, style, border) : ''

  const copy = async () => {
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const download = () => {
    const blob = new Blob([output], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `ascii_art_${Date.now()}.txt`
    a.click(); URL.revokeObjectURL(url)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-mono mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
          Free Tool
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-3 tracking-tight">{tx.title}</h1>
        <p className="text-slate-300 text-base max-w-lg mx-auto">{tx.desc}</p>
      </div>

      {/* 입력 */}
      <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-5 mb-5">
        <label className="text-xs text-slate-400 mb-2 block font-medium">{tx.input} (최대 20자)</label>
        <input value={input} onChange={e => setInput(e.target.value.slice(0, 20))}
          placeholder={tx.inputPlaceholder}
          className="w-full bg-[#0f1117] border border-surface-border rounded-xl px-4 py-3 text-lg text-slate-200 placeholder-slate-600 focus:outline-none focus:border-brand-500/50 transition-all font-mono" />
        <div className="flex flex-wrap gap-1.5 mt-2">
          {EXAMPLES.map(ex => (
            <button key={ex} onClick={() => setInput(ex)}
              className="text-xs px-2.5 py-1 rounded border border-surface-border text-slate-400 hover:text-brand-400 hover:border-brand-500/40 transition-all">
              {ex}
            </button>
          ))}
        </div>
      </div>

      {/* 스타일 & 테두리 */}
      <div className="grid md:grid-cols-2 gap-4 mb-5">
        <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4">
          <p className="text-xs text-slate-400 mb-2 font-medium">{tx.style}</p>
          <div className="flex flex-wrap gap-1.5">
            {STYLES.map(s => (
              <button key={s.key} onClick={() => setStyle(s.key)}
                className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${style === s.key ? 'bg-brand-500 border-brand-500 text-white font-bold' : 'border-surface-border text-slate-300 hover:border-brand-500/40 bg-[#0f1117]'}`}>
                {lang === 'ko' ? s.label : s.labelEn}
              </button>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4">
          <p className="text-xs text-slate-400 mb-2 font-medium">{tx.border}</p>
          <div className="flex flex-wrap gap-1.5">
            {BORDERS.map(b => (
              <button key={b.key} onClick={() => setBorder(b.key)}
                className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${border === b.key ? 'bg-brand-500 border-brand-500 text-white font-bold' : 'border-surface-border text-slate-300 hover:border-brand-500/40 bg-[#0f1117]'}`}>
                {lang === 'ko' ? b.label : b.labelEn}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 결과 */}
      <div className="rounded-xl border border-surface-border bg-[#1a1d27] overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-surface-border">
          <span className="text-sm font-medium text-slate-200">{tx.preview}</span>
          <div className="flex gap-2">
            <button onClick={copy} className={`text-xs px-3 py-1.5 rounded-lg border flex items-center gap-1 transition-all ${copied ? 'bg-brand-500/20 border-brand-500/40 text-brand-400' : 'border-surface-border text-slate-300 hover:border-brand-500/40'}`}>
              {copied ? <CheckCheck size={12} /> : <Copy size={12} />} {copied ? tx.copied : tx.copy}
            </button>
            <button onClick={download} className="text-xs px-3 py-1.5 rounded-lg border border-brand-500/30 bg-brand-500/10 text-brand-400 hover:bg-brand-500/20 transition-all flex items-center gap-1">
              <Download size={12} /> {tx.download}
            </button>
          </div>
        </div>
        <pre className="px-4 py-4 text-sm text-brand-300 font-mono overflow-x-auto leading-relaxed whitespace-pre bg-[#0f1117]">
          {output || (lang === 'ko' ? '텍스트를 입력하면 ASCII 아트가 생성됩니다' : 'Enter text above to generate ASCII art')}
        </pre>
      </div>

      <ToolFooter
        toolName={lang === 'ko' ? 'ASCII 아트 생성기' : 'ASCII Art Generator'}
        toolUrl="https://keyword-mixer.vercel.app/ascii-art"
        description={tx.desc}
        howToUse={lang === 'ko' ? [
          { step: '텍스트 입력', desc: '변환할 텍스트를 입력하세요. 최대 20자, 영문/숫자를 지원합니다.' },
          { step: '스타일 선택', desc: '블록체, 심플, 그림자, 슬림 중 원하는 스타일을 선택하세요.' },
          { step: '테두리 선택', desc: '없음, 박스, 이중선, 별표, 해시 테두리를 선택할 수 있습니다.' },
          { step: '복사 또는 저장', desc: '복사 버튼으로 클립보드에 복사하거나 txt 파일로 저장하세요.' },
        ] : [
          { step: 'Enter text', desc: 'Type text to convert. Max 20 characters, supports letters and numbers.' },
          { step: 'Choose style', desc: 'Select from Block, Simple, Shadow, or Thin style.' },
          { step: 'Add border', desc: 'Optionally add Box, Double, Star, or Hash borders.' },
          { step: 'Copy or save', desc: 'Copy to clipboard or download as a .txt file.' },
        ]}
        whyUse={lang === 'ko' ? [
          { title: '4가지 스타일', desc: '블록체부터 슬림체까지 다양한 ASCII 폰트 스타일을 즉시 적용할 수 있습니다.' },
          { title: '5가지 테두리', desc: '박스, 이중선, 별표 등 다양한 테두리 효과로 꾸밀 수 있습니다.' },
          { title: 'TXT 저장', desc: '생성된 ASCII 아트를 .txt 파일로 저장해 언제든지 활용하세요.' },
          { title: '이메일/터미널 활용', desc: '이메일 서명, GitHub README, 터미널 배너 등에 활용할 수 있습니다.' },
        ] : [
          { title: '4 font styles', desc: 'Instantly switch between Block, Simple, Shadow, and Thin styles.' },
          { title: '5 border types', desc: 'Decorate with Box, Double, Star, or Hash borders.' },
          { title: 'TXT download', desc: 'Save ASCII art as .txt files for later use.' },
          { title: 'Email & terminal use', desc: 'Perfect for email signatures, GitHub READMEs, and terminal banners.' },
        ]}
        faqs={lang === 'ko' ? [
          { q: 'ASCII 아트란?', a: 'ASCII 문자(키보드로 입력 가능한 문자)를 사용해 그림이나 텍스트를 표현하는 예술 형식입니다. 1960년대부터 사용되어 왔습니다.' },
          { q: '한글도 지원하나요?', a: '현재는 영문자(A-Z), 숫자(0-9), 일부 특수문자를 지원합니다. 한글 ASCII 아트는 기술적 제한으로 지원이 어렵습니다.' },
          { q: 'GitHub README에 어떻게 사용하나요?', a: '코드 블록(```)으로 감싸서 마크다운에 붙여넣으면 됩니다. 등폭 폰트(monospace)에서 가장 잘 보입니다.' },
          { q: '이메일 서명에 사용할 수 있나요?', a: '등폭 폰트를 지원하는 이메일 클라이언트에서만 정상 표시됩니다. Gmail, Outlook에서 텍스트 서명으로 사용 가능합니다.' },
        ] : [
          { q: 'What is ASCII art?', a: 'ASCII art uses keyboard characters to create images and text designs. It has been around since the 1960s.' },
          { q: 'Does it support non-English characters?', a: 'Currently supports A-Z letters, 0-9 numbers, and some special characters. Unicode/Korean characters have technical limitations.' },
          { q: 'How to use in GitHub README?', a: 'Wrap in a code block (```) in your markdown file. Best viewed in monospace fonts.' },
          { q: 'Can I use it in email signatures?', a: 'Only works in email clients that support monospace fonts. Works as text signatures in Gmail and Outlook.' },
        ]}
        keywords="ASCII 아트 생성기 · ASCII art generator · 텍스트 아트 · text art · ASCII text · 아스키 아트 · ASCII font · text to ASCII · ASCII banner · ASCII art maker · free ASCII art generator · terminal art"
      />
    </div>
  )
}
