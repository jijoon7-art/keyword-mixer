
'use client'
import { useState } from 'react'
import { Copy, CheckCheck } from 'lucide-react'
import { useLang } from './LangContext'
import ToolFooter from './ToolFooter'

const T = {
  ko: { title: '페인트 / 도배 계산기', desc: '방 크기로 필요한 페인트 양과 도배지 양을 계산. 도어·창문 면적 공제, 여유분 포함.' },
  en: { title: 'Paint & Wallpaper Calculator', desc: 'Calculate paint and wallpaper needed from room dimensions. Deducts doors/windows, includes extra margin.' }
}
function fmt(n: number) { return n.toFixed(2) }
function comma(n: number) { return Math.round(n).toLocaleString() }

export default function PaintCalculator() {
  const { lang } = useLang()
  const tx = T[lang]
  const [mode, setMode] = useState<'paint'|'wallpaper'>('paint')
  const [length, setLength] = useState(4.5)
  const [width, setWidth] = useState(3.6)
  const [height, setHeight] = useState(2.4)
  const [doors, setDoors] = useState(1)
  const [windows, setWindows] = useState(2)
  const [coats, setCoats] = useState(2)
  const [coverage, setCoverage] = useState(10)
  const [wallpaperW, setWallpaperW] = useState(53)
  const [wallpaperRepeat, setWallpaperRepeat] = useState(0)
  const [margin, setMargin] = useState(10)
  const [copied, setCopied] = useState<string|null>(null)
  const copy = async (t: string, k: string) => { await navigator.clipboard.writeText(t); setCopied(k); setTimeout(() => setCopied(null), 1500) }

  const wallArea = 2 * (length + width) * height
  const doorArea = doors * 1.9 * 0.9
  const windowArea = windows * 1.5 * 1.2
  const netArea = Math.max(0, wallArea - doorArea - windowArea)
  const ceilArea = length * width

  // 페인트 계산
  const paintNeeded = (netArea * coats) / coverage
  const ceilPaintNeeded = (ceilArea * coats) / coverage
  const totalPaint = paintNeeded + ceilPaintNeeded
  const paintWithMargin = totalPaint * (1 + margin / 100)

  // 도배지 계산 (cm 단위)
  const wallPeriPerimeter = 2 * (length + width) * 100 // cm
  const effectiveW = wallpaperW - wallpaperRepeat
  const rolls = Math.ceil(wallPeriPerimeter / effectiveW)
  const rollLength = (height * 100 + wallpaperRepeat + 10)
  const totalCm = rolls * rollLength
  const rollsNeeded = Math.ceil((totalCm / 100 / 15) * (1 + margin / 100))

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-mono mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />Free Tool
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-3">{tx.title}</h1>
        <p className="text-slate-300 text-base max-w-xl mx-auto">{tx.desc}</p>
      </div>
      <div className="flex rounded-xl border border-surface-border overflow-hidden mb-5">
        {[['paint', lang==='ko'?'페인트 계산':'Paint'], ['wallpaper', lang==='ko'?'도배지 계산':'Wallpaper']].map(([v,l]) => (
          <button key={v} onClick={() => setMode(v as 'paint'|'wallpaper')}
            className={`flex-1 py-2.5 text-sm font-medium transition-all ${mode===v?'bg-brand-500 text-white font-bold':'bg-[#1a1d27] text-slate-300'}`}>{l}</button>
        ))}
      </div>
      <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-5 mb-5">
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            [lang==='ko'?'가로 (m)':'Length (m)', length, setLength],
            [lang==='ko'?'세로 (m)':'Width (m)', width, setWidth],
            [lang==='ko'?'높이 (m)':'Height (m)', height, setHeight],
          ].map(([l,v,s]) => (
            <div key={l as string}>
              <label className="text-xs text-slate-400 mb-1 block">{l as string}</label>
              <input type="number" step={0.1} value={v as number} onChange={e => (s as Function)(+e.target.value)}
                className="w-full bg-[#0f1117] border border-surface-border rounded-lg px-2 py-2 text-slate-200 text-sm font-mono focus:outline-none focus:border-brand-500/50 transition-all" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3 mb-3">
          {[
            [lang==='ko'?'문 개수':'Doors', doors, setDoors],
            [lang==='ko'?'창문 개수':'Windows', windows, setWindows],
          ].map(([l,v,s]) => (
            <div key={l as string}>
              <label className="text-xs text-slate-400 mb-1 block">{l as string}</label>
              <input type="number" min={0} value={v as number} onChange={e => (s as Function)(+e.target.value)}
                className="w-full bg-[#0f1117] border border-surface-border rounded-lg px-2 py-2 text-slate-200 text-sm font-mono focus:outline-none focus:border-brand-500/50 transition-all" />
            </div>
          ))}
        </div>
        {mode === 'paint' ? (
          <div className="grid grid-cols-3 gap-3">
            {[
              [lang==='ko'?'도장 횟수':'Coats', coats, setCoats],
              [lang==='ko'?'커버리지 (m²/L)':'Coverage (m²/L)', coverage, setCoverage],
              [lang==='ko'?'여유분 (%)':'Extra (%)', margin, setMargin],
            ].map(([l,v,s]) => (
              <div key={l as string}>
                <label className="text-xs text-slate-400 mb-1 block">{l as string}</label>
                <input type="number" value={v as number} onChange={e => (s as Function)(+e.target.value)}
                  className="w-full bg-[#0f1117] border border-surface-border rounded-lg px-2 py-2 text-slate-200 text-sm font-mono focus:outline-none focus:border-brand-500/50 transition-all" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            {[
              [lang==='ko'?'도배지 너비 (cm)':'Wallpaper Width', wallpaperW, setWallpaperW],
              [lang==='ko'?'무늬 반복 (cm)':'Pattern Repeat', wallpaperRepeat, setWallpaperRepeat],
              [lang==='ko'?'여유분 (%)':'Extra (%)', margin, setMargin],
            ].map(([l,v,s]) => (
              <div key={l as string}>
                <label className="text-xs text-slate-400 mb-1 block">{l as string}</label>
                <input type="number" value={v as number} onChange={e => (s as Function)(+e.target.value)}
                  className="w-full bg-[#0f1117] border border-surface-border rounded-lg px-2 py-2 text-slate-200 text-sm font-mono focus:outline-none focus:border-brand-500/50 transition-all" />
              </div>
            ))}
          </div>
        )}
      </div>
      {mode === 'paint' ? (
        <div className="flex flex-col gap-3">
          <div className="rounded-xl border border-brand-500/30 bg-brand-500/10 p-4 flex justify-between items-center">
            <div>
              <p className="text-xs text-slate-400">{lang==='ko'?`필요 페인트 (${margin}% 여유 포함)`:`Paint Needed (${margin}% extra)`}</p>
              <p className="text-4xl font-extrabold text-brand-400 font-mono">{fmt(paintWithMargin)} L</p>
            </div>
            <button onClick={() => copy(fmt(paintWithMargin),'p')} className={`p-2.5 rounded-xl border transition-all ${copied==='p'?'bg-brand-500/20 border-brand-500/40 text-brand-400':'border-surface-border text-slate-400 hover:text-brand-400'}`}>
              {copied==='p'?<CheckCheck size={16}/>:<Copy size={16}/>}
            </button>
          </div>
          {[
            [lang==='ko'?'벽면 순 면적':'Net Wall Area', `${fmt(netArea)} m²`,'wa'],
            [lang==='ko'?'천장 면적':'Ceiling Area', `${fmt(ceilArea)} m²`,'ca'],
            [lang==='ko'?'벽면 페인트 (여유 전)':'Wall Paint (pre-margin)', `${fmt(paintNeeded)} L`,'wp'],
            [lang==='ko'?'천장 페인트':'Ceiling Paint', `${fmt(ceilPaintNeeded)} L`,'cp'],
          ].map(([l,v,k]) => (
            <div key={k as string} className="flex justify-between items-center p-3 rounded-xl border border-surface-border bg-[#1a1d27]">
              <span className="text-xs text-slate-400">{l as string}</span>
              <span className="text-sm font-mono font-bold text-slate-200">{v as string}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-brand-500/30 bg-brand-500/10 p-5 flex justify-between items-center">
          <div>
            <p className="text-xs text-slate-400">{lang==='ko'?`필요 도배지 롤 수 (${margin}% 여유)`:`Wallpaper Rolls (${margin}% extra)`}</p>
            <p className="text-4xl font-extrabold text-brand-400 font-mono">{rollsNeeded} {lang==='ko'?'롤':'rolls'}</p>
            <p className="text-xs text-slate-500 mt-1">{lang==='ko'?`총 벽 둘레 ${(wallPeriPerimeter/100).toFixed(1)}m`:`Total perimeter: ${(wallPeriPerimeter/100).toFixed(1)}m`}</p>
          </div>
          <button onClick={() => copy(String(rollsNeeded),'r')} className={`p-2.5 rounded-xl border transition-all ${copied==='r'?'bg-brand-500/20 border-brand-500/40 text-brand-400':'border-surface-border text-slate-400 hover:text-brand-400'}`}>
            {copied==='r'?<CheckCheck size={16}/>:<Copy size={16}/>}
          </button>
        </div>
      )}
      <ToolFooter
        toolName={lang==='ko'?'페인트/도배 계산기':'Paint & Wallpaper Calculator'}
        toolUrl="https://keyword-mixer.vercel.app/paint-calculator"
        description={tx.desc}
        howToUse={lang==='ko'?[
          {step:'계산 유형 선택', desc:'페인트 또는 도배지 계산을 선택하세요.'},
          {step:'방 크기 입력', desc:'가로, 세로, 높이를 입력하세요.'},
          {step:'문/창문 개수 입력', desc:'페인트를 칠하지 않을 문과 창문 수를 입력하세요.'},
          {step:'필요량 확인', desc:'여유분이 포함된 필요 페인트/도배지 양이 계산됩니다.'},
        ]:[
          {step:'Select type', desc:'Choose paint or wallpaper calculation.'},
          {step:'Enter room size', desc:'Input length, width, and height.'},
          {step:'Enter doors/windows', desc:'Input number of doors and windows to deduct.'},
          {step:'View required amount', desc:'Paint or wallpaper needed including margin is calculated.'},
        ]}
        whyUse={lang==='ko'?[
          {title:'도어·창문 자동 공제', desc:'문(1.9×0.9m)과 창문(1.5×1.2m) 면적을 자동으로 차감합니다.'},
          {title:'여유분 포함', desc:'10% 여유분을 기본으로 포함해 부족하지 않도록 합니다.'},
          {title:'천장 페인트 계산', desc:'벽면과 천장의 페인트를 분리해 계산합니다.'},
          {title:'도배지·페인트 통합', desc:'페인트와 도배지 계산을 하나의 도구에서 제공합니다.'},
        ]:[
          {title:'Auto door/window deduction', desc:'Deducts door (1.9×0.9m) and window (1.5×1.2m) areas automatically.'},
          {title:'Margin included', desc:'Default 10% extra to ensure you never run short.'},
          {title:'Ceiling paint', desc:'Calculates wall and ceiling paint separately.'},
          {title:'Paint & wallpaper unified', desc:'Both paint and wallpaper calculations in one tool.'},
        ]}
        faqs={lang==='ko'?[
          {q:'페인트 커버리지(m²/L)란?', a:'1리터의 페인트로 칠할 수 있는 면적입니다. 일반 벽면용 페인트는 보통 8~12m²/L입니다.'},
          {q:'도장 횟수는 몇 회가 적당한가요?', a:'새 벽면에는 1~2회, 색상을 크게 바꾸거나 어두운 색에서 밝은 색으로 변경할 때는 3회 이상이 필요합니다.'},
          {q:'도배지 무늬 반복이란?', a:'패턴이 있는 도배지에서 한 패턴이 반복되는 간격(cm)입니다. 반복 간격이 클수록 자재 낭비가 많습니다.'},
          {q:'여유분은 왜 필요한가요?', a:'재단 과정에서 생기는 자투리, 실수로 인한 손실, 향후 보수 시 같은 자재가 필요할 때를 대비해 10~15% 여유분을 권장합니다.'},
        ]:[
          {q:'What is paint coverage (m²/L)?', a:'Area that 1 liter of paint can cover. Standard wall paint covers 8-12 m²/L.'},
          {q:'How many coats needed?', a:'1-2 coats for new walls. 3+ coats when making dramatic color changes or covering dark colors.'},
          {q:'What is wallpaper pattern repeat?', a:'The vertical distance in cm before a pattern repeats. Larger repeats mean more waste.'},
          {q:'Why include extra margin?', a:'10-15% extra is recommended to account for trimming waste, mistakes, and future patching needs.'},
        ]}
        keywords="페인트 계산기 · 도배 계산기 · 페인트 필요량 · 도배지 롤 수 · 방 페인트 계산 · paint calculator · wallpaper calculator · paint amount calculator · how much paint do I need"
      />
    </div>
  )
}
