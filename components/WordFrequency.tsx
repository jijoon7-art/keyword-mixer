
'use client'
import { useState, useMemo } from 'react'
import { Copy, CheckCheck } from 'lucide-react'
import { useLang } from './LangContext'
import ToolFooter from './ToolFooter'

const T = {
  ko: { title: '단어 빈도 분석기', desc: '텍스트에서 단어 빈도를 분석해 가장 많이 사용된 단어 순위를 제공. SEO 키워드 분석에 활용.' },
  en: { title: 'Word Frequency Analyzer', desc: 'Analyze word frequency in text. Shows most-used words ranked. Great for SEO keyword analysis.' }
}

export default function WordFrequency() {
  const { lang } = useLang()
  const tx = T[lang]
  const [text, setText] = useState(lang === 'ko' ? '안녕하세요. 이 도구는 단어 빈도를 분석합니다. 텍스트를 입력하면 단어 빈도를 분석하여 단어 목록을 보여줍니다. 단어 분석은 SEO에도 유용합니다.' : 'Hello world. This tool analyzes word frequency. Enter text and it analyzes word frequency to show word list. Word analysis is useful for SEO too.')
  const [minLen, setMinLen] = useState(2)
  const [topN, setTopN] = useState(20)
  const [copied, setCopied] = useState<string|null>(null)
  const copy = async (t: string, k: string) => { await navigator.clipboard.writeText(t); setCopied(k); setTimeout(() => setCopied(null), 1500) }

  const STOPWORDS_KO = new Set(['이','그','저','것','수','있','없','하','되','않','등','를','을','의','이','가','은','는','에','에서','로','으로','도','만','이다','입니다','합니다'])
  const STOPWORDS_EN = new Set(['the','a','an','is','are','was','were','be','been','have','has','had','do','does','did','will','would','could','should','may','might','and','or','but','in','on','at','to','for','of','with','by','from','up','about','into','through','as'])

  const analysis = useMemo(() => {
    if (!text.trim()) return []
    const isKorean = /[가-힣]/.test(text)
    const stopwords = isKorean ? STOPWORDS_KO : STOPWORDS_EN
    const words = text
      .toLowerCase()
      .replace(/[^\w가-힣\s]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length >= minLen && !stopwords.has(w) && !/^\d+$/.test(w))

    const freq = new Map<string, number>()
    words.forEach(w => freq.set(w, (freq.get(w) || 0) + 1))
    return Array.from(freq.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, topN)
      .map(([word, count]) => ({ word, count, pct: (count / words.length * 100).toFixed(1) }))
  }, [text, minLen, topN])

  const maxCount = analysis[0]?.count || 1
  const totalWords = text.trim() ? text.toLowerCase().replace(/[^\w가-힣\s]/g, ' ').split(/\s+/).filter(w => w.length >= minLen).length : 0

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
            <div className="flex justify-between px-4 py-2.5 border-b border-surface-border bg-[#0f1117]">
              <span className="text-xs text-slate-400 font-medium">{lang==="ko"?"텍스트 입력":"Input Text"} ({totalWords}{lang==="ko"?" 단어":" words"})</span>
              <button onClick={() => setText("")} className="text-xs text-slate-500 hover:text-red-400 transition-all">{lang==="ko"?"지우기":"Clear"}</button>
            </div>
            <textarea value={text} onChange={e => setText(e.target.value)} rows={12} className="w-full bg-transparent px-4 py-3 text-sm text-slate-200 focus:outline-none resize-none" placeholder={lang==="ko"?"분석할 텍스트를 붙여넣으세요...":"Paste text to analyze..."} />
          </div>
          <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-3">
            <div className="flex gap-4 text-xs">
              <label className="flex items-center gap-1.5 text-slate-400">
                {lang==="ko"?"최소 글자":"Min chars"}:
                <input type="number" min={1} max={10} value={minLen} onChange={e => setMinLen(+e.target.value)} className="w-10 bg-[#0f1117] border border-surface-border rounded px-1 py-0.5 text-slate-200 text-center focus:outline-none"/>
              </label>
              <label className="flex items-center gap-1.5 text-slate-400">
                {lang==="ko"?"상위":"Top"}:
                <select value={topN} onChange={e => setTopN(+e.target.value)} className="bg-[#0f1117] border border-surface-border rounded px-1 py-0.5 text-slate-200 text-xs focus:outline-none">
                  {[10,20,30,50].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </label>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-surface-border bg-[#1a1d27] overflow-hidden">
          <div className="flex justify-between px-4 py-2.5 border-b border-surface-border bg-[#0f1117]">
            <span className="text-xs text-slate-400 font-medium">{lang==="ko"?"단어 빈도 순위":"Word Frequency Ranking"} ({analysis.length})</span>
            <button onClick={() => copy(analysis.map((a,i)=>`${i+1}. ${a.word}: ${a.count}`).join("\n"),"all")} className={`text-xs px-2 py-1 rounded border flex items-center gap-1 transition-all ${copied==="all"?"bg-brand-500/20 border-brand-500/40 text-brand-400":"border-surface-border text-slate-300 hover:border-brand-500/40"}`}>
              {copied==="all"?<CheckCheck size={10}/>:<Copy size={10}/>} {lang==="ko"?"전체":"All"}
            </button>
          </div>
          <div className="max-h-96 overflow-y-auto divide-y divide-surface-border">
            {analysis.map((a, i) => (
              <div key={a.word} className="flex items-center gap-2 px-3 py-2 hover:bg-surface-hover/10 group">
                <span className="text-xs text-slate-600 w-5 flex-shrink-0">{i+1}</span>
                <span className="text-sm font-medium text-slate-200 w-24 flex-shrink-0">{a.word}</span>
                <div className="flex-1 h-2 bg-surface-border rounded-full overflow-hidden">
                  <div className="h-full bg-brand-500/60 rounded-full" style={{width:`${(a.count/maxCount)*100}%`}} />
                </div>
                <span className="text-xs font-mono text-brand-400 w-8 text-right">{a.count}</span>
                <span className="text-xs text-slate-600 w-10 text-right">{a.pct}%</span>
                <button onClick={() => copy(a.word, a.word)} className={`opacity-0 group-hover:opacity-100 p-1 rounded border transition-all ${copied===a.word?"text-brand-400 border-brand-500/40":"border-surface-border text-slate-600 hover:text-brand-400"}`}>
                  {copied===a.word?<CheckCheck size={10}/>:<Copy size={10}/>}
                </button>
              </div>
            ))}
            {analysis.length === 0 && <div className="px-4 py-8 text-center text-slate-500 text-sm">{lang==="ko"?"텍스트를 입력해주세요":"Please enter text"}</div>}
          </div>
        </div>
      </div>
      <ToolFooter
        toolName={lang==="ko"?"단어 빈도 분석기":"Word Frequency Analyzer"}
        toolUrl="https://keyword-mixer.vercel.app/word-frequency"
        description={tx.desc}
        howToUse={lang==="ko"?[{step:"텍스트 입력",desc:"분석할 텍스트를 붙여넣거나 입력하세요."},{step:"옵션 설정",desc:"최소 글자 수와 표시할 상위 단어 수를 설정하세요."},{step:"순위 확인",desc:"단어 빈도 순위가 실시간으로 표시됩니다."},{step:"단어 복사",desc:"각 단어를 클릭하거나 전체 목록을 복사하세요."}]:[{step:"Enter text",desc:"Paste or type text to analyze."},{step:"Set options",desc:"Set minimum character length and top N words."},{step:"View ranking",desc:"Word frequency ranking shows in real-time."},{step:"Copy words",desc:"Click words individually or copy the full list."}]}
        whyUse={lang==="ko"?[{title:"불용어 자동 제거",desc:"한국어/영어 불용어(조사, 관사 등)를 자동으로 제거합니다."},{title:"실시간 분석",desc:"텍스트 입력 즉시 단어 빈도가 계산됩니다."},{title:"바 차트 시각화",desc:"빈도를 바 차트로 시각화해 직관적으로 파악합니다."},{title:"SEO 키워드 활용",desc:"블로그 글의 핵심 키워드 빈도를 분석해 SEO에 활용합니다."}]:[{title:"Stop word removal",desc:"Automatically removes Korean/English stop words."},{title:"Real-time analysis",desc:"Word frequency calculated instantly as you type."},{title:"Bar chart visualization",desc:"Visual bar chart for intuitive frequency comparison."},{title:"SEO keyword use",desc:"Analyze blog post keyword frequency for SEO optimization."}]}
        faqs={lang==="ko"?[{q:"불용어란?",a:"'이','그','것','the','a' 같이 분석에 의미가 없는 일반적인 단어입니다. 이 도구는 한국어와 영어 불용어를 자동으로 제거합니다."},{q:"SEO에 어떻게 활용하나요?",a:"블로그 글에 타겟 키워드가 충분히 사용되었는지 확인하고, 과도하게 반복되는 단어(키워드 스터핑)를 파악하는 데 유용합니다."},{q:"최소 글자 수 설정은?",a:"단어의 최소 길이를 설정합니다. 2로 설정하면 2글자 이상 단어만 분석합니다. 한국어의 경우 2-3자 설정을 권장합니다."},{q:"분석 결과를 어떻게 활용하나요?",a:"상위 단어들이 문서의 핵심 주제를 반영합니다. 예상치 못한 단어가 상위에 오면 문서 수정이 필요할 수 있습니다."}]:[{q:"What are stop words?",a:"Common words like 'the', 'a', 'is' that carry little meaning for analysis. This tool automatically removes Korean and English stop words."},{q:"How to use for SEO?",a:"Check if target keywords appear enough in your content, and identify over-repeated words (keyword stuffing)."},{q:"Minimum character setting?",a:"Sets minimum word length. Setting 2 analyzes words with 2+ characters. For English, 3+ characters is recommended."},{q:"How to use the results?",a:"Top words reflect the core topics of your document. Unexpected top words may indicate the document needs revision."}]}
        keywords="단어 빈도 분석 · 텍스트 분석 · 키워드 빈도 · SEO 키워드 분석 · word frequency analyzer · text analysis · keyword density · SEO analysis · word count tool"
      />
    </div>
  )
}
