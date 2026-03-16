'use client'

import { useState } from 'react'
import { Copy, CheckCheck } from 'lucide-react'

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : null
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('').toUpperCase()
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255; g /= 255; b /= 255
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
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
}

function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  s /= 100; l /= 100
  const k = (n: number) => (n + h / 30) % 12
  const a = s * Math.min(l, 1 - l)
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))
  return { r: Math.round(f(0) * 255), g: Math.round(f(8) * 255), b: Math.round(f(4) * 255) }
}

const PRESETS = [
  '#FF6B6B','#FF8E53','#FFC300','#2ECC71','#1ABC9C',
  '#3498DB','#9B59B6','#E91E63','#FF5722','#607D8B',
  '#FFFFFF','#F5F5F5','#9E9E9E','#424242','#000000',
  '#22c55e','#3b82f6','#f59e0b','#ef4444','#8b5cf6',
]

export default function ColorConverter() {
  const [hex, setHex] = useState('#22c55e')
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  const rgb = hexToRgb(hex) ?? { r: 34, g: 197, b: 94 }
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)

  const copy = async (val: string, key: string) => {
    await navigator.clipboard.writeText(val)
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(null), 1500)
  }

  const handleHexInput = (val: string) => {
    setHex(val)
  }

  const handleRgbInput = (r: number, g: number, b: number) => {
    setHex(rgbToHex(r, g, b))
  }

  const handleHslInput = (h: number, s: number, l: number) => {
    const { r, g, b } = hslToRgb(h, s, l)
    setHex(rgbToHex(r, g, b))
  }

  const hexVal = hex.startsWith('#') ? hex : `#${hex}`
  const rgbVal = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`
  const hslVal = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`
  const rgbaVal = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)`
  const tailwindApprox = `rgb(${rgb.r} ${rgb.g} ${rgb.b})`

  const outputs = [
    { key: 'hex', label: 'HEX', value: hexVal.toUpperCase() },
    { key: 'rgb', label: 'RGB', value: rgbVal },
    { key: 'hsl', label: 'HSL', value: hslVal },
    { key: 'rgba', label: 'RGBA', value: rgbaVal },
    { key: 'css', label: 'CSS 변수', value: `--color: ${hexVal.toUpperCase()};` },
    { key: 'tailwind', label: 'Tailwind', value: tailwindApprox },
  ]

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Hero */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-mono mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
          Free Design Tool
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-3 tracking-tight">색상 코드 변환기</h1>
        <p className="text-slate-300 text-base max-w-lg mx-auto">
          HEX · RGB · HSL · RGBA 즉시 변환. CSS 변수, Tailwind 형식 지원.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Left - Picker & Presets */}
        <div className="flex flex-col gap-4">
          {/* Color picker */}
          <div className="rounded-xl border border-surface-border bg-surface-card p-5">
            <div
              className="w-full h-32 rounded-lg mb-4 border border-surface-border transition-all"
              style={{ backgroundColor: hexVal }}
            />
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={hexVal.length === 7 ? hexVal : '#22c55e'}
                onChange={e => setHex(e.target.value)}
                className="w-12 h-10 rounded-lg border border-surface-border cursor-pointer bg-transparent"
              />
              <input
                type="text"
                value={hexVal}
                onChange={e => handleHexInput(e.target.value)}
                placeholder="#22c55e"
                className="flex-1 bg-surface-DEFAULT border border-surface-border rounded-lg px-3 py-2 text-sm text-slate-200 font-mono focus:outline-none focus:border-brand-500/50 transition-all uppercase"
              />
            </div>
          </div>

          {/* RGB sliders */}
          <div className="rounded-xl border border-surface-border bg-surface-card p-4">
            <p className="text-xs font-semibold text-slate-400 mb-3">RGB 슬라이더</p>
            {[
              { label: 'R', val: rgb.r, color: '#ef4444' },
              { label: 'G', val: rgb.g, color: '#22c55e' },
              { label: 'B', val: rgb.b, color: '#3b82f6' },
            ].map(ch => (
              <div key={ch.label} className="flex items-center gap-3 mb-2">
                <span className="text-xs font-mono w-4 font-bold" style={{ color: ch.color }}>{ch.label}</span>
                <input
                  type="range" min={0} max={255} value={ch.val}
                  onChange={e => {
                    const v = +e.target.value
                    handleRgbInput(
                      ch.label === 'R' ? v : rgb.r,
                      ch.label === 'G' ? v : rgb.g,
                      ch.label === 'B' ? v : rgb.b,
                    )
                  }}
                  className="flex-1 accent-green-500"
                />
                <span className="text-xs font-mono text-slate-300 w-8 text-right">{ch.val}</span>
              </div>
            ))}
          </div>

          {/* Presets */}
          <div className="rounded-xl border border-surface-border bg-surface-card p-4">
            <p className="text-xs font-semibold text-slate-400 mb-3">프리셋 색상</p>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map(p => (
                <button
                  key={p}
                  onClick={() => setHex(p)}
                  className={`w-7 h-7 rounded-lg border-2 transition-all ${hex.toUpperCase() === p.toUpperCase() ? 'border-brand-400 scale-110' : 'border-surface-border hover:border-slate-400'}`}
                  style={{ backgroundColor: p }}
                  title={p}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right - Output values */}
        <div className="rounded-xl border border-surface-border bg-surface-card p-5">
          <p className="text-sm font-semibold text-slate-200 mb-4">변환 결과</p>
          <div className="flex flex-col gap-3">
            {outputs.map(o => (
              <div key={o.key} className="flex items-center justify-between p-3 rounded-lg bg-surface-DEFAULT border border-surface-border hover:border-brand-500/30 transition-all">
                <div>
                  <p className="text-xs text-slate-500 mb-0.5">{o.label}</p>
                  <p className="text-sm font-mono text-slate-200">{o.value}</p>
                </div>
                <button
                  onClick={() => copy(o.value, o.key)}
                  className={`p-2 rounded-lg border transition-all ${copiedKey === o.key ? 'bg-brand-500/20 border-brand-500/40 text-brand-400' : 'border-surface-border text-slate-400 hover:border-brand-500/40 hover:text-brand-300'}`}
                >
                  {copiedKey === o.key ? <CheckCheck size={13} /> : <Copy size={13} />}
                </button>
              </div>
            ))}
          </div>

          {/* Contrast info */}
          <div className="mt-4 p-3 rounded-lg bg-surface-DEFAULT border border-surface-border">
            <p className="text-xs text-slate-400 mb-2">명도 정보</p>
            <div className="flex gap-2">
              <div className="flex-1 rounded-lg p-2 text-center text-xs font-bold" style={{ backgroundColor: hexVal, color: '#ffffff' }}>
                흰 텍스트
              </div>
              <div className="flex-1 rounded-lg p-2 text-center text-xs font-bold" style={{ backgroundColor: hexVal, color: '#000000' }}>
                검은 텍스트
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-2">밝기: {hsl.l}% · 채도: {hsl.s}%</p>
          </div>
        </div>
      </div>

      {/* SEO */}
      <div className="mt-16 p-6 rounded-xl border border-surface-border/30 bg-surface-card/20">
        <p className="text-xs text-slate-500 leading-relaxed">
          색상 코드 변환기 · HEX RGB 변환 · RGB HSL 변환 · 색상 변환기 · 컬러 코드 변환 · HEX 코드 ·
          color converter · HEX to RGB · RGB to HEX · HSL converter · color code converter ·
          free color tool · online color picker · CSS color converter
        </p>
      </div>
    </div>
  )
}
