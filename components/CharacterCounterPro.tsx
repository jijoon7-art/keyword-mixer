
'use client'
import { useState, useMemo } from 'react'
import { Copy, CheckCheck } from 'lucide-react'
import { useLang } from './LangContext'
import ToolFooter from './ToolFooter'

const T = {
  ko: { title: '글자수 세기 Pro', desc: '글자수·단어수·문장수·읽기시간·SNS 한도 체크. 블로그·SNS·레포트 작성에 필수.' },
  en: { title: 'Character Counter Pro', desc: 'Count chars, words, sentences, reading time, and SNS limits. Essential for blogs, social media, and reports.' }
}

const SNS_LIMITS = [
  { name: "Twitter/X", limit: 280, color: "blue" },
  { name: "Instagram", limit: 2200, color: "purple" },
  { name: "Facebook", limit: 63206, color: "blue" },
  { name: "LinkedIn", limit: 3000, color: "blue" },
  { name: "YouTube", limit: 5000, color: "red" },
  { name: "Kakao Story", limit: 2000, color: "yellow" },
]

export default function CharacterCounterPro() {
  const { lang } = useLang()
  const tx = T[lang]
  const [text, setText] = useState(lang === "ko" ? "안녕하세요! 이 도구는 글자수를 세어주는 유용한 도구입니다. 블로그, SNS, 레포트 작성 시 활용해 보세요." : "Hello! This tool counts characters and words. Great for blogs, social media, and reports.")
  const [copied, setCopied] = useState<string|null>(null)
  const copy = async (t: string, k: string) => { await navigator.clipboard.writeText(t); setCopied(k); setTimeout(() => setCopied(null),1500) }

  const stats = useMemo(() => {
    const chars = text.length
    const charsNoSpace = text.replace(/\s/g, "").length
    const words = text.trim() ? text.trim().split(/\s+/).length : 0
    const sentences = text.split(/[.!?。！？]+/).filter(s => s.trim()).length
    const paragraphs = text.split(/\n\n+/).filter(p => p.trim()).length
    const bytes = new Blob([text]).size
    const readingTime = Math.max(1, Math.ceil(words / 200))
    const koreanChars = (text.match(/[가-힣]/g) ?? []).length
    const englishChars = (text.match(/[a-zA-Z]/g) ?? []).length
    const numbers = (text.match(/[0-9]/g) ?? []).length
    const spaces = (text.match(/\s/g) ?? []).length
    return { chars, charsNoSpace, words, sentences, paragraphs, bytes, readingTime, koreanChars, englishChars, numbers, spaces }
  }, [text])

  const COLOR_MAP: Record<string, string> = {
    blue: "text-blue-400", purple: "text-purple-400", red: "text-red-400",
    yellow: "text-yellow-400", green: "text-brand-400"
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-mono mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />Free Tool
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-3">{tx.title}</h1>
        <p className="text-slate-300 text-base max-w-xl mx-auto">{tx.desc}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <div className="flex flex-col gap-3">
          <div className="rounded-xl border border-surface-border bg-[#1a1d27] overflow-hidden flex-1">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-surface-border">
              <span className="text-xs text-slate-400 font-medium">{lang==="ko"?"텍스트 입력":"Enter Text"}</span>
              <button onClick={() => setText("")} className="text-xs text-slate-500 hover:text-red-400 transition-all">{lang==="ko"?"지우기":"Clear"}</button>
            </div>
            <textarea value={text} onChange={e => setText(e.target.value)} rows={14}
              placeholder={lang==="ko"?"여기에 텍스트를 입력하세요...":"Enter your text here..."}
              className="w-full bg-transparent px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none resize-none leading-relaxed" />
          </div>
          <button onClick={() => copy(text, "text")} className={`text-xs px-4 py-2 rounded-lg border flex items-center gap-1.5 justify-center transition-all ${copied==="text"?"bg-brand-500/20 border-brand-500/40 text-brand-400":"border-surface-border text-slate-300 hover:border-brand-500/40"}`}>
            {copied==="text"?<CheckCheck size={12}/>:<Copy size={12}/>} {lang==="ko"?"텍스트 복사":"Copy Text"}
          </button>
        </div>

        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-2">
            {[
              {label:lang==="ko"?"글자수":"Characters", val:stats.chars},
              {label:lang==="ko"?"공백 제외":"Without Spaces", val:stats.charsNoSpace},
              {label:lang==="ko"?"단어수":"Words", val:stats.words},
              {label:lang==="ko"?"문장수":"Sentences", val:stats.sentences},
              {label:lang==="ko"?"단락수":"Paragraphs", val:stats.paragraphs},
              {label:lang==="ko"?"바이트":"Bytes", val:stats.bytes},
              {label:lang==="ko"?`읽기 시간 (~200단어/분)`:"Reading Time (~200wpm)", val:`${stats.readingTime}${lang==="ko"?"분":"min"}`},
              {label:lang==="ko"?"공백":"Spaces", val:stats.spaces},
            ].map(s => (
              <div key={s.label} className="rounded-xl border border-surface-border bg-[#1a1d27] p-3 text-center">
                <p className="text-xl font-bold text-brand-400 font-mono">{typeof s.val === "number" ? s.val.toLocaleString() : s.val}</p>
                <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4">
            <p className="text-xs text-slate-400 font-medium mb-2">{lang==="ko"?"문자 분류":"Character Types"}</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                [lang==="ko"?"한글":"Korean", stats.koreanChars],
                [lang==="ko"?"영문":"English", stats.englishChars],
                [lang==="ko"?"숫자":"Numbers", stats.numbers],
                [lang==="ko"?"기타":"Other", stats.charsNoSpace - stats.koreanChars - stats.englishChars - stats.numbers],
              ].map(([l,v]) => (
                <div key={l as string} className="flex justify-between px-2 py-1.5 rounded bg-[#0f1117] border border-surface-border">
                  <span className="text-slate-400">{l as string}</span><span className="text-slate-200 font-mono">{v as number}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4">
            <p className="text-xs text-slate-400 font-medium mb-2">{lang==="ko"?"SNS 글자수 한도":"SNS Character Limits"}</p>
            <div className="flex flex-col gap-2">
              {SNS_LIMITS.map(s => {
                const pct = Math.min(100, (stats.chars / s.limit) * 100)
                const over = stats.chars > s.limit
                return (
                  <div key={s.name}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">{s.name}</span>
                      <span className={over ? "text-red-400 font-bold" : `${COLOR_MAP[s.color]} font-mono`}>
                        {stats.chars}/{s.limit} {over ? (lang==="ko"?"초과!":"over!") : ""}
                      </span>
                    </div>
                    <div className="h-1.5 bg-surface-border rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all ${over ? "bg-red-500" : "bg-brand-500"}`} style={{width:`${pct}%`}} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      <ToolFooter
        toolName={lang==="ko"?"글자수 세기 Pro":"Character Counter Pro"}
        toolUrl="https://keyword-mixer.vercel.app/character-counter-pro"
        description={tx.desc}
        howToUse={lang==="ko"?[
          {step:"텍스트 입력", desc:"왼쪽 입력창에 글자수를 세고 싶은 텍스트를 입력하세요."},
          {step:"통계 확인", desc:"글자수, 단어수, 문장수, 읽기 시간이 실시간으로 계산됩니다."},
          {step:"SNS 한도 확인", desc:"트위터, 인스타그램 등 SNS별 글자수 한도 달성률을 확인하세요."},
          {step:"복사", desc:"텍스트 복사 버튼으로 내용을 클립보드에 복사하세요."},
        ]:[
          {step:"Enter text", desc:"Type or paste text in the left input area."},
          {step:"View stats", desc:"Characters, words, sentences, reading time update in real-time."},
          {step:"Check SNS limits", desc:"See progress bars for Twitter, Instagram and other platforms."},
          {step:"Copy", desc:"Use copy button to save text to clipboard."},
        ]}
        whyUse={lang==="ko"?[
          {title:"실시간 11가지 통계", desc:"글자수, 단어수, 문장수, 단락, 바이트, 읽기 시간 등을 실시간 계산합니다."},
          {title:"SNS 6개 플랫폼 한도", desc:"트위터, 인스타그램, 페이스북, 링크드인, 유튜브, 카카오스토리 한도를 한눈에 확인합니다."},
          {title:"문자 분류", desc:"한글, 영문, 숫자, 기타로 문자를 분류해 상세히 분석합니다."},
          {title:"바이트 계산", desc:"한글 등 멀티바이트 문자의 실제 파일 크기를 계산합니다."},
        ]:[
          {title:"11 real-time stats", desc:"Characters, words, sentences, paragraphs, bytes, reading time all live."},
          {title:"6 SNS platform limits", desc:"Twitter, Instagram, Facebook, LinkedIn, YouTube, Kakao Story limits at a glance."},
          {title:"Character type analysis", desc:"Detailed breakdown of Korean, English, numbers, and other characters."},
          {title:"Byte count", desc:"Calculates actual file size for multibyte characters like Korean."},
        ]}
        faqs={lang==="ko"?[
          {q:"글자수와 바이트 수가 다른 이유는?", a:"영문은 1글자=1바이트이지만 한글은 1글자=2~3바이트입니다. 데이터베이스나 API에서 바이트 제한이 있을 때 중요합니다."},
          {q:"트위터 글자수 제한은?", a:"2023년 기준 유료 구독자(Twitter Blue)는 최대 25,000자, 일반 사용자는 280자입니다."},
          {q:"읽기 시간 계산 기준은?", a:"일반 성인 평균 독서 속도인 200~250단어/분을 기준으로 계산합니다."},
          {q:"인스타그램 해시태그는 글자수에 포함되나요?", a:"네, 인스타그램 캡션의 총 글자수 한도(2,200자)에 해시태그도 포함됩니다."},
        ]:[
          {q:"Why are character count and byte count different?", a:"English = 1 char/byte, Korean = 2-3 bytes/char. Important when databases or APIs have byte limits."},
          {q:"Twitter character limit?", a:"280 characters for regular users. Twitter Blue subscribers get up to 25,000 characters."},
          {q:"Reading time calculation basis?", a:"Based on average adult reading speed of 200-250 words per minute."},
          {q:"Do Instagram hashtags count toward limit?", a:"Yes, hashtags count toward the 2,200 character limit for Instagram captions."},
        ]}
        keywords="글자수 세기 · 글자수 계산기 · 단어수 세기 · 문자수 카운터 · SNS 글자수 · 트위터 글자수 · character counter · word count · character count tool · SNS character limit · Twitter word count"
      />
    </div>
  )
}
