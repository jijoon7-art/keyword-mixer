
'use client'
import { useState } from 'react'
import { Copy, CheckCheck } from 'lucide-react'
import { useLang } from './LangContext'
import ToolFooter from './ToolFooter'

const T = {
  ko: { title: '콘크리트 / 시멘트 계산기', desc: '면적과 두께로 필요한 콘크리트 및 시멘트, 모래, 자갈 양을 계산. 공사 자재 구매 전 필수.' },
  en: { title: 'Concrete / Cement Calculator', desc: 'Calculate concrete, cement, sand, and gravel needed from area and thickness. Essential before buying materials.' }
}
function fmt(n: number) { return n.toFixed(2) }

export default function ConcreteCalculator() {
  const { lang } = useLang()
  const tx = T[lang]
  const [length, setLength] = useState(5)
  const [width, setWidth] = useState(4)
  const [thickness, setThickness] = useState(0.1)
  const [mixRatio, setMixRatio] = useState('1-2-3')
  const [waste, setWaste] = useState(10)
  const [copied, setCopied] = useState<string|null>(null)
  const copy = async (t: string, k: string) => { await navigator.clipboard.writeText(t); setCopied(k); setTimeout(() => setCopied(null), 1500) }

  const volume = length * width * thickness
  const volumeWithWaste = volume * (1 + waste / 100)

  const RATIOS: Record<string, {cement:number,sand:number,gravel:number,name_ko:string,name_en:string}> = {
    '1-2-3': { cement: 1, sand: 2, gravel: 3, name_ko: '1:2:3 (일반용)', name_en: '1:2:3 (General)' },
    '1-1.5-3': { cement: 1, sand: 1.5, gravel: 3, name_ko: '1:1.5:3 (강도형)', name_en: '1:1.5:3 (Strength)' },
    '1-2-4': { cement: 1, sand: 2, gravel: 4, name_ko: '1:2:4 (경량)', name_en: '1:2:4 (Lightweight)' },
  }

  const ratio = RATIOS[mixRatio]
  const totalParts = ratio.cement + ratio.sand + ratio.gravel
  const cementVol = (volumeWithWaste / totalParts) * ratio.cement
  const sandVol = (volumeWithWaste / totalParts) * ratio.sand
  const gravelVol = (volumeWithWaste / totalParts) * ratio.gravel
  // 시멘트: 1m³ ≈ 1500kg, 1포 = 40kg
  const cementKg = cementVol * 1500
  const cementBags = Math.ceil(cementKg / 40)

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-mono mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />Free Tool
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-3">{tx.title}</h1>
        <p className="text-slate-300 text-base max-w-xl mx-auto">{tx.desc}</p>
      </div>
      <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-5 mb-5">
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            [lang==='ko'?'가로 (m)':'Length (m)', length, setLength],
            [lang==='ko'?'세로 (m)':'Width (m)', width, setWidth],
            [lang==='ko'?'두께 (m)':'Thickness (m)', thickness, setThickness],
          ].map(([l,v,s]) => (
            <div key={l as string}>
              <label className="text-xs text-slate-400 mb-1 block">{l as string}</label>
              <input type="number" step={0.01} value={v as number} onChange={e => (s as Function)(+e.target.value)}
                className="w-full bg-[#0f1117] border border-surface-border rounded-lg px-2 py-2 text-slate-200 text-sm font-mono focus:outline-none focus:border-brand-500/50 transition-all" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">{lang==='ko'?'배합비':'Mix Ratio'}</label>
            <select value={mixRatio} onChange={e => setMixRatio(e.target.value)} className="w-full bg-[#0f1117] border border-surface-border rounded-lg px-2 py-2 text-slate-200 text-xs focus:outline-none focus:border-brand-500/50 transition-all">
              {Object.entries(RATIOS).map(([k,v]) => <option key={k} value={k}>{lang==='ko'?v.name_ko:v.name_en}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">{lang==='ko'?'여유율 (%)':'Waste (%)'}</label>
            <input type="number" value={waste} onChange={e => setWaste(+e.target.value)} className="w-full bg-[#0f1117] border border-surface-border rounded-lg px-2 py-2 text-slate-200 text-sm font-mono focus:outline-none focus:border-brand-500/50 transition-all" />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <div className="rounded-xl border border-brand-500/30 bg-brand-500/10 p-4 flex justify-between items-center">
          <div>
            <p className="text-xs text-slate-400">{lang==='ko'?'총 콘크리트 부피 (여유 포함)':'Total Volume (with waste)'}</p>
            <p className="text-4xl font-extrabold text-brand-400 font-mono">{fmt(volumeWithWaste)} m³</p>
          </div>
          <button onClick={() => copy(fmt(volumeWithWaste),'v')} className={`p-2.5 rounded-xl border transition-all ${copied==='v'?'bg-brand-500/20 border-brand-500/40 text-brand-400':'border-surface-border text-slate-400 hover:text-brand-400'}`}>
            {copied==='v'?<CheckCheck size={16}/>:<Copy size={16}/>}
          </button>
        </div>
        {[
          [lang==='ko'?'시멘트 (m³)':'Cement (m³)', `${fmt(cementVol)} m³`,'c'],
          [lang==='ko'?`시멘트 포대 (40kg/포)`:`Cement Bags (40kg)`, `${cementBags}${lang==='ko'?'포':'bags'}`,'cb'],
          [lang==='ko'?'모래 (m³)':'Sand (m³)', `${fmt(sandVol)} m³`,'s'],
          [lang==='ko'?'자갈 (m³)':'Gravel (m³)', `${fmt(gravelVol)} m³`,'g'],
        ].map(([l,v,k]) => (
          <div key={k as string} className="flex justify-between items-center p-3 rounded-xl border border-surface-border bg-[#1a1d27]">
            <span className="text-xs text-slate-400">{l as string}</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold font-mono text-slate-200">{v as string}</span>
              <button onClick={() => copy((v as string).replace(/[m³포bags]/g,'').trim(), k as string)} className={`p-1 rounded border transition-all ${copied===k?'bg-brand-500/20 border-brand-500/40 text-brand-400':'border-surface-border text-slate-600 hover:text-brand-400'}`}>
                {copied===k?<CheckCheck size={11}/>:<Copy size={11}/>}
              </button>
            </div>
          </div>
        ))}
      </div>
      <ToolFooter
        toolName={lang==='ko'?'콘크리트 계산기':'Concrete Calculator'}
        toolUrl="https://keyword-mixer.vercel.app/concrete-calculator"
        description={tx.desc}
        howToUse={lang==='ko'?[{step:'크기 입력',desc:'타설할 면적의 가로, 세로, 두께를 입력하세요.'},{step:'배합비 선택',desc:'용도에 맞는 시멘트:모래:자갈 배합비를 선택하세요.'},{step:'여유율 설정',desc:'낭비를 고려한 여유율을 설정하세요 (기본 10%).'},{step:'자재량 확인',desc:'필요한 콘크리트, 시멘트 포대, 모래, 자갈 양이 계산됩니다.'}]:[{step:'Enter dimensions',desc:'Input length, width, and thickness to pour.'},{step:'Select mix ratio',desc:'Choose cement:sand:gravel ratio for your use.'},{step:'Set waste %',desc:'Set waste margin (default 10%).'},{step:'View materials',desc:'Required concrete volume, cement bags, sand, gravel calculated.'}]}
        whyUse={lang==='ko'?[{title:'시멘트 포대 수 계산',desc:'부피를 시멘트 포대(40kg) 수로 변환해 구매 수량을 알려줍니다.'},{title:'배합비별 계산',desc:'1:2:3, 1:1.5:3, 1:2:4 세 가지 배합비를 지원합니다.'},{title:'여유율 포함',desc:'낭비와 손실을 고려한 여유율을 자동으로 반영합니다.'},{title:'자재별 분리 계산',desc:'시멘트·모래·자갈을 각각 분리해 계산합니다.'}]:[{title:'Cement bag count',desc:'Converts volume to cement bags (40kg each) for purchasing.'},{title:'Multiple mix ratios',desc:'Supports 1:2:3, 1:1.5:3, 1:2:4 mix ratios.'},{title:'Waste included',desc:'Automatically accounts for waste and spillage.'},{title:'Per-material calc',desc:'Separate calculations for cement, sand, and gravel.'}]}
        faqs={lang==='ko'?[{q:'콘크리트 배합비는?',a:'일반 바닥: 1:2:3, 구조물: 1:1.5:3, 가벼운 작업: 1:2:4를 사용합니다.'},{q:'시멘트 1포 = 몇 m³?',a:'시멘트 40kg 1포 = 약 0.027m³입니다.'},{q:'레미콘을 사용하면?',a:'레미콘은 m³ 단위로 주문합니다. 이 계산기의 총 부피(m³)를 참고해 주문하세요.'},{q:'여유율은 얼마가 적당한가요?',a:'일반 타설은 10%, 복잡한 형태나 수작업은 15~20%를 권장합니다.'}]:[{q:'Which mix ratio to use?',a:'General floors: 1:2:3, structural: 1:1.5:3, light work: 1:2:4.'},{q:'1 cement bag = how much m³?',a:'1 bag of cement (40kg) ≈ 0.027 m³.'},{q:'Using ready-mix concrete?',a:'Order ready-mix by m³. Use this calculator total volume to determine order quantity.'},{q:'Recommended waste margin?',a:'10% for straightforward pours, 15-20% for complex shapes or manual work.'}]}
        keywords="콘크리트 계산기 · 시멘트 계산기 · 콘크리트 양 계산 · 시멘트 포대 수 · 건축 자재 계산 · concrete calculator · cement calculator · concrete volume · cement bags needed"
      />
    </div>
  )
}
