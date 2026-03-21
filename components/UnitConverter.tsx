'use client'

import ToolFooter from './ToolFooter'
import { useState } from 'react'
import { Copy, CheckCheck } from 'lucide-react'

const CATEGORIES = {
  '길이': {
    units: ['mm', 'cm', 'm', 'km', 'inch', 'ft', 'yard', 'mile'],
    base: 'm',
    toBase: { mm: 0.001, cm: 0.01, m: 1, km: 1000, inch: 0.0254, ft: 0.3048, yard: 0.9144, mile: 1609.344 },
    labels: { mm: '밀리미터', cm: '센티미터', m: '미터', km: '킬로미터', inch: '인치', ft: '피트', yard: '야드', mile: '마일' },
  },
  '무게': {
    units: ['mg', 'g', 'kg', 'ton', 'oz', 'lb'],
    base: 'kg',
    toBase: { mg: 0.000001, g: 0.001, kg: 1, ton: 1000, oz: 0.0283495, lb: 0.453592 },
    labels: { mg: '밀리그램', g: '그램', kg: '킬로그램', ton: '톤', oz: '온스', lb: '파운드' },
  },
  '온도': {
    units: ['°C', '°F', 'K'],
    base: '°C',
    toBase: {} as Record<string, number>,
    labels: { '°C': '섭씨', '°F': '화씨', K: '켈빈' },
  },
  '넓이': {
    units: ['mm²', 'cm²', 'm²', 'km²', '평', '아르', '헥타르', 'ft²', 'acre'],
    base: 'm²',
    toBase: { 'mm²': 0.000001, 'cm²': 0.0001, 'm²': 1, 'km²': 1000000, '평': 3.30579, '아르': 100, '헥타르': 10000, 'ft²': 0.092903, 'acre': 4046.86 },
    labels: { 'mm²': '제곱밀리미터', 'cm²': '제곱센티미터', 'm²': '제곱미터', 'km²': '제곱킬로미터', '평': '평', '아르': '아르', '헥타르': '헥타르', 'ft²': '제곱피트', 'acre': '에이커' },
  },
  '속도': {
    units: ['m/s', 'km/h', 'mph', 'knot'],
    base: 'm/s',
    toBase: { 'm/s': 1, 'km/h': 0.277778, 'mph': 0.44704, 'knot': 0.514444 },
    labels: { 'm/s': '미터/초', 'km/h': '킬로미터/시', 'mph': '마일/시', 'knot': '노트' },
  },
  '용량': {
    units: ['ml', 'L', 'fl oz', 'cup', 'pint', 'gallon'],
    base: 'L',
    toBase: { ml: 0.001, L: 1, 'fl oz': 0.0295735, cup: 0.236588, pint: 0.473176, gallon: 3.78541 },
    labels: { ml: '밀리리터', L: '리터', 'fl oz': '액량온스', cup: '컵', pint: '파인트', gallon: '갤런' },
  },
}

function convertTemp(val: number, from: string, to: string): number {
  let celsius = val
  if (from === '°F') celsius = (val - 32) * 5 / 9
  if (from === 'K') celsius = val - 273.15
  if (to === '°C') return celsius
  if (to === '°F') return celsius * 9 / 5 + 32
  if (to === 'K') return celsius + 273.15
  return celsius
}

type CategoryKey = keyof typeof CATEGORIES

