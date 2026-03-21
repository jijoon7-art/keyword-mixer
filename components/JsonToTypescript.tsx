'use client'

import { useState } from 'react'
import { Copy, CheckCheck, Download } from 'lucide-react'
import { useLang } from './LangContext'
import ToolFooter from './ToolFooter'

const T = {
  ko: {
    title: 'JSON → TypeScript 인터페이스 생성기',
    desc: 'JSON을 TypeScript 인터페이스로 즉시 변환. 중첩 객체, 배열, 옵셔널 타입 자동 생성.',
    input: 'JSON 입력',
    output: 'TypeScript 결과',
    copy: '복사',
    copied: '복사됨',
    download: '저장',
    sample: '샘플',
    rootName: '루트 인터페이스 이름',
    options: '옵션',
    optional: '옵셔널 타입 (? 추가)',
    readonly: 'readonly 추가',
    semicolon: '세미콜론 사용',
  },
  en: {
    title: 'JSON to TypeScript Interface Generator',
    desc: 'Convert JSON to TypeScript interfaces instantly. Auto-generates nested objects, arrays, and optional types.',
    input: 'JSON Input',
    output: 'TypeScript Output',
    copy: 'Copy',
    copied: 'Copied!',
    download: 'Save',
    sample: 'Sample',
    rootName: 'Root Interface Name',
    options: 'Options',
    optional: 'Optional types (add ?)',
    readonly: 'Add readonly',
    semicolon: 'Use semicolons',
  }
}

const SAMPLE_JSON = `{
  "user": {
    "id": 1,
    "name": "홍길동",
    "email": "hong@example.com",
    "age": 30,
    "isActive": true,
    "tags": ["developer", "designer"],
    "address": {
      "city": "Seoul",
      "zip": "12345"
    },
    "scores": [95, 87, 92],
    "metadata": null
  }
}`

function getType(value: unknown, optional: boolean, readonly: boolean, sem: string): string {
  if (value === null) return 'null'
  if (Array.isArray(value)) {
    if (value.length === 0) return 'unknown[]'
    const types = Array.from(new Set(value.map(v => getType(v, optional, readonly, sem))))
    return types.length === 1 ? `${types[0]}[]` : `(${types.join(' | ')})[]`
  }
  if (typeof value === 'object') return 'object' // handled separately
  return typeof value
}

function generateInterface(obj: Record<string, unknown>, name: string, optional: boolean, readonly: boolean, semi: boolean, interfaces: Map<string, string>): string {
  const sep = semi ? ';' : ''
  const ro = readonly ? 'readonly ' : ''
  const lines: string[] = [`export interface ${name} {`]

  for (const [key, val] of Object.entries(obj)) {
    const opt = optional ? '?' : ''
    if (val !== null && typeof val === 'object' && !Array.isArray(val)) {
      const childName = key.charAt(0).toUpperCase() + key.slice(1)
      generateInterface(val as Record<string, unknown>, childName, optional, readonly, semi, interfaces)
      lines.push(`  ${ro}${key}${opt}: ${childName}${sep}`)
    } else if (Array.isArray(val) && val.length > 0 && val[0] !== null && typeof val[0] === 'object' && !Array.isArray(val[0])) {
      const childName = key.charAt(0).toUpperCase() + key.slice(1) + 'Item'
      generateInterface(val[0] as Record<string, unknown>, childName, optional, readonly, semi, interfaces)
      lines.push(`  ${ro}${key}${opt}: ${childName}[]${sep}`)
    } else {
      lines.push(`  ${ro}${key}${opt}: ${getType(val, optional, readonly, semi)}${sep}`)
    }
  }

  lines.push('}')
  interfaces.set(name, lines.join('\n'))
  return lines.join('\n')
}

