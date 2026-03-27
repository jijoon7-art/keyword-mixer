
'use client'
import { useState } from 'react'
import { Copy, CheckCheck } from 'lucide-react'
import { useLang } from './LangContext'
import ToolFooter from './ToolFooter'

const T = {
  ko: { title: '파일 크기 단위 변환기', desc: 'Byte·KB·MB·GB·TB 파일 크기 단위를 즉시 변환. 전송 시간·저장 용량 계산 포함.' },
  en: { title: 'File Size Unit Converter', desc: 'Convert Byte, KB, MB, GB, TB instantly. Includes transfer time and storage capacity calculation.' }
}

const UNITS = [
  { label: 'Byte', factor: 1 },
  { label: 'KB', factor: 1024 },
  { label: 'MB', factor: 1024**2 },
  { label: 'GB', factor: 1024**3 },
  { label: 'TB', factor: 1024**4 },
  { label: 'PB', factor: 1024**5 },
]

const SPEEDS = [
  { label_ko: 'USB 2.0 (60 MB/s)', label_en: 'USB 2.0 (60 MB/s)', bps: 60*1024*1024 },
  { label_ko: 'USB 3.0 (600 MB/s)', label_en: 'USB 3.0 (600 MB/s)', bps: 600*1024*1024 },
  { label_ko: '광랜 1Gbps', label_en: 'Fiber 1Gbps', bps: 1000*1024*1024/8 },
  { label_ko: 'Wi-Fi 6 (최대)', label_en: 'Wi-Fi 6 (max)', bps: 300*1024*1024 },
  { label_ko: 'LTE (50 MB/s)', label_en: 'LTE (50 MB/s)', bps: 50*1024*1024 },
  { label_ko: '5G (200 MB/s)', label_en: '5G (200 MB/s)', bps: 200*1024*1024 },
]

function fmtTime(sec: number, lang: string): string {
  if(sec < 1) return `${(sec*1000).toFixed(0)}ms`
  if(sec < 60) return `${sec.toFixed(1)}${lang==='ko'?'초':'s'}`
  if(sec < 3600) return `${Math.floor(sec/60)}${lang==='ko'?'분':'m'} ${Math.round(sec%60)}${lang==='ko'?'초':'s'}`
  return `${Math.floor(sec/3600)}${lang==='ko'?'시간':'h'} ${Math.floor((sec%3600)/60)}${lang==='ko'?'분':'m'}`
}

