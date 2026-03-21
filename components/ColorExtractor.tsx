'use client'

import { useState, useRef, useCallback } from 'react'
import { Upload, Copy, CheckCheck } from 'lucide-react'
import { useLang } from './LangContext'
import ToolFooter from './ToolFooter'

const T = {
  ko: {
    title: '이미지 색상 추출기',
    desc: '이미지에서 주요 색상을 자동 추출. HEX·RGB·HSL 코드 복사, CSS 팔레트 내보내기.',
    dropzone: '이미지를 드래그하거나 클릭하여 업로드',
    dropSub: 'JPG, PNG, WebP, GIF 지원',
    extractCount: '추출할 색상 수',
    extracting: '색상 추출 중...',
    colors: '추출된 색상',
    copy: '복사',
    copied: '복사됨',
    exportCSS: 'CSS 변수 내보내기',
    click: '클릭하여 이미지 선택',
    dominant: '주요 색상',
    palette: '팔레트',
  },
  en: {
    title: 'Image Color Extractor',
    desc: 'Extract dominant colors from images automatically. Copy HEX, RGB, HSL codes and export CSS palette.',
    dropzone: 'Drag & drop an image or click to upload',
    dropSub: 'JPG, PNG, WebP, GIF supported',
    extractCount: 'Colors to Extract',
    extracting: 'Extracting colors...',
    colors: 'Extracted Colors',
    copy: 'Copy',
    copied: 'Copied!',
    exportCSS: 'Export CSS Variables',
    click: 'Click to select image',
    dominant: 'Dominant',
    palette: 'Palette',
  }
}

interface ExtractedColor {
  hex: string
  rgb: { r: number; g: number; b: number }
  hsl: { h: number; s: number; l: number }
  count: number
  percent: number
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('').toUpperCase()
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  const rs = r / 255, gs = g / 255, bs = b / 255
  const max = Math.max(rs, gs, bs), min = Math.min(rs, gs, bs)
  let h = 0, s = 0
  const l = (max + min) / 2
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case rs: h = ((gs - bs) / d + (gs < bs ? 6 : 0)) / 6; break
      case gs: h = ((bs - rs) / d + 2) / 6; break
      case bs: h = ((rs - gs) / d + 4) / 6; break
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
}

function quantizeColor(r: number, g: number, b: number, factor = 32): string {
  const qr = Math.round(r / factor) * factor
  const qg = Math.round(g / factor) * factor
  const qb = Math.round(b / factor) * factor
  return `${qr},${qg},${qb}`
}

function getTextColor(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.5 ? '#000000' : '#ffffff'
}

