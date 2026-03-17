'use client'

import { useState } from 'react'
import { useLang } from './LangContext'
import ToolFooter from './ToolFooter'

const T = {
  ko: {
    title: '평수 계산기',
    desc: '아파트 평수↔제곱미터 즉시 변환. 전용면적·공급면적·건축면적 차이 안내.',
    inputLabel: '면적 입력',
    fromUnit: '변환할 단위',
    toUnit: '결과 단위',
    result: '변환 결과',
    pyeong: '평 (坪)',
    sqm: '제곱미터 (m²)',
    sqft: '제곱피트 (ft²)',
    sqyard: '제곱야드 (yd²)',
    acre: '에이커 (acre)',
    tips: '아파트 면적 기준 안내',
    tip1: '전용면적: 실제 사용 가능한 면적 (방, 거실, 주방, 욕실)',
    tip2: '공급면적: 전용면적 + 주거공용면적 (계단, 복도)',
    tip3: '계약면적: 공급면적 + 기타공용면적 (주차장, 관리실)',
    commonSizes: '주요 아파트 평형',
    swap: '단위 교환',
  },
  en: {
    title: 'Area Converter (Pyeong ↔ m²)',
    desc: 'Convert Korean Pyeong to square meters instantly. Apartment area guide included.',
    inputLabel: 'Enter Area',
    fromUnit: 'From Unit',
    toUnit: 'To Unit',
    result: 'Result',
    pyeong: 'Pyeong (평)',
    sqm: 'Square Meter (m²)',
    sqft: 'Square Feet (ft²)',
    sqyard: 'Square Yard (yd²)',
    acre: 'Acre',
    tips: 'Korean Apartment Area Guide',
    tip1: 'Exclusive area (전용면적): Actual living space (rooms, kitchen, bathroom)',
    tip2: 'Supply area (공급면적): Exclusive + shared hallways, stairs',
    tip3: 'Contract area (계약면적): Supply area + parking, management office',
    commonSizes: 'Common Apartment Sizes',
    swap: 'Swap Units',
  }
}

const UNITS = ['pyeong', 'sqm', 'sqft', 'sqyard', 'acre'] as const
type Unit = typeof UNITS[number]

const TO_SQM: Record<Unit, number> = {
  pyeong: 3.30579,
  sqm: 1,
  sqft: 0.092903,
  sqyard: 0.836127,
  acre: 4046.86,
}

const COMMON_SIZES = [
  { pyeong: 10, label: '10평', desc: '원룸/소형' },
  { pyeong: 20, label: '20평', desc: '소형 아파트' },
  { pyeong: 25, label: '25평', desc: '중소형 (국민평형)' },
  { pyeong: 30, label: '30평', desc: '중형 아파트' },
  { pyeong: 33, label: '33평', desc: '중형 (84m²)' },
  { pyeong: 40, label: '40평', desc: '중대형' },
  { pyeong: 50, label: '50평', desc: '대형' },
  { pyeong: 60, label: '60평', desc: '초대형' },
]