export default function FileSizeConverter() {
  const { lang } = useLang()
  const tx = T[lang]
  const [value, setValue] = useState(1)
  const [fromUnit, setFromUnit] = useState('GB')
  const [copied, setCopied] = useState<string|null>(null)
  const copy = async (t: string, k: string) => { await navigator.clipboard.writeText(t); setCopied(k); setTimeout(() => setCopied(null), 1500) }

  const fromFactor = UNITS.find(u => u.label === fromUnit)?.factor ?? 1
  const bytes = value * fromFactor

  const fmt = (b: number, factor: number): string => {
    const v = b / factor
    return v >= 1000 ? v.toFixed(1) : v < 0.001 ? v.toExponential(2) : v.toFixed(3).replace(/\.?0+$/,'')
  }

  const PRESETS = [100, 1, 10, 50, 1, 1, 10]
  const PRESET_UNITS = ['MB','GB','GB','GB','TB','PB','PB']

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
        <div className="flex gap-3 mb-3">
          <input type="number" value={value} step={0.1} onChange={e => setValue(+e.target.value)}
            className="flex-1 bg-[#0f1117] border border-surface-border rounded-xl px-4 py-3 text-slate-200 text-2xl font-mono focus:outline-none focus:border-brand-500/50 transition-all" />
          <select value={fromUnit} onChange={e => setFromUnit(e.target.value)}
            className="bg-[#0f1117] border border-surface-border rounded-xl px-3 py-3 text-slate-200 text-sm focus:outline-none focus:border-brand-500/50 transition-all">
            {UNITS.map(u => <option key={u.label} value={u.label}>{u.label}</option>)}
          </select>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {PRESETS.map((v,i) => (
            <button key={i} onClick={() => { setValue(v); setFromUnit(PRESET_UNITS[i]) }}
              className="text-xs px-2.5 py-1 rounded border border-surface-border text-slate-400 hover:border-brand-500/40 bg-[#0f1117] transition-all">
              {v}{PRESET_UNITS[i]}
            </button>
          ))}
        </div>
      </div>

      {/* 변환 결과 */}
      <div className="rounded-xl border border-surface-border bg-[#1a1d27] overflow-hidden mb-5">
        <div className="divide-y divide-surface-border">
          {UNITS.map(u => (
            <div key={u.label} className={`flex items-center justify-between px-4 py-3 ${u.label===fromUnit?'bg-brand-500/10':''}`}>
              <span className={`text-sm font-medium ${u.label===fromUnit?'text-brand-400':'text-slate-300'}`}>{u.label}</span>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-mono font-bold ${u.label===fromUnit?'text-brand-400':'text-slate-200'}`}>{fmt(bytes, u.factor)}</span>
                <button onClick={() => copy(fmt(bytes, u.factor), u.label)} className={`p-1.5 rounded border transition-all ${copied===u.label?'bg-brand-500/20 border-brand-500/40 text-brand-400':'border-surface-border text-slate-600 hover:text-brand-400'}`}>
                  {copied===u.label?<CheckCheck size={12}/>:<Copy size={12}/>}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 전송 시간 */}
      <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4">
        <p className="text-xs text-slate-400 font-medium mb-3">{lang==='ko'?`⏱️ ${fmt(bytes,1024**2)}MB 전송 예상 시간`:`⏱️ Transfer time for ${fmt(bytes,1024**2)}MB`}</p>
        <div className="grid grid-cols-2 gap-2">
          {SPEEDS.map(s => (
            <div key={s.label_en} className="flex justify-between px-3 py-2 rounded-lg border border-surface-border bg-[#0f1117] text-xs">
              <span className="text-slate-400">{lang==='ko'?s.label_ko:s.label_en}</span>
              <span className="text-brand-400 font-mono font-bold">{fmtTime(bytes/s.bps, lang)}</span>
            </div>
          ))}
        </div>
      </div>

      <ToolFooter
        toolName={lang==='ko'?'파일 크기 단위 변환기':'File Size Converter'}
        toolUrl="https://keyword-mixer.vercel.app/file-size-converter"
        description={tx.desc}
        howToUse={lang==='ko'?[{step:'값 입력',desc:'변환할 파일 크기를 입력하세요.'},{step:'단위 선택',desc:'입력한 값의 단위를 선택하세요.'},{step:'변환 결과 확인',desc:'Byte부터 PB까지 모든 단위로 변환된 결과를 확인하세요.'},{step:'전송 시간 확인',desc:'다양한 연결 속도에서의 전송 시간도 계산됩니다.'}]:[{step:'Enter value',desc:'Input the file size to convert.'},{step:'Select unit',desc:'Choose the unit of your input.'},{step:'View conversions',desc:'See conversions to all units from Byte to PB.'},{step:'Transfer time',desc:'Also see estimated transfer time at various speeds.'}]}
        whyUse={lang==='ko'?[{title:'6단위 동시 변환',desc:'Byte, KB, MB, GB, TB, PB를 한번에 변환합니다.'},{title:'전송 시간 계산',desc:'USB, Wi-Fi, 5G 등 6가지 속도에서 전송 시간을 계산합니다.'},{title:'프리셋 제공',desc:'100MB, 1GB 등 자주 사용하는 크기를 버튼으로 빠르게 선택합니다.'},{title:'정확한 이진 변환',desc:'1024 기준의 정확한 이진 단위로 변환합니다.'}]:[{title:'6 units at once',desc:'Converts Byte, KB, MB, GB, TB, PB simultaneously.'},{title:'Transfer time',desc:'Calculates transfer time at USB, Wi-Fi, 5G and more speeds.'},{title:'Presets provided',desc:'Quick buttons for common sizes like 100MB, 1GB.'},{title:'Accurate binary conversion',desc:'Uses precise binary units based on 1024.'}]}
        faqs={lang==='ko'?[{q:'KB, KiB 차이는?',a:'KB는 1000바이트, KiB(키비바이트)는 1024바이트입니다. 이 계산기는 컴퓨터 표준인 1024 기반을 사용합니다.'},{q:'1GB 파일을 USB 2.0으로 전송하면?',a:'USB 2.0 속도 60MB/s 기준으로 약 17초가 걸립니다. 이 계산기의 전송 시간에서 확인하세요.'},{q:'하드디스크 1TB는 실제로 몇 GB?',a:'제조사는 1TB=1조 바이트로 표시하지만, 컴퓨터는 1TB=1024^4 바이트로 계산해 약 931GB로 표시됩니다.'},{q:'클라우드 저장소 5GB 남은 용량 계산?',a:'5GB 입력 후 다른 단위로 변환해보세요. 5GB = 5120MB = 약 5,368MB입니다.'}]:[{q:'KB vs KiB difference?',a:'KB = 1000 bytes, KiB (kibibyte) = 1024 bytes. This calculator uses computer standard 1024-base.'},{q:'1GB file via USB 2.0?',a:'At USB 2.0 speed of 60 MB/s, about 17 seconds. Check transfer time in this calculator.'},{q:'1TB hard drive shows how many GB?',a:'Manufacturers say 1TB = 1 trillion bytes, but computers calculate 1TB = 1024^4 bytes, showing ~931 GB.'},{q:'Calculate remaining 5GB cloud storage?',a:'Enter 5 GB to see in other units. 5 GB = 5120 MB ≈ 5,368 MB.'}]}
        keywords="파일 크기 변환 · KB MB GB 변환 · 파일 용량 단위 · 파일 크기 계산기 · file size converter · KB to MB · MB to GB · file size unit converter · storage converter"
      />
    </div>
  )
}