export default function ColorExtractor() {
  const { lang } = useLang()
  const tx = T[lang]
  const [image, setImage] = useState<string | null>(null)
  const [colors, setColors] = useState<ExtractedColor[]>([])
  const [loading, setLoading] = useState(false)
  const [count, setCount] = useState(8)
  const [copied, setCopied] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const extractColors = useCallback((imgSrc: string, colorCount: number) => {
    setLoading(true)
    const img = new window.Image()
    img.onload = () => {
      const canvas = canvasRef.current!
      const ctx = canvas.getContext('2d')!
      const maxSize = 200
      const scale = Math.min(maxSize / img.width, maxSize / img.height)
      canvas.width = Math.floor(img.width * scale)
      canvas.height = Math.floor(img.height * scale)
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data

      const colorMap = new Map<string, number>()
      for (let i = 0; i < data.length; i += 4) {
        if (data[i + 3] < 128) continue // skip transparent
        const key = quantizeColor(data[i], data[i + 1], data[i + 2])
        colorMap.set(key, (colorMap.get(key) ?? 0) + 1)
      }

      const sorted = Array.from(colorMap.entries()).sort((a, b) => b[1] - a[1])
      const total = sorted.reduce((sum, [, c]) => sum + c, 0)

      const extracted: ExtractedColor[] = sorted.slice(0, colorCount).map(([key, count]) => {
        const [r, g, b] = key.split(',').map(Number)
        return {
          hex: rgbToHex(r, g, b),
          rgb: { r, g, b },
          hsl: rgbToHsl(r, g, b),
          count,
          percent: Math.round(count / total * 100),
        }
      })

      setColors(extracted)
      setLoading(false)
    }
    img.src = imgSrc
  }, [])

  const loadImage = (file: File) => {
    if (!file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = e => {
      const src = e.target?.result as string
      setImage(src)
      extractColors(src, count)
    }
    reader.readAsDataURL(file)
  }

  const copy = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(key); setTimeout(() => setCopied(null), 1500)
  }

  const exportCSS = () => {
    const css = `:root {\n${colors.map((c, i) => `  --color-${i + 1}: ${c.hex};`).join('\n')}\n}`
    copy(css, 'css')
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-mono mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />Free Design Tool
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-3">{tx.title}</h1>
        <p className="text-slate-300 text-base max-w-lg mx-auto">{tx.desc}</p>
      </div>

      <canvas ref={canvasRef} className="hidden" />

      <div className="grid md:grid-cols-2 gap-5">
        {/* 업로드 영역 */}
        <div className="flex flex-col gap-4">
          <div
            onDragOver={e => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) loadImage(f) }}
            onClick={() => inputRef.current?.click()}
            className={`rounded-xl border-2 border-dashed cursor-pointer transition-all flex flex-col items-center justify-center p-8 min-h-[200px] ${dragging ? 'border-brand-500 bg-brand-500/10' : 'border-surface-border hover:border-brand-500/40 hover:bg-brand-500/5'}`}
          >
            {image ? (
              <img src={image} alt="uploaded" className="max-w-full max-h-48 object-contain rounded-lg" />
            ) : (
              <>
                <Upload size={24} className="text-slate-500 mb-3" />
                <p className="text-slate-300 text-sm font-medium text-center">{tx.dropzone}</p>
                <p className="text-slate-600 text-xs mt-1">{tx.dropSub}</p>
              </>
            )}
            <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) loadImage(f) }} />
          </div>

          {/* 설정 */}
          <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4">
            <p className="text-xs text-slate-400 mb-2 font-medium">{tx.extractCount}</p>
            <div className="flex gap-1.5">
              {[4, 6, 8, 12, 16].map(n => (
                <button key={n} onClick={() => { setCount(n); if (image) extractColors(image, n) }}
                  className={`flex-1 py-1.5 rounded-lg border text-xs font-mono transition-all ${count === n ? 'bg-brand-500 border-brand-500 text-white font-bold' : 'border-surface-border text-slate-300 bg-[#0f1117]'}`}>
                  {n}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 색상 결과 */}
        <div className="rounded-xl border border-surface-border bg-[#1a1d27] overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-surface-border">
            <p className="text-sm font-medium text-slate-200">{tx.colors}</p>
            {colors.length > 0 && (
              <button onClick={exportCSS} className={`text-xs px-2.5 py-1.5 rounded-lg border flex items-center gap-1 transition-all ${copied === 'css' ? 'bg-brand-500/20 border-brand-500/40 text-brand-400' : 'border-surface-border text-slate-300 hover:border-brand-500/40'}`}>
                {copied === 'css' ? <CheckCheck size={11} /> : <Copy size={11} />} {tx.exportCSS}
              </button>
            )}
          </div>

          {loading ? (
            <div className="flex items-center justify-center p-10">
              <div className="w-8 h-8 border-2 border-brand-500/30 border-t-brand-500 rounded-full animate-spin" />
              <span className="ml-3 text-sm text-slate-400">{tx.extracting}</span>
            </div>
          ) : colors.length > 0 ? (
            <>
              {/* 팔레트 바 */}
              <div className="flex h-12">
                {colors.map(c => (
                  <div key={c.hex} className="flex-1 cursor-pointer hover:scale-y-110 transition-all origin-bottom" style={{ backgroundColor: c.hex, width: `${c.percent}%` }} title={c.hex} />
                ))}
              </div>
              {/* 색상 목록 */}
              <div className="divide-y divide-surface-border max-h-80 overflow-y-auto">
                {colors.map((c, i) => (
                  <div key={c.hex} className="flex items-center gap-3 px-3 py-2.5 hover:bg-surface-hover/10 transition-all">
                    <div className="w-10 h-10 rounded-lg border border-surface-border flex-shrink-0 flex items-center justify-center text-xs font-bold" style={{ backgroundColor: c.hex, color: getTextColor(c.hex) }}>
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-mono text-slate-200 font-bold">{c.hex}</p>
                      <p className="text-xs text-slate-500">rgb({c.rgb.r},{c.rgb.g},{c.rgb.b}) · hsl({c.hsl.h},{c.hsl.s}%,{c.hsl.l}%) · {c.percent}%</p>
                    </div>
                    <div className="flex gap-1">
                      {[['HEX', c.hex], ['RGB', `rgb(${c.rgb.r},${c.rgb.g},${c.rgb.b})`], ['HSL', `hsl(${c.hsl.h},${c.hsl.s}%,${c.hsl.l}%)`]].map(([fmt, val]) => (
                        <button key={fmt} onClick={() => copy(val, `${c.hex}-${fmt}`)}
                          className={`text-xs px-1.5 py-1 rounded border transition-all ${copied === `${c.hex}-${fmt}` ? 'bg-brand-500/20 border-brand-500/40 text-brand-400' : 'border-surface-border text-slate-500 hover:text-brand-400 hover:border-brand-500/40'}`}>
                          {copied === `${c.hex}-${fmt}` ? '✓' : fmt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center p-10 text-slate-600 text-sm">
              {lang === 'ko' ? '이미지를 업로드하면 색상이 추출됩니다' : 'Upload an image to extract colors'}
            </div>
          )}
        </div>
      </div>

      <ToolFooter
        toolName={lang === 'ko' ? '이미지 색상 추출기' : 'Image Color Extractor'}
        toolUrl="https://keyword-mixer.vercel.app/color-extractor"
        description={tx.desc}
        howToUse={lang === 'ko' ? [
          { step: '이미지 업로드', desc: '이미지를 드래그하거나 클릭해서 선택하세요. JPG, PNG, WebP, GIF를 지원합니다.' },
          { step: '추출 수 설정', desc: '4~16개 중 원하는 색상 수를 선택하세요.' },
          { step: '색상 확인', desc: '이미지의 주요 색상이 HEX, RGB, HSL로 표시됩니다.' },
          { step: '복사 또는 내보내기', desc: '각 색상 코드를 복사하거나 CSS 변수 형태로 한번에 내보낼 수 있습니다.' },
        ] : [
          { step: 'Upload image', desc: 'Drag & drop or click to select an image. Supports JPG, PNG, WebP, GIF.' },
          { step: 'Set color count', desc: 'Choose 4-16 colors to extract.' },
          { step: 'View colors', desc: 'Dominant colors are shown in HEX, RGB, and HSL formats.' },
          { step: 'Copy or export', desc: 'Copy individual color codes or export all as CSS variables.' },
        ]}
        whyUse={lang === 'ko' ? [
          { title: '브랜드 색상 추출', desc: '로고나 브랜드 이미지에서 공식 색상 코드를 추출할 때 유용합니다.' },
          { title: 'HEX/RGB/HSL 동시 제공', desc: '세 가지 색상 표현 형식을 모두 제공합니다.' },
          { title: 'CSS 변수 내보내기', desc: ':root CSS 변수 형식으로 일괄 복사할 수 있습니다.' },
          { title: '브라우저 처리', desc: '이미지가 서버에 업로드되지 않아 개인정보가 보호됩니다.' },
        ] : [
          { title: 'Brand color extraction', desc: 'Extract official color codes from logos and brand images.' },
          { title: 'HEX/RGB/HSL all formats', desc: 'All three color format representations provided simultaneously.' },
          { title: 'CSS variable export', desc: 'Export all colors as CSS custom properties in one click.' },
          { title: 'Privacy safe', desc: 'Images are processed in the browser — never uploaded to a server.' },
        ]}
        faqs={lang === 'ko' ? [
          { q: '색상 추출이 정확한가요?', a: '색상 양자화 알고리즘을 사용해 이미지의 주요 색상을 추출합니다. 유사한 색상은 그룹화됩니다.' },
          { q: '이미지가 서버에 저장되나요?', a: '아니요. 모든 처리는 브라우저 캔버스에서 이루어지며 서버에 전송되지 않습니다.' },
          { q: 'PNG 투명 배경은 어떻게 처리되나요?', a: '투명(알파=0)인 픽셀은 색상 추출에서 제외됩니다.' },
          { q: '몇 개의 색상을 추출하는 게 좋나요?', a: '일반적으로 6~8개를 권장합니다. 너무 많으면 유사한 색상이 포함됩니다.' },
        ] : [
          { q: 'How accurate is the color extraction?', a: 'Uses color quantization algorithm to group similar colors. Results show dominant color clusters.' },
          { q: 'Is my image stored on a server?', a: 'No. All processing happens in the browser canvas. Nothing is uploaded to any server.' },
          { q: 'How are PNG transparent backgrounds handled?', a: 'Fully transparent pixels (alpha=0) are excluded from color extraction.' },
          { q: 'How many colors should I extract?', a: '6-8 colors is generally recommended. Too many results in similar shades appearing.' },
        ]}
        keywords="이미지 색상 추출 · 색상 추출기 · 사진 색상 · 팔레트 추출 · HEX 추출 · color extractor · extract colors from image · image color picker · dominant color · color palette from image · free color extractor"
      />
    </div>
  )
}
