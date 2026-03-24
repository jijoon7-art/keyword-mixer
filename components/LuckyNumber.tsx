'use client'
import { useState } from 'react'
import { Copy, CheckCheck } from 'lucide-react'
import { useLang } from './LangContext'
import ToolFooter from './ToolFooter'

const T = {
  ko: { title: '행운 번호 생성기', desc: '이름·생년월일로 수비학 행운 번호 계산. 오늘의 행운 번호, 인생 번호, 운명 번호 제공.' },
  en: { title: 'Lucky Number Generator', desc: 'Calculate numerology lucky numbers from name and birth date. Life path, destiny, and today numbers.' }
}

interface MeaningData { ko: string; en: string; lucky: number[]; color: string }

const MEANINGS: Record<string, MeaningData> = {
  '1': { ko: '리더십과 독립심. 새로운 시작을 상징합니다.', en: 'Leadership and independence. Symbolizes new beginnings.', lucky: [1,10,19,28], color: 'text-red-400' },
  '2': { ko: '협력과 균형. 파트너십을 통해 빛납니다.', en: 'Cooperation and balance. Shines through partnership.', lucky: [2,11,20,29], color: 'text-blue-400' },
  '3': { ko: '창의성과 표현력. 예술적 재능이 풍부합니다.', en: 'Creativity and expression. Rich artistic talent.', lucky: [3,12,21,30], color: 'text-yellow-400' },
  '4': { ko: '안정과 실용성. 신뢰할 수 있는 기반을 만듭니다.', en: 'Stability and practicality. Builds reliable foundations.', lucky: [4,13,22,31], color: 'text-brand-400' },
  '5': { ko: '자유와 모험. 변화를 즐기고 다재다능합니다.', en: 'Freedom and adventure. Enjoys change and versatility.', lucky: [5,14,23], color: 'text-orange-400' },
  '6': { ko: '책임감과 돌봄. 가족과 커뮤니티를 소중히 여깁니다.', en: 'Responsibility and nurturing. Values family and community.', lucky: [6,15,24], color: 'text-pink-400' },
  '7': { ko: '지혜와 영성. 분석적이고 철학적인 성향입니다.', en: 'Wisdom and spirituality. Analytical and philosophical.', lucky: [7,16,25], color: 'text-purple-400' },
  '8': { ko: '성공과 물질적 번영. 사업적 능력이 뛰어납니다.', en: 'Success and material prosperity. Excellent business ability.', lucky: [8,17,26], color: 'text-amber-400' },
  '9': { ko: '인도주의와 완성. 넓은 세계관을 가집니다.', en: 'Humanitarianism and completion. Has a broad worldview.', lucky: [9,18,27], color: 'text-cyan-400' },
  '11': { ko: '영감과 직관. 마스터 번호로 강력한 직관력을 가집니다.', en: 'Inspiration and intuition. Master number with powerful intuition.', lucky: [11,22,33], color: 'text-slate-300' },
  '22': { ko: '마스터 빌더. 큰 꿈을 현실로 만드는 능력이 있습니다.', en: 'Master Builder. Ability to make big dreams into reality.', lucky: [22,11,4], color: 'text-slate-300' },
}

function getMeaning(n: number): MeaningData {
  return MEANINGS[String(n)] ?? MEANINGS['1']
}

function reduceToSingle(n: number): number {
  let val = n
  while (val > 9 && val !== 11 && val !== 22 && val !== 33) {
    val = String(val).split('').reduce((s, d) => s + parseInt(d), 0)
  }
  return val
}

function dateToLifePath(dateStr: string): number {
  const nums = dateStr.replace(/-/g, '').split('').reduce((s, d) => s + parseInt(d), 0)
  return reduceToSingle(nums)
}

function nameToNumber(name: string): number {
  const vals: Record<string, number> = {
    A:1,B:2,C:3,D:4,E:5,F:6,G:7,H:8,I:9,
    J:1,K:2,L:3,M:4,N:5,O:6,P:7,Q:8,R:9,
    S:1,T:2,U:3,V:4,W:5,X:6,Y:7,Z:8
  }
  const korMap: Record<string, number> = {
    '가':1,'나':2,'다':3,'라':4,'마':5,
    '바':6,'사':7,'아':8,'자':9,'차':1,
    '카':2,'타':3,'파':4,'하':5
  }
  const total = name.toUpperCase().split('').reduce((s, c) => s + (vals[c] ?? korMap[c] ?? 0), 0)
  return reduceToSingle(total || 5)
}

function getTodayNumber(): number {
  const d = new Date()
  const n = d.getFullYear() + (d.getMonth() + 1) + d.getDate()
  return reduceToSingle(n)
}

