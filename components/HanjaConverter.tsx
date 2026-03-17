'use client'
import { useState } from 'react'
import { Copy, CheckCheck } from 'lucide-react'
import { useLang } from './LangContext'
import ToolFooter from './ToolFooter'

const T = {
  ko: { title: '한자 변환기', desc: '한글을 한자로, 한자를 한글로 변환. 이름·사자성어·급수별 한자 모음 제공.' },
  en: { title: 'Hanja (Chinese Characters) Converter', desc: 'Convert Korean to Hanja characters. Name lookup, idioms, and level-based character lists.' }
}

// 자주 쓰이는 이름용 한자
const NAME_HANJA: Record<string, { hanja: string; meaning: string; meaningEn: string }[]> = {
  '민': [{ hanja: '民', meaning: '백성 민', meaningEn: 'people' }, { hanja: '敏', meaning: '민첩할 민', meaningEn: 'agile' }, { hanja: '玟', meaning: '옥돌 민', meaningEn: 'jade' }],
  '준': [{ hanja: '俊', meaning: '준걸 준', meaningEn: 'talented' }, { hanja: '峻', meaning: '높을 준', meaningEn: 'high' }, { hanja: '竣', meaning: '마칠 준', meaningEn: 'complete' }],
  '수': [{ hanja: '秀', meaning: '빼어날 수', meaningEn: 'excel' }, { hanja: '壽', meaning: '목숨 수', meaningEn: 'longevity' }, { hanja: '洙', meaning: '물가 수', meaningEn: 'waterside' }],
  '진': [{ hanja: '鎭', meaning: '진압할 진', meaningEn: 'suppress' }, { hanja: '珍', meaning: '보배 진', meaningEn: 'treasure' }, { hanja: '眞', meaning: '참 진', meaningEn: 'true' }],
  '호': [{ hanja: '浩', meaning: '넓을 호', meaningEn: 'vast' }, { hanja: '虎', meaning: '범 호', meaningEn: 'tiger' }, { hanja: '鎬', meaning: '빛날 호', meaningEn: 'shine' }],
  '지': [{ hanja: '智', meaning: '슬기로울 지', meaningEn: 'wisdom' }, { hanja: '志', meaning: '뜻 지', meaningEn: 'will' }, { hanja: '芝', meaning: '지초 지', meaningEn: 'mushroom' }],
  '현': [{ hanja: '賢', meaning: '어질 현', meaningEn: 'wise' }, { hanja: '炫', meaning: '빛날 현', meaningEn: 'bright' }, { hanja: '玄', meaning: '검을 현', meaningEn: 'dark' }],
  '우': [{ hanja: '宇', meaning: '집 우', meaningEn: 'universe' }, { hanja: '佑', meaning: '도울 우', meaningEn: 'help' }, { hanja: '雨', meaning: '비 우', meaningEn: 'rain' }],
  '서': [{ hanja: '瑞', meaning: '상서로울 서', meaningEn: 'auspicious' }, { hanja: '徐', meaning: '천천히 서', meaningEn: 'slow' }, { hanja: '書', meaning: '글 서', meaningEn: 'writing' }],
  '은': [{ hanja: '恩', meaning: '은혜 은', meaningEn: 'grace' }, { hanja: '銀', meaning: '은 은', meaningEn: 'silver' }, { hanja: '隱', meaning: '숨을 은', meaningEn: 'hide' }],
  '나': [{ hanja: '娜', meaning: '아름다울 나', meaningEn: 'beautiful' }, { hanja: '羅', meaning: '벌일 나', meaningEn: 'spread' }],
  '도': [{ hanja: '道', meaning: '길 도', meaningEn: 'way' }, { hanja: '度', meaning: '법도 도', meaningEn: 'law' }, { hanja: '燾', meaning: '덮을 도', meaningEn: 'cover' }],
}

