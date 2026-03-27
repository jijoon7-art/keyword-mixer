
'use client'
import { useState } from 'react'
import { Copy, CheckCheck } from 'lucide-react'
import { useLang } from './LangContext'
import ToolFooter from './ToolFooter'

const T = {
  ko: { title: 'JSON 유효성 검사기 / 정렬기', desc: 'JSON 문법 오류를 즉시 검사하고 예쁘게 정렬. 축소·파싱·타입 분석 기능 포함.' },
  en: { title: 'JSON Validator & Formatter', desc: 'Instantly validate JSON syntax and format it beautifully. Includes minify, parse, and type analysis.' }
}

export default function JsonValidator() {
  const { lang } = useLang()
  const tx = T[lang]
  const [input, setInput] = useState('{"name":"홍길동","age":30,"city":"서울","hobbies":["독서","등산"],"active":true}')
  const [indent, setIndent] = useState(2)
  const [copied, setCopied] = useState<string|null>(null)
  const copy = async (t: string, k: string) => { await navigator.clipboard.writeText(t); setCopied(k); setTimeout(() => setCopied(null), 1500) }

  let parsed: any = null
  let error: string | null = null
  let formatted = ""
  let minified = ""
  let typeInfo: {key: string; type: string; value: string}[] = []

  try {
    parsed = JSON.parse(input)
    error = null
    formatted = JSON.stringify(parsed, null, indent)
    minified = JSON.stringify(parsed)
    if (typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)) {
      typeInfo = Object.entries(parsed).map(([k, v]) => ({
        key: k,
        type: Array.isArray(v) ? `array[${(v as any[]).length}]` : typeof v,
        value: JSON.stringify(v).slice(0, 40) + (JSON.stringify(v).length > 40 ? "..." : "")
      }))
    }
  } catch (e: any) {
    error = e.message
    formatted = ""
    minified = ""
  }

  const isValid = error === null && input.trim() !== ""

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-mono mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />Developer Tool
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-3">{tx.title}</h1>
        <p className="text-slate-300 text-base max-w-xl mx-auto">{tx.desc}</p>
      </div>

      <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-3 mb-4 flex flex-wrap gap-3 items-center">
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-bold ${isValid ? "border-brand-500/40 bg-brand-500/10 text-brand-400" : input.trim() ? "border-red-500/40 bg-red-500/10 text-red-400" : "border-surface-border text-slate-500"}`}>
          {isValid ? "✓ Valid JSON" : input.trim() ? "✗ Invalid JSON" : "— Empty"}
        </div>
        <label className="flex items-center gap-1.5 text-xs text-slate-400">
          {lang==="ko"?"들여쓰기:":"Indent:"}
          <select value={indent} onChange={e => setIndent(+e.target.value)} className="bg-[#0f1117] border border-surface-border rounded px-2 py-1 text-slate-200 text-xs focus:outline-none">
            {[2,4,8].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </label>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div className="rounded-xl border border-surface-border bg-[#1a1d27] overflow-hidden">
          <div className="flex justify-between px-4 py-2.5 border-b border-surface-border bg-[#0f1117]">
            <span className="text-xs text-slate-400 font-medium">{lang==="ko"?"JSON 입력":"JSON Input"}</span>
            <button onClick={() => setInput("")} className="text-xs text-slate-500 hover:text-red-400 transition-all">{lang==="ko"?"지우기":"Clear"}</button>
          </div>
          <textarea value={input} onChange={e => setInput(e.target.value)} rows={12} className="w-full bg-transparent px-4 py-3 text-sm text-slate-200 font-mono focus:outline-none resize-none leading-relaxed" placeholder="JSON을 입력하세요..." />
          {error && <div className="px-4 py-2 border-t border-red-500/30 bg-red-500/10 text-xs text-red-400 font-mono">{error}</div>}
        </div>

        <div className="flex flex-col gap-3">
          <div className="rounded-xl border border-surface-border bg-[#1a1d27] overflow-hidden flex-1">
            <div className="flex justify-between px-4 py-2.5 border-b border-surface-border bg-[#0f1117]">
              <span className="text-xs text-slate-400 font-medium">{lang==="ko"?"정렬된 JSON":"Formatted JSON"}</span>
              <button onClick={() => copy(formatted, "fmt")} className={`text-xs px-2 py-1 rounded border flex items-center gap-1 transition-all ${copied==="fmt"?"bg-brand-500/20 border-brand-500/40 text-brand-400":"border-surface-border text-slate-300 hover:border-brand-500/40"}`}>
                {copied==="fmt"?<CheckCheck size={10}/>:<Copy size={10}/>}
              </button>
            </div>
            <textarea readOnly value={formatted} rows={8} className="w-full bg-transparent px-4 py-3 text-xs text-slate-200 font-mono focus:outline-none resize-none leading-relaxed" />
          </div>
          <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-3">
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-400">{lang==="ko"?"축소된 JSON":"Minified JSON"}</span>
              <button onClick={() => copy(minified,"min")} className={`text-xs px-2 py-1 rounded border flex items-center gap-1 transition-all ${copied==="min"?"bg-brand-500/20 border-brand-500/40 text-brand-400":"border-surface-border text-slate-300 hover:border-brand-500/40"}`}>
                {copied==="min"?<CheckCheck size={10}/>:<Copy size={10}/>} {lang==="ko"?"복사":"Copy"}
              </button>
            </div>
            <p className="text-xs text-slate-500 font-mono mt-1 truncate">{minified || "—"}</p>
          </div>
        </div>
      </div>

      {typeInfo.length > 0 && (
        <div className="rounded-xl border border-surface-border bg-[#1a1d27] overflow-hidden">
          <div className="px-4 py-2.5 border-b border-surface-border bg-[#0f1117]">
            <p className="text-xs text-slate-400 font-medium">{lang==="ko"?"타입 분석":"Type Analysis"}</p>
          </div>
          <div className="grid grid-cols-3 divide-x divide-surface-border text-xs px-4 py-2 text-slate-500 bg-[#0f1117] border-b border-surface-border">
            <span>{lang==="ko"?"키":"Key"}</span><span className="px-4">{lang==="ko"?"타입":"Type"}</span><span className="px-4">{lang==="ko"?"값":"Value"}</span>
          </div>
          <div className="divide-y divide-surface-border max-h-48 overflow-y-auto">
            {typeInfo.map(t => (
              <div key={t.key} className="grid grid-cols-3 divide-x divide-surface-border text-xs px-4 py-2 hover:bg-surface-hover/10">
                <span className="text-brand-400 font-mono">{t.key}</span>
                <span className="px-4 text-yellow-400">{t.type}</span>
                <span className="px-4 text-slate-300 font-mono truncate">{t.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <ToolFooter
        toolName={lang==="ko"?"JSON 유효성 검사기":"JSON Validator"}
        toolUrl="https://keyword-mixer.vercel.app/json-validator"
        description={tx.desc}
        howToUse={lang==="ko"?[{step:"JSON 입력",desc:"유효성 검사할 JSON을 붙여넣으세요."},{step:"유효성 확인",desc:"상단에 Valid/Invalid 결과가 즉시 표시됩니다."},{step:"정렬된 JSON 확인",desc:"오른쪽에 들여쓰기가 적용된 정렬된 JSON이 표시됩니다."},{step:"복사하여 사용",desc:"정렬된 또는 축소된 JSON을 복사해 사용하세요."}]:[{step:"Enter JSON",desc:"Paste the JSON to validate."},{step:"Check validity",desc:"Valid/Invalid result shows instantly at the top."},{step:"View formatted JSON",desc:"See indented, formatted JSON on the right."},{step:"Copy & use",desc:"Copy formatted or minified JSON for your use."}]}
        whyUse={lang==="ko"?[{title:"즉시 유효성 검사",desc:"JSON 입력 즉시 문법 오류를 감지하고 위치를 알려줍니다."},{title:"타입 분석",desc:"각 키의 데이터 타입(string, number, array 등)을 분석합니다."},{title:"정렬+축소 동시 지원",desc:"예쁘게 정렬된 버전과 한 줄로 축소된 버전을 모두 제공합니다."},{title:"들여쓰기 설정",desc:"2칸, 4칸, 8칸 들여쓰기를 선택할 수 있습니다."}]:[{title:"Instant validation",desc:"Detects JSON syntax errors immediately as you type."},{title:"Type analysis",desc:"Analyzes data types (string, number, array, etc.) for each key."},{title:"Format + minify",desc:"Provides both beautifully formatted and single-line minified versions."},{title:"Indent settings",desc:"Choose 2, 4, or 8-space indentation."}]}
        faqs={lang==="ko"?[{q:"JSON 유효성 오류 원인?",a:"가장 흔한 원인: 따옴표 누락(문자열은 반드시 큰따옴표), 마지막 항목 뒤 콤마, 중괄호/대괄호 불일치, 특수문자 이스케이프 누락."},{q:"JSON과 JavaScript 객체 차이?",a:"JSON은 키에 반드시 큰따옴표를 사용해야 합니다. JavaScript 객체는 작은따옴표나 따옴표 없이도 키를 사용할 수 있습니다."},{q:"JSON 축소는 언제 사용하나요?",a:"API 전송이나 파일 크기를 줄일 때 축소된 JSON을 사용합니다. 공백 제거로 파일 크기를 줄일 수 있습니다."},{q:"타입 분석은 어떤 타입을 지원하나요?",a:"string, number, boolean, null, array(크기), object를 분석합니다."}]:[{q:"Common JSON validation errors?",a:"Most common: missing quotes (strings must use double quotes), trailing commas, mismatched brackets, unescaped special characters."},{q:"JSON vs JavaScript object?",a:"JSON requires double quotes around keys. JavaScript objects can use single quotes or no quotes for keys."},{q:"When to use minified JSON?",a:"Use minified JSON for API transfers or reducing file size. Removing whitespace reduces file size."},{q:"Which types does type analysis support?",a:"Analyzes string, number, boolean, null, array (with size), and object types."}]}
        keywords="JSON 유효성 검사 · JSON 정렬기 · JSON 검증 · JSON formatter · JSON validator · JSON beautifier · JSON minifier · JSON parser · validate JSON online"
      />
    </div>
  )
}
