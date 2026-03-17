'use client'
import { useState } from 'react'
import { useLang } from './LangContext'
import ToolFooter from './ToolFooter'
import { Copy, CheckCheck, ExternalLink } from 'lucide-react'

const T = {
  ko: { title: '맞춤법 검사기', desc: '자주 틀리는 한국어 맞춤법 확인 및 교정 가이드. 네이버·부산대 맞춤법 검사기 바로가기 제공.' },
  en: { title: 'Korean Spell Checker', desc: 'Korean spelling correction guide with common mistake patterns. Direct links to professional spell checkers.' }
}

const COMMON_ERRORS = [
  { wrong: '되요', right: '돼요', rule: lang => lang==='ko'?'"되어요"의 준말은 "돼요"입니다.':'"돼요" is the correct contraction of "되어요"' },
  { wrong: '데요', right: '대요', rule: lang => lang==='ko'?'"대요"는 남의 말을 전달할 때, "데요"는 경험을 말할 때':'"대요" for hearsay, "데요" for personal experience' },
  { wrong: '않되', right: '안 돼', rule: lang => lang==='ko'?'"않"은 동사 뒤, "안"은 동사 앞에 사용':'"않" after verb, "안" before verb' },
  { wrong: '함으로써', right: '함으로써 vs 함으로서', rule: lang => lang==='ko'?'"써"는 수단, "서"는 자격을 나타냄':'"써" means by means of, "서" means in the capacity of' },
  { wrong: '왠지', right: '웬지', rule: lang => lang==='ko'?'"왠지"가 맞는 표현 ("왜인지"의 준말)':'"왠지" is correct (contraction of "왜인지")' },
  { wrong: '어이없다', right: '어이없다', rule: lang => lang==='ko'?'"어이없다"가 표준어 ("어처구니없다"도 맞음)':'"어이없다" is the standard form' },
  { wrong: '할께요', right: '할게요', rule: lang => lang==='ko'?'"ㄹ게요"는 된소리 없이 쓰는 것이 원칙':'"ㄹ게요" should not use tense consonants' },
  { wrong: '잊어버리다', right: '잊어버리다', rule: lang => lang==='ko'?'"잊어버리다"가 맞는 표현':'"잊어버리다" is the correct form' },
  { wrong: '맞추다 vs 맞히다', right: '구별 필요', rule: lang => lang==='ko'?'"맞추다"는 기준에 맞게 조정, "맞히다"는 정답을 알아냄':'"맞추다" to adjust to standard, "맞히다" to get the right answer' },
  { wrong: '느즈막히', right: '느지막이', rule: lang => lang==='ko'?'"느지막이"가 표준어':'"느지막이" is the standard form' },
  { wrong: '부딪히다', right: '부딪히다', rule: lang => lang==='ko'?'"부딪히다"(피동)와 "부딪치다"(능동)는 다른 표현':'"부딪히다" (passive) vs "부딪치다" (active) are different' },
  { wrong: '어떻해', right: '어떻게 해', rule: lang => lang==='ko'?'"어떻해"는 없는 말, "어떻게 해" 또는 "어떡해"가 맞음':'"어떻해" doesn\'t exist; use "어떻게 해" or "어떡해"' },
]

const EXTERNAL = [
  { name: '네이버 맞춤법 검사기', url: 'https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=0&ie=utf8&query=맞춤법+검사기', desc: '네이버 공식 맞춤법 검사' },
  { name: '부산대 맞춤법 검사기', url: 'http://speller.cs.pusan.ac.kr/', desc: '학술 맞춤법 검사 시스템' },
  { name: '한국어 맞춤법/문법 검사기', url: 'https://www.korean.go.kr/hangeul/rule/', desc: '국립국어원 어문 규범' },
]

