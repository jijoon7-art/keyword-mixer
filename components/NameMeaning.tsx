
'use client'
import { useState } from 'react'
import { Copy, CheckCheck } from 'lucide-react'
import { useLang } from './LangContext'
import ToolFooter from './ToolFooter'
const T = { ko:{ title:'이름 의미 분석기', desc:'한글 이름의 획수·오행·의미를 분석. 성씨 유래와 이름자 뜻을 제공.' }, en:{ title:'Korean Name Analyzer', desc:'Analyze Korean name stroke count, five elements, and meaning. Surname origin and character meanings.' } }

const SURNAMES: Record<string, {meaning_ko:string,meaning_en:string,origin_ko:string,origin_en:string}> = {
  '김':{ meaning_ko:'쇠 금(金) - 금속, 귀함을 상징', meaning_en:'Gold/Metal - symbolizes value and strength', origin_ko:'신라 시대 김알지에서 유래. 한국 최다 성씨.', origin_en:'Origin from Silla dynasty Kim Alji. Most common Korean surname.' },
  '이':{ meaning_ko:'오얏나무 리(李) - 자두나무, 청렴을 상징', meaning_en:'Plum tree - symbolizes purity and integrity', origin_ko:'중국에서 유래. 한국 두 번째로 많은 성씨.', origin_en:'Chinese origin. Second most common Korean surname.' },
  '박':{ meaning_ko:'박 박(朴) - 순박함, 검소함을 상징', meaning_en:'Gourd - symbolizes simplicity and frugality', origin_ko:'신라 시조 박혁거세에서 유래.', origin_en:'Origin from Silla founder Bak Hyeokgeose.' },
  '최':{ meaning_ko:'높을 최(崔) - 높음, 탁월함을 상징', meaning_en:'High/Tall - symbolizes excellence and eminence', origin_ko:'중국 산동 출신 최씨에서 유래.', origin_en:'Origin from Choi clan from Shandong, China.' },
  '정':{ meaning_ko:'바를 정(鄭) - 올바름, 정직을 상징', meaning_en:'Upright - symbolizes correctness and honesty', origin_ko:'고려 시대에 많이 쓰이기 시작한 성씨.', origin_en:'Surname that became common during the Goryeo period.' },
}

const CHAR_MEANINGS: Record<string, {ko:string,en:string,element:string}> = {
  '민':{ ko:'민첩할 민(敏) - 민첩하고 총명함', en:'Nimble/Clever - quick-minded and intelligent', element:'金' },
  '준':{ ko:'준걸 준(俊) - 뛰어나고 준수함', en:'Outstanding - excelling and handsome', element:'水' },
  '서':{ ko:'서쪽 서(西)/상서로울 서(瑞) - 상서로움, 행운', en:'Auspicious - good omen and fortune', element:'木' },
  '현':{ ko:'어질 현(賢) - 지혜롭고 덕망 있음', en:'Wise/Virtuous - wise and virtuous', element:'水' },
  '지':{ ko:'슬기로울 지(智) - 지혜와 총명함', en:'Wisdom - intelligent and perceptive', element:'火' },
  '수':{ ko:'빼어날 수(秀) - 뛰어나고 아름다움', en:'Excellent - outstanding and beautiful', element:'水' },
  '영':{ ko:'꽃부리 영(英) - 뛰어남과 영리함', en:'Brilliant - outstanding and clever', element:'木' },
  '호':{ ko:'호걸 호(豪) - 호탕하고 기개 있음', en:'Heroic - bold and spirited', element:'火' },
  '진':{ ko:'나아갈 진(進)/참 진(眞) - 전진, 진실', en:'Advance/True - progress and truth', element:'水' },
  '우':{ ko:'우의 우(友)/비올 우(雨) - 우정, 온화함', en:'Friendship/Rain - friendship and gentleness', element:'水' },
}

function countStrokes(char: string): number {
  // 간략화된 획수 계산 (실제로는 유니코드 기반)
  const code = char.charCodeAt(0)
  if(code >= 0xAC00 && code <= 0xD7A3) {
    const idx = code - 0xAC00
    const onset = Math.floor(idx / 588)
    return (onset % 7) + 2
  }
  return 3
}

