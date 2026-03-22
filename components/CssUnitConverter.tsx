
'use client'
import { useState } from 'react'
import { Copy, CheckCheck } from 'lucide-react'
import { useLang } from './LangContext'
import ToolFooter from './ToolFooter'

const T = {
  ko: { title: 'CSS 단위 변환기', desc: 'px·em·rem·vw·vh·pt·cm 등 CSS 단위를 즉시 변환. 반응형 웹 개발 필수 도구.' },
  en: { title: 'CSS Unit Converter', desc: 'Convert px, em, rem, vw, vh, pt, cm CSS units instantly. Essential for responsive web development.' }
}

export default function CssUnitConverter() {
  const { lang } = useLang()
  const tx = T[lang]
  const [px, setPx] = useState(16)
  const [baseFontSize, setBaseFontSize] = useState(16)
  const [viewportW, setViewportW] = useState(1440)
  const [viewportH, setViewportH] = useState(900)
  const [copied, setCopied] = useState<string|null>(null)
  const copy = async (t: string, k: string) => { await navigator.clipboard.writeText(t); setCopied(k); setTimeout(() => setCopied(null),1500) }

  const conversions = [
    { unit: "px", val: px, label: "픽셀" },
    { unit: "em", val: +(px / baseFontSize).toFixed(4), label: "em (부모 기준)" },
    { unit: "rem", val: +(px / baseFontSize).toFixed(4), label: "rem (루트 기준)" },
    { unit: "pt", val: +(px * 0.75).toFixed(2), label: "포인트 (인쇄)" },
    { unit: "pc", val: +(px / 16).toFixed(4), label: "파이카" },
    { unit: "vw", val: +((px / viewportW) * 100).toFixed(4), label: `vw (${viewportW}px 기준)` },
    { unit: "vh", val: +((px / viewportH) * 100).toFixed(4), label: `vh (${viewportH}px 기준)` },
    { unit: "cm", val: +(px * 0.026458).toFixed(4), label: "센티미터" },
    { unit: "mm", val: +(px * 0.264583).toFixed(3), label: "밀리미터" },
    { unit: "in", val: +(px / 96).toFixed(4), label: "인치 (96dpi)" },
  ]

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-mono mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />Free Developer Tool
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-3">{tx.title}</h1>
        <p className="text-slate-300 text-base max-w-xl mx-auto">{tx.desc}</p>
      </div>

      <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-5 mb-5">
        <div className="mb-4">
          <label className="text-xs text-slate-400 mb-1.5 block">{lang==="ko"?"기준 픽셀 (px)":"Base Pixel (px)"}</label>
          <input type="number" value={px} step={1} onChange={e => setPx(+e.target.value)}
            className="w-full bg-[#0f1117] border border-surface-border rounded-xl px-4 py-3 text-slate-200 text-2xl font-mono focus:outline-none focus:border-brand-500/50 transition-all mb-2" />
          <div className="flex flex-wrap gap-1.5">
            {[8,10,12,14,16,18,20,24,32,48,64,100].map(v => (
              <button key={v} onClick={() => setPx(v)}
                className={`text-xs px-2.5 py-1 rounded border transition-all ${px===v?"bg-brand-500 border-brand-500 text-white":"border-surface-border text-slate-400 bg-[#0f1117]"}`}>{v}px</button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            [lang==="ko"?"기본 폰트 크기 (px)":"Base Font Size", baseFontSize, setBaseFontSize],
            [lang==="ko"?"뷰포트 너비 (px)":"Viewport Width", viewportW, setViewportW],
            [lang==="ko"?"뷰포트 높이 (px)":"Viewport Height", viewportH, setViewportH],
          ].map(([label, val, set]) => (
            <div key={label as string}>
              <label className="text-xs text-slate-400 mb-1 block">{label as string}</label>
              <input type="number" min={1} value={val as number} onChange={e => (set as Function)(+e.target.value)}
                className="w-full bg-[#0f1117] border border-surface-border rounded-lg px-2 py-2 text-slate-200 text-xs font-mono focus:outline-none focus:border-brand-500/50 transition-all" />
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {conversions.map(c => (
          <div key={c.unit} className="rounded-xl border border-surface-border bg-[#1a1d27] p-3 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500">{c.label}</p>
              <p className="text-base font-bold text-slate-200 font-mono">{c.val} <span className="text-brand-400 text-sm">{c.unit}</span></p>
            </div>
            <button onClick={() => copy(`${c.val}${c.unit}`, c.unit)} className={`p-1.5 rounded border transition-all ${copied===c.unit?"bg-brand-500/20 border-brand-500/40 text-brand-400":"border-surface-border text-slate-600 hover:text-brand-400"}`}>
              {copied===c.unit?<CheckCheck size={12}/>:<Copy size={12}/>}
            </button>
          </div>
        ))}
      </div>

      <ToolFooter
        toolName={lang==="ko"?"CSS 단위 변환기":"CSS Unit Converter"}
        toolUrl="https://keyword-mixer.vercel.app/css-unit-converter"
        description={tx.desc}
        howToUse={lang==="ko"?[
          {step:"픽셀 입력", desc:"변환할 px 값을 입력하거나 프리셋을 클릭하세요."},
          {step:"기준값 설정", desc:"em/rem의 기본 폰트 크기, vw/vh의 뷰포트 크기를 설정하세요."},
          {step:"변환 결과 확인", desc:"10가지 CSS 단위로 자동 변환된 결과를 확인하세요."},
          {step:"복사하여 사용", desc:"필요한 단위 값을 복사해 CSS 코드에 바로 사용하세요."},
        ]:[
          {step:"Enter pixels", desc:"Input px value or click presets."},
          {step:"Set base values", desc:"Configure base font size and viewport dimensions."},
          {step:"View conversions", desc:"See 10 CSS unit conversions automatically."},
          {step:"Copy to use", desc:"Copy needed unit values directly into CSS code."},
        ]}
        whyUse={lang==="ko"?[
          {title:"10가지 단위 동시 변환", desc:"px, em, rem, vw, vh, pt, cm, mm, in, pc를 한번에 변환합니다."},
          {title:"커스텀 기준값", desc:"em/rem 기본 폰트 크기와 vw/vh 뷰포트 크기를 프로젝트에 맞게 설정합니다."},
          {title:"반응형 개발 필수", desc:"px→vw/vh 변환으로 반응형 웹 개발을 쉽게 합니다."},
          {title:"인쇄 단위 지원", desc:"pt, cm, mm, in 인쇄 단위도 포함해 다양한 용도로 활용합니다."},
        ]:[
          {title:"10 units at once", desc:"Convert px, em, rem, vw, vh, pt, cm, mm, in, pc simultaneously."},
          {title:"Custom base values", desc:"Set base font size and viewport for accurate em/rem/vw/vh."},
          {title:"Responsive dev essential", desc:"px→vw/vh conversion for responsive web design."},
          {title:"Print units included", desc:"pt, cm, mm, in for print and diverse use cases."},
        ]}
        faqs={lang==="ko"?[
          {q:"rem과 em의 차이는?", a:"rem은 HTML 루트 요소의 폰트 크기 기준(보통 16px), em은 부모 요소의 폰트 크기 기준입니다. rem이 더 예측 가능하고 일관성이 있어 권장됩니다."},
          {q:"vw와 vh는 어디에 쓰나요?", a:"vw(viewport width)는 화면 너비의 %, vh(viewport height)는 화면 높이의 %입니다. 반응형 레이아웃, 전체화면 섹션, 동적 폰트 크기에 활용됩니다."},
          {q:"16px이 기본인 이유는?", a:"대부분의 브라우저 기본 폰트 크기가 16px입니다. 1rem = 16px이 기본값이며, HTML에서 font-size: 62.5%로 설정하면 1rem = 10px로 사용할 수 있습니다."},
          {q:"pt는 언제 사용하나요?", a:"pt(포인트)는 인쇄용 단위입니다. 1pt = 1/72인치 ≈ 1.333px. Word·PDF 문서 작업 시 주로 사용됩니다."},
        ]:[
          {q:"rem vs em difference?", a:"rem is based on root element font size (usually 16px). em is based on parent element. rem is recommended for predictability."},
          {q:"When to use vw and vh?", a:"vw = % of viewport width, vh = % of viewport height. Used for responsive layouts, full-screen sections, dynamic font sizes."},
          {q:"Why is 16px the default?", a:"Most browsers default to 16px font size. 1rem = 16px by default. Set html {font-size: 62.5%} to make 1rem = 10px."},
          {q:"When to use pt?", a:"pt (point) is for print. 1pt = 1/72 inch ≈ 1.333px. Mainly used in Word/PDF document work."},
        ]}
        keywords="CSS 단위 변환기 · px to rem · px em 변환 · rem px 변환 · CSS px rem em · css unit converter · px to em · rem calculator · viewport units · responsive design units · px to vw"
      />
    </div>
  )
}