export default function SpellChecker() {
  const { lang } = useLang()
  const tx = T[lang]
  const [input, setInput] = useState('')
  const [copied, setCopied] = useState<string|null>(null)
  const [search, setSearch] = useState('')

  const copy = async (text: string, key: string) => { await navigator.clipboard.writeText(text); setCopied(key); setTimeout(() => setCopied(null), 1500) }

  const filtered = search ? COMMON_ERRORS.filter(e => e.wrong.includes(search) || e.right.includes(search)) : COMMON_ERRORS

  // 간단한 패턴 매칭으로 오류 감지
  const detectedErrors = COMMON_ERRORS.filter(e => e.wrong !== '맞추다 vs 맞히다' && e.wrong !== '어이없다' && e.wrong !== '잊어버리다' && input.includes(e.wrong))

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-mono mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />Free Tool
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-3">{tx.title}</h1>
        <p className="text-slate-300 text-base max-w-xl mx-auto">{tx.desc}</p>
      </div>

      {/* 안내 */}
      <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-4 mb-5">
        <p className="text-blue-400 text-sm font-medium mb-2">💡 {lang==='ko'?'이 도구에 대해':'About this tool'}</p>
        <p className="text-blue-300/70 text-xs">{lang==='ko'?'브라우저 기반으로 완전한 한국어 맞춤법 검사는 기술적 한계가 있습니다. 자주 틀리는 패턴을 안내하고 전문 검사기 링크를 제공합니다.':'Complete Korean spell checking in browser has technical limitations. We provide common error patterns and links to professional spell checkers.'}</p>
      </div>

      {/* 전문 검사기 바로가기 */}
      <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4 mb-5">
        <p className="text-xs text-slate-400 mb-3 font-medium">{lang==='ko'?'🔗 전문 맞춤법 검사기 바로가기':'🔗 Professional Spell Checkers'}</p>
        <div className="flex flex-col gap-2">
          {EXTERNAL.map(e => (
            <a key={e.name} href={e.url} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-between p-3 rounded-lg border border-surface-border hover:border-brand-500/40 hover:bg-brand-500/5 transition-all group">
              <div>
                <p className="text-sm font-medium text-slate-200 group-hover:text-brand-300">{e.name}</p>
                <p className="text-xs text-slate-500">{e.desc}</p>
              </div>
              <ExternalLink size={14} className="text-slate-500 group-hover:text-brand-400 flex-shrink-0" />
            </a>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {/* 텍스트 입력 */}
        <div className="flex flex-col gap-3">
          <div className="rounded-xl border border-surface-border bg-[#1a1d27] overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-surface-border">
              <span className="text-sm font-medium text-slate-200">{lang==='ko'?'텍스트 입력':'Enter Text'}</span>
              <span className="text-xs text-slate-500">{input.length}{lang==='ko'?'자':' chars'}</span>
            </div>
            <textarea value={input} onChange={e => setInput(e.target.value)}
              placeholder={lang==='ko'?'검사할 텍스트를 입력하세요...':'Enter text to check...'}
              rows={10} className="w-full bg-transparent px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none resize-none" />
          </div>

          {detectedErrors.length > 0 && (
            <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-4">
              <p className="text-xs font-medium text-yellow-400 mb-2">⚠️ {lang==='ko'?`${detectedErrors.length}개 패턴 감지됨`:`${detectedErrors.length} patterns detected`}</p>
              {detectedErrors.map(e => (
                <div key={e.wrong} className="text-xs text-yellow-300/80 mb-1">
                  • <span className="line-through text-red-400">{e.wrong}</span> → <span className="text-brand-400 font-bold">{e.right}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 자주 틀리는 표현 */}
        <div className="rounded-xl border border-surface-border bg-[#1a1d27] overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-surface-border">
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder={lang==='ko'?'검색...':'Search...'}
              className="flex-1 bg-transparent text-sm text-slate-200 placeholder-slate-600 focus:outline-none" />
          </div>
          <div className="overflow-y-auto max-h-96 divide-y divide-surface-border">
            {filtered.map(e => (
              <div key={e.wrong} className="px-4 py-3 hover:bg-surface-hover/10 transition-all">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-red-400 line-through">{e.wrong}</span>
                  <span className="text-slate-600 text-xs">→</span>
                  <span className="text-xs text-brand-400 font-bold">{e.right}</span>
                  <button onClick={() => copy(e.right, e.wrong)} className={`ml-auto p-1 rounded transition-all ${copied===e.wrong?'text-brand-400':'text-slate-600 hover:text-brand-400'}`}>
                    {copied===e.wrong?<CheckCheck size={12}/>:<Copy size={12}/>}
                  </button>
                </div>
                <p className="text-xs text-slate-500">{e.rule(lang as 'ko'|'en')}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ToolFooter
        toolName={lang==='ko'?'맞춤법 검사기':'Korean Spell Checker'}
        toolUrl="https://keyword-mixer.vercel.app/spell-checker"
        description={tx.desc}
        howToUse={lang==='ko'?[
          {step:'전문 검사기 활용', desc:'완전한 맞춤법 검사는 위의 네이버/부산대 검사기 링크를 사용하세요.'},
          {step:'텍스트 입력', desc:'검사할 텍스트를 입력하면 자주 틀리는 패턴을 자동으로 감지합니다.'},
          {step:'오류 목록 확인', desc:'오른쪽 자주 틀리는 표현 목록에서 올바른 표현을 확인하세요.'},
          {step:'올바른 표현 복사', desc:'각 항목의 복사 버튼으로 올바른 표현을 클립보드에 복사하세요.'},
        ]:[
          {step:'Use professional checkers', desc:'For complete spell checking, use the Naver or Pusan Nat\'l links above.'},
          {step:'Enter text', desc:'Type text to automatically detect common error patterns.'},
          {step:'Check error list', desc:'Review the common mistakes list on the right for correct forms.'},
          {step:'Copy correct form', desc:'Use copy buttons to save correct spellings to clipboard.'},
        ]}
        whyUse={lang==='ko'?[
          {title:'자주 틀리는 패턴 가이드', desc:'한국인이 자주 헷갈리는 맞춤법 패턴을 한눈에 확인할 수 있습니다.'},
          {title:'전문 검사기 연결', desc:'네이버·부산대 등 전문 맞춤법 검사기를 바로 이용할 수 있습니다.'},
          {title:'올바른 표현 복사', desc:'맞는 표현을 바로 복사해 글쓰기에 활용할 수 있습니다.'},
          {title:'규칙 설명 포함', desc:'왜 맞고 틀린지 문법 규칙도 함께 설명합니다.'},
        ]:[
          {title:'Common error patterns', desc:'See common Korean spelling mistakes and their corrections at a glance.'},
          {title:'Professional checker links', desc:'Direct access to Naver and Pusan National University spell checkers.'},
          {title:'Copy correct form', desc:'Copy correct spellings directly for use in writing.'},
          {title:'Rule explanations', desc:'Grammar rules explaining why forms are correct or incorrect.'},
        ]}
        faqs={lang==='ko'?[
          {q:'"됐다"와 "됬다" 중 어떤 게 맞나요?', a:'"됐다"가 맞습니다. "되었다"의 준말로 "됐다"로 씁니다. "됬"은 없는 글자입니다.'},
          {q:'"왠지"와 "웬지" 중 어떤 게 맞나요?', a:'"왠지"가 맞습니다. "왜인지"의 준말입니다. "웬"은 "어떤"이나 "어찌된"의 의미로 사용됩니다.'},
          {q:'"할게요"와 "할께요" 중 어떤 게 맞나요?', a:'"할게요"가 맞습니다. ㄹ 뒤에서 된소리를 쓰지 않는 원칙에 따릅니다.'},
          {q:'맞춤법이 자꾸 헷갈린다면?', a:'국립국어원 표준국어대사전(stdict.korean.go.kr)을 북마크해두고 수시로 확인하세요. 네이버 국어사전도 유용합니다.'},
        ]:[
          {q:'Which is correct: "됐다" or "됬다"?', a:'"됐다" is correct. It\'s a contraction of "되었다". "됬" doesn\'t exist in Korean.'},
          {q:'"왠지" or "웬지"?', a:'"왠지" is correct, a contraction of "왜인지" (why is it). "웬" means "some kind of" or "how come".'},
          {q:'"할게요" or "할께요"?', a:'"할게요" is correct. Korean doesn\'t use tense consonants after ㄹ.'},
          {q:'Tips for remembering Korean spelling?', a:'Bookmark the Korean National Institute of Language\'s dictionary (stdict.korean.go.kr) for quick reference.' },
        ]}
        keywords="맞춤법 검사기 · 한국어 맞춤법 · 맞춤법 교정 · 자주 틀리는 맞춤법 · 맞춤법 검사 · spell checker Korean · Korean grammar checker · Korean spelling · 맞춤법 틀리기 쉬운"
      />
    </div>
  )
}