export default function JsonToTypescript() {
  const { lang } = useLang()
  const tx = T[lang]
  const [input, setInput] = useState(SAMPLE_JSON)
  const [rootName, setRootName] = useState('Root')
  const [optional, setOptional] = useState(false)
  const [readonly, setReadonly] = useState(false)
  const [semi, setSemi] = useState(true)
  const [copied, setCopied] = useState(false)

  const result = (() => {
    try {
      const parsed = JSON.parse(input)
      if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
        return lang === 'ko' ? '// 루트가 객체여야 합니다' : '// Root must be an object'
      }
      const interfaces = new Map<string, string>()
      generateInterface(parsed, rootName, optional, readonly, semi, interfaces)
      return Array.from(interfaces.values()).reverse().join('\n\n')
    } catch (e) {
      return `// ${lang === 'ko' ? 'JSON 파싱 오류: ' : 'JSON parse error: '}${(e as Error).message}`
    }
  })()

  const copy = async () => { await navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 1500) }
  const download = () => {
    const blob = new Blob([result], { type: 'text/typescript' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = `${rootName.toLowerCase()}.ts`
    a.click(); URL.revokeObjectURL(url)
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-mono mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />Free Developer Tool
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-3">{tx.title}</h1>
        <p className="text-slate-300 text-base max-w-xl mx-auto">{tx.desc}</p>
      </div>

      {/* 옵션 */}
      <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4 mb-5">
        <div className="flex flex-wrap gap-4 items-center">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">{tx.rootName}</label>
            <input value={rootName} onChange={e => setRootName(e.target.value || 'Root')}
              className="bg-[#0f1117] border border-surface-border rounded-lg px-3 py-1.5 text-sm text-slate-200 font-mono focus:outline-none focus:border-brand-500/50 transition-all w-32" />
          </div>
          {[
            { label: tx.optional, val: optional, set: setOptional },
            { label: tx.readonly, val: readonly, set: setReadonly },
            { label: tx.semicolon, val: semi, set: setSemi },
          ].map(opt => (
            <label key={opt.label} className="flex items-center gap-2 cursor-pointer mt-4">
              <div onClick={() => opt.set(!opt.val)} className={`w-10 h-5 rounded-full relative transition-all ${opt.val ? 'bg-brand-500' : 'bg-surface-border'}`}>
                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all shadow ${opt.val ? 'left-5' : 'left-0.5'}`} />
              </div>
              <span className="text-sm text-slate-300">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="rounded-xl border border-surface-border bg-[#1a1d27] overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-surface-border">
            <span className="text-sm font-medium text-slate-200">{tx.input}</span>
            <button onClick={() => setInput(SAMPLE_JSON)} className="text-xs text-slate-500 hover:text-brand-400 transition-all">{tx.sample}</button>
          </div>
          <textarea value={input} onChange={e => setInput(e.target.value)} rows={20}
            className="w-full bg-transparent px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none resize-none font-mono leading-relaxed" />
        </div>

        <div className="rounded-xl border border-surface-border bg-[#1a1d27] overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-surface-border">
            <span className="text-sm font-medium text-slate-200">{tx.output}</span>
            <div className="flex gap-2">
              <button onClick={copy} className={`text-xs px-2.5 py-1.5 rounded-lg border flex items-center gap-1 transition-all ${copied ? 'bg-brand-500/20 border-brand-500/40 text-brand-400' : 'border-surface-border text-slate-300 hover:border-brand-500/40'}`}>
                {copied ? <CheckCheck size={11} /> : <Copy size={11} />} {copied ? tx.copied : tx.copy}
              </button>
              <button onClick={download} className="text-xs px-2.5 py-1.5 rounded-lg border border-brand-500/30 bg-brand-500/10 text-brand-400 hover:bg-brand-500/20 transition-all flex items-center gap-1">
                <Download size={11} /> .ts
              </button>
            </div>
          </div>
          <pre className="px-4 py-3 text-sm text-brand-300 font-mono leading-relaxed overflow-auto max-h-[480px] whitespace-pre-wrap">{result}</pre>
        </div>
      </div>

      <ToolFooter
        toolName={lang === 'ko' ? 'JSON → TypeScript 생성기' : 'JSON to TypeScript Generator'}
        toolUrl="https://keyword-mixer.vercel.app/json-to-typescript"
        description={tx.desc}
        howToUse={lang === 'ko' ? [
          { step: 'JSON 붙여넣기', desc: 'JSON 데이터를 왼쪽 입력창에 붙여넣으세요. 샘플 버튼으로 예시를 확인할 수 있습니다.' },
          { step: '루트 이름 설정', desc: '생성될 최상위 인터페이스 이름을 입력하세요 (기본값: Root).' },
          { step: '옵션 설정', desc: '옵셔널 타입(?), readonly, 세미콜론 사용 여부를 선택하세요.' },
          { step: '복사 또는 저장', desc: '생성된 TypeScript 코드를 복사하거나 .ts 파일로 저장하세요.' },
        ] : [
          { step: 'Paste JSON', desc: 'Paste JSON data into the left panel. Use Sample button for a demo.' },
          { step: 'Set root name', desc: 'Enter the name for the root interface (default: Root).' },
          { step: 'Configure options', desc: 'Toggle optional types (?), readonly, and semicolon preferences.' },
          { step: 'Copy or save', desc: 'Copy generated TypeScript code or save as a .ts file.' },
        ]}
        whyUse={lang === 'ko' ? [
          { title: '중첩 객체 자동 처리', desc: 'JSON의 중첩 객체를 별도 인터페이스로 자동 분리 생성합니다.' },
          { title: '배열 타입 추론', desc: '배열 요소의 타입을 자동으로 추론해 적절한 타입을 생성합니다.' },
          { title: '옵션 커스터마이징', desc: '옵셔널(?), readonly, 세미콜론 등 팀 코딩 스타일에 맞게 설정하세요.' },
          { title: '.ts 파일 저장', desc: '생성된 인터페이스를 바로 .ts 파일로 다운로드할 수 있습니다.' },
        ] : [
          { title: 'Auto nested objects', desc: 'Automatically splits nested objects into separate interfaces.' },
          { title: 'Array type inference', desc: 'Infers array element types and generates appropriate type annotations.' },
          { title: 'Style customization', desc: 'Configure optional, readonly, and semicolons for your team style.' },
          { title: 'Save as .ts', desc: 'Download generated interfaces directly as a .ts file.' },
        ]}
        faqs={lang === 'ko' ? [
          { q: 'null 값은 어떻게 처리되나요?', a: 'null은 null 타입으로 변환됩니다. 필요 시 옵셔널(?) 옵션을 켜거나 직접 string | null 등으로 수정하세요.' },
          { q: '배열에 여러 타입이 섞여 있으면?', a: '(string | number)[] 형태로 유니온 타입을 생성합니다.' },
          { q: '빈 배열은 어떻게 처리되나요?', a: '빈 배열은 unknown[] 타입으로 생성됩니다. 실제 타입에 맞게 수동으로 수정하세요.' },
          { q: 'API 응답을 TypeScript로 변환하는 방법은?', a: 'API 응답 JSON을 이 도구에 붙여넣으면 자동으로 인터페이스가 생성됩니다. fetch 응답에서 console.log()로 출력 후 복사해서 사용하세요.' },
        ] : [
          { q: 'How are null values handled?', a: 'null becomes the null type. Toggle optional (?) or manually change to string | null as needed.' },
          { q: 'What about arrays with mixed types?', a: 'Creates a union type like (string | number)[].' },
          { q: 'How are empty arrays handled?', a: 'Empty arrays become unknown[]. Update manually to match the actual type.' },
          { q: 'How to convert API responses to TypeScript?', a: 'Paste API response JSON into this tool to auto-generate interfaces. Use console.log() in fetch response to get JSON, then copy and paste here.' },
        ]}
        keywords="JSON TypeScript 변환 · JSON 인터페이스 생성 · JSON to TypeScript · JSON interface generator · TypeScript type generator · JSON schema · 타입스크립트 인터페이스 · JSON type converter · free TypeScript tool"
      />
    </div>
  )
}
