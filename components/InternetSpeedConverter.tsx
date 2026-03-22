
'use client'
import { useState } from 'react'
import { Copy, CheckCheck } from 'lucide-react'
import { useLang } from './LangContext'
import ToolFooter from './ToolFooter'

const T = {
  ko: { title: '인터넷 속도 단위 변환기', desc: 'Mbps·Gbps·MB/s·GB/s 속도 단위를 즉시 변환. 파일 다운로드 시간도 계산.' },
  en: { title: 'Internet Speed Unit Converter', desc: 'Convert Mbps, Gbps, MB/s, GB/s instantly. Calculate file download time.' }
}

const UNITS = [
  { key: "bps", label: "bps", factor: 1 },
  { key: "kbps", label: "Kbps", factor: 1000 },
  { key: "mbps", label: "Mbps", factor: 1000000 },
  { key: "gbps", label: "Gbps", factor: 1000000000 },
  { key: "kBs", label: "KB/s", factor: 8000 },
  { key: "mBs", label: "MB/s", factor: 8000000 },
  { key: "gBs", label: "GB/s", factor: 8000000000 },
]

const FILE_SIZES = [
  { ko: "이메일 (100KB)", en: "Email (100KB)", bytes: 100*1024 },
  { ko: "MP3 음악 (5MB)", en: "MP3 Song (5MB)", bytes: 5*1024*1024 },
  { ko: "HD 영화 (4GB)", en: "HD Movie (4GB)", bytes: 4*1024*1024*1024 },
  { ko: "4K 영화 (15GB)", en: "4K Movie (15GB)", bytes: 15*1024*1024*1024 },
  { ko: "게임 (50GB)", en: "Game (50GB)", bytes: 50*1024*1024*1024 },
]

function formatTime(seconds: number): string {
  if (seconds < 1) return `${Math.round(seconds * 1000)}ms`
  if (seconds < 60) return `${seconds.toFixed(1)}초`
  if (seconds < 3600) return `${Math.floor(seconds/60)}분 ${Math.round(seconds%60)}초`
  return `${Math.floor(seconds/3600)}시간 ${Math.floor((seconds%3600)/60)}분`
}
function formatTimeEn(seconds: number): string {
  if (seconds < 1) return `${Math.round(seconds * 1000)}ms`
  if (seconds < 60) return `${seconds.toFixed(1)}s`
  if (seconds < 3600) return `${Math.floor(seconds/60)}m ${Math.round(seconds%60)}s`
  return `${Math.floor(seconds/3600)}h ${Math.floor((seconds%3600)/60)}m`
}

