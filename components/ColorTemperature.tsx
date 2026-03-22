
'use client'
import { useState } from 'react'
import { Copy, CheckCheck } from 'lucide-react'
import { useLang } from './LangContext'
import ToolFooter from './ToolFooter'

const T = {
  ko: { title: '색온도 변환기 (K↔RGB)', desc: '색온도(켈빈)를 RGB·HEX 색상으로 변환. 조명 색온도를 시각적으로 미리보기.' },
  en: { title: 'Color Temperature Converter (K↔RGB)', desc: 'Convert color temperature (Kelvin) to RGB/HEX. Visual preview of lighting color temperatures.' }
}

// Tanner Helland 알고리즘
function kelvinToRgb(K: number): { r: number; g: number; b: number } {
  const temp = Math.min(Math.max(K, 1000), 40000) / 100
  let r, g, b
  if (temp <= 66) {
    r = 255
    g = Math.min(255, Math.max(0, 99.4708025861 * Math.log(temp) - 161.1195681661))
    b = temp <= 19 ? 0 : Math.min(255, Math.max(0, 138.5177312231 * Math.log(temp - 10) - 305.0447927307))
  } else {
    r = Math.min(255, Math.max(0, 329.698727446 * Math.pow(temp - 60, -0.1332047592)))
    g = Math.min(255, Math.max(0, 288.1221695283 * Math.pow(temp - 60, -0.0755148492)))
    b = 255
  }
  return { r: Math.round(r), g: Math.round(g), b: Math.round(b) }
}

function toHex(r: number, g: number, b: number): string {
  return "#" + [r,g,b].map(v => v.toString(16).padStart(2,"0")).join("").toUpperCase()
}

const PRESETS = [
  { k: 1900, name_ko: "양초", name_en: "Candle" },
  { k: 2700, name_ko: "백열전구", name_en: "Incandescent" },
  { k: 3000, name_ko: "할로겐", name_en: "Halogen" },
  { k: 4000, name_ko: "형광등 (따뜻함)", name_en: "Warm Fluorescent" },
  { k: 5000, name_ko: "주간 일광", name_en: "Daylight" },
  { k: 5500, name_ko: "정오 햇빛", name_en: "Noon Sunlight" },
  { k: 6500, name_ko: "흐린 날", name_en: "Overcast Sky" },
  { k: 7000, name_ko: "LCD 모니터", name_en: "LCD Monitor" },
  { k: 9000, name_ko: "파란 하늘", name_en: "Blue Sky" },
]

