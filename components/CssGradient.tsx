'use client'

import ToolFooter from './ToolFooter'
import { useState } from 'react'
import { Copy, CheckCheck, RefreshCw } from 'lucide-react'

type GradientType = 'linear' | 'radial' | 'conic'

interface ColorStop {
  id: string
  color: string
  position: number
}

const PRESETS = [
  { name: '석양', stops: [{ color: '#FF512F', pos: 0 }, { color: '#DD2476', pos: 100 }], angle: 135 },
  { name: '오션', stops: [{ color: '#2196F3', pos: 0 }, { color: '#00BCD4', pos: 100 }], angle: 120 },
  { name: '포레스트', stops: [{ color: '#11998e', pos: 0 }, { color: '#38ef7d', pos: 100 }], angle: 120 },
  { name: '퍼플', stops: [{ color: '#9B59B6', pos: 0 }, { color: '#3498DB', pos: 100 }], angle: 135 },
  { name: '골든', stops: [{ color: '#F7971E', pos: 0 }, { color: '#FFD200', pos: 100 }], angle: 120 },
  { name: '인디고', stops: [{ color: '#667eea', pos: 0 }, { color: '#764ba2', pos: 100 }], angle: 135 },
  { name: '민트', stops: [{ color: '#00b09b', pos: 0 }, { color: '#96c93d', pos: 100 }], angle: 120 },
  { name: '코랄', stops: [{ color: '#FF9966', pos: 0 }, { color: '#FF5E62', pos: 100 }], angle: 135 },
  { name: '새벽', stops: [{ color: '#0f0c29', pos: 0 }, { color: '#302b63', pos: 50 }, { color: '#24243e', pos: 100 }], angle: 135 },
  { name: '브랜드', stops: [{ color: '#22c55e', pos: 0 }, { color: '#16a34a', pos: 100 }], angle: 135 },
]

