
'use client'
import { useState } from 'react'
import { Copy, CheckCheck } from 'lucide-react'
import { useLang } from './LangContext'
import ToolFooter from './ToolFooter'

const T = {
  ko: { title: '속력/거리/시간 계산기', desc: '속력·거리·시간 중 두 가지를 입력해 나머지를 계산. 단위 변환 포함.' },
  en: { title: 'Speed/Distance/Time Calculator', desc: 'Calculate speed, distance, or time by entering any two values. Includes unit conversion.' }
}

const SPEED_UNITS = ['km/h', 'm/s', 'mph', 'knots']
const DIST_UNITS = ['km', 'm', 'miles', 'ft']
const TIME_UNITS = ['hours', 'minutes', 'seconds']

function toKmh(val: number, unit: string): number {
  if (unit === 'km/h') return val
  if (unit === 'm/s') return val * 3.6
  if (unit === 'mph') return val * 1.60934
  if (unit === 'knots') return val * 1.852
  return val
}
function fromKmh(val: number, unit: string): number {
  if (unit === 'km/h') return val
  if (unit === 'm/s') return val / 3.6
  if (unit === 'mph') return val / 1.60934
  if (unit === 'knots') return val / 1.852
  return val
}
function toKm(val: number, unit: string): number {
  if (unit === 'km') return val
  if (unit === 'm') return val / 1000
  if (unit === 'miles') return val * 1.60934
  if (unit === 'ft') return val * 0.0003048
  return val
}
function fromKm(val: number, unit: string): number {
  if (unit === 'km') return val
  if (unit === 'm') return val * 1000
  if (unit === 'miles') return val / 1.60934
  if (unit === 'ft') return val / 0.0003048
  return val
}
function toHours(val: number, unit: string): number {
  if (unit === 'hours') return val
  if (unit === 'minutes') return val / 60
  if (unit === 'seconds') return val / 3600
  return val
}
function fromHours(val: number, unit: string): number {
  if (unit === 'hours') return val
  if (unit === 'minutes') return val * 60
  if (unit === 'seconds') return val * 3600
  return val
}
function fmtTime(hours: number, lang: string): string {
  const h = Math.floor(hours)
  const m = Math.floor((hours - h) * 60)
  const s = Math.round(((hours - h) * 60 - m) * 60)
  if (h > 0) return lang==='ko' ? `${h}시간 ${m}분 ${s}초` : `${h}h ${m}m ${s}s`
  if (m > 0) return lang==='ko' ? `${m}분 ${s}초` : `${m}m ${s}s`
  return lang==='ko' ? `${s}초` : `${s}s`
}

