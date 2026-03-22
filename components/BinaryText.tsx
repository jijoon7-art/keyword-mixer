
'use client'
import { useState } from 'react'
import { Copy, CheckCheck } from 'lucide-react'
import { useLang } from './LangContext'
import ToolFooter from './ToolFooter'

const T = {
  ko: { title: '이진수 텍스트 변환기', desc: '텍스트를 이진수(01010)로, 이진수를 텍스트로 즉시 변환. ASCII 코드 방식.' },
  en: { title: 'Binary Text Converter', desc: 'Convert text to binary (01010) and binary back to text instantly using ASCII encoding.' }
}

function textToBinary(text: string): string {
  return text.split("").map(c => c.charCodeAt(0).toString(2).padStart(8,"0")).join(" ")
}

function binaryToText(bin: string): string {
  try {
    return bin.trim().split(/\s+/).map(b => String.fromCharCode(parseInt(b, 2))).join("")
  } catch { return "" }
}

export default function BinaryText() {
  const { lang } = useLang()
  const tx = T[lang]
  const [mode, setMode] = useState<"encode"|"decode">("encode")
  const [text, setText] = useState("Hello")
  const [binary, setBinary] = useState("")
  const [copied, setCopied] = useState<string|null>(null)
  const copy = async (t: string, k: string) => { await navigator.clipboard.writeText(t); setCopied(k); setTimeout(() => setCopied(null),1500) }

  const encoded = textToBinary(text)
  const decoded = binaryToText(binary)

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-mono mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />Free Developer Tool
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-3">{tx.title}</h1>
        <p className="text-slate-300 text-base max-w-xl mx-auto">{tx.desc}</p>
      </div>

      <div className="flex rounded-xl border border-surface-border overflow-hidden mb-5">
        {[["encode", lang === "ko" ? "텍스트 → 이진수" : "Text → Binary"], ["decode", lang === "ko" ? "이진수 → 텍스트" : "Binary → Text"]].map(([v,l]) => (
          <button key={v} onClick={() => setMode(v as "encode"|"decode")}
            className={`flex-1 py-2.5 text-sm font-medium transition-all ${mode===v?"bg-brand-500 text-white font-bold":"bg-[#1a1d27] text-slate-300"}`}>{l}</button>
        ))}
      </div>

      {mode === "encode" && (
        <div className="flex flex-col gap-4">
          <div className="rounded-xl border border-surface-border bg-[#1a1d27] overflow-hidden">
            <div className="px-4 py-2.5 border-b border-surface-border"><span className="text-xs text-slate-400 font-medium">{lang==="ko"?"텍스트 입력":"Enter Text"}</span></div>
            <textarea value={text} onChange={e => setText(e.target.value)} rows={4} placeholder={lang==="ko"?"변환할 텍스트...":"Text to convert..."}
              className="w-full bg-transparent px-4 py-3 text-slate-200 text-sm focus:outline-none resize-none" />
          </div>
          <div className="rounded-xl border border-surface-border bg-[#1a1d27] overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-surface-border">
              <span className="text-xs text-slate-400 font-medium">{lang==="ko"?"이진수 결과":"Binary Result"}</span>
              <button onClick={() => copy(encoded, "enc")} className={`text-xs px-3 py-1.5 rounded-lg border flex items-center gap-1 transition-all ${copied==="enc"?"bg-brand-500/20 border-brand-500/40 text-brand-400":"border-surface-border text-slate-300 hover:border-brand-500/40"}`}>
                {copied==="enc"?<CheckCheck size={12}/>:<Copy size={12}/>} {lang==="ko"?"복사":"Copy"}
              </button>
            </div>
            <div className="px-4 py-4 font-mono text-xs text-brand-400 leading-loose break-all">{encoded || <span className="text-slate-600">{lang==="ko"?"결과가 여기에 표시됩니다":"Result appears here"}</span>}</div>
          </div>
        </div>
      )}

      {mode === "decode" && (
        <div className="flex flex-col gap-4">
          <div className="rounded-xl border border-surface-border bg-[#1a1d27] overflow-hidden">
            <div className="px-4 py-2.5 border-b border-surface-border"><span className="text-xs text-slate-400 font-medium">{lang==="ko"?"이진수 입력 (공백으로 구분)":"Enter Binary (space-separated)"}</span></div>
            <textarea value={binary} onChange={e => setBinary(e.target.value)} rows={4} placeholder="01001000 01100101 01101100 01101100 01101111"
              className="w-full bg-transparent px-4 py-3 text-brand-400 text-xs font-mono focus:outline-none resize-none leading-loose" />
          </div>
          <div className="rounded-xl border border-surface-border bg-[#1a1d27] overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-surface-border">
              <span className="text-xs text-slate-400 font-medium">{lang==="ko"?"텍스트 결과":"Text Result"}</span>
              <button onClick={() => copy(decoded, "dec")} className={`text-xs px-3 py-1.5 rounded-lg border flex items-center gap-1 transition-all ${copied==="dec"?"bg-brand-500/20 border-brand-500/40 text-brand-400":"border-surface-border text-slate-300 hover:border-brand-500/40"}`}>
                {copied==="dec"?<CheckCheck size={12}/>:<Copy size={12}/>} {lang==="ko"?"복사":"Copy"}
              </button>
            </div>
            <p className="px-4 py-4 text-xl font-bold text-slate-200">{decoded || <span className="text-slate-600 text-sm">{lang==="ko"?"텍스트가 여기에 표시됩니다":"Text appears here"}</span>}</p>
          </div>
        </div>
      )}

      <ToolFooter
        toolName={lang==="ko"?"이진수 텍스트 변환기":"Binary Text Converter"}
        toolUrl="https://keyword-mixer.vercel.app/binary-text"
        description={tx.desc}
        howToUse={lang==="ko"?[
          {step:"변환 방향 선택", desc:"텍스트→이진수 또는 이진수→텍스트를 선택하세요."},
          {step:"내용 입력", desc:"변환할 텍스트나 이진수를 입력하세요."},
          {step:"결과 확인", desc:"입력 즉시 변환 결과가 표시됩니다."},
          {step:"복사", desc:"복사 버튼으로 결과를 복사하세요."},
        ]:[
          {step:"Select direction", desc:"Choose text→binary or binary→text."},
          {step:"Enter content", desc:"Type text or binary to convert."},
          {step:"View result", desc:"Result appears instantly."},
          {step:"Copy", desc:"Use copy button to save result."},
        ]}
        whyUse={lang==="ko"?[
          {title:"양방향 변환", desc:"텍스트→이진수, 이진수→텍스트 양방향 지원."},
          {title:"ASCII 인코딩", desc:"표준 ASCII 코드 기반으로 정확하게 변환합니다."},
          {title:"8비트 그룹화", desc:"각 문자를 8비트로 패딩해 읽기 쉽게 표시합니다."},
          {title:"개발자 학습용", desc:"컴퓨터 과학 기초 학습에 활용할 수 있습니다."},
        ]:[
          {title:"Bidirectional", desc:"Both text→binary and binary→text conversion."},
          {title:"ASCII encoding", desc:"Accurate conversion using standard ASCII codes."},
          {title:"8-bit grouping", desc:"Each character padded to 8 bits for readability."},
          {title:"CS learning tool", desc:"Great for computer science fundamentals learning."},
        ]}
        faqs={lang==="ko"?[
          {q:"이진수 변환 원리는?", a:"각 문자를 ASCII 코드(0~127)로 변환 후 8자리 2진수로 표현합니다. 예: A=65=01000001."},
          {q:"한글도 변환 가능한가요?", a:"한글은 유니코드 기반으로 ASCII와 다른 인코딩을 사용해 정확한 변환이 복잡합니다. 이 도구는 영문·숫자·특수문자에 최적화되어 있습니다."},
          {q:"이진수 입력 시 공백이 필요한가요?", a:"네, 각 문자의 이진수를 공백으로 구분해야 합니다. 예: 01001000 01100101"},
          {q:"이진수는 어디에 쓰이나요?", a:"컴퓨터의 모든 데이터는 내부적으로 이진수(0과 1)로 저장됩니다. 프로그래밍, 네트워크, 암호화 등 모든 컴퓨터 과학의 기반입니다."},
        ]:[
          {q:"How does binary conversion work?", a:"Each character is converted to its ASCII code (0-127), then represented as an 8-digit binary number. E.g., A=65=01000001."},
          {q:"Does it support Korean?", a:"Korean uses Unicode-based encoding different from ASCII. This tool is optimized for English, numbers, and symbols."},
          {q:"Are spaces required in binary input?", a:"Yes, each character binary must be space-separated. E.g.: 01001000 01100101"},
          {q:"Where is binary used?", a:"All computer data is stored internally as binary (0s and 1s). Foundation of all programming, networking, and cryptography."},
        ]}
        keywords="이진수 변환기 · 이진수 텍스트 변환 · 텍스트 이진수 · binary text converter · text to binary · binary to text · binary code converter · ASCII binary"
      />
    </div>
  )
}
