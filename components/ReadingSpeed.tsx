
'use client'
import { useState } from 'react'
import { Copy, CheckCheck } from 'lucide-react'
import { useLang } from './LangContext'
import ToolFooter from './ToolFooter'

const T = {
  ko: { title: '독서 속도 / 완독 시간 계산기', desc: '분당 읽기 속도(WPM)와 책 분량으로 완독 시간을 계산. 타이핑 속도 측정과 독서 목표 계획 수립.' },
  en: { title: 'Reading Speed & Book Time Calculator', desc: 'Calculate reading completion time from WPM and book length. Set reading goals and track speed.' }
}

const BOOKS = [
  { title_ko: '해리포터와 마법사의 돌', title_en: 'Harry Potter (Sorcerer's Stone)', words: 77325 },
  { title_ko: '어린 왕자', title_en: 'The Little Prince', words: 17000 },
  { title_ko: '노인과 바다', title_en: 'The Old Man and the Sea', words: 27000 },
  { title_ko: '1984', title_en: '1984 (Orwell)', words: 88942 },
  { title_ko: '위대한 개츠비', title_en: 'The Great Gatsby', words: 47094 },
  { title_ko: '일반 소설 (350p)', title_en: 'Avg Novel (350p)', words: 87500 },
]

function fmt(seconds: number, lang: string): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  if (h > 0) return lang === 'ko' ? `${h}시간 ${m}분` : `${h}h ${m}m`
  return lang === 'ko' ? `${m}분` : `${m}min`
}

