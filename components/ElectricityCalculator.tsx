'use client'
import { useState } from 'react'
import { Copy, CheckCheck, Plus, Trash2 } from 'lucide-react'
import { useLang } from './LangContext'
import ToolFooter from './ToolFooter'

const T = {
  ko: { title: '전기요금 계산기', desc: '가전제품별 전력 소비량과 사용 시간으로 월 전기요금 추정. 누진세 자동 적용.' },
  en: { title: 'Electricity Bill Calculator', desc: 'Estimate monthly electricity costs by appliance usage. Auto-applies progressive rate structure.' }
}

const APPLIANCES = [
  { ko: '에어컨 (1등급)', en: 'AC (Grade 1)', watts: 900 },
  { ko: '에어컨 (일반)', en: 'AC (Standard)', watts: 1500 },
  { ko: '냉장고', en: 'Refrigerator', watts: 50 },
  { ko: 'TV (55인치)', en: 'TV (55")', watts: 130 },
  { ko: 'TV (43인치)', en: 'TV (43")', watts: 80 },
  { ko: '세탁기', en: 'Washing Machine', watts: 500 },
  { ko: '전기밥솥', en: 'Rice Cooker', watts: 1000 },
  { ko: '전자레인지', en: 'Microwave', watts: 1000 },
  { ko: '식기세척기', en: 'Dishwasher', watts: 1500 },
  { ko: '컴퓨터 (데스크탑)', en: 'Desktop PC', watts: 300 },
  { ko: '노트북', en: 'Laptop', watts: 60 },
  { ko: '스마트폰 충전', en: 'Phone Charger', watts: 20 },
  { ko: 'LED 전등', en: 'LED Light', watts: 10 },
  { ko: '형광등', en: 'Fluorescent', watts: 36 },
  { ko: '전기온풍기', en: 'Electric Heater', watts: 2000 },
  { ko: '인덕션', en: 'Induction Cooker', watts: 2000 },
]

// 한국 주택용 전기요금 누진세 (2024년)
function calcElectricity(kwh: number): number {
  let bill = 0
  // 1구간: 200kWh 이하 (88.3원/kWh)
  // 2구간: 201~400kWh (182.9원/kWh)
  // 3구간: 400kWh 초과 (275.6원/kWh)
  const b1 = Math.min(kwh, 200)
  const b2 = Math.max(0, Math.min(kwh - 200, 200))
  const b3 = Math.max(0, kwh - 400)
  bill = b1 * 88.3 + b2 * 182.9 + b3 * 275.6
  // 기본요금
  if (kwh <= 200) bill += 910
  else if (kwh <= 400) bill += 1600
  else bill += 7300
  // 부가세 10% + 전력기반기금 3.7%
  bill *= 1.137
  return Math.round(bill)
}

function comma(n: number) { return Math.round(n).toLocaleString('ko-KR') }

interface Item { name: string; watts: number; hoursPerDay: number; daysPerMonth: number }