export default function PyeongsuCalculator() {
  const { lang } = useLang()
  const tx = T[lang]

  const [value, setValue] = useState('33')
  const [from, setFrom] = useState<Unit>('pyeong')
  const [to, setTo] = useState<Unit>('sqm')

  const convert = (val: number, f: Unit, t: Unit) => {
    const sqm = val * TO_SQM[f]
    return sqm / TO_SQM[t]
  }

  const result = convert(parseFloat(value) || 0, from, to)

  const unitLabel = (u: Unit) => ({
    pyeong: tx.pyeong,
    sqm: tx.sqm,
    sqft: tx.sqft,
    sqyard: tx.sqyard,
    acre: tx.acre,
  }[u])

  // 모든 단위 동시 결과
  const allResults = UNITS.filter(u => u !== from).map(u => ({
    unit: u,
    label: unitLabel(u),
    value: convert(parseFloat(value) || 0, from, u),
  }))

  const swap = () => { setFrom(to); setTo(from) }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-mono mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
          Free Tool
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-3 tracking-tight">{tx.title}</h1>
        <p className="text-slate-300 text-base max-w-lg mx-auto">{tx.desc}</p>
      </div>

      {/* 변환기 */}
      <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-5 mb-5">
        <div className="grid grid-cols-[1fr,auto,1fr] items-end gap-3 mb-5">
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block font-medium">{tx.inputLabel}</label>
            <input
              type="number"
              value={value}
              onChange={e => setValue(e.target.value)}
              className="w-full bg-[#0f1117] border border-surface-border rounded-xl px-4 py-3 text-slate-200 text-xl font-mono focus:outline-none focus:border-brand-500/50 transition-all"
            />
            <select value={from} onChange={e => setFrom(e.target.value as Unit)}
              className="w-full mt-2 bg-[#0f1117] border border-surface-border rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-brand-500/50 transition-all">
              {UNITS.map(u => <option key={u} value={u}>{unitLabel(u)}</option>)}
            </select>
          </div>

          <button onClick={swap}
            className="mb-0.5 px-3 py-3 rounded-xl border border-surface-border text-slate-300 hover:text-brand-400 hover:border-brand-500/40 transition-all text-lg">
            ⇄
          </button>

          <div>
            <label className="text-xs text-slate-400 mb-1.5 block font-medium">{tx.result}</label>
            <div className="w-full bg-[#0f1117] border border-brand-500/30 rounded-xl px-4 py-3 text-brand-400 text-xl font-mono min-h-[52px] flex items-center">
              {result.toFixed(4).replace(/\.?0+$/, '')}
            </div>
            <select value={to} onChange={e => setTo(e.target.value as Unit)}
              className="w-full mt-2 bg-[#0f1117] border border-surface-border rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-brand-500/50 transition-all">
              {UNITS.map(u => <option key={u} value={u}>{unitLabel(u)}</option>)}
            </select>
          </div>
        </div>

        {/* 전체 단위 결과 */}
        <div>
          <p className="text-xs text-slate-500 mb-2 font-medium">
            {lang === 'ko' ? '전체 단위 변환 결과' : 'All Unit Conversions'}
          </p>
          <div className="grid grid-cols-2 gap-2">
            {allResults.map(r => (
              <div key={r.unit} className="flex items-center justify-between p-2.5 rounded-lg bg-[#0f1117] border border-surface-border">
                <span className="text-xs text-slate-400">{r.label}</span>
                <span className="text-sm font-mono text-slate-200 font-bold">
                  {r.value < 0.01 ? r.value.toFixed(6) : r.value.toFixed(2).replace(/\.?0+$/, '')}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 주요 평형 */}
      <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-5 mb-5">
        <p className="text-sm font-semibold text-slate-200 mb-3">{tx.commonSizes}</p>
        <div className="grid grid-cols-4 gap-2">
          {COMMON_SIZES.map(s => (
            <button key={s.pyeong} onClick={() => { setValue(String(s.pyeong)); setFrom('pyeong'); setTo('sqm') }}
              className="p-2.5 rounded-lg border border-surface-border hover:border-brand-500/40 hover:bg-brand-500/5 transition-all text-center">
              <p className="text-sm font-bold text-slate-200">{s.label}</p>
              <p className="text-xs text-brand-400 font-mono">{(s.pyeong * 3.30579).toFixed(1)}m²</p>
              <p className="text-xs text-slate-500 mt-0.5">{s.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* 면적 기준 안내 */}
      <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-5">
        <p className="text-sm font-semibold text-slate-200 mb-3">{tx.tips}</p>
        <div className="flex flex-col gap-2">
          {[tx.tip1, tx.tip2, tx.tip3].map((tip, i) => (
            <div key={i} className="flex gap-2 items-start text-xs text-slate-400">
              <span className="w-4 h-4 rounded-full bg-brand-500/20 text-brand-400 flex items-center justify-center flex-shrink-0 text-xs font-bold">{i + 1}</span>
              {tip}
            </div>
          ))}
        </div>
      </div>

      <ToolFooter
        toolName={lang === 'ko' ? '평수 계산기' : 'Pyeong to m² Converter'}
        toolUrl="https://keyword-mixer.vercel.app/pyeongsu-calculator"
        description={tx.desc}
        howToUse={lang === 'ko' ? [
          { step: '면적 값 입력', desc: '변환할 면적 수치를 입력하세요.' },
          { step: '단위 선택', desc: '평, m², ft² 등 변환할 단위를 선택하세요.' },
          { step: '결과 확인', desc: '목표 단위의 결과가 즉시 표시됩니다.' },
          { step: '평형 버튼 활용', desc: '주요 아파트 평형 버튼을 클릭하면 자동으로 입력됩니다.' },
        ] : [
          { step: 'Enter area value', desc: 'Type the area number you want to convert.' },
          { step: 'Select units', desc: 'Choose from Pyeong, m², ft², yd², or acre.' },
          { step: 'Get instant result', desc: 'See the converted value immediately.' },
          { step: 'Use preset sizes', desc: 'Click common apartment sizes for quick conversion.' },
        ]}
        whyUse={lang === 'ko' ? [
          { title: '평수 계산 필수', desc: '아파트 매매·임대 시 평수와 m² 변환은 필수입니다.' },
          { title: '전용/공급면적 안내', desc: '전용·공급·계약면적 차이를 한눈에 이해할 수 있습니다.' },
          { title: '주요 평형 즉시 확인', desc: '10평~60평까지 주요 아파트 평형을 클릭 한 번으로 확인하세요.' },
          { title: '다양한 단위 지원', desc: '평, m², ft², yd², 에이커까지 5가지 단위를 지원합니다.' },
        ] : [
          { title: 'Essential for Korea real estate', desc: 'Pyeong is the standard unit used in Korean real estate.' },
          { title: 'Multiple units', desc: 'Convert between Pyeong, m², ft², yd², and acres.' },
          { title: 'Apartment size guide', desc: 'Quick reference for common Korean apartment sizes.' },
          { title: 'Instant conversion', desc: 'Real-time conversion as you type.' },
        ]}
        faqs={lang === 'ko' ? [
          { q: '1평은 몇 m²인가요?', a: '1평 = 3.30579 m²입니다. 반올림해서 약 3.3m²로 계산하기도 합니다.' },
          { q: '33평이 왜 84m²인가요?', a: '33평 × 3.30579 = 109m²인데, 이는 공급면적입니다. 전용면적 기준으로는 약 84m²입니다. 분양 광고에서는 전용면적을 주로 표기합니다.' },
          { q: '전용면적과 공급면적 차이는?', a: '전용면적은 실제 내 집 면적(방·거실·주방·화장실), 공급면적은 전용면적 + 공용복도·계단 면적입니다.' },
          { q: '국민평형이란?', a: '25~34평(전용 59~84m²)을 국민평형이라고 합니다. 한국에서 가장 많이 거래되는 아파트 크기입니다.' },
        ] : [
          { q: 'How much is 1 Pyeong in m²?', a: '1 Pyeong = 3.30579 m² (approximately 3.3 m²).' },
          { q: 'What is the difference between exclusive and supply area?', a: 'Exclusive area is your actual living space. Supply area includes shared hallways and stairs.' },
          { q: 'What is 33 Pyeong in m²?', a: '33 Pyeong = ~109 m² (supply area) or ~84 m² (exclusive area). Listings usually show exclusive area.' },
          { q: 'Is Pyeong used only in Korea?', a: 'Pyeong (평) is a traditional unit used primarily in Korea, Taiwan, and Japan (tsubo in Japanese).' },
        ]}
        keywords="평수 계산기 · 평 m2 변환 · 평수 계산 · 아파트 평수 · 평수 제곱미터 · 전용면적 공급면적 · pyeong to square meter · pyeong calculator · Korean apartment size · 평 to m2 converter · area converter · 33평 몇m2"
      />
    </div>
  )
}