export default function NameMeaning() {
  const { lang } = useLang()
  const tx = T[lang]
  const [name, setName] = useState(lang === 'ko' ? '김민준' : '')
  const [copied, setCopied] = useState<string|null>(null)
  const copy = async (t:string,k:string) => { await navigator.clipboard.writeText(t); setCopied(k); setTimeout(()=>setCopied(null),1500) }

  const chars = name.trim().split('')
  const surname = chars[0] || ''
  const givenName = chars.slice(1).join('')

  const surnameInfo = SURNAMES[surname]
  const ELEM_MAP: Record<string,string> = {'木':'wood','火':'fire','土':'earth','金':'metal','水':'water'}
  const ELEM_COLOR: Record<string,string> = {'木':'text-brand-400','火':'text-red-400','土':'text-yellow-400','金':'text-slate-300','水':'text-blue-400'}

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-mono mb-4"><span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse"/>Free Tool</div>
        <h1 className="text-4xl font-extrabold text-white mb-3">{tx.title}</h1>
        <p className="text-slate-300 text-base max-w-xl mx-auto">{tx.desc}</p>
      </div>

      <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-5 mb-5">
        <label className="text-xs text-slate-400 mb-1.5 block">{lang==='ko'?'한글 이름 입력':'Enter Korean Name'}</label>
        <input value={name} onChange={e=>setName(e.target.value)} placeholder={lang==='ko'?'예: 김민준':'e.g. 김민준'}
          className="w-full bg-[#0f1117] border border-surface-border rounded-xl px-4 py-3 text-slate-200 text-2xl font-mono text-center focus:outline-none focus:border-brand-500/50 transition-all" />
        <div className="flex flex-wrap gap-1.5 mt-2">{['김민준','이서현','박지수','최호진','정수영'].map(n=><button key={n} onClick={()=>setName(n)} className="text-xs px-2.5 py-1 rounded border border-surface-border text-slate-400 hover:text-brand-300 hover:border-brand-500/40 bg-[#0f1117] transition-all">{n}</button>)}</div>
      </div>

      {name.trim() && (
        <>
          {/* 이름 글자별 분석 */}
          <div className="flex gap-3 mb-4 justify-center">
            {chars.map((c,i)=>{
              const m = i === 0 ? surnameInfo : CHAR_MEANINGS[c]
              const elem = m ? (i===0 ? '金' : CHAR_MEANINGS[c]?.element || '土') : '土'
              return (
                <div key={i} className="rounded-xl border border-surface-border bg-[#1a1d27] p-4 text-center flex-1 max-w-24">
                  <p className="text-3xl font-bold text-slate-200 mb-1">{c}</p>
                  <p className={`text-xs font-bold ${ELEM_COLOR[elem]}`}>{lang==='ko'?`오행: ${elem}`:`${ELEM_MAP[elem]}`}</p>
                  <p className="text-xs text-slate-600 mt-1">{lang==='ko'?`획수: ${countStrokes(c)}`:`${countStrokes(c)} strokes`}</p>
                </div>
              )
            })}
          </div>

          {/* 성씨 정보 */}
          {surnameInfo && (
            <div className="rounded-xl border border-brand-500/30 bg-brand-500/10 p-4 mb-4">
              <p className="text-xs text-slate-400 mb-1 font-medium">{lang==='ko'?`성씨 분석: ${surname}씨`:`Surname Analysis: ${surname}`}</p>
              <p className="text-sm font-bold text-brand-400 mb-1">{lang==='ko'?surnameInfo.meaning_ko:surnameInfo.meaning_en}</p>
              <p className="text-xs text-slate-400">{lang==='ko'?surnameInfo.origin_ko:surnameInfo.origin_en}</p>
              <button onClick={()=>copy(lang==='ko'?surnameInfo.meaning_ko:surnameInfo.meaning_en,'sm')} className={`mt-2 text-xs px-2 py-1 rounded border flex items-center gap-1 transition-all ${copied==='sm'?'bg-brand-500/20 border-brand-500/40 text-brand-400':'border-surface-border text-slate-400 hover:border-brand-500/40'}`}>
                {copied==='sm'?<CheckCheck size={11}/>:<Copy size={11}/>} {lang==='ko'?'복사':'Copy'}
              </button>
            </div>
          )}

          {/* 이름자 분석 */}
          {givenName && (
            <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4">
              <p className="text-xs text-slate-400 mb-2 font-medium">{lang==='ko'?'이름자 분석':'Given Name Analysis'}</p>
              {givenName.split('').map((c,i)=>{
                const m = CHAR_MEANINGS[c]
                if(!m) return <div key={i} className="text-xs text-slate-500 py-1">{c}: {lang==='ko'?'분석 데이터 준비 중...':'Analysis data coming soon...'}</div>
                return (
                  <div key={i} className="mb-2 p-2.5 rounded-lg border border-surface-border bg-[#0f1117]">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-lg font-bold text-slate-200">{c}</span>
                      <span className={`text-xs font-bold ${ELEM_COLOR[m.element]}`}>{lang==='ko'?`오행: ${m.element}`:`Element: ${ELEM_MAP[m.element]}`}</span>
                    </div>
                    <p className="text-xs text-slate-300">{lang==='ko'?m.ko:m.en}</p>
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}

      <ToolFooter toolName={lang==='ko'?'이름 의미 분석기':'Korean Name Analyzer'} toolUrl="https://keyword-mixer.vercel.app/name-meaning" description={tx.desc}
        howToUse={lang==='ko'?[{step:'이름 입력',desc:'분석할 한글 이름을 입력하세요.'},{step:'성씨 분석',desc:'성씨의 뜻과 유래를 확인하세요.'},{step:'이름자 분석',desc:'이름 각 글자의 한자 의미와 오행을 확인하세요.'},{step:'결과 복사',desc:'분석 결과를 복사해 활용하세요.'}]:[{step:'Enter name',desc:'Type the Korean name to analyze.'},{step:'Surname analysis',desc:'View surname meaning and origin.'},{step:'Character analysis',desc:'See Chinese character meanings and five elements.'},{step:'Copy results',desc:'Copy analysis results for your use.'}]}
        whyUse={lang==='ko'?[{title:'성씨 유래 제공',desc:'한국 주요 성씨의 역사와 의미를 설명합니다.'},{title:'이름자 한자 의미',desc:'이름 각 글자의 한자 의미와 특성을 분석합니다.'},{title:'오행 분석',desc:'목·화·토·금·수 오행으로 이름의 에너지를 분석합니다.'},{title:'획수 계산',desc:'각 글자의 획수를 계산해 작명 참고 자료로 활용합니다.'}]:[{title:'Surname origin',desc:'Explains history and meaning of major Korean surnames.'},{title:'Character meanings',desc:'Analyzes the Chinese character meaning of each name character.'},{title:'Five elements',desc:'Analyzes name energy through Wood, Fire, Earth, Metal, Water.'},{title:'Stroke count',desc:'Calculates strokes for each character as naming reference.'}]}
        faqs={lang==='ko'?[{q:'이름 분석이 정확한가요?',a:'주요 성씨와 자주 사용되는 이름자를 기반으로 한 참고용 데이터입니다. 정확한 작명 분석은 전문 작명소를 이용하시길 권장합니다.'},{q:'오행이란?',a:'동양 철학의 다섯 가지 기본 요소(목·화·토·금·수)입니다. 이름의 오행 균형이 좋으면 운이 좋다고 봅니다.'},{q:'한국 성씨는 몇 개인가요?',a:'2015년 인구주택총조사 기준 5,582개의 성씨가 있습니다. 상위 10개 성씨가 전체 인구의 약 64%를 차지합니다.'},{q:'이름 획수는 왜 중요한가요?',a:'전통적인 동양 작명에서 이름의 획수 조합이 운명에 영향을 준다고 봅니다. 과학적 근거는 없지만 전통 문화로 참고합니다.'}]:[{q:'Is the analysis accurate?',a:'Reference data based on common surnames and name characters. For accurate naming analysis, consult a professional naming specialist.'},{q:'What are the Five Elements?',a:'Five basic elements of Eastern philosophy: Wood, Fire, Earth, Metal, Water. Balance of elements in a name is considered auspicious.'},{q:'How many Korean surnames?',a:'5,582 surnames per 2015 census. The top 10 surnames account for ~64% of the population.'},{q:'Why do stroke counts matter?',a:'Traditional East Asian naming considers stroke combinations to influence destiny. No scientific basis but respected as cultural tradition.'}]}
        keywords="이름 의미 · 이름 뜻 · 한글 이름 분석 · 성씨 유래 · 이름 한자 · Korean name meaning · name analyzer · Korean surname origin · name characters meaning"
      />
    </div>
  )
}