const IDIOMS = [
  { ko: '일석이조', hanja: '一石二鳥', meaning: '돌 하나로 새 두 마리를 잡는다', meaningEn: 'Kill two birds with one stone' },
  { ko: '이구동성', hanja: '異口同聲', meaning: '다른 입으로 같은 소리를 낸다', meaningEn: 'Speak with one voice' },
  { ko: '시작이반', hanja: '始作二半', meaning: '시작이 절반이다', meaningEn: 'Well begun is half done' },
  { ko: '인지상정', hanja: '人之常情', meaning: '사람이면 누구나 가지는 보통 감정', meaningEn: 'Common human feeling' },
  { ko: '전화위복', hanja: '轉禍爲福', meaning: '재앙이 바뀌어 복이 됨', meaningEn: 'Turn misfortune into blessing' },
  { ko: '청출어람', hanja: '靑出於藍', meaning: '제자가 스승보다 뛰어남', meaningEn: 'The student surpasses the teacher' },
  { ko: '마이동풍', hanja: '馬耳東風', meaning: '남의 말을 귀담아듣지 않음', meaningEn: 'Turn a deaf ear' },
  { ko: '오매불망', hanja: '寤寐不忘', meaning: '자나 깨나 잊지 못함', meaningEn: 'Think of someone day and night' },
]

// 기본 한자 → 한글 매핑
const HANJA_TO_HANGUL: Record<string, string> = {
  '大': '대', '小': '소', '中': '중', '上': '상', '下': '하', '天': '천', '地': '지', '人': '인',
  '山': '산', '水': '수', '火': '화', '木': '목', '金': '금', '土': '토', '日': '일', '月': '월',
  '年': '년', '時': '시', '分': '분', '秒': '초', '愛': '애', '恨': '한', '希': '희', '望': '망',
  '平': '평', '和': '화', '戰': '전', '爭': '쟁', '勝': '승', '負': '부', '國': '국', '家': '가',
}

