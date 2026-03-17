'use client'

import { useState, useCallback } from 'react'
import { useLang } from './LangContext'
import ToolFooter from './ToolFooter'
import { Copy, CheckCheck, RefreshCw, Lock, Unlock } from 'lucide-react'

const T = {
  ko: {
    title: '색상 팔레트 생성기',
    desc: '조화로운 색상 팔레트를 즉시 생성. 모노크롬·보색·유사색·트리아드 등 8가지 조화 방식.',
    generate: '팔레트 생성',
    copy: '복사',
    copied: '복사됨',
    harmony: '색상 조화',
    baseColor: '기준 색상',
    randomize: '랜덤',
    exportCSS: 'CSS 내보내기',
  },
  en: {
    title: 'Color Palette Generator',
    desc: 'Generate harmonious color palettes instantly. 8 harmony modes including monochrome, complementary, analogous.',
    generate: 'Generate',
    copy: 'Copy',
    copied: 'Copied!',
    harmony: 'Color Harmony',
    baseColor: 'Base Color',
    randomize: 'Random',
    exportCSS: 'Export CSS',
  }
}

const HARMONIES = [
  { key: 'analogous', label: '유사색', labelEn: 'Analogous' },
  { key: 'complementary', label: '보색', labelEn: 'Complementary' },
  { key: 'triadic', label: '트리아드', labelEn: 'Triadic' },
  { key: 'tetradic', label: '테트라드', labelEn: 'Tetradic' },
  { key: 'monochromatic', label: '모노크롬', labelEn: 'Monochromatic' },
  { key: 'split-complementary', label: '분할보색', labelEn: 'Split-Comp' },
  { key: 'shades', label: '음영', labelEn: 'Shades' },
  { key: 'tints', label: '틴트', labelEn: 'Tints' },
]

function hexToHsl(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  let h = 0, s = 0
  const l = (max + min) / 2
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
      case g: h = ((b - r) / d + 2) / 6; break
      case b: h = ((r - g) / d + 4) / 6; break
    }
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)]
}