export default function UnitConverter() {
  const [category, setCategory] = useState<CategoryKey>('길이')
  const [fromUnit, setFromUnit] = useState('m')
  const [toUnit, setToUnit] = useState('cm')
  const [value, setValue] = useState('1')
  const [copied, setCopied] = useState(false)

  const cat = CATEGORIES[category]

  const convert = (v: string, from: string, to: string): string => {
    const num = parseFloat(v)
    if (isNaN(num)) return ''
    if (category === '온도') {
      return convertTemp(num, from, to).toFixed(6).replace(/\.?0+$/, '')
    }
    const toBase = (cat as typeof CATEGORIES['길이']).toBase
    const baseVal = num * (toBase[from as keyof typeof toBase] ?? 1)
    const result = baseVal / (toBase[to as keyof typeof toBase] ?? 1)    
    return result.toFixed(10).replace(/\.?0+$/, '')
  }

  const result = convert(value, fromUnit, toUnit)

  const copy = async () => {
    if (!result) return
    await navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const swap = () => {
    const tmp = fromUnit
    setFromUnit(toUnit)
    setToUnit(tmp)
  }

  // All conversions at once
  const allResults = cat.units
    .filter(u => u !== fromUnit)
    .map(u => ({
      unit: u,
      label: (cat as typeof CATEGORIES['길이']).labels[u as keyof (typeof CATEGORIES['길이'])['labels']] ?? u,
      result: convert(value, fromUnit, u),
    }))

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-mono mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
          Free Tool
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-3 tracking-tight">단위 변환기</h1>
        <p className="text-slate-300 text-base max-w-lg mx-auto">
          길이·무게·온도·넓이·속도·용량 단위를 즉시 변환. 한 번에 모든 단위 결과 확인.
        </p>
      </div>

      {/* Category */}
      <div className="flex flex-wrap gap-2 mb-6">
        {Object.keys(CATEGORIES).map(c => (
          <button
            key={c}
            onClick={() => {
              setCategory(c as CategoryKey)
              setFromUnit(CATEGORIES[c as CategoryKey].units[0])
              setToUnit(CATEGORIES[c as CategoryKey].units[1])
            }}
            className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
              category === c ? 'bg-brand-500 border-brand-500 text-white font-bold' : 'border-surface-border text-slate-300 hover:border-brand-500/40 hover:text-brand-300 bg-surface-card'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Converter */}
      <div className="rounded-xl border border-surface-border bg-surface-card p-5 mb-6">
        <div className="grid grid-cols-[1fr,auto,1fr] items-end gap-3 mb-6">
          {/* From */}
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block font-medium">변환할 값</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={value}
                onChange={e => setValue(e.target.value)}
                className="flex-1 bg-surface-DEFAULT border border-surface-border rounded-lg px-3 py-2.5 text-slate-200 text-lg font-mono focus:outline-none focus:border-brand-500/50 transition-all"
              />
              <select
                value={fromUnit}
                onChange={e => setFromUnit(e.target.value)}
                className="bg-surface-DEFAULT border border-surface-border rounded-lg px-3 py-2.5 text-slate-200 text-sm focus:outline-none focus:border-brand-500/50 transition-all"
              >
                {cat.units.map(u => (
                  <option key={u} value={u}>{u} — {(cat as typeof CATEGORIES['길이']).labels[u]}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Swap */}
          <button onClick={swap} className="mb-0.5 px-3 py-2.5 rounded-lg border border-surface-border text-slate-300 hover:text-brand-400 hover:border-brand-500/40 bg-surface-DEFAULT transition-all text-lg">
            ⇄
          </button>

          {/* To */}
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block font-medium">변환 결과</label>
            <div className="flex gap-2">
              <div className="flex-1 bg-surface-DEFAULT border border-brand-500/30 rounded-lg px-3 py-2.5 text-brand-400 text-lg font-mono flex items-center">
                {result || '—'}
              </div>
              <div className="flex gap-1">
                <select
                  value={toUnit}
                  onChange={e => setToUnit(e.target.value)}
                  className="bg-surface-DEFAULT border border-surface-border rounded-lg px-3 py-2.5 text-slate-200 text-sm focus:outline-none focus:border-brand-500/50 transition-all"
                >
                  {cat.units.map(u => (
                    <option key={u} value={u}>{u} — {(cat as typeof CATEGORIES['길이']).labels[u]}</option>
                  ))}
                </select>
                <button onClick={copy} className={`px-3 py-2.5 rounded-lg border transition-all ${copied ? 'bg-brand-500/20 border-brand-500/40 text-brand-400' : 'border-surface-border text-slate-400 hover:border-brand-500/40 hover:text-brand-300 bg-surface-DEFAULT'}`}>
                  {copied ? <CheckCheck size={14} /> : <Copy size={14} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* All results */}
        <div>
          <p className="text-xs text-slate-400 mb-3 font-medium">전체 단위 변환 결과</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {allResults.map(r => (
              <div key={r.unit} className="flex items-center justify-between p-2.5 rounded-lg bg-surface-DEFAULT border border-surface-border hover:border-brand-500/30 transition-all">
                <div>
                  <p className="text-xs text-slate-500">{r.label}</p>
                  <p className="text-sm font-mono text-slate-200 font-medium">{r.result || '—'} <span className="text-slate-500">{r.unit}</span></p>
                </div>
                <button
                  onClick={async () => { await navigator.clipboard.writeText(r.result); }}
                  className="p-1.5 rounded border border-surface-border text-slate-600 hover:text-brand-400 hover:border-brand-500/40 transition-all"
                >
                  <Copy size={11} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SEO */}
      <ToolFooter
        toolName="단위 변환기"
        toolUrl="https://keyword-mixer.vercel.app/unit-converter"
        description="길이·무게·온도·넓이·속도·용량 단위를 즉시 변환."
        howToUse={[
          { step: "카테고리 선택", desc: "길이, 무게, 온도, 넓이, 속도, 용량 중 변환할 카테고리를 선택하세요." },
          { step: "값 입력", desc: "변환할 숫자를 입력하고 원본 단위를 선택하세요." },
          { step: "단위 선택", desc: "변환할 목표 단위를 선택하면 즉시 결과가 표시됩니다." },
          { step: "전체 결과 확인", desc: "하단에 모든 단위로 변환된 결과가 한번에 표시됩니다." },
        ]}
        whyUse={[
          { title: "6가지 카테고리", desc: "길이부터 용량까지 일상과 업무에서 자주 쓰는 모든 단위를 지원합니다." },
          { title: "전체 단위 동시 표시", desc: "한 번 입력으로 관련된 모든 단위의 결과를 바로 확인할 수 있습니다." },
          { title: "정밀한 계산", desc: "부동소수점 정밀 계산으로 소수점 이하도 정확하게 변환합니다." },
          { title: "스왑 기능", desc: "버튼 하나로 변환 방향을 즉시 반전할 수 있습니다." },
        ]}
        faqs={[
          { q: "평과 제곱미터 변환은?", a: "넓이 카테고리에서 평과 m²를 선택하면 됩니다. 1평 = 3.30579 m²입니다." },
          { q: "화씨와 섭씨 변환은?", a: "온도 카테고리에서 °C와 °F를 선택하세요. 변환 공식: (°F - 32) × 5/9 = °C" },
          { q: "국제 단위(SI)란?", a: "m, kg, L 등 국제 표준 단위계입니다. 과학·공학에서 공식적으로 사용합니다." },
          { q: "인치와 센티미터 변환은?", a: "1인치 = 2.54cm입니다. 길이 카테고리에서 inch와 cm를 선택하세요." },
        ]}
        keywords="단위 변환기 · 길이 변환 · 무게 변환 · 온도 변환 · 넓이 변환 · 평 제곱미터 변환 · 인치 센티미터 · 섭씨 화씨 · unit converter · length converter · weight converter · temperature converter · metric converter"
      />
    </div>
  )
}