export default function ElectricityCalculator() {
  const { lang } = useLang()
  const tx = T[lang]
  const [items, setItems] = useState<Item[]>([
    { name: lang === 'ko' ? '에어컨 (일반)' : 'AC (Standard)', watts: 1500, hoursPerDay: 8, daysPerMonth: 30 },
    { name: lang === 'ko' ? '냉장고' : 'Refrigerator', watts: 50, hoursPerDay: 24, daysPerMonth: 30 },
    { name: 'TV (55")', watts: 130, hoursPerDay: 4, daysPerMonth: 30 },
    { name: lang === 'ko' ? '노트북' : 'Laptop', watts: 60, hoursPerDay: 8, daysPerMonth: 25 },
  ])
  const [copied, setCopied] = useState<string | null>(null)
  const copy = async (text: string, key: string) => { await navigator.clipboard.writeText(text); setCopied(key); setTimeout(() => setCopied(null), 1500) }

  const addItem = () => setItems(p => [...p, { name: '', watts: 100, hoursPerDay: 4, daysPerMonth: 30 }])
  const removeItem = (i: number) => setItems(p => p.filter((_, j) => j !== i))
  const update = (i: number, k: keyof Item, v: string | number) => setItems(p => p.map((it, j) => j === i ? { ...it, [k]: v } : it))

  const itemKwhs = items.map(it => (it.watts / 1000) * it.hoursPerDay * it.daysPerMonth)
  const totalKwh = itemKwhs.reduce((s, k) => s + k, 0)
  const totalBill = calcElectricity(totalKwh)

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-mono mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />Free Tool
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-3">{tx.title}</h1>
        <p className="text-slate-300 text-base max-w-xl mx-auto">{tx.desc}</p>
      </div>

      {/* 가전제품 추가 */}
      <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4 mb-4">
        <p className="text-xs text-slate-400 mb-2 font-medium">{lang === 'ko' ? '빠른 추가' : 'Quick Add'}</p>
        <div className="flex flex-wrap gap-1.5">
          {APPLIANCES.map(a => (
            <button key={a.ko} onClick={() => setItems(p => [...p, { name: lang === 'ko' ? a.ko : a.en, watts: a.watts, hoursPerDay: 4, daysPerMonth: 30 }])}
              className="text-xs px-2.5 py-1.5 rounded-lg border border-surface-border text-slate-300 hover:border-brand-500/40 hover:text-brand-300 bg-[#0f1117] transition-all">
              + {lang === 'ko' ? a.ko : a.en}
            </button>
          ))}
        </div>
      </div>

      {/* 항목 목록 */}
      <div className="rounded-xl border border-surface-border bg-[#1a1d27] overflow-hidden mb-5">
        <div className="grid grid-cols-12 gap-0 px-4 py-2 bg-[#0f1117] border-b border-surface-border text-xs text-slate-500 font-medium">
          <span className="col-span-4">{lang === 'ko' ? '기기명' : 'Appliance'}</span>
          <span className="col-span-2 text-center">{lang === 'ko' ? '소비전력(W)' : 'Watts'}</span>
          <span className="col-span-2 text-center">{lang === 'ko' ? '일사용(h)' : 'hrs/day'}</span>
          <span className="col-span-2 text-center">{lang === 'ko' ? '월사용(일)' : 'days/mo'}</span>
          <span className="col-span-1 text-center">kWh</span>
          <span className="col-span-1"></span>
        </div>
        {items.map((item, i) => (
          <div key={i} className="grid grid-cols-12 gap-0 px-4 py-2 border-b border-surface-border hover:bg-surface-hover/5 items-center">
            <div className="col-span-4 pr-2">
              <input value={item.name} onChange={e => update(i, 'name', e.target.value)}
                className="w-full bg-transparent text-xs text-slate-200 focus:outline-none" />
            </div>
            {[
              { key: 'watts' as const, col: 2 },
              { key: 'hoursPerDay' as const, col: 2 },
              { key: 'daysPerMonth' as const, col: 2 },
            ].map(f => (
              <div key={f.key} className={`col-span-${f.col} px-1`}>
                <input type="number" value={(item as any)[f.key]} min={0} onChange={e => update(i, f.key, +e.target.value)}
                  className="w-full bg-[#0f1117] border border-surface-border rounded px-2 py-1 text-xs text-slate-200 font-mono text-center focus:outline-none focus:border-brand-500/50 transition-all" />
              </div>
            ))}
            <div className="col-span-1 text-center">
              <span className="text-xs text-brand-400 font-mono">{itemKwhs[i].toFixed(1)}</span>
            </div>
            <div className="col-span-1 flex justify-center">
              <button onClick={() => removeItem(i)} className="text-slate-600 hover:text-red-400 transition-all">
                <Trash2 size={12} />
              </button>
            </div>
          </div>
        ))}
        <button onClick={addItem} className="w-full py-2 text-xs text-brand-400 hover:text-brand-300 flex items-center justify-center gap-1 transition-all">
          <Plus size={12} /> {lang === 'ko' ? '항목 추가' : 'Add Item'}
        </button>
      </div>

      {/* 결과 */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="rounded-xl border border-brand-500/30 bg-brand-500/10 p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400">{lang === 'ko' ? '월 예상 전기요금' : 'Est. Monthly Bill'}</p>
            <p className="text-3xl font-extrabold text-brand-400 font-mono">₩{comma(totalBill)}</p>
          </div>
          <button onClick={() => copy(String(totalBill), 'bill')} className={`p-2 rounded-lg border transition-all ${copied === 'bill' ? 'bg-brand-500/20 border-brand-500/40 text-brand-400' : 'border-surface-border text-slate-500 hover:text-brand-400'}`}>
            {copied === 'bill' ? <CheckCheck size={14} /> : <Copy size={14} />}
          </button>
        </div>
        <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4">
          <p className="text-xs text-slate-400">{lang === 'ko' ? '월 사용량' : 'Monthly Usage'}</p>
          <p className="text-3xl font-extrabold text-slate-200 font-mono">{totalKwh.toFixed(0)} kWh</p>
          <p className="text-xs text-slate-500 mt-1">
            {totalKwh <= 200 ? (lang === 'ko' ? '1구간 (기본)' : 'Tier 1 (Basic)')
              : totalKwh <= 400 ? (lang === 'ko' ? '2구간 (중간)' : 'Tier 2 (Mid)')
              : (lang === 'ko' ? '3구간 (누진)' : 'Tier 3 (High)')}
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4">
        <p className="text-xs text-slate-400 font-medium mb-2">{lang === 'ko' ? '💡 누진세 구간 안내 (주택용)' : '💡 Progressive Rate Tiers (Residential)'}</p>
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: lang === 'ko' ? '1구간 (~200kWh)' : 'Tier 1 (≤200kWh)', rate: '88.3원/kWh', base: '기본료 910원', active: totalKwh <= 200 },
            { label: lang === 'ko' ? '2구간 (201~400kWh)' : 'Tier 2 (201-400)', rate: '182.9원/kWh', base: '기본료 1,600원', active: totalKwh > 200 && totalKwh <= 400 },
            { label: lang === 'ko' ? '3구간 (400kWh~)' : 'Tier 3 (400+)', rate: '275.6원/kWh', base: '기본료 7,300원', active: totalKwh > 400 },
          ].map(t => (
            <div key={t.label} className={`rounded-lg border p-2.5 text-xs ${t.active ? 'border-brand-500/40 bg-brand-500/10' : 'border-surface-border bg-[#0f1117]'}`}>
              <p className={`font-medium mb-1 ${t.active ? 'text-brand-400' : 'text-slate-400'}`}>{t.label}</p>
              <p className="text-slate-300">{t.rate}</p>
              <p className="text-slate-500">{t.base}</p>
            </div>
          ))}
        </div>
      </div>

      <ToolFooter
        toolName={lang === 'ko' ? '전기요금 계산기' : 'Electricity Bill Calculator'}
        toolUrl="https://keyword-mixer.vercel.app/electricity-calculator"
        description={tx.desc}
        howToUse={lang === 'ko' ? [
          { step: '가전제품 추가', desc: '빠른 추가 버튼으로 가전제품을 선택하거나 직접 입력하세요.' },
          { step: '사용 시간 입력', desc: '각 기기의 하루 사용 시간과 월 사용 일수를 입력하세요.' },
          { step: '요금 확인', desc: '누진세가 자동으로 적용된 월 예상 전기요금이 계산됩니다.' },
          { step: '절감 방법 파악', desc: '어떤 기기가 전기를 많이 쓰는지 파악해 절약 방법을 찾으세요.' },
        ] : [
          { step: 'Add appliances', desc: 'Use quick add buttons or type appliance names manually.' },
          { step: 'Enter usage time', desc: 'Input daily hours and monthly days of use for each item.' },
          { step: 'View bill estimate', desc: 'Monthly bill with progressive rates applied automatically.' },
          { step: 'Find savings', desc: 'Identify which appliances use the most power to reduce costs.' },
        ]}
        whyUse={lang === 'ko' ? [
          { title: '누진세 자동 적용', desc: '한국 주택용 전기 누진세를 자동으로 계산합니다.' },
          { title: '기기별 사용량 확인', desc: '각 가전제품의 kWh 사용량을 개별적으로 확인합니다.' },
          { title: '부가세 포함', desc: '부가세 10%와 전력기반기금 3.7%까지 포함한 실제 요금을 계산합니다.' },
          { title: '30가지 가전제품 프리셋', desc: '자주 사용하는 가전제품의 소비전력 데이터를 내장했습니다.' },
        ] : [
          { title: 'Auto progressive rates', desc: 'Automatically applies Korean residential progressive electricity rates.' },
          { title: 'Per-appliance usage', desc: 'See individual kWh consumption for each appliance.' },
          { title: 'All taxes included', desc: 'Includes 10% VAT and 3.7% power infrastructure fund.' },
          { title: '30 appliance presets', desc: 'Built-in power data for 30 common household appliances.' },
        ]}
        faqs={lang === 'ko' ? [
          { q: '전기요금 누진세란?', a: '월 사용량이 많을수록 높은 단가가 적용되는 구조입니다. 200kWh 이하 1구간, 201~400kWh 2구간, 400kWh 초과 3구간으로 나뉩니다.' },
          { q: '에어컨이 전기요금을 얼마나 올리나요?', a: '1.5kW 에어컨을 하루 8시간 30일 사용 시 약 360kWh를 소모합니다. 이로 인해 월 전기요금이 크게 올라 누진 3구간으로 진입할 수 있습니다.' },
          { q: '전기요금을 줄이는 방법은?', a: '에어컨 온도를 1도 올리면 약 7% 절약됩니다. LED 전구로 교체, 대기전력 차단, 에너지 효율 등급 높은 제품 구매가 효과적입니다.' },
          { q: '계산 요금과 실제 요금이 다른 이유는?', a: '이 계산기는 추정치입니다. 실제 요금은 계절별 요금 조정, 복지 할인, TV수신료 포함 여부 등에 따라 다릅니다.' },
        ] : [
          { q: 'What is progressive electricity rate?', a: 'Higher usage incurs higher unit prices. 3 tiers: up to 200kWh, 201-400kWh, and over 400kWh.' },
          { q: 'How much does AC affect the bill?', a: '1.5kW AC running 8hr/day for 30 days uses ~360kWh. This can push you into the highest tier.' },
          { q: 'How to reduce electricity bills?', a: 'Raise AC temperature by 1°C to save ~7%. Switch to LED bulbs, cut standby power, buy high-efficiency appliances.' },
          { q: 'Why might actual bill differ?', a: 'This is an estimate. Actual bills vary by seasonal adjustments, welfare discounts, and TV license fees.' },
        ]}
        keywords="전기요금 계산기 · 전기세 계산 · 누진세 계산기 · 월 전기요금 · 에어컨 전기세 · 가전제품 전기요금 · electricity bill calculator Korea · electric bill estimator · progressive electricity rate · 전기요금 누진세"
      />
    </div>
  )
}
