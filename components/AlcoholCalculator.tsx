'use client'
import { useState } from 'react'
import { Copy, CheckCheck } from 'lucide-react'
import { useLang } from './LangContext'
import ToolFooter from './ToolFooter'

const T = {
  ko: {
    title: '음주 계산기 (혈중알코올농도)',
    desc: '음주량·체중·시간으로 혈중알코올농도(BAC)를 추정. 음주운전 위험 판단, 해소 시간 계산.',
    weight: '체중 (kg)',
    gender: '성별',
    male: '남성', female: '여성',
    drinks: '마신 술',
    time: '음주 시작 후 경과 시간 (시간)',
    bac: '추정 혈중알코올농도 (BAC)',
    safe: '음주운전 안전 가능 (BAC < 0.03%)',
    warning: '면허 정지 수준 (BAC 0.03~0.08%)',
    danger: '면허 취소 수준 (BAC ≥ 0.08%)',
    soberTime: '완전 해소 예상 시간',
    addDrink: '음주 추가',
  },
  en: {
    title: 'Drinking Calculator (BAC)',
    desc: 'Estimate blood alcohol content (BAC) from drinks, weight, and time. Assess drunk driving risk and sobering time.',
    weight: 'Weight (kg)',
    gender: 'Gender',
    male: 'Male', female: 'Female',
    drinks: 'Drinks Consumed',
    time: 'Hours Since Drinking Started',
    bac: 'Estimated BAC',
    safe: 'Safe to drive (BAC < 0.03%)',
    warning: 'License suspension (BAC 0.03~0.08%)',
    danger: 'License revocation (BAC ≥ 0.08%)',
    soberTime: 'Est. Time to Sober Up',
    addDrink: 'Add Drink',
  }
}

const DRINKS = [
  { name_ko: '소주 1잔 (50ml)', name_en: 'Soju 1 glass (50ml)', grams: 8.7 },
  { name_ko: '소주 1병 (360ml)', name_en: 'Soju 1 bottle', grams: 62.5 },
  { name_ko: '맥주 1캔 (355ml)', name_en: 'Beer 1 can (355ml)', grams: 12.8 },
  { name_ko: '맥주 생맥주 500ml', name_en: 'Draft beer 500ml', grams: 18.0 },
  { name_ko: '막걸리 1잔 (200ml)', name_en: 'Makgeolli 200ml', grams: 10.0 },
  { name_ko: '와인 1잔 (150ml)', name_en: 'Wine 1 glass (150ml)', grams: 17.7 },
  { name_ko: '양주/위스키 1잔 (45ml)', name_en: 'Whiskey 1 shot (45ml)', grams: 14.2 },
  { name_ko: '폭탄주 1잔', name_en: 'Boilermaker', grams: 21.0 },
]

interface DrinkItem { id: number; drinkIdx: number; count: number }