export default function LuckyNumber() {
  const { lang } = useLang()
  const tx = T[lang]
  const [name, setName] = useState('')
  const [birthDate, setBirthDate] = useState('1995-03-15')
  const [copied, setCopied] = useState<string | null>(null)
  const copy = async (t: string, k: string) => {
    await navigator.clipboard.writeText(t)
    setCopied(k)
    setTimeout(() => setCopied(null), 1500)
  }

  const lifePath = dateToLifePath(birthDate)
  const destinyNum = nameToNumber(name || (lang === 'ko' ? '홍길동' : 'Alex'))
  const todayNum = getTodayNumber()
  const d = new Date(birthDate)
  const personalYear = reduceToSingle(new Date().getFullYear() + (d.getMonth() + 1) + d.getDate())

  const lpData = getMeaning(lifePath)
  const dnData = getMeaning(destinyNum)

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-mono mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
          Fun Tool ✨
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-3">{tx.title}</h1>
        <p className="text-slate-300 text-base max-w-xl mx-auto">{tx.desc}</p>
      </div>

      <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-5 mb-5">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">{lang === 'ko' ? '이름' : 'Name'}</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder={lang === 'ko' ? '홍길동' : 'Alex'}
              className="w-full bg-[#0f1117] border border-surface-border rounded-lg px-3 py-2 text-slate-200 text-sm focus:outline-none focus:border-brand-500/50 transition-all"
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">{lang === 'ko' ? '생년월일' : 'Birth Date'}</label>
            <input
              type="date"
              value={birthDate}
              onChange={e => setBirthDate(e.target.value)}
              className="w-full bg-[#0f1117] border border-surface-border rounded-lg px-2 py-2 text-slate-200 text-xs focus:outline-none focus:border-brand-500/50 transition-all"
            />
          </div>
        </div>
      </div>

      {/* 인생 번호 + 운명 번호 */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        {[
          { label: lang === 'ko' ? '🌟 인생 번호 (Life Path)' : '🌟 Life Path Number', num: lifePath, data: lpData, key: 'lp' },
          { label: lang === 'ko' ? '✨ 운명 번호 (Destiny)' : '✨ Destiny Number', num: destinyNum, data: dnData, key: 'dn' },
        ].map(r => (
          <div key={r.key} className="rounded-xl border border-surface-border bg-[#1a1d27] p-4">
            <p className="text-xs text-slate-400 mb-2 font-medium">{r.label}</p>
            <div className="flex items-center gap-3 mb-2">
              <p className={`text-5xl font-extrabold font-mono ${r.data.color}`}>{r.num}</p>
              <button
                onClick={() => copy(String(r.num), r.key)}
                className={`p-1.5 rounded border transition-all ${copied === r.key ? 'bg-brand-500/20 border-brand-500/40 text-brand-400' : 'border-surface-border text-slate-500 hover:text-brand-400'}`}
              >
                {copied === r.key ? <CheckCheck size={13} /> : <Copy size={13} />}
              </button>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">{lang === 'ko' ? r.data.ko : r.data.en}</p>
            <p className="text-xs text-slate-500 mt-1.5">
              {lang === 'ko' ? '행운의 날짜: ' : 'Lucky dates: '}{r.data.lucky.join(', ')}
            </p>
          </div>
        ))}
      </div>

      {/* 오늘 번호 + 개인 연도 번호 */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-4 text-center">
          <p className="text-xs text-slate-400 mb-1">{lang === 'ko' ? '☀️ 오늘의 행운 번호' : '☀️ Today\'s Lucky Number'}</p>
          <p className="text-5xl font-extrabold text-yellow-400 font-mono">{todayNum}</p>
          <button
            onClick={() => copy(String(todayNum), 'today')}
            className={`mt-2 p-1.5 rounded border transition-all ${copied === 'today' ? 'bg-yellow-500/20 border-yellow-500/40 text-yellow-400' : 'border-surface-border text-slate-500 hover:text-yellow-400'}`}
          >
            {copied === 'today' ? <CheckCheck size={13} /> : <Copy size={13} />}
          </button>
        </div>
        <div className="rounded-xl border border-purple-500/30 bg-purple-500/10 p-4 text-center">
          <p className="text-xs text-slate-400 mb-1">{lang === 'ko' ? '🔮 개인 연도 번호' : '🔮 Personal Year'}</p>
          <p className="text-5xl font-extrabold text-purple-400 font-mono">{personalYear}</p>
          <button
            onClick={() => copy(String(personalYear), 'py')}
            className={`mt-2 p-1.5 rounded border transition-all ${copied === 'py' ? 'bg-purple-500/20 border-purple-500/40 text-purple-400' : 'border-surface-border text-slate-500 hover:text-purple-400'}`}
          >
            {copied === 'py' ? <CheckCheck size={13} /> : <Copy size={13} />}
          </button>
        </div>
      </div>

      {/* 수비학 번호 의미표 */}
      <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4">
        <p className="text-xs text-slate-400 font-medium mb-3">{lang === 'ko' ? '📊 수비학 번호 의미' : '📊 Numerology Number Meanings'}</p>
        <div className="grid grid-cols-3 gap-2">
          {(['1','2','3','4','5','6','7','8','9'] as const).map(n => {
            const m = MEANINGS[n]
            return (
              <div key={n} className={`rounded-lg border border-surface-border bg-[#0f1117] p-2 text-center cursor-pointer transition-all hover:border-brand-500/30 ${String(lifePath) === n || String(destinyNum) === n ? 'border-brand-500/40 bg-brand-500/10' : ''}`}>
                <p className={`text-xl font-bold font-mono ${m.color}`}>{n}</p>
                <p className="text-xs text-slate-500 mt-0.5 leading-tight">{lang === 'ko' ? m.ko.split('.')[0] : m.en.split('.')[0]}</p>
              </div>
            )
          })}
        </div>
      </div>

      <ToolFooter
        toolName={lang === 'ko' ? '행운 번호 생성기' : 'Lucky Number Generator'}
        toolUrl="https://keyword-mixer.vercel.app/lucky-number"
        description={tx.desc}
        howToUse={lang === 'ko' ? [
          { step: '이름 입력', desc: '이름을 입력하면 운명 번호가 계산됩니다.' },
          { step: '생년월일 입력', desc: '생년월일로 인생 번호가 계산됩니다.' },
          { step: '번호 확인', desc: '인생·운명·오늘·개인연도 번호를 확인하세요.' },
          { step: '번호 복사', desc: '각 번호를 복사해 활용하세요.' },
        ] : [
          { step: 'Enter name', desc: 'Destiny number calculated from your name.' },
          { step: 'Enter birth date', desc: 'Life path number calculated from birth date.' },
          { step: 'View numbers', desc: 'See life path, destiny, today, and personal year numbers.' },
          { step: 'Copy numbers', desc: 'Copy numbers for your use.' },
        ]}
        whyUse={lang === 'ko' ? [
          { title: '4가지 번호 동시 계산', desc: '인생번호·운명번호·오늘번호·개인연도번호를 한번에 계산.' },
          { title: '수비학 의미 설명', desc: '각 번호의 수비학적 의미와 특성을 설명합니다.' },
          { title: '행운 날짜 제공', desc: '각 번호별 행운의 날짜를 함께 제공합니다.' },
          { title: '번호 의미표', desc: '1~9 수비학 번호의 의미를 한눈에 확인합니다.' },
        ] : [
          { title: '4 numbers at once', desc: 'Life path, destiny, today, and personal year all calculated.' },
          { title: 'Numerology meanings', desc: 'Explains the numerological significance of each number.' },
          { title: 'Lucky dates', desc: 'Provides lucky dates corresponding to each number.' },
          { title: 'Number reference table', desc: 'See meanings of numbers 1-9 at a glance.' },
        ]}
        faqs={lang === 'ko' ? [
          { q: '수비학이란?', a: '숫자에 특별한 의미와 에너지가 있다고 보는 고대 학문입니다. 이름과 생년월일에서 숫자를 추출해 성격·운명·행운을 탐구합니다.' },
          { q: '인생 번호란?', a: '생년월일의 모든 숫자를 더해 단일 자릿수로 줄인 번호입니다. 당신의 핵심 본성과 인생 목적을 나타낸다고 합니다.' },
          { q: '마스터 번호(11, 22)란?', a: '11과 22는 더 이상 줄이지 않는 특별한 번호입니다. 강화된 에너지와 더 큰 잠재력을 가진다고 알려져 있습니다.' },
          { q: '수비학이 과학적인가요?', a: '수비학은 과학적으로 검증된 학문이 아닙니다. 재미와 자기 탐구를 위한 도구로 즐기시면 좋습니다.' },
        ] : [
          { q: 'What is numerology?', a: 'An ancient study assigning special meaning to numbers. Explores personality, destiny, and luck from name and birth date.' },
          { q: 'What is the life path number?', a: 'All digits of birth date reduced to single digit. Said to represent your core nature and life purpose.' },
          { q: 'Master numbers (11, 22)?', a: 'Special numbers not reduced further. Said to have enhanced energy and greater potential.' },
          { q: 'Is numerology scientific?', a: 'Numerology is not scientifically validated. Enjoy it as entertainment and self-exploration.' },
        ]}
        keywords="행운 번호 · 수비학 · 인생 번호 · 운명 번호 · 오늘의 행운 번호 · lucky number generator · numerology calculator · life path number · destiny number · lucky number today"
      />
    </div>
  )
}