export default function SpeedDistanceTime() {
  const { lang } = useLang()
  const tx = T[lang]
  const [calcFor, setCalcFor] = useState<'speed'|'distance'|'time'>('speed')
  const [speed, setSpeed] = useState(60)
  const [speedUnit, setSpeedUnit] = useState('km/h')
  const [distance, setDistance] = useState(100)
  const [distUnit, setDistUnit] = useState('km')
  const [time, setTime] = useState(2)
  const [timeUnit, setTimeUnit] = useState('hours')
  const [copied, setCopied] = useState<string|null>(null)
  const copy = async (t: string, k: string) => { await navigator.clipboard.writeText(t); setCopied(k); setTimeout(() => setCopied(null), 1500) }

  const speedKmh = toKmh(speed, speedUnit)
  const distKm = toKm(distance, distUnit)
  const timeH = toHours(time, timeUnit)

  let result = 0, resultStr = '', label = ''
  if (calcFor === 'speed') {
    result = timeH > 0 ? distKm / timeH : 0
    result = fromKmh(result, speedUnit)
    resultStr = `${result.toFixed(2)} ${speedUnit}`
    label = lang==='ko'?'계산된 속력':'Calculated Speed'
  } else if (calcFor === 'distance') {
    result = speedKmh * timeH
    result = fromKm(result, distUnit)
    resultStr = `${result.toFixed(2)} ${distUnit}`
    label = lang==='ko'?'계산된 거리':'Calculated Distance'
  } else {
    result = speedKmh > 0 ? distKm / speedKmh : 0
    resultStr = fmtTime(result, lang)
    label = lang==='ko'?'계산된 시간':'Calculated Time'
  }

  const MODES = [
    ['speed', lang==='ko'?'속력 계산':'Speed'],
    ['distance', lang==='ko'?'거리 계산':'Distance'],
    ['time', lang==='ko'?'시간 계산':'Time'],
  ]

  const InputRow = ({label, val, setVal, units, unit, setUnit, disabled}: any) => (
    <div className={`rounded-xl border p-3 ${disabled?'border-surface-border opacity-50':'border-brand-500/30 bg-brand-500/5'}`}>
      <p className="text-xs text-slate-400 mb-2 font-medium">{label}</p>
      <div className="flex gap-2">
        <input type="number" value={val} step={0.1} onChange={e => setVal(+e.target.value)} disabled={disabled}
          className="flex-1 bg-[#0f1117] border border-surface-border rounded-lg px-3 py-2 text-slate-200 text-lg font-mono focus:outline-none focus:border-brand-500/50 transition-all disabled:opacity-50" />
        <select value={unit} onChange={e => setUnit(e.target.value)} className="bg-[#0f1117] border border-surface-border rounded-lg px-2 py-2 text-slate-200 text-xs focus:outline-none transition-all">
          {units.map((u: string) => <option key={u} value={u}>{u}</option>)}
        </select>
      </div>
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-mono mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />Free Tool
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-3">{tx.title}</h1>
        <p className="text-slate-300 text-base max-w-xl mx-auto">{tx.desc}</p>
      </div>
      <div className="grid grid-cols-3 gap-2 mb-5">
        {MODES.map(([v,l]) => (
          <button key={v} onClick={() => setCalcFor(v as any)} className={`py-2.5 rounded-xl border text-sm font-medium transition-all ${calcFor===v?'bg-brand-500 border-brand-500 text-white font-bold':'border-surface-border text-slate-300 bg-[#1a1d27]'}`}>{l}</button>
        ))}
      </div>
      <div className="flex flex-col gap-3 mb-5">
        <InputRow label={lang==='ko'?'속력':'Speed'} val={speed} setVal={setSpeed} units={SPEED_UNITS} unit={speedUnit} setUnit={setSpeedUnit} disabled={calcFor==='speed'} />
        <InputRow label={lang==='ko'?'거리':'Distance'} val={distance} setVal={setDistance} units={DIST_UNITS} unit={distUnit} setUnit={setDistUnit} disabled={calcFor==='distance'} />
        <InputRow label={lang==='ko'?'시간':'Time'} val={time} setVal={setTime} units={TIME_UNITS} unit={timeUnit} setUnit={setTimeUnit} disabled={calcFor==='time'} />
      </div>
      <div className="rounded-xl border border-brand-500/40 bg-brand-500/10 p-5 flex justify-between items-center mb-4">
        <div>
          <p className="text-xs text-slate-400">{label}</p>
          <p className="text-3xl font-extrabold text-brand-400 font-mono">{resultStr}</p>
          {calcFor==='time' && result>0 && <p className="text-xs text-slate-500 mt-1">{result.toFixed(4)} {lang==='ko'?'시간':'hours'}</p>}
        </div>
        <button onClick={() => copy(resultStr,'r')} className={`p-2.5 rounded-xl border transition-all ${copied==='r'?'bg-brand-500/20 border-brand-500/40 text-brand-400':'border-surface-border text-slate-400 hover:text-brand-400'}`}>
          {copied==='r'?<CheckCheck size={16}/>:<Copy size={16}/>}
        </button>
      </div>
      <ToolFooter
        toolName={lang==='ko'?'속력/거리/시간 계산기':'Speed Distance Time Calculator'}
        toolUrl="https://keyword-mixer.vercel.app/speed-distance-time"
        description={tx.desc}
        howToUse={lang==='ko'?[{step:'계산 대상 선택',desc:'속력/거리/시간 중 구하고 싶은 항목을 선택하세요.'},{step:'알고 있는 값 입력',desc:'나머지 두 항목의 값과 단위를 입력하세요.'},{step:'결과 확인',desc:'선택한 항목이 자동으로 계산됩니다.'},{step:'단위 변환',desc:'각 항목의 단위를 km, miles, m/s 등으로 변환할 수 있습니다.'}]:[{step:'Select unknown',desc:'Choose which to calculate: speed, distance, or time.'},{step:'Enter known values',desc:'Input the two known values with their units.'},{step:'View result',desc:'Selected value is automatically calculated.'},{step:'Unit conversion',desc:'Convert between km, miles, m/s, and more.'}]}
        whyUse={lang==='ko'?[{title:'3가지 계산 모드',desc:'속력·거리·시간 세 가지 중 어느 것이든 계산할 수 있습니다.'},{title:'다양한 단위',desc:'km/h, mph, knots, m/s, km, miles, ft, 시간/분/초를 지원합니다.'},{title:'시간 포맷 표시',desc:'계산된 시간을 N시간 M분 S초 형식으로 보기 좋게 표시합니다.'},{title:'물리 학습용',desc:'물리 공식 v=d/t 학습과 실생활 활용에 유용합니다.'}]:[{title:'3 calculation modes',desc:'Calculate speed, distance, or time from any two values.'},{title:'Multiple units',desc:'Supports km/h, mph, knots, m/s, km, miles, ft, h/m/s.'},{title:'Time format display',desc:'Shows calculated time as Xh Ym Zs for readability.'},{title:'Physics learning',desc:'Useful for learning the physics formula v=d/t and real applications.'}]}
        faqs={lang==='ko'?[{q:'속력·거리·시간 공식은?',a:'속력(v) = 거리(d) ÷ 시간(t). 거리 = 속력 × 시간. 시간 = 거리 ÷ 속력.'},{q:'서울~부산 고속도로 소요 시간은?',a:'약 400km, 평균 100km/h 기준: 400 ÷ 100 = 4시간. 거리 계산 모드에서 확인하세요.'},{q:'knots(노트)란?',a:'해상·항공에서 사용하는 속도 단위. 1노트 = 1.852km/h. 날씨·선박·항공기 속도 표기에 사용됩니다.'},{q:'m/s와 km/h 변환은?',a:'1 m/s = 3.6 km/h. 1 km/h = 0.2778 m/s. 이 계산기에서 단위만 바꾸면 자동 변환됩니다.'}]:[{q:'Speed distance time formula?',a:'Speed(v) = Distance(d) ÷ Time(t). Distance = Speed × Time. Time = Distance ÷ Speed.'},{q:'Seoul to Busan by highway?',a:'~400km at avg 100km/h: 400 ÷ 100 = 4 hours. Check with Time calculation mode.'},{q:'What are knots?',a:'Speed unit used in maritime and aviation. 1 knot = 1.852 km/h. Used for weather, ships, aircraft.'},{q:'m/s to km/h conversion?',a:'1 m/s = 3.6 km/h. 1 km/h = 0.2778 m/s. Just change the unit selector in this calculator for automatic conversion.'}]}
        keywords="속력 거리 시간 계산기 · 속도 계산기 · 거리 계산기 · 시간 계산기 · km/h mph 변환 · speed distance time calculator · velocity calculator · physics calculator"
      />
    </div>
  )
}