function hslToHex(h: number, s: number, l: number): string {
  h = ((h % 360) + 360) % 360
  s = Math.max(0, Math.min(100, s))
  l = Math.max(0, Math.min(100, l))
  const ss = s / 100, ll = l / 100
  const c = (1 - Math.abs(2 * ll - 1)) * ss
  const x = c * (1 - Math.abs((h / 60) % 2 - 1))
  const m = ll - c / 2
  let r = 0, g = 0, b = 0
  if (h < 60) { r = c; g = x } else if (h < 120) { r = x; g = c }
  else if (h < 180) { g = c; b = x } else if (h < 240) { g = x; b = c }
  else if (h < 300) { r = x; b = c } else { r = c; b = x }
  const toHex = (n: number) => Math.round((n + m) * 255).toString(16).padStart(2, '0')
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

function generatePalette(baseHex: string, harmony: string): string[] {
  const [h, s, l] = hexToHsl(baseHex)
  switch (harmony) {
    case 'analogous': return [h - 30, h - 15, h, h + 15, h + 30].map(hh => hslToHex(hh, s, l))
    case 'complementary': return [h, h + 30, h + 150, h + 180, h + 210].map(hh => hslToHex(hh, s, l))
    case 'triadic': return [h, h + 60, h + 120, h + 180, h + 240].map(hh => hslToHex(hh, s, l))
    case 'tetradic': return [h, h + 90, h + 180, h + 270, h + 315].map(hh => hslToHex(hh, s, l))
    case 'monochromatic': return [20, 35, 50, 65, 80].map(ll => hslToHex(h, s, ll))
    case 'split-complementary': return [h, h + 150, h + 180, h + 210, h + 30].map(hh => hslToHex(hh, s, l))
    case 'shades': return [10, 25, 40, 55, 70].map(ll => hslToHex(h, s, ll))
    case 'tints': return [30, 45, 60, 75, 90].map(ll => hslToHex(h, s, ll))
    default: return [baseHex]
  }
}

function getTextColor(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.5 ? '#000000' : '#ffffff'
}

export default function ColorPalette() {
  const { lang } = useLang()
  const tx = T[lang]

  const [baseColor, setBaseColor] = useState('#22c55e')
  const [harmony, setHarmony] = useState('analogous')
  const [locked, setLocked] = useState<boolean[]>([false, false, false, false, false])
  const [copied, setCopied] = useState<string | null>(null)
  const [palettes, setPalettes] = useState<string[]>(() => generatePalette('#22c55e', 'analogous'))

  const generate = useCallback(() => {
    const newPalette = generatePalette(baseColor, harmony)
    setPalettes(prev => newPalette.map((c, i) => locked[i] ? prev[i] : c))
  }, [baseColor, harmony, locked])

  const randomize = () => {
    const randomHex = '#' + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0')
    setBaseColor(randomHex)
    const newPalette = generatePalette(randomHex, harmony)
    setPalettes(prev => newPalette.map((c, i) => locked[i] ? prev[i] : c))
  }

  const copy = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 1500)
  }

  const exportCSS = () => {
    const css = `:root {\n${palettes.map((c, i) => `  --color-${i + 1}: ${c};`).join('\n')}\n}`
    copy(css, 'css')
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-mono mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
          Free Design Tool
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-3 tracking-tight">{tx.title}</h1>
        <p className="text-slate-300 text-base max-w-lg mx-auto">{tx.desc}</p>
      </div>

      {/* 설정 */}
      <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-5 mb-5">
        <div className="flex gap-4 items-end mb-4">
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">{tx.baseColor}</label>
            <div className="flex items-center gap-2">
              <input type="color" value={baseColor} onChange={e => { setBaseColor(e.target.value); setPalettes(generatePalette(e.target.value, harmony)) }}
                className="w-12 h-10 rounded-lg border border-surface-border cursor-pointer bg-transparent" />
              <input type="text" value={baseColor} onChange={e => { if (/^#[0-9a-f]{6}$/i.test(e.target.value)) { setBaseColor(e.target.value); setPalettes(generatePalette(e.target.value, harmony)) } }}
                className="w-24 bg-[#0f1117] border border-surface-border rounded-lg px-3 py-2 text-sm text-slate-200 font-mono focus:outline-none focus:border-brand-500/50 transition-all" />
            </div>
          </div>
          <button onClick={randomize} className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-surface-border text-slate-300 hover:text-brand-400 hover:border-brand-500/40 transition-all text-sm mb-0.5">
            <RefreshCw size={14} /> {tx.randomize}
          </button>
          <button onClick={exportCSS} className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg border text-sm transition-all mb-0.5 ${copied === 'css' ? 'bg-brand-500/20 border-brand-500/40 text-brand-400' : 'border-surface-border text-slate-300 hover:border-brand-500/40'}`}>
            {copied === 'css' ? <CheckCheck size={14} /> : <Copy size={14} />} {tx.exportCSS}
          </button>
        </div>

        {/* 조화 방식 */}
        <div>
          <p className="text-xs text-slate-400 mb-2 font-medium">{tx.harmony}</p>
          <div className="flex flex-wrap gap-1.5">
            {HARMONIES.map(h => (
              <button key={h.key} onClick={() => { setHarmony(h.key); setPalettes(generatePalette(baseColor, h.key)) }}
                className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${harmony === h.key ? 'bg-brand-500 border-brand-500 text-white font-bold' : 'border-surface-border text-slate-300 hover:border-brand-500/40 hover:text-brand-300 bg-[#0f1117]'}`}>
                {lang === 'ko' ? h.label : h.labelEn}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 팔레트 */}
      <div className="rounded-xl overflow-hidden border border-surface-border mb-5">
        <div className="flex h-40">
          {palettes.map((color, i) => (
            <div key={i} className="flex-1 relative group" style={{ backgroundColor: color }}>
              <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all bg-black/20">
                <p className="text-xs font-mono font-bold" style={{ color: getTextColor(color) }}>{color.toUpperCase()}</p>
                <button onClick={() => copy(color, `color-${i}`)} className="mt-1 p-1 rounded" style={{ color: getTextColor(color) }}>
                  {copied === `color-${i}` ? <CheckCheck size={14} /> : <Copy size={14} />}
                </button>
              </div>
              <button onClick={() => setLocked(prev => prev.map((l, j) => j === i ? !l : l))}
                className="absolute top-2 right-2 p-1 rounded opacity-0 group-hover:opacity-100 transition-all" style={{ color: getTextColor(color) }}>
                {locked[i] ? <Lock size={12} /> : <Unlock size={12} />}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 색상 코드 목록 */}
      <div className="grid grid-cols-5 gap-2 mb-5">
        {palettes.map((color, i) => (
          <div key={i} className="rounded-lg border border-surface-border bg-[#1a1d27] p-2.5">
            <div className="w-full h-10 rounded-lg mb-2 border border-surface-border" style={{ backgroundColor: color }} />
            <p className="text-xs font-mono text-center text-slate-200">{color.toUpperCase()}</p>
            <div className="flex gap-1 mt-1 justify-center">
              <button onClick={() => copy(color, `hex-${i}`)} className={`text-xs px-1.5 py-0.5 rounded border transition-all ${copied === `hex-${i}` ? 'bg-brand-500/20 border-brand-500/40 text-brand-400' : 'border-surface-border text-slate-500 hover:text-brand-400'}`}>
                {copied === `hex-${i}` ? '✓' : 'HEX'}
              </button>
              <button onClick={() => { const [h, s, l] = hexToHsl(color); copy(`hsl(${h}, ${s}%, ${l}%)`, `hsl-${i}`) }} className={`text-xs px-1.5 py-0.5 rounded border transition-all ${copied === `hsl-${i}` ? 'bg-brand-500/20 border-brand-500/40 text-brand-400' : 'border-surface-border text-slate-500 hover:text-brand-400'}`}>
                HSL
              </button>
            </div>
          </div>
        ))}
      </div>

      <ToolFooter
        toolName={lang === 'ko' ? '색상 팔레트 생성기' : 'Color Palette Generator'}
        toolUrl="https://keyword-mixer.vercel.app/color-palette"
        description={tx.desc}
        howToUse={lang === 'ko' ? [
          { step: '기준 색상 선택', desc: '컬러 피커나 HEX 코드를 입력해 기준 색상을 설정하세요.' },
          { step: '조화 방식 선택', desc: '유사색, 보색, 모노크롬 등 8가지 색상 조화 방식 중 하나를 선택하세요.' },
          { step: '팔레트 확인', desc: '생성된 5가지 색상을 확인하고 마음에 드는 색상을 복사하세요.' },
          { step: 'CSS 내보내기', desc: 'CSS 내보내기 버튼으로 CSS 변수 형태로 일괄 복사할 수 있습니다.' },
        ] : [
          { step: 'Choose base color', desc: 'Use the color picker or enter a HEX code to set your base color.' },
          { step: 'Select harmony mode', desc: 'Choose from 8 harmony modes: analogous, complementary, monochromatic, etc.' },
          { step: 'Review palette', desc: 'Browse the 5 generated colors and click to copy any color code.' },
          { step: 'Export CSS', desc: 'Use Export CSS to copy all colors as CSS custom properties.' },
        ]}
        whyUse={lang === 'ko' ? [
          { title: '8가지 조화 방식', desc: '색상 이론에 기반한 8가지 팔레트 생성 방식으로 전문적인 배색을 만들 수 있습니다.' },
          { title: 'HEX & HSL 지원', desc: 'HEX와 HSL 코드를 모두 제공해 CSS 작업에 바로 활용할 수 있습니다.' },
          { title: '잠금 기능', desc: '마음에 드는 색상은 잠금 설정해 다시 생성해도 유지할 수 있습니다.' },
          { title: 'CSS 변수 내보내기', desc: ':root CSS 변수 형식으로 한번에 내보내기가 가능합니다.' },
        ] : [
          { title: '8 harmony modes', desc: 'Color theory-based palettes from analogous to tetradic harmonies.' },
          { title: 'HEX & HSL codes', desc: 'Get both HEX and HSL values ready for CSS development.' },
          { title: 'Lock colors', desc: 'Lock colors you love while regenerating the rest of the palette.' },
          { title: 'CSS export', desc: 'Export as CSS custom properties (:root variables) in one click.' },
        ]}
        faqs={lang === 'ko' ? [
          { q: '유사색이란?', a: '색상환에서 인접한 색상들입니다. 자연스럽고 부드러운 느낌을 줍니다. 웹 디자인에서 가장 많이 사용됩니다.' },
          { q: '보색이란?', a: '색상환에서 정반대에 위치한 색상입니다. 강렬한 대비로 주의를 끌 때 사용합니다. 빨강-초록, 파랑-주황이 대표적입니다.' },
          { q: 'HEX와 HSL 중 어떤 걸 사용해야 하나요?', a: 'HEX(#RRGGBB)는 웹에서 가장 범용적입니다. HSL(색조, 채도, 밝기)은 색상을 직관적으로 조절할 때 유리합니다.' },
          { q: '모노크롬 팔레트는 언제 사용하나요?', a: '같은 색상의 밝기만 다른 팔레트입니다. 미니멀하고 세련된 디자인에 적합합니다.' },
        ] : [
          { q: 'What is analogous color harmony?', a: 'Colors adjacent on the color wheel. Creates natural, harmonious designs. Most commonly used in web design.' },
          { q: 'What is complementary harmony?', a: 'Colors opposite on the color wheel. Creates strong contrast for attention-grabbing designs. Classic examples: red-green, blue-orange.' },
          { q: 'HEX vs HSL — which to use?', a: 'HEX (#RRGGBB) is universal for web. HSL (Hue, Saturation, Lightness) is better for intuitive color adjustments in CSS.' },
          { q: 'When to use monochromatic palettes?', a: 'Same hue with different lightness values. Perfect for minimal, elegant designs with visual hierarchy.' },
        ]}
        keywords="색상 팔레트 생성기 · 컬러 팔레트 · 색상 조합 · 보색 · 유사색 · 색상 추천 · color palette generator · color scheme · complementary colors · analogous colors · color harmony · palette maker · CSS color palette · free color tool"
      />
    </div>
  )
}
