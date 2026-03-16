'use client'

import ToolFooter from './ToolFooter'
import { useState } from 'react'
import { RefreshCw, Copy, CheckCheck, Star } from 'lucide-react'

const BONUS_COLOR = 'bg-yellow-500'
const NUM_COLORS = [
  'bg-yellow-500',   // 1-10
  'bg-blue-500',     // 11-20
  'bg-red-500',      // 21-30
  'bg-slate-500',    // 31-40
  'bg-green-500',    // 41-45
]

function getColor(n: number) {
  if (n <= 10) return NUM_COLORS[0]
  if (n <= 20) return NUM_COLORS[1]
  if (n <= 30) return NUM_COLORS[2]
  if (n <= 40) return NUM_COLORS[3]
  return NUM_COLORS[4]
}

function generateNumbers(exclude: number[] = []): number[] {
  const pool = Array.from({ length: 45 }, (_, i) => i + 1).filter(n => !exclude.includes(n))
  const result: number[] = []
  while (result.length < 6) {
    const idx = Math.floor(Math.random() * pool.length)
    result.push(pool.splice(idx, 1)[0])
  }
  return result.sort((a, b) => a - b)
}

interface LottoSet {
  numbers: number[]
  bonus: number
  id: number
}

export default function LottoGenerator() {
  const [sets, setSets] = useState<LottoSet[]>([])
  const [count, setCount] = useState(5)
  const [excludeNums, setExcludeNums] = useState('')
  const [includeNums, setIncludeNums] = useState('')
  const [history, setHistory] = useState<LottoSet[][]>([])
  const [copied, setCopied] = useState(false)
  const [stats, setStats] = useState<Record<number, number>>({})

  const parseNums = (str: string) =>
    str.split(/[,\s]+/).map(n => parseInt(n)).filter(n => n >= 1 && n <= 45)

  const generate = () => {
    const exclude = parseNums(excludeNums)
    const include = parseNums(includeNums).slice(0, 5)
    const newSets: LottoSet[] = []

    for (let i = 0; i < count; i++) {
      const pool = Array.from({ length: 45 }, (_, j) => j + 1)
        .filter(n => !exclude.includes(n) && !include.includes(n))
      const needed = 6 - include.length
      const extra: number[] = []
      const poolCopy = [...pool]
      while (extra.length < needed && poolCopy.length > 0) {
        const idx = Math.floor(Math.random() * poolCopy.length)
        extra.push(poolCopy.splice(idx, 1)[0])
      }
      const numbers = [...include, ...extra].sort((a, b) => a - b)
      const bonusPool = Array.from({ length: 45 }, (_, j) => j + 1)
        .filter(n => !numbers.includes(n))
      const bonus = bonusPool[Math.floor(Math.random() * bonusPool.length)]
      newSets.push({ numbers, bonus, id: Date.now() + i })
    }

    setSets(newSets)
    setHistory(prev => [newSets, ...prev.slice(0, 4)])

    // Update stats
    const newStats = { ...stats }
    newSets.forEach(s => s.numbers.forEach(n => { newStats[n] = (newStats[n] ?? 0) + 1 }))
    setStats(newStats)
  }

  const copyAll = async () => {
    const text = sets.map((s, i) =>
      `게임${i + 1}: ${s.numbers.join(', ')} (보너스: ${s.bonus})`
    ).join('\n')
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const topNums = Object.entries(stats)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([n]) => parseInt(n))

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-mono mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
          Free Tool
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-3 tracking-tight">로또 번호 생성기</h1>
        <p className="text-slate-300 text-base max-w-lg mx-auto">
          랜덤 로또 번호 자동 생성. 제외 번호·포함 번호 설정, 최대 10게임 동시 생성.
        </p>
      </div>

      {/* Settings */}
      <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-5 mb-6">
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block font-medium">포함할 번호 (최대 5개)</label>
            <input value={includeNums} onChange={e => setIncludeNums(e.target.value)}
              placeholder="예: 7, 14, 27"
              className="w-full bg-[#0f1117] border border-surface-border rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-500/50 transition-all" />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block font-medium">제외할 번호</label>
            <input value={excludeNums} onChange={e => setExcludeNums(e.target.value)}
              placeholder="예: 1, 2, 3"
              className="w-full bg-[#0f1117] border border-surface-border rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-500/50 transition-all" />
          </div>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <span className="text-sm text-slate-300">게임 수</span>
          <div className="flex gap-1.5">
            {[1, 3, 5, 7, 10].map(n => (
              <button key={n} onClick={() => setCount(n)}
                className={`w-10 h-8 rounded-lg border text-sm font-mono transition-all ${count === n ? 'bg-brand-500 border-brand-500 text-white font-bold' : 'border-surface-border text-slate-300 hover:border-brand-500/40 bg-[#0f1117]'}`}>
                {n}
              </button>
            ))}
          </div>
        </div>

        <button onClick={generate}
          className="w-full py-3 rounded-xl bg-brand-500 hover:bg-brand-400 text-white font-bold text-sm transition-all shadow-[0_4px_15px_rgba(34,197,94,0.3)] flex items-center justify-center gap-2">
          <RefreshCw size={15} /> 번호 생성하기
        </button>
      </div>

      {/* Results */}
      {sets.length > 0 && (
        <div className="rounded-xl border border-surface-border bg-[#1a1d27] overflow-hidden mb-6">
          <div className="flex items-center justify-between px-4 py-3 border-b border-surface-border">
            <span className="text-sm font-medium text-slate-200">{sets.length}게임 생성됨</span>
            <button onClick={copyAll} className={`text-xs px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1 ${copied ? 'bg-brand-500/20 border-brand-500/40 text-brand-400' : 'border-surface-border text-slate-300 hover:border-brand-500/40'}`}>
              {copied ? <CheckCheck size={12} /> : <Copy size={12} />}
              {copied ? '복사됨' : '전체 복사'}
            </button>
          </div>
          <div className="divide-y divide-surface-border">
            {sets.map((s, i) => (
              <div key={s.id} className="flex items-center gap-3 px-4 py-4">
                <span className="text-xs text-slate-500 font-mono w-12">게임{i + 1}</span>
                <div className="flex gap-2 flex-wrap flex-1">
                  {s.numbers.map(n => (
                    <span key={n} className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm ${getColor(n)}`}>
                      {n}
                    </span>
                  ))}
                  <span className="flex items-center gap-1 text-xs text-slate-500 ml-1">
                    + <span className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs border-2 border-yellow-400 bg-transparent`}>{s.bonus}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Ball color guide */}
      <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4 mb-6">
        <p className="text-xs text-slate-400 mb-3 font-medium">번호별 색상</p>
        <div className="flex flex-wrap gap-3">
          {[['1~10', 'bg-yellow-500'], ['11~20', 'bg-blue-500'], ['21~30', 'bg-red-500'], ['31~40', 'bg-slate-500'], ['41~45', 'bg-green-500']].map(([label, cls]) => (
            <div key={label} className="flex items-center gap-1.5">
              <span className={`w-5 h-5 rounded-full ${cls}`} />
              <span className="text-xs text-slate-400">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Frequency stats */}
      {topNums.length > 0 && (
        <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4">
          <p className="text-xs text-slate-400 mb-3 font-medium flex items-center gap-1.5">
            <Star size={12} className="text-yellow-400" /> 이번 세션 자주 나온 번호 Top 10
          </p>
          <div className="flex flex-wrap gap-2">
            {topNums.map(n => (
              <span key={n} className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm ${getColor(n)}`}>
                {n}
              </span>
            ))}
          </div>
        </div>
      )}

      <ToolFooter
        toolName="로또 번호 생성기"
        toolUrl="https://keyword-mixer.vercel.app/lotto"
        description="랜덤 로또 번호 자동 생성. 제외 번호·포함 번호 설정, 최대 10게임 동시 생성."
        howToUse={[
          { step: '게임 수 설정', desc: '1~10게임 중 원하는 게임 수를 선택하세요.' },
          { step: '포함/제외 번호 설정 (선택)', desc: '꼭 포함하거나 제외할 번호가 있으면 입력하세요. 최대 5개까지 포함 가능합니다.' },
          { step: '번호 생성', desc: '생성하기 버튼을 눌러 랜덤 로또 번호를 받으세요.' },
          { step: '번호 복사', desc: '전체 복사 버튼으로 모든 게임 번호를 한번에 복사할 수 있습니다.' },
        ]}
        whyUse={[
          { title: '완전 랜덤 생성', desc: '순수 랜덤 알고리즘으로 편향 없이 공정하게 번호를 생성합니다.' },
          { title: '번호 제외 기능', desc: '최근에 자주 나온 번호나 원하지 않는 번호를 제외하고 생성할 수 있습니다.' },
          { title: '10게임 동시 생성', desc: '여러 게임을 한번에 생성해 시간을 절약하세요.' },
          { title: '번호 색상 표시', desc: '실제 로또와 동일한 색상으로 번호를 표시해 직관적으로 확인할 수 있습니다.' },
        ]}
        faqs={[
          { q: '로또 번호는 진짜 랜덤인가요?', a: 'JavaScript의 Math.random()을 기반으로 생성됩니다. 완전한 랜덤이지만 당첨을 보장하지는 않습니다.' },
          { q: '포함 번호는 몇 개까지 설정할 수 있나요?', a: '최대 5개까지 설정 가능합니다. 6개를 모두 지정하면 나머지 1개를 랜덤으로 채울 수 없어 5개로 제한됩니다.' },
          { q: '로또 1등 확률은?', a: '로또 6/45의 1등 당첨 확률은 약 1/8,145,060 (814만분의 1)입니다.' },
          { q: '보너스 번호는 어떻게 사용하나요?', a: '보너스 번호는 2등 당첨(5개 일치 + 보너스) 확인에 사용됩니다. 당첨 번호와 함께 확인하세요.' },
        ]}
        keywords="로또 번호 생성기 · 로또 번호 추천 · 로또 자동 번호 · 행운의 번호 · 로또 당첨 번호 · 로또 6/45 · lotto number generator · random lotto numbers · lucky number generator · lottery number picker"
      />
    </div>
  )
}