export default function AlcoholCalculator() {
  const { lang } = useLang()
  const tx = T[lang]
  const [weight, setWeight] = useState(65)
  const [gender, setGender] = useState<'male' | 'female'>('male')
  const [elapsed, setElapsed] = useState(1)
  const [items, setItems] = useState<DrinkItem[]>([
    { id: 1, drinkIdx: 0, count: 2 },
    { id: 2, drinkIdx: 2, count: 1 },
  ])
  const [copied, setCopied] = useState<string | null>(null)
  const copy = async (t: string, k: string) => { await navigator.clipboard.writeText(t); setCopied(k); setTimeout(() => setCopied(null), 1500) }

  const addItem = () => setItems(p => [...p, { id: Date.now(), drinkIdx: 0, count: 1 }])
  const removeItem = (id: number) => setItems(p => p.filter(x => x.id !== id))
  const update = (id: number, k: keyof DrinkItem, v: number) => setItems(p => p.map(x => x.id === id ? { ...x, [k]: v } : x))

  // Widmark 공식
  const totalAlcohol = items.reduce((s, item) => s + DRINKS[item.drinkIdx].grams * item.count, 0)
  const r = gender === 'male' ? 0.68 : 0.55 // 분포계수
  const metabolismRate = 0.015 // 시간당 감소율

  const bacPeak = (totalAlcohol / (weight * 1000 * r)) * 100
  const bac = Math.max(0, bacPeak - metabolismRate * elapsed)
  const bacStr = bac.toFixed(3)

  const soberHours = bacPeak / metabolismRate
  const soberRemain = Math.max(0, soberHours - elapsed)

  const getBacStatus = () => {
    if (bac < 0.03) return { level: 'safe', label: tx.safe, color: 'text-brand-400', bg: 'border-brand-500/30 bg-brand-500/10', emoji: '✅' }
    if (bac < 0.08) return { level: 'warning', label: tx.warning, color: 'text-yellow-400', bg: 'border-yellow-500/30 bg-yellow-500/10', emoji: '⚠️' }
    return { level: 'danger', label: tx.danger, color: 'text-red-400', bg: 'border-red-500/30 bg-red-500/10', emoji: '🚫' }
  }
  const status = getBacStatus()

  const EFFECTS = [
    { bac: 0.02, ko: '기분 좋음, 긴장 완화', en: 'Relaxed, mood enhanced' },
    { bac: 0.05, ko: '판단력 약간 저하, 반응 느려짐', en: 'Slightly impaired judgment' },
    { bac: 0.08, ko: '균형감각 저하, 반응시간 증가', en: 'Balance impaired, slower reactions' },
    { bac: 0.15, ko: '심한 운동능력 저하', en: 'Severely impaired motor skills' },
    { bac: 0.30, ko: '의식 잃을 수 있음', en: 'May lose consciousness' },
  ]

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-mono mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />Free Health Tool
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-3">{tx.title}</h1>
        <p className="text-slate-300 text-base max-w-xl mx-auto">{tx.desc}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-5 mb-5">
        {/* 입력 */}
        <div className="flex flex-col gap-3">
          <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4">
            <div className="flex gap-2 mb-3">
              {[['male', tx.male], ['female', tx.female]].map(([v, l]) => (
                <button key={v} onClick={() => setGender(v as 'male' | 'female')}
                  className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-all ${gender === v ? 'bg-brand-500 border-brand-500 text-white' : 'border-surface-border text-slate-300 bg-[#0f1117]'}`}>{l}</button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">{tx.weight}</label>
                <input type="number" min={30} max={200} value={weight} onChange={e => setWeight(+e.target.value)}
                  className="w-full bg-[#0f1117] border border-surface-border rounded-lg px-3 py-2 text-slate-200 text-lg font-mono text-center focus:outline-none focus:border-brand-500/50 transition-all" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">{tx.time}</label>
                <input type="number" min={0} max={24} step={0.5} value={elapsed} onChange={e => setElapsed(+e.target.value)}
                  className="w-full bg-[#0f1117] border border-surface-border rounded-lg px-3 py-2 text-slate-200 text-lg font-mono text-center focus:outline-none focus:border-brand-500/50 transition-all" />
              </div>
            </div>
          </div>

          {/* 음주 목록 */}
          <div className="rounded-xl border border-surface-border bg-[#1a1d27] overflow-hidden">
            <div className="px-3 py-2.5 border-b border-surface-border bg-[#0f1117]">
              <p className="text-xs font-medium text-slate-200">{tx.drinks}</p>
            </div>
            <div className="divide-y divide-surface-border">
              {items.map(item => (
                <div key={item.id} className="flex items-center gap-2 px-3 py-2.5">
                  <select value={item.drinkIdx} onChange={e => update(item.id, 'drinkIdx', +e.target.value)}
                    className="flex-1 bg-[#0f1117] border border-surface-border rounded px-2 py-1.5 text-slate-200 text-xs focus:outline-none focus:border-brand-500/50 transition-all">
                    {DRINKS.map((d, i) => <option key={i} value={i}>{lang === 'ko' ? d.name_ko : d.name_en}</option>)}
                  </select>
                  <div className="flex items-center gap-1">
                    <button onClick={() => update(item.id, 'count', Math.max(1, item.count - 1))} className="w-6 h-6 rounded border border-surface-border text-slate-300 hover:text-brand-400 text-xs transition-all">-</button>
                    <span className="w-8 text-center text-sm font-bold text-slate-200">{item.count}</span>
                    <button onClick={() => update(item.id, 'count', item.count + 1)} className="w-6 h-6 rounded border border-surface-border text-slate-300 hover:text-brand-400 text-xs transition-all">+</button>
                  </div>
                  <button onClick={() => removeItem(item.id)} className="text-slate-600 hover:text-red-400 text-xs transition-all">✕</button>
                </div>
              ))}
            </div>
            <button onClick={addItem} className="w-full py-2 text-xs text-brand-400 hover:text-brand-300 transition-all">+ {tx.addDrink}</button>
          </div>
        </div>

        {/* 결과 */}
        <div className="flex flex-col gap-3">
          <div className={`rounded-xl border p-5 text-center ${status.bg}`}>
            <p className="text-4xl mb-2">{status.emoji}</p>
            <p className="text-xs text-slate-400 mb-1">{tx.bac}</p>
            <p className={`text-5xl font-extrabold font-mono ${status.color}`}>{bacStr}%</p>
            <p className={`text-sm font-bold mt-2 ${status.color}`}>{status.label}</p>
            <button onClick={() => copy(bacStr, 'bac')} className={`mt-2 p-1.5 rounded border transition-all ${copied === 'bac' ? 'bg-brand-500/20 border-brand-500/40 text-brand-400' : 'border-surface-border text-slate-500 hover:text-brand-400'}`}>
              {copied === 'bac' ? <CheckCheck size={12} /> : <Copy size={12} />}
            </button>
          </div>

          <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4">
            <div className="flex flex-col gap-2 text-xs">
              {[
                [lang === 'ko' ? '총 순수 알코올' : 'Total Pure Alcohol', `${totalAlcohol.toFixed(1)}g`],
                [lang === 'ko' ? '최고 BAC (음주 직후)' : 'Peak BAC (right after)', `${bacPeak.toFixed(3)}%`],
                [lang === 'ko' ? '완전 해소까지' : 'Time to sober up', soberRemain > 0 ? `약 ${soberRemain.toFixed(1)}${lang === 'ko' ? '시간' : 'hr'}` : (lang === 'ko' ? '해소 완료' : 'Sober')],
              ].map(([l, v]) => (
                <div key={l as string} className="flex justify-between py-1.5 border-b border-surface-border last:border-0">
                  <span className="text-slate-400">{l}</span>
                  <span className="text-slate-200 font-mono font-bold">{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* BAC별 증상 */}
          <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-3">
            <p className="text-xs text-slate-400 font-medium mb-2">{lang === 'ko' ? '📊 BAC별 증상' : '📊 BAC Effects'}</p>
            {EFFECTS.map(e => (
              <div key={e.bac} className={`flex items-center gap-2 text-xs py-1 ${bac >= e.bac ? 'opacity-100' : 'opacity-30'}`}>
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${bac >= e.bac ? 'bg-red-400' : 'bg-slate-600'}`} />
                <span className="text-slate-400 w-12">{e.bac}%</span>
                <span className="text-slate-300">{lang === 'ko' ? e.ko : e.en}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-3 text-center">
        <p className="text-xs text-red-400/80">
          ⚠️ {lang === 'ko' ? '이 계산기는 추정값입니다. 개인의 신체 조건, 공복 여부, 피로도에 따라 실제 BAC가 달라집니다. 음주 후에는 절대 운전하지 마세요.' : 'This is an estimate. Actual BAC varies by individual factors, empty stomach, and fatigue. NEVER drink and drive.'}
        </p>
      </div>

      <ToolFooter
        toolName={lang === 'ko' ? '음주 계산기 (혈중알코올농도)' : 'Drinking Calculator (BAC)'}
        toolUrl="https://keyword-mixer.vercel.app/alcohol-calculator"
        description={tx.desc}
        howToUse={lang === 'ko' ? [
          { step: '성별과 체중 입력', desc: '성별과 체중에 따라 알코올 분포계수가 달라집니다.' },
          { step: '마신 술 입력', desc: '마신 술의 종류와 잔 수를 추가하세요.' },
          { step: '경과 시간 입력', desc: '음주 시작 후 얼마나 시간이 지났는지 입력하세요.' },
          { step: '결과 확인', desc: '현재 추정 BAC와 운전 가능 여부, 해소 시간을 확인하세요.' },
        ] : [
          { step: 'Enter gender and weight', desc: 'Affects alcohol distribution coefficient.' },
          { step: 'Add drinks', desc: 'Add types and quantities of drinks consumed.' },
          { step: 'Enter elapsed time', desc: 'Input hours since you started drinking.' },
          { step: 'View results', desc: 'See estimated BAC, driving safety, and sobering time.' },
        ]}
        whyUse={lang === 'ko' ? [
          { title: 'Widmark 공식 적용', desc: '검증된 Widmark 공식으로 혈중알코올농도를 추정합니다.' },
          { title: '한국 음주운전 기준', desc: 'BAC 0.03% 면허정지, 0.08% 면허취소 기준을 적용합니다.' },
          { title: '다양한 술 종류', desc: '소주, 맥주, 막걸리, 와인, 양주 등 8가지 주류를 지원합니다.' },
          { title: '해소 시간 계산', desc: '완전히 술이 깨는 예상 시간을 계산합니다.' },
        ] : [
          { title: 'Widmark formula', desc: 'Uses validated Widmark formula for BAC estimation.' },
          { title: 'Korean DUI standards', desc: 'Applies 0.03% license suspension, 0.08% revocation thresholds.' },
          { title: 'Multiple drink types', desc: 'Supports soju, beer, makgeolli, wine, whiskey and more.' },
          { title: 'Sobering time', desc: 'Calculates estimated time until fully sober.' },
        ]}
        faqs={lang === 'ko' ? [
          { q: '한국 음주운전 단속 기준은?', a: 'BAC 0.03% 이상: 면허정지 (100일) + 벌금. BAC 0.08% 이상: 면허취소 + 형사처벌. 2회 이상 또는 사고 시 가중처벌.' },
          { q: '음주 후 얼마나 지나야 운전할 수 있나요?', a: '개인차가 크지만 일반적으로 소주 1병 기준 약 5~6시간이 필요합니다. 이 계산기의 해소 시간을 참고하되, 안전을 위해 충분한 시간을 두세요.' },
          { q: '물이나 음식을 먹으면 BAC가 내려가나요?', a: '물은 BAC를 직접적으로 낮추지 않지만 탈수를 방지합니다. 음식은 알코올 흡수를 늦추지만 이미 흡수된 알코올은 낮추지 못합니다. 오직 시간만이 BAC를 낮춥니다.' },
          { q: '이 계산기는 법적 효력이 있나요?', a: '아니요. 이 계산기는 참고용 추정값입니다. 실제 BAC는 경찰 음주측정기나 혈액검사로만 정확히 알 수 있습니다.' },
        ] : [
          { q: 'Korean DUI limits?', a: 'BAC 0.03%+: License suspension (100 days) + fine. BAC 0.08%+: License revocation + criminal punishment.' },
          { q: 'How long after drinking to drive?', a: 'Varies widely. Generally 5-6 hours for 1 bottle of soju. Use this calculator as reference, but always err on the side of caution.' },
          { q: 'Does water or food lower BAC?', a: 'Water prevents dehydration but doesn\'t lower BAC. Food slows alcohol absorption but doesn\'t reduce already-absorbed alcohol. Only time lowers BAC.' },
          { q: 'Does this calculator have legal standing?', a: 'No. This is for reference only. Actual BAC can only be accurately measured by a breathalyzer or blood test.' },
        ]}
        keywords="음주 계산기 · 혈중알코올농도 계산 · BAC 계산기 · 음주운전 기준 · 술 깨는 시간 · 음주 측정 · alcohol calculator · BAC calculator Korea · blood alcohol content · drunk driving limit"
      />
    </div>
  )
}