export default function InternetSpeedConverter() {
  const { lang } = useLang()
  const tx = T[lang]
  const [value, setValue] = useState(100)
  const [from, setFrom] = useState("mbps")
  const [copied, setCopied] = useState<string|null>(null)
  const copy = async (t: string, k: string) => { await navigator.clipboard.writeText(t); setCopied(k); setTimeout(() => setCopied(null),1500) }

  const bps = value * (UNITS.find(u => u.key === from)?.factor ?? 1)

  const convertTo = (key: string) => {
    const f = UNITS.find(u => u.key === key)?.factor ?? 1
    const v = bps / f
    return v < 0.001 ? v.toExponential(2) : v < 1 ? v.toFixed(4) : v >= 1000000 ? v.toExponential(2) : v.toFixed(3).replace(/\.?0+$/, "")
  }

  const bpsNum = typeof bps === "number" ? bps : 0
  const ft = lang === "ko" ? formatTime : formatTimeEn

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
        <div className="flex gap-3 mb-4">
          <input type="number" value={value} onChange={e => setValue(+e.target.value)}
            className="flex-1 bg-[#0f1117] border border-surface-border rounded-xl px-4 py-3 text-slate-200 text-2xl font-mono focus:outline-none focus:border-brand-500/50 transition-all" />
          <select value={from} onChange={e => setFrom(e.target.value)}
            className="bg-[#0f1117] border border-surface-border rounded-xl px-3 py-3 text-slate-200 text-sm focus:outline-none focus:border-brand-500/50 transition-all">
            {UNITS.map(u => <option key={u.key} value={u.key}>{u.label}</option>)}
          </select>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {[1,10,100,500,1000].map(v => (
            <button key={v} onClick={() => setValue(v)}
              className={`text-xs px-2.5 py-1 rounded border transition-all ${value===v?"bg-brand-500 border-brand-500 text-white":"border-surface-border text-slate-400 bg-[#0f1117]"}`}>{v}</button>
          ))}
        </div>
      </div>
      <div className="rounded-xl border border-surface-border bg-[#1a1d27] overflow-hidden mb-5">
        <div className="px-4 py-3 border-b border-surface-border bg-[#0f1117]">
          <p className="text-xs text-slate-400 font-medium">{lang==="ko"?"변환 결과":"Conversion Results"}</p>
        </div>
        <div className="divide-y divide-surface-border">
          {UNITS.map(u => (
            <div key={u.key} className={`flex items-center justify-between px-4 py-3 ${u.key===from?"bg-brand-500/10":""}`}>
              <span className={`text-sm font-medium ${u.key===from?"text-brand-400":"text-slate-300"}`}>{u.label}</span>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-mono font-bold ${u.key===from?"text-brand-400":"text-slate-200"}`}>{convertTo(u.key)}</span>
                <button onClick={() => copy(convertTo(u.key), u.key)} className={`p-1 rounded border transition-all ${copied===u.key?"bg-brand-500/20 border-brand-500/40 text-brand-400":"border-surface-border text-slate-600 hover:text-brand-400"}`}>
                  {copied===u.key?<CheckCheck size={11}/>:<Copy size={11}/>}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-xl border border-surface-border bg-[#1a1d27] overflow-hidden">
        <div className="px-4 py-3 border-b border-surface-border bg-[#0f1117]">
          <p className="text-xs text-slate-400 font-medium">{lang==="ko"?"📥 파일 다운로드 예상 시간":"📥 Estimated Download Time"}</p>
        </div>
        <div className="divide-y divide-surface-border">
          {FILE_SIZES.map(f => (
            <div key={f.ko} className="flex justify-between px-4 py-2.5">
              <span className="text-xs text-slate-400">{lang==="ko"?f.ko:f.en}</span>
              <span className="text-xs font-mono text-brand-400 font-bold">{ft((f.bytes*8)/bpsNum)}</span>
            </div>
          ))}
        </div>
      </div>
      <ToolFooter
        toolName={lang==="ko"?"인터넷 속도 단위 변환기":"Internet Speed Converter"}
        toolUrl="https://keyword-mixer.vercel.app/internet-speed-converter"
        description={tx.desc}
        howToUse={lang==="ko"?[
          {step:"속도 입력", desc:"변환할 속도 값을 입력하세요."},
          {step:"단위 선택", desc:"입력한 값의 단위를 선택하세요."},
          {step:"변환 결과 확인", desc:"7가지 속도 단위로 자동 변환된 결과를 확인하세요."},
          {step:"다운로드 시간 확인", desc:"현재 속도로 각 파일을 다운로드하는 데 걸리는 시간을 확인하세요."},
        ]:[
          {step:"Enter speed", desc:"Input the speed value to convert."},
          {step:"Select unit", desc:"Choose the unit of your input value."},
          {step:"View results", desc:"See the value converted to 7 different speed units."},
          {step:"Download time", desc:"See how long it takes to download files at this speed."},
        ]}
        whyUse={lang==="ko"?[
          {title:"7가지 단위 동시 변환", desc:"bps, Kbps, Mbps, Gbps, KB/s, MB/s, GB/s 모두 한번에."},
          {title:"파일 다운로드 시간", desc:"실제 파일 크기별 예상 다운로드 시간을 계산합니다."},
          {title:"실용적인 프리셋", desc:"자주 사용하는 속도 값을 버튼으로 빠르게 선택합니다."},
          {title:"개발자·네트워크 엔지니어 활용", desc:"비트와 바이트 단위를 혼동하지 않고 정확히 변환합니다."},
        ]:[
          {title:"7 units at once", desc:"bps, Kbps, Mbps, Gbps, KB/s, MB/s, GB/s simultaneously."},
          {title:"Download time calc", desc:"Calculates estimated download time for real file sizes."},
          {title:"Speed presets", desc:"Quick buttons for commonly referenced speed values."},
          {title:"Dev & network use", desc:"Accurately convert between bit and byte-based units."},
        ]}
        faqs={lang==="ko"?[
          {q:"Mbps와 MB/s 차이는?", a:"Mbps는 메가비트/초, MB/s는 메가바이트/초입니다. 1바이트=8비트이므로 100Mbps = 12.5MB/s입니다. 인터넷 속도는 Mbps, 다운로드 속도는 MB/s로 표시됩니다."},
          {q:"광랜 1Gbps면 얼마나 빠른가요?", a:"이론상 1GB 파일을 8초 만에 다운로드할 수 있습니다. 실제로는 서버 속도, 네트워크 혼잡 등으로 70~90% 수준에서 나옵니다."},
          {q:"5G 속도는 얼마나 되나요?", a:"5G 이론값은 최대 20Gbps이지만, 실제 체감 속도는 100~1000Mbps 수준입니다. 위치, 기지국, 단말기에 따라 크게 다릅니다."},
          {q:"Wi-Fi 6 속도는?", a:"Wi-Fi 6(802.11ax) 이론값은 최대 9.6Gbps이며, 실제 환경에서 1~2Gbps 수준이 일반적입니다."},
        ]:[
          {q:"Mbps vs MB/s difference?", a:"Mbps is megabits per second, MB/s is megabytes per second. 1 byte = 8 bits, so 100 Mbps = 12.5 MB/s. ISPs use Mbps; download apps show MB/s."},
          {q:"How fast is 1 Gbps fiber?", a:"Theoretically downloads a 1GB file in 8 seconds. In practice, 70-90% of theoretical due to server speeds and congestion."},
          {q:"What is 5G speed?", a:"5G theoretical max is 20 Gbps, but real-world speeds are 100-1000 Mbps depending on location, tower, and device."},
          {q:"Wi-Fi 6 speed?", a:"Wi-Fi 6 (802.11ax) theoretical max is 9.6 Gbps, with real-world performance typically 1-2 Gbps."},
        ]}
        keywords="인터넷 속도 단위 변환 · Mbps MB/s 변환 · Gbps 변환 · 인터넷 속도 계산 · 다운로드 속도 단위 · internet speed converter · Mbps to MB/s · speed unit converter · download time calculator · network speed units"
      />
    </div>
  )
}