export default function ReadingSpeed() {
  const { lang } = useLang()
  const tx = T[lang]
  const [wpm, setWpm] = useState(250)
  const [words, setWords] = useState(87500)
  const [pages, setPages] = useState(350)
  const [dailyMin, setDailyMin] = useState(30)
  const [testText] = useState(lang === 'ko'
    ? '다음 문장을 읽고 시간을 측정해보세요. 독서는 지식을 쌓고 상상력을 키우는 가장 좋은 방법 중 하나입니다. 꾸준한 독서 습관은 어휘력 향상과 논리적 사고력 발달에 도움이 됩니다.'
    : 'Read this text and measure your time. Reading is one of the best ways to build knowledge and expand imagination. Consistent reading habits improve vocabulary and logical thinking skills.')
  const [copied, setCopied] = useState<string|null>(null)
  const copy = async (t: string, k: string) => { await navigator.clipboard.writeText(t); setCopied(k); setTimeout(() => setCopied(null), 1500) }

  const readingSeconds = Math.round((words / wpm) * 60)
  const daysToFinish = Math.ceil(readingSeconds / 60 / dailyMin)
  const wordsPerPage = Math.round(words / pages)
  const pagePerDay = Math.round((wpm * dailyMin) / wordsPerPage)

  const SPEED_LEVELS = [
    { label: lang === 'ko' ? '느린 독서' : 'Slow', range: '100-200 WPM', desc: lang === 'ko' ? '어려운 교재나 세밀한 독서' : 'Difficult texts or detailed reading' },
    { label: lang === 'ko' ? '보통 독서' : 'Average', range: '200-300 WPM', desc: lang === 'ko' ? '일반적인 성인 독서 속도' : 'Typical adult reading speed' },
    { label: lang === 'ko' ? '빠른 독서' : 'Fast', range: '300-500 WPM', desc: lang === 'ko' ? '훈련된 독서가 속도' : 'Trained reader speed' },
    { label: lang === 'ko' ? '속독' : 'Speed Reading', range: '500+ WPM', desc: lang === 'ko' ? '속독 훈련 후 달성 가능' : 'Achievable with speed reading training' },
  ]

  const getCurrentLevel = () => {
    if (wpm < 200) return 0
    if (wpm < 300) return 1
    if (wpm < 500) return 2
    return 3
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-mono mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />Free Tool
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-3">{tx.title}</h1>
        <p className="text-slate-300 text-base max-w-xl mx-auto">{tx.desc}</p>
      </div>

      <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-5 mb-5">
        <div className="mb-4">
          <div className="flex justify-between mb-1.5">
            <label className="text-xs text-slate-400 font-medium">{lang === 'ko' ? '분당 단어 수 (WPM)' : 'Words Per Minute (WPM)'}</label>
            <span className="text-brand-400 font-mono text-sm font-bold">{wpm} WPM</span>
          </div>
          <input type="range" min={50} max={1000} step={10} value={wpm} onChange={e => setWpm(+e.target.value)} className="w-full accent-green-500 mb-2" />
          <div className="flex gap-1.5">
            {[100, 200, 250, 300, 400, 500].map(v => (
              <button key={v} onClick={() => setWpm(v)} className={`flex-1 py-1 rounded border text-xs transition-all ${wpm === v ? 'bg-brand-500 border-brand-500 text-white' : 'border-surface-border text-slate-500 bg-[#0f1117]'}`}>{v}</button>
            ))}
          </div>
          <div className={`mt-2 text-xs px-3 py-1.5 rounded-lg border ${['border-blue-500/30 bg-blue-500/10 text-blue-400','border-brand-500/30 bg-brand-500/10 text-brand-400','border-yellow-500/30 bg-yellow-500/10 text-yellow-400','border-purple-500/30 bg-purple-500/10 text-purple-400'][getCurrentLevel()]}`}>
            {SPEED_LEVELS[getCurrentLevel()].label}: {SPEED_LEVELS[getCurrentLevel()].desc}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            [lang === 'ko' ? '책 단어 수' : 'Total Words', words, setWords, 1000],
            [lang === 'ko' ? '총 페이지 수' : 'Total Pages', pages, setPages, 10],
            [lang === 'ko' ? '하루 독서 시간 (분)' : 'Daily Reading (min)', dailyMin, setDailyMin, 5],
          ].map(([l, v, s, step]) => (
            <div key={l as string}>
              <label className="text-xs text-slate-400 mb-1 block">{l as string}</label>
              <input type="number" min={1} value={v as number} step={step as number} onChange={e => (s as Function)(+e.target.value)}
                className="w-full bg-[#0f1117] border border-surface-border rounded-lg px-2 py-2 text-slate-200 text-sm font-mono focus:outline-none focus:border-brand-500/50 transition-all" />
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-1.5 mt-3">
          {BOOKS.map(b => (
            <button key={b.title_ko} onClick={() => { setWords(b.words); setPages(Math.round(b.words / 250)) }}
              className="text-xs px-2.5 py-1.5 rounded-lg border border-surface-border text-slate-300 hover:border-brand-500/40 hover:text-brand-300 bg-[#0f1117] transition-all">
              {lang === 'ko' ? b.title_ko : b.title_en}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="rounded-xl border border-brand-500/30 bg-brand-500/10 p-4 col-span-2 flex justify-between items-center">
          <div>
            <p className="text-xs text-slate-400">{lang === 'ko' ? '예상 완독 시간' : 'Est. Reading Time'}</p>
            <p className="text-4xl font-extrabold text-brand-400 font-mono">{fmt(readingSeconds, lang)}</p>
            <p className="text-xs text-slate-500 mt-1">{lang === 'ko' ? `하루 ${dailyMin}분 읽으면 ${daysToFinish}일 후 완독` : `${daysToFinish} days at ${dailyMin}min/day`}</p>
          </div>
          <button onClick={() => copy(fmt(readingSeconds, lang), 'time')} className={`p-2.5 rounded-xl border transition-all ${copied === 'time' ? 'bg-brand-500/20 border-brand-500/40 text-brand-400' : 'border-surface-border text-slate-400 hover:text-brand-400'}`}>
            {copied === 'time' ? <CheckCheck size={16} /> : <Copy size={16} />}
          </button>
        </div>
        {[
          { label: lang === 'ko' ? '하루 독서 페이지' : 'Pages/day', val: `${pagePerDay}p`, key: 'ppd' },
          { label: lang === 'ko' ? '완독까지 남은 일수' : 'Days to finish', val: `${daysToFinish}${lang === 'ko' ? '일' : 'd'}`, key: 'days' },
        ].map(r => (
          <div key={r.key} className="rounded-xl border border-surface-border bg-[#1a1d27] p-3 flex justify-between items-center">
            <div>
              <p className="text-xs text-slate-400">{r.label}</p>
              <p className="text-xl font-bold text-slate-200 font-mono">{r.val}</p>
            </div>
            <button onClick={() => copy(r.val, r.key)} className={`p-1.5 rounded border transition-all ${copied === r.key ? 'bg-brand-500/20 border-brand-500/40 text-brand-400' : 'border-surface-border text-slate-500 hover:text-brand-400'}`}>
              {copied === r.key ? <CheckCheck size={13} /> : <Copy size={13} />}
            </button>
          </div>
        ))}
      </div>

      <ToolFooter
        toolName={lang === 'ko' ? '독서 속도 계산기' : 'Reading Speed Calculator'}
        toolUrl="https://keyword-mixer.vercel.app/reading-speed"
        description={tx.desc}
        howToUse={lang === 'ko' ? [
          {step:'WPM 설정', desc:'자신의 분당 독서 단어 수를 슬라이더로 설정하세요. 모르면 250으로 시작하세요.'},
          {step:'책 정보 입력', desc:'읽고 싶은 책의 단어 수나 페이지 수를 입력하세요.'},
          {step:'하루 독서 시간 설정', desc:'하루에 몇 분 독서할 수 있는지 입력하세요.'},
          {step:'완독 계획 확인', desc:'예상 완독 시간과 하루 목표 페이지를 확인하세요.'},
        ] : [
          {step:'Set WPM', desc:'Set your words per minute with the slider. Start with 250 if unsure.'},
          {step:'Enter book info', desc:'Input the word count or page count of the book you want to read.'},
          {step:'Set daily reading time', desc:'Enter how many minutes per day you can read.'},
          {step:'View reading plan', desc:'See estimated completion time and daily page target.'},
        ]}
        whyUse={lang === 'ko' ? [
          {title:'완독 계획 수립', desc:'하루 독서 시간으로 언제 책을 다 읽을 수 있는지 계산합니다.'},
          {title:'인기 책 프리셋', desc:'해리포터, 1984 등 인기 도서의 분량이 내장되어 있습니다.'},
          {title:'독서 속도 단계', desc:'현재 WPM이 어느 독서 속도 단계인지 알 수 있습니다.'},
          {title:'독서 목표 관리', desc:'하루 독서 페이지 목표를 설정해 꾸준한 독서 습관을 기릅니다.'},
        ] : [
          {title:'Reading plan', desc:'Calculates when you will finish a book based on daily reading time.'},
          {title:'Popular book presets', desc:'Pre-loaded word counts for Harry Potter, 1984, and more.'},
          {title:'Speed level indicator', desc:'Shows which reading speed level your WPM falls into.'},
          {title:'Daily goal setting', desc:'Set daily page targets to build consistent reading habits.'},
        ]}
        faqs={lang === 'ko' ? [
          {q:'평균 독서 속도는?', a:'성인 평균은 200~250 WPM입니다. 이해력을 유지하면서 빠른 독서는 300~400 WPM 정도입니다.'},
          {q:'책의 단어 수는 어디서 확인하나요?', a:'대부분의 책은 뒷표지나 출판사 홈페이지에 페이지 수가 나와 있습니다. 일반 소설은 페이지당 약 250단어입니다.'},
          {q:'독서 속도를 높이는 방법은?', a:'손가락으로 읽는 위치를 따라가기, 복창하지 않기(눈으로만 읽기), 청킹(여러 단어를 한 번에 인식) 연습이 효과적입니다.'},
          {q:'WPM이 낮아도 괜찮나요?', a:'독서의 목적에 따라 다릅니다. 소설은 빠르게, 전공서적이나 철학책은 천천히 읽는 게 더 효과적입니다.'},
        ] : [
          {q:'Average reading speed?', a:'Adults average 200-250 WPM. Fast reading with good comprehension is around 300-400 WPM.'},
          {q:'Where to find a book word count?', a:'Check back cover or publisher website for page count. Average novel is ~250 words per page.'},
          {q:'How to increase reading speed?', a:'Use finger tracking, avoid subvocalization (silent pronouncing), and practice chunking (recognizing word groups).'},
          {q:'Is slow WPM okay?', a:'Depends on purpose. Fiction can be read faster; textbooks and philosophy books benefit from slower, careful reading.'},
        ]}
        keywords="독서 속도 계산기 · WPM 계산 · 완독 시간 · 분당 단어 수 · 책 읽는 시간 · reading speed calculator · WPM calculator · book reading time · words per minute"
      />
    </div>
  )
}
