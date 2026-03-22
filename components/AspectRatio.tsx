
'use client'
import { useState } from 'react'
import { Copy, CheckCheck } from 'lucide-react'
import { useLang } from './LangContext'
import ToolFooter from './ToolFooter'

const T = {
  ko: { title: '화면 비율 계산기', desc: '해상도·화면 비율 계산기. W×H로 비율 계산, 비율로 해상도 계산. 16:9, 4:3 등 변환.' },
  en: { title: 'Aspect Ratio Calculator', desc: 'Calculate screen aspect ratios and resolutions. Convert between resolution and ratio. Supports 16:9, 4:3, and more.' }
}

function gcd(a: number, b: number): number { return b === 0 ? a : gcd(b, a % b) }

const PRESETS = [
  { label: "16:9 (FHD)", w: 1920, h: 1080 },
  { label: "16:9 (4K)", w: 3840, h: 2160 },
  { label: "4:3", w: 1024, h: 768 },
  { label: "21:9", w: 2560, h: 1080 },
  { label: "9:16 (모바일)", w: 1080, h: 1920 },
  { label: "1:1", w: 1080, h: 1080 },
]

export default function AspectRatio() {
  const { lang } = useLang()
  const tx = T[lang]
  const [mode, setMode] = useState<"wh"|"ratio">("wh")
  const [w, setW] = useState(1920)
  const [h, setH] = useState(1080)
  const [ratioW, setRatioW] = useState(16)
  const [ratioH, setRatioH] = useState(9)
  const [targetW, setTargetW] = useState(1280)
  const [copied, setCopied] = useState<string|null>(null)
  const copy = async (t: string, k: string) => { await navigator.clipboard.writeText(t); setCopied(k); setTimeout(() => setCopied(null),1500) }

  const g = gcd(w, h)
  const ratio = `${w/g}:${h/g}`
  const pct = ((w/h)*100).toFixed(1)
  const diagonal = Math.sqrt(w**2 + h**2).toFixed(0)

  const targetH = Math.round(targetW * ratioH / ratioW)
  const ratioTarget = `${targetW}×${targetH}`

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-mono mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />Free Design Tool
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-3">{tx.title}</h1>
        <p className="text-slate-300 text-base max-w-xl mx-auto">{tx.desc}</p>
      </div>

      <div className="flex rounded-xl border border-surface-border overflow-hidden mb-5">
        {[["wh", lang==="ko"?"해상도 → 비율":"Resolution → Ratio"], ["ratio", lang==="ko"?"비율 → 해상도":"Ratio → Resolution"]].map(([v,l]) => (
          <button key={v} onClick={() => setMode(v as "wh"|"ratio")}
            className={`flex-1 py-2.5 text-sm font-medium transition-all ${mode===v?"bg-brand-500 text-white font-bold":"bg-[#1a1d27] text-slate-300"}`}>{l}</button>
        ))}
      </div>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {PRESETS.map(p => (
          <button key={p.label} onClick={() => { if(mode==="wh"){setW(p.w);setH(p.h)} else {const g2=gcd(p.w,p.h);setRatioW(p.w/g2);setRatioH(p.h/g2)} }}
            className="text-xs px-2.5 py-1.5 rounded-lg border border-surface-border text-slate-300 hover:border-brand-500/40 hover:text-brand-300 bg-[#0f1117] transition-all">{p.label}</button>
        ))}
      </div>

      {mode === "wh" && (
        <div className="flex flex-col gap-4">
          <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-5">
            <div className="grid grid-cols-2 gap-3">
              {[["W", w, setW], ["H", h, setH]].map(([label, val, set]) => (
                <div key={label as string}>
                  <label className="text-xs text-slate-400 mb-1.5 block">{lang==="ko"?`${label==="W"?"너비":"높이"} (px)`:label as string}</label>
                  <input type="number" min={1} value={val as number} onChange={e => (set as Function)(+e.target.value)}
                    className="w-full bg-[#0f1117] border border-surface-border rounded-xl px-4 py-3 text-slate-200 text-xl font-mono text-center focus:outline-none focus:border-brand-500/50 transition-all" />
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              {label:lang==="ko"?"화면 비율":"Aspect Ratio", val:ratio, key:"ratio"},
              {label:lang==="ko"?"너비/높이 %":"Width/Height %", val:`${pct}%`, key:"pct"},
              {label:lang==="ko"?"대각선 (픽셀)":"Diagonal (px)", val:diagonal, key:"diag"},
            ].map(r => (
              <div key={r.key} className="rounded-xl border border-brand-500/30 bg-brand-500/10 p-3 text-center">
                <p className="text-xs text-slate-400 mb-1">{r.label}</p>
                <p className="text-lg font-bold text-brand-400 font-mono">{r.val}</p>
                <button onClick={() => copy(r.val, r.key)} className={`mt-1 p-1 rounded border transition-all ${copied===r.key?"bg-brand-500/20 border-brand-500/40 text-brand-400":"border-surface-border text-slate-600 hover:text-brand-400"}`}>
                  {copied===r.key?<CheckCheck size={11}/>:<Copy size={11}/>}
                </button>
              </div>
            ))}
          </div>
          <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-3 flex items-center justify-center" style={{aspectRatio:`${w}/${h}`, maxHeight:"200px"}}>
            <p className="text-xs text-slate-500">{w}×{h} ({ratio})</p>
          </div>
        </div>
      )}

      {mode === "ratio" && (
        <div className="flex flex-col gap-4">
          <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-5">
            <div className="grid grid-cols-3 gap-3 items-end">
              <div>
                <label className="text-xs text-slate-400 mb-1.5 block">{lang==="ko"?"비율 W":"Ratio W"}</label>
                <input type="number" min={1} value={ratioW} onChange={e => setRatioW(+e.target.value)}
                  className="w-full bg-[#0f1117] border border-surface-border rounded-xl px-3 py-3 text-slate-200 text-xl font-mono text-center focus:outline-none focus:border-brand-500/50 transition-all" />
              </div>
              <p className="text-center text-2xl text-slate-400 pb-1">:</p>
              <div>
                <label className="text-xs text-slate-400 mb-1.5 block">{lang==="ko"?"비율 H":"Ratio H"}</label>
                <input type="number" min={1} value={ratioH} onChange={e => setRatioH(+e.target.value)}
                  className="w-full bg-[#0f1117] border border-surface-border rounded-xl px-3 py-3 text-slate-200 text-xl font-mono text-center focus:outline-none focus:border-brand-500/50 transition-all" />
              </div>
            </div>
            <div className="mt-3">
              <label className="text-xs text-slate-400 mb-1.5 block">{lang==="ko"?"기준 너비 (px)":"Target Width (px)"}</label>
              <input type="number" min={1} value={targetW} onChange={e => setTargetW(+e.target.value)}
                className="w-full bg-[#0f1117] border border-surface-border rounded-lg px-3 py-2.5 text-slate-200 text-lg font-mono focus:outline-none focus:border-brand-500/50 transition-all" />
            </div>
          </div>
          <div className="rounded-xl border border-brand-500/40 bg-brand-500/10 p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400">{lang==="ko"?"계산된 해상도":"Calculated Resolution"}</p>
              <p className="text-3xl font-extrabold text-brand-400 font-mono">{ratioTarget}</p>
            </div>
            <button onClick={() => copy(ratioTarget, "res")} className={`p-2.5 rounded-xl border transition-all ${copied==="res"?"bg-brand-500/20 border-brand-500/40 text-brand-400":"border-surface-border text-slate-400 hover:text-brand-400"}`}>
              {copied==="res"?<CheckCheck size={16}/>:<Copy size={16}/>}
            </button>
          </div>
        </div>
      )}

      <ToolFooter
        toolName={lang==="ko"?"화면 비율 계산기":"Aspect Ratio Calculator"}
        toolUrl="https://keyword-mixer.vercel.app/aspect-ratio"
        description={tx.desc}
        howToUse={lang==="ko"?[
          {step:"모드 선택", desc:"해상도→비율 또는 비율→해상도 모드를 선택하세요."},
          {step:"프리셋 선택", desc:"자주 사용하는 해상도 프리셋을 클릭하세요."},
          {step:"값 입력", desc:"너비·높이 또는 비율을 입력하세요."},
          {step:"결과 복사", desc:"계산된 비율이나 해상도를 복사하세요."},
        ]:[
          {step:"Select mode", desc:"Choose resolution→ratio or ratio→resolution mode."},
          {step:"Use presets", desc:"Click common resolution presets."},
          {step:"Enter values", desc:"Input width/height or ratio."},
          {step:"Copy result", desc:"Copy the calculated ratio or resolution."},
        ]}
        whyUse={lang==="ko"?[
          {title:"양방향 계산", desc:"해상도→비율, 비율→해상도 양방향 계산을 지원합니다."},
          {title:"시각적 미리보기", desc:"입력한 비율로 실제 화면 모양을 미리보기할 수 있습니다."},
          {title:"인기 해상도 프리셋", desc:"FHD, 4K, 모바일 등 자주 사용하는 해상도를 바로 선택합니다."},
          {title:"GCD 최소화", desc:"최대공약수로 비율을 자동으로 최소화해 표현합니다."},
        ]:[
          {title:"Bidirectional", desc:"Both resolution→ratio and ratio→resolution calculation."},
          {title:"Visual preview", desc:"See actual screen shape preview for the entered ratio."},
          {title:"Common presets", desc:"FHD, 4K, mobile and other popular resolution presets."},
          {title:"GCD simplification", desc:"Automatically simplifies ratio using GCD."},
        ]}
        faqs={lang==="ko"?[
          {q:"16:9가 표준인 이유는?", a:"사람의 시야각이 가로로 넓어 16:9가 가장 자연스럽게 보입니다. 4K(3840×2160), FHD(1920×1080), HD(1280×720) 모두 16:9 비율입니다."},
          {q:"4:3은 어디서 사용되나요?", a:"구형 TV·모니터, 표준 사진 인화(4R), 일부 태블릿에서 사용됩니다. 현재 대부분 16:9로 전환되었습니다."},
          {q:"21:9 울트라와이드란?", a:"시네마틱 비율로 영화 제작에 사용됩니다. 게이밍·영상 편집용 모니터에 인기입니다."},
          {q:"소셜미디어별 권장 비율은?", a:"인스타그램: 1:1(정방형), 4:5(세로), 1.91:1(가로). 유튜브: 16:9. 틱톡/릴스: 9:16."},
        ]:[
          {q:"Why is 16:9 standard?", a:"Human peripheral vision is wider horizontally, making 16:9 most natural. 4K(3840×2160), FHD(1920×1080), HD(1280×720) are all 16:9."},
          {q:"Where is 4:3 used?", a:"Old TVs/monitors, standard photo prints (4R), some tablets. Most have now transitioned to 16:9."},
          {q:"What is 21:9 ultrawide?", a:"Cinematic ratio used in film production. Popular for gaming and video editing monitors."},
          {q:"Recommended ratios for social media?", a:"Instagram: 1:1 (square), 4:5 (portrait), 1.91:1 (landscape). YouTube: 16:9. TikTok/Reels: 9:16."},
        ]}
        keywords="화면 비율 계산기 · 해상도 비율 · 16:9 계산기 · 4:3 비율 · 화면 해상도 · aspect ratio calculator · screen ratio · resolution calculator · 16:9 4K · image aspect ratio"
      />
    </div>
  )
}