export default function HanjaConverter() {
  const { lang } = useLang()
  const tx = T[lang]
  const [input, setInput] = useState('')
  const [copied, setCopied] = useState<string|null>(null)
  const [tab, setTab] = useState<'name'|'idiom'|'basic'>('name')

  const copy = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text); setCopied(key); setTimeout(() => setCopied(null), 1500)
  }

  const hanjaToHangul = (text: string) => text.split('').map(c => HANJA_TO_HANGUL[c] ?? c).join('')

  const nameLookup = input.split('').map(char => ({ char, results: NAME_HANJA[char] ?? [] })).filter(r => r.results.length > 0)
  const idiomResults = IDIOMS.filter(i => i.ko.includes(input) || i.hanja.includes(input) || i.meaning.includes(input))

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-mono mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />Free Tool
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-3">{tx.title}</h1>
        <p className="text-slate-300 text-base max-w-xl mx-auto">{tx.desc}</p>
      </div>

      <div className="flex rounded-xl border border-surface-border overflow-hidden mb-5">
        {[['name', lang==='ko'?'이름 한자':'Name Hanja'], ['idiom', lang==='ko'?'사자성어':'Idioms'], ['basic', lang==='ko'?'한자→한글':'Hanja→Korean']].map(([k,l]) => (
          <button key={k} onClick={() => setTab(k as any)}
            className={`flex-1 py-2.5 text-sm font-medium transition-all ${tab===k ? 'bg-brand-500 text-white font-bold' : 'bg-[#1a1d27] text-slate-300 hover:text-white'}`}>{l}</button>
        ))}
      </div>

      <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4 mb-5">
        <input value={input} onChange={e => setInput(e.target.value)}
          placeholder={tab==='name' ? (lang==='ko'?'이름 한 글자씩 입력 (예: 민준)':'Enter name characters') : tab==='idiom' ? (lang==='ko'?'사자성어 검색...':'Search idioms...') : (lang==='ko'?'한자 입력 (예: 大韓民國)':'Enter Hanja characters')}
          className="w-full bg-[#0f1117] border border-surface-border rounded-lg px-3 py-2.5 text-slate-200 text-sm focus:outline-none focus:border-brand-500/50 transition-all" />
      </div>

      {tab === 'name' && (
        <div className="flex flex-col gap-4">
          {nameLookup.length === 0 && input && <p className="text-slate-500 text-sm text-center py-8">{lang==='ko'?'검색 결과가 없습니다':'No results found'}</p>}
          {nameLookup.map(({ char, results }) => (
            <div key={char} className="rounded-xl border border-surface-border bg-[#1a1d27] p-4">
              <p className="text-lg font-bold text-brand-400 mb-3">'{char}'</p>
              <div className="grid grid-cols-3 gap-3">
                {results.map(r => (
                  <div key={r.hanja} className="rounded-lg border border-surface-border bg-[#0f1117] p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-3xl font-bold text-slate-200">{r.hanja}</span>
                      <button onClick={() => copy(r.hanja, r.hanja)} className={`p-1 rounded transition-all ${copied===r.hanja?'text-brand-400':'text-slate-600 hover:text-brand-400'}`}>
                        {copied===r.hanja?<CheckCheck size={13}/>:<Copy size={13}/>}
                      </button>
                    </div>
                    <p className="text-xs text-slate-400">{lang==='ko'?r.meaning:r.meaningEn}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {!input && (
            <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4">
              <p className="text-xs text-slate-400 mb-3 font-medium">{lang==='ko'?'자주 사용하는 이름 한자':'Common name characters'}</p>
              <div className="flex flex-wrap gap-2">
                {Object.keys(NAME_HANJA).map(k => (
                  <button key={k} onClick={() => setInput(k)} className="text-sm px-3 py-1.5 rounded-lg border border-surface-border text-slate-300 hover:border-brand-500/40 hover:text-brand-300 bg-[#0f1117] transition-all">{k}</button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {tab === 'idiom' && (
        <div className="flex flex-col gap-3">
          {(input ? idiomResults : IDIOMS).map(i => (
            <div key={i.hanja} className="rounded-xl border border-surface-border bg-[#1a1d27] p-4 flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-lg font-bold text-slate-200">{i.ko}</span>
                  <span className="text-xl text-brand-400 font-bold">{i.hanja}</span>
                </div>
                <p className="text-sm text-slate-400">{lang==='ko'?i.meaning:i.meaningEn}</p>
              </div>
              <button onClick={() => copy(`${i.ko} (${i.hanja}): ${lang==='ko'?i.meaning:i.meaningEn}`, i.hanja)}
                className={`p-2 rounded-lg border transition-all flex-shrink-0 ${copied===i.hanja?'bg-brand-500/20 border-brand-500/40 text-brand-400':'border-surface-border text-slate-500 hover:text-brand-400 hover:border-brand-500/40'}`}>
                {copied===i.hanja?<CheckCheck size={13}/>:<Copy size={13}/>}
              </button>
            </div>
          ))}
        </div>
      )}

      {tab === 'basic' && (
        <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-5">
          {input && (
            <div className="mb-4 p-3 rounded-lg bg-brand-500/10 border border-brand-500/20">
              <p className="text-xs text-slate-400 mb-1">{lang==='ko'?'변환 결과':'Result'}</p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-brand-400">{hanjaToHangul(input)}</span>
                <button onClick={() => copy(hanjaToHangul(input), 'basic')} className={`p-1.5 rounded border transition-all ${copied==='basic'?'bg-brand-500/20 border-brand-500/40 text-brand-400':'border-surface-border text-slate-500 hover:text-brand-400'}`}>
                  {copied==='basic'?<CheckCheck size={13}/>:<Copy size={13}/>}
                </button>
              </div>
            </div>
          )}
          <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
            {Object.entries(HANJA_TO_HANGUL).map(([h, k]) => (
              <button key={h} onClick={() => setInput(prev => prev + h)}
                className="p-2 rounded-lg border border-surface-border bg-[#0f1117] hover:border-brand-500/40 transition-all text-center">
                <p className="text-lg font-bold text-slate-200">{h}</p>
                <p className="text-xs text-slate-500">{k}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      <ToolFooter
        toolName={lang==='ko'?'한자 변환기':'Hanja Converter'}
        toolUrl="https://keyword-mixer.vercel.app/hanja-converter"
        description={tx.desc}
        howToUse={lang==='ko'?[
          {step:'이름 한자 조회', desc:'이름 탭에서 이름 글자를 입력하면 사용 가능한 한자와 뜻을 보여줍니다.'},
          {step:'사자성어 검색', desc:'사자성어 탭에서 한글이나 한자로 검색하면 관련 사자성어를 찾을 수 있습니다.'},
          {step:'한자→한글 변환', desc:'한자→한글 탭에서 한자를 입력하면 한글 독음으로 변환됩니다.'},
          {step:'결과 복사', desc:'각 결과 옆 복사 버튼으로 원하는 내용을 클립보드에 복사하세요.'},
        ]:[
          {step:'Name lookup', desc:'Enter Korean name characters to find suitable Hanja with meanings.'},
          {step:'Search idioms', desc:'Search Korean or Chinese 4-character idioms (사자성어).'},
          {step:'Hanja to Korean', desc:'Convert Hanja characters to their Korean pronunciation (독음).'},
          {step:'Copy results', desc:'Use copy buttons to save results to clipboard.'},
        ]}
        whyUse={lang==='ko'?[
          {title:'이름 작명 도우미', desc:'아이 이름이나 개명 시 각 글자에 맞는 한자와 뜻을 찾을 수 있습니다.'},
          {title:'사자성어 모음', desc:'자주 사용되는 사자성어와 의미를 한눈에 확인할 수 있습니다.'},
          {title:'한자 학습', desc:'한자와 한글 독음을 대조하며 한자를 학습할 수 있습니다.'},
          {title:'글쓰기 활용', desc:'격식 있는 글이나 서류에 사용할 한자 표현을 찾을 수 있습니다.'},
        ]:[
          {title:'Korean name lookup', desc:'Find suitable Hanja for Korean names with detailed meanings.'},
          {title:'4-character idiom guide', desc:'Comprehensive guide to Korean/Chinese 4-character idioms.'},
          {title:'Hanja learning', desc:'Learn Hanja by comparing with Korean pronunciation.'},
          {title:'Formal writing', desc:'Find appropriate Hanja expressions for formal documents.'},
        ]}
        faqs={lang==='ko'?[
          {q:'한자 이름은 왜 중요한가요?', a:'한국에서 출생신고 시 한자 이름을 함께 등록합니다. 이름의 뜻을 담는 중요한 문화적 의미가 있습니다.'},
          {q:'사자성어란?', a:'한자 4글자로 이루어진 고사성어로 중국 고전에서 유래한 격언이나 교훈을 담고 있습니다.'},
          {q:'한자 급수 시험이란?', a:'한국어문회, 대한검정회 등에서 주관하는 한자 능력 시험으로 8급(가장 쉬움)~1급(가장 어려움)으로 구성됩니다.'},
          {q:'한자와 중국어 한자는 같나요?', a:'기본은 같지만 한국은 전통 한자(번체), 중국은 간체자를 사용합니다. 일부 글자는 형태가 다릅니다.'},
        ]:[
          {q:'Why are Hanja names important in Korea?', a:'Korean birth registration includes Hanja names. They carry cultural and meaningful significance.'},
          {q:'What is a 사자성어 (4-character idiom)?', a:'Four-character phrases derived from Chinese classics, containing wisdom, lessons, or famous stories.'},
          {q:'Are Korean and Chinese Hanja the same?', a:'The base is similar, but Korea uses traditional characters while China uses simplified characters.'},
          {q:'What is the Hanja proficiency test?', a:'Tests administered by Korean language organizations, ranging from Level 8 (easiest) to Level 1 (hardest).'},
        ]}
        keywords="한자 변환기 · 한자 이름 · 한자 뜻 · 사자성어 · 한자 공부 · 이름 한자 · 한자 풀이 · Hanja converter · Korean Hanja · Chinese characters Korean · name Hanja · 4 character idiom Korean"
      />
    </div>
  )
}