export default function ColorTemperature() {
  const { lang } = useLang()
  const tx = T[lang]
  const [k, setK] = useState(6500)
  const [copied, setCopied] = useState<string|null>(null)
  const copy = async (t: string, key: string) => { await navigator.clipboard.writeText(t); setCopied(key); setTimeout(() => setCopied(null),1500) }

  const rgb = kelvinToRgb(k)
  const hex = toHex(rgb.r, rgb.g, rgb.b)
  const textColor = (rgb.r * 0.299 + rgb.g * 0.587 + rgb.b * 0.114) > 186 ? "#000" : "#fff"

  const warmth = k < 3500 ? (lang==="ko"?"따뜻한 계열 (주황/노란)":"Warm (orange/yellow)")
    : k < 5000 ? (lang==="ko"?"중간 (자연광)":"Neutral (natural)")
    : (lang==="ko"?"차가운 계열 (흰/파란)":"Cool (white/blue)")

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-mono mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />Free Design Tool
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-3">{tx.title}</h1>
        <p className="text-slate-300 text-base max-w-xl mx-auto">{tx.desc}</p>
      </div>
      <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-5 mb-5">
        <label className="text-xs text-slate-400 mb-2 block font-medium">{lang==="ko"?"색온도 (K)":"Color Temperature (K)"}</label>
        <div className="flex items-center gap-3 mb-3">
          <input type="range" min={1000} max={12000} step={100} value={k} onChange={e => setK(+e.target.value)} className="flex-1 accent-green-500" />
          <input type="number" value={k} step={100} min={1000} max={12000} onChange={e => setK(+e.target.value)}
            className="w-24 bg-[#0f1117] border border-surface-border rounded-lg px-3 py-2 text-brand-400 text-sm font-mono text-center focus:outline-none focus:border-brand-500/50 transition-all" />
          <span className="text-slate-400 text-sm">K</span>
        </div>
        <div className="h-8 rounded-xl mb-3" style={{ background: "linear-gradient(to right, #ff9a00, #ffe87c, #fff, #c4d8ff, #6b9fff)" }} />
        <div className="flex flex-wrap gap-1.5">
          {PRESETS.map(p => (
            <button key={p.k} onClick={() => setK(p.k)}
              className={`text-xs px-2.5 py-1.5 rounded border transition-all ${k===p.k?"bg-brand-500 border-brand-500 text-white":"border-surface-border text-slate-400 bg-[#0f1117] hover:border-brand-500/40"}`}>
              {p.k}K {lang==="ko"?p.name_ko:p.name_en}
            </button>
          ))}
        </div>
      </div>
      {/* 미리보기 */}
      <div className="rounded-xl overflow-hidden mb-5 h-32 flex items-center justify-center" style={{ backgroundColor: hex }}>
        <div className="text-center">
          <p className="text-2xl font-extrabold font-mono" style={{ color: textColor }}>{k}K</p>
          <p className="text-sm font-medium" style={{ color: textColor }}>{warmth}</p>
        </div>
      </div>
      {/* 변환 결과 */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "HEX", val: hex, key: "hex" },
          { label: "RGB", val: `rgb(${rgb.r},${rgb.g},${rgb.b})`, key: "rgb" },
          { label: "CSS", val: `color-mix(in srgb, ${hex} 100%)`, key: "css" },
        ].map(r => (
          <div key={r.key} className="rounded-xl border border-surface-border bg-[#1a1d27] p-3 text-center">
            <p className="text-xs text-slate-400 mb-1">{r.label}</p>
            <p className="text-xs font-mono text-slate-200 break-all">{r.val}</p>
            <button onClick={() => copy(r.val, r.key)} className={`mt-2 p-1.5 rounded border transition-all ${copied===r.key?"bg-brand-500/20 border-brand-500/40 text-brand-400":"border-surface-border text-slate-500 hover:text-brand-400"}`}>
              {copied===r.key?<CheckCheck size={12}/>:<Copy size={12}/>}
            </button>
          </div>
        ))}
      </div>
      <ToolFooter
        toolName={lang==="ko"?"색온도 변환기":"Color Temperature Converter"}
        toolUrl="https://keyword-mixer.vercel.app/color-temperature"
        description={tx.desc}
        howToUse={lang==="ko"?[
          {step:"색온도 입력", desc:"슬라이더를 조절하거나 켈빈(K) 값을 직접 입력하세요."},
          {step:"프리셋 선택", desc:"양초, 백열등, 형광등 등 일반적인 조명 색온도를 빠르게 선택하세요."},
          {step:"미리보기 확인", desc:"해당 색온도의 실제 색상이 미리보기로 표시됩니다."},
          {step:"코드 복사", desc:"HEX·RGB 색상 코드를 복사해 디자인 작업에 활용하세요."},
        ]:[
          {step:"Enter temperature", desc:"Adjust slider or type Kelvin value directly."},
          {step:"Use presets", desc:"Quickly select common light sources like candle, incandescent, fluorescent."},
          {step:"View preview", desc:"See the actual color that corresponds to the temperature."},
          {step:"Copy codes", desc:"Copy HEX or RGB codes for design work."},
        ]}
        whyUse={lang==="ko"?[
          {title:"실제 색상 미리보기", desc:"색온도를 정확한 RGB 색상으로 시각화해 실제로 어떻게 보이는지 확인합니다."},
          {title:"조명 프리셋", desc:"양초·백열전구·형광등 등 9가지 일반 조명의 색온도를 제공합니다."},
          {title:"HEX·RGB 변환", desc:"켈빈 온도를 HEX·RGB로 변환해 CSS·디자인 툴에서 바로 사용할 수 있습니다."},
          {title:"그라디언트 시각화", desc:"1000K~12000K 범위의 색온도 그라디언트를 한눈에 확인합니다."},
        ]:[
          {title:"Actual color preview", desc:"Visualizes exact RGB color for any Kelvin temperature."},
          {title:"Lighting presets", desc:"9 common light source presets from candle to blue sky."},
          {title:"HEX/RGB conversion", desc:"Convert Kelvin to HEX/RGB for immediate use in CSS and design tools."},
          {title:"Gradient visualization", desc:"See the full 1000K-12000K color temperature gradient at a glance."},
        ]}
        faqs={lang==="ko"?[
          {q:"색온도란?", a:"빛의 색상을 온도(켈빈, K)로 표현한 값입니다. 낮은 K(2700K)는 노란/주황빛의 따뜻한 색, 높은 K(6500K↑)는 파란빛의 차가운 색입니다."},
          {q:"일반적인 조명 색온도는?", a:"백열전구 2700K, 할로겐 3000K, 형광등 4000~6500K, 자연광 5500K, 흐린날 6500K 정도입니다."},
          {q:"눈에 좋은 모니터 색온도는?", a:"낮에는 6500K, 저녁에는 4000~5000K, 밤에는 3000K 이하가 눈에 덜 피로합니다. f.lux, Night Shift 등의 앱을 활용하세요."},
          {q:"사진 촬영 시 색온도는?", a:"야외 맑은날 5200~5500K, 흐린날 7000K, 실내 백열등 2500~3000K를 화이트밸런스로 설정합니다."},
        ]:[
          {q:"What is color temperature?", a:"A measure of light color in Kelvin (K). Low K (2700K) = warm yellow/orange light. High K (6500K+) = cool blue-white light."},
          {q:"Common lighting temperatures?", a:"Incandescent 2700K, halogen 3000K, fluorescent 4000-6500K, natural daylight 5500K, overcast 6500K."},
          {q:"Best monitor color temperature?", a:"6500K during day, 4000-5000K at evening, 3000K or below at night. Apps like f.lux or Night Shift help automatically."},
          {q:"Photography white balance?", a:"Sunny daylight 5200-5500K, overcast 7000K, indoor incandescent 2500-3000K for white balance settings."},
        ]}
        keywords="색온도 변환기 · 켈빈 RGB 변환 · 색온도 K · 조명 색온도 · 색온도 HEX · color temperature converter · Kelvin to RGB · color temperature K · lighting color temperature · Kelvin color"
      />
    </div>
  )
}