export default function CssGradient() {
  const [type, setType] = useState<GradientType>('linear')
  const [angle, setAngle] = useState(135)
  const [stops, setStops] = useState<ColorStop[]>([
    { id: 'a', color: '#22c55e', position: 0 },
    { id: 'b', color: '#3b82f6', position: 100 },
  ])
  const [copied, setCopied] = useState<string | null>(null)

  const gradientStr = (() => {
    const stopStr = stops.map(s => `${s.color} ${s.position}%`).join(', ')
    if (type === 'linear') return `linear-gradient(${angle}deg, ${stopStr})`
    if (type === 'radial') return `radial-gradient(circle, ${stopStr})`
    return `conic-gradient(from ${angle}deg, ${stopStr})`
  })()

  const css = `background: ${gradientStr};`
  const tailwind = `style={{ background: '${gradientStr}' }}`

  const copy = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 1500)
  }

  const addStop = () => {
    const newPos = Math.round((stops[stops.length - 1].position + stops[0].position) / 2)
    setStops(prev => [...prev, { id: Date.now().toString(), color: '#ffffff', position: newPos }].sort((a, b) => a.position - b.position))
  }

  const updateStop = (id: string, key: 'color' | 'position', value: string | number) => {
    setStops(prev => prev.map(s => s.id === id ? { ...s, [key]: value } : s).sort((a, b) => a.position - b.position))
  }

  const removeStop = (id: string) => {
    if (stops.length <= 2) return
    setStops(prev => prev.filter(s => s.id !== id))
  }

  const applyPreset = (p: typeof PRESETS[0]) => {
    setStops(p.stops.map((s, i) => ({ id: `p${i}`, color: s.color, position: s.pos })))
    setAngle(p.angle)
    setType('linear')
  }

  const randomGradient = () => {
    const rand = () => '#' + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0')
    setStops([{ id: 'r0', color: rand(), position: 0 }, { id: 'r1', color: rand(), position: 100 }])
    setAngle(Math.floor(Math.random() * 360))
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-mono mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
          Free Design Tool
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-3 tracking-tight">CSS 그라디언트 생성기</h1>
        <p className="text-slate-300 text-base max-w-lg mx-auto">
          Linear·Radial·Conic 그라디언트 즉시 생성. CSS·Tailwind 코드 복사, 프리셋 10종 제공.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Controls */}
        <div className="flex flex-col gap-4">
          {/* Type */}
          <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4">
            <p className="text-xs text-slate-400 mb-2 font-medium">그라디언트 유형</p>
            <div className="flex gap-1.5">
              {(['linear', 'radial', 'conic'] as GradientType[]).map(t => (
                <button key={t} onClick={() => setType(t)}
                  className={`flex-1 py-2 rounded-lg border text-xs font-medium transition-all ${type === t ? 'bg-brand-500 border-brand-500 text-white font-bold' : 'border-surface-border text-slate-300 hover:border-brand-500/40 bg-[#0f1117]'}`}>
                  {t === 'linear' ? '선형' : t === 'radial' ? '방사형' : '원뿔형'}
                </button>
              ))}
            </div>
          </div>

          {/* Angle */}
          {(type === 'linear' || type === 'conic') && (
            <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4">
              <div className="flex justify-between mb-2">
                <label className="text-xs text-slate-400 font-medium">각도</label>
                <span className="text-xs text-brand-400 font-mono">{angle}°</span>
              </div>
              <input type="range" min={0} max={360} value={angle} onChange={e => setAngle(+e.target.value)} className="w-full accent-green-500" />
              <div className="flex gap-1.5 mt-2">
                {[0, 45, 90, 135, 180, 225, 270, 315].map(a => (
                  <button key={a} onClick={() => setAngle(a)}
                    className={`flex-1 py-1 rounded text-xs transition-all ${angle === a ? 'bg-brand-500 text-white font-bold' : 'text-slate-500 hover:text-brand-400'}`}>
                    {a}°
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Color stops */}
          <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-slate-400 font-medium">색상 포인트</p>
              <button onClick={addStop} className="text-xs px-2.5 py-1 rounded-lg border border-brand-500/30 text-brand-400 hover:bg-brand-500/10 transition-all">+ 추가</button>
            </div>
            <div className="flex flex-col gap-2">
              {stops.map(s => (
                <div key={s.id} className="flex items-center gap-2">
                  <input type="color" value={s.color} onChange={e => updateStop(s.id, 'color', e.target.value)}
                    className="w-8 h-8 rounded border border-surface-border cursor-pointer bg-transparent flex-shrink-0" />
                  <span className="text-xs text-slate-400 font-mono w-16">{s.color}</span>
                  <input type="range" min={0} max={100} value={s.position}
                    onChange={e => updateStop(s.id, 'position', +e.target.value)} className="flex-1 accent-green-500" />
                  <span className="text-xs text-slate-400 font-mono w-8">{s.position}%</span>
                  <button onClick={() => removeStop(s.id)} disabled={stops.length <= 2}
                    className="text-slate-600 hover:text-red-400 disabled:opacity-30 transition-all text-sm">×</button>
                </div>
              ))}
            </div>
          </div>

          {/* Presets */}
          <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-slate-400 font-medium">프리셋</p>
              <button onClick={randomGradient} className="text-xs text-slate-500 hover:text-brand-400 flex items-center gap-1 transition-all">
                <RefreshCw size={11} /> 랜덤
              </button>
            </div>
            <div className="grid grid-cols-5 gap-1.5">
              {PRESETS.map(p => (
                <button key={p.name} onClick={() => applyPreset(p)} title={p.name}
                  className="h-8 rounded-lg border-2 border-transparent hover:border-brand-400 transition-all overflow-hidden"
                  style={{ background: `linear-gradient(${p.angle}deg, ${p.stops.map(s => `${s.color} ${s.pos}%`).join(', ')})` }} />
              ))}
            </div>
          </div>
        </div>

        {/* Preview & Code */}
        <div className="flex flex-col gap-4">
          {/* Preview */}
          <div className="rounded-xl border border-surface-border overflow-hidden h-48"
            style={{ background: gradientStr }} />

          {/* CSS */}
          <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-slate-400 font-medium">CSS</p>
              <button onClick={() => copy(css, 'css')} className={`text-xs px-2.5 py-1.5 rounded-lg border flex items-center gap-1 transition-all ${copied === 'css' ? 'bg-brand-500/20 border-brand-500/40 text-brand-400' : 'border-surface-border text-slate-300 hover:border-brand-500/40'}`}>
                {copied === 'css' ? <CheckCheck size={11} /> : <Copy size={11} />}
                {copied === 'css' ? '복사됨' : '복사'}
              </button>
            </div>
            <code className="text-xs text-brand-300 font-mono break-all leading-relaxed">{css}</code>
          </div>

          {/* Tailwind */}
          <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-slate-400 font-medium">React / Tailwind inline</p>
              <button onClick={() => copy(tailwind, 'tw')} className={`text-xs px-2.5 py-1.5 rounded-lg border flex items-center gap-1 transition-all ${copied === 'tw' ? 'bg-brand-500/20 border-brand-500/40 text-brand-400' : 'border-surface-border text-slate-300 hover:border-brand-500/40'}`}>
                {copied === 'tw' ? <CheckCheck size={11} /> : <Copy size={11} />}
                {copied === 'tw' ? '복사됨' : '복사'}
              </button>
            </div>
            <code className="text-xs text-slate-300 font-mono break-all leading-relaxed">{tailwind}</code>
          </div>

          {/* Full value */}
          <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-slate-400 font-medium">그라디언트 값만</p>
              <button onClick={() => copy(gradientStr, 'val')} className={`text-xs px-2.5 py-1.5 rounded-lg border flex items-center gap-1 transition-all ${copied === 'val' ? 'bg-brand-500/20 border-brand-500/40 text-brand-400' : 'border-surface-border text-slate-300 hover:border-brand-500/40'}`}>
                {copied === 'val' ? <CheckCheck size={11} /> : <Copy size={11} />}
                {copied === 'val' ? '복사됨' : '복사'}
              </button>
            </div>
            <code className="text-xs text-slate-300 font-mono break-all leading-relaxed">{gradientStr}</code>
          </div>
        </div>
      </div>
      <ToolFooter
        toolName="CSS 그라디언트 생성기"
        toolUrl="https://keyword-mixer.vercel.app/css-gradient"
        description="Linear·Radial·Conic 그라디언트 즉시 생성."
        howToUse={[
          { step: '도구 접속', desc: 'CSS 그라디언트 생성기에 접속하세요.' },
          { step: '내용 입력', desc: '필요한 내용을 입력하거나 파일을 업로드하세요.' },
          { step: '결과 확인', desc: '변환/생성된 결과를 즉시 확인하세요.' },
          { step: '복사 또는 저장', desc: '결과를 복사하거나 파일로 저장하세요.' },
        ]}
        whyUse={[
          { title: '무료 사용', desc: '로그인 없이 완전 무료로 사용할 수 있습니다.' },
          { title: '빠른 처리', desc: '브라우저에서 즉시 처리되어 빠르게 결과를 얻을 수 있습니다.' },
          { title: '개인정보 보호', desc: '서버에 데이터가 저장되지 않아 안전합니다.' },
          { title: '다양한 기능', desc: '시중 유사 도구보다 더 많은 기능을 제공합니다.' },
        ]}
        faqs={[
          { q: '이 도구는 무료인가요?', a: '네, 완전 무료입니다. 로그인도 필요 없습니다.' },
          { q: '데이터는 서버에 저장되나요?', a: '아니요. 모든 처리는 브라우저에서 이루어지며 서버에 전송되지 않습니다.' },
          { q: '모바일에서도 사용할 수 있나요?', a: '네, 모바일 브라우저에서도 동일하게 사용할 수 있습니다.' },
          { q: '오류가 발생하면 어떻게 하나요?', a: '페이지를 새로고침하거나 하단 피드백 폼으로 알려주시면 빠르게 수정하겠습니다.' },
        ]}
        keywords="CSS 그라디언트 생성기 · 그라디언트 만들기 · CSS gradient generator · linear gradient · radial gradient · gradient background"
      />
    </div>
  )
}
