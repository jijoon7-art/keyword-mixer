'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Upload, Download, RotateCcw, FlipHorizontal, FlipVertical, Sun, Contrast, Droplets } from 'lucide-react'

type Tab = 'resize' | 'convert' | 'rotate' | 'filter' | 'watermark'
type Format = 'image/jpeg' | 'image/png' | 'image/webp'

interface ImageState {
  src: string
  name: string
  width: number
  height: number
  size: number
}

const FORMAT_OPTIONS: { value: Format; label: string; ext: string }[] = [
  { value: 'image/jpeg', label: 'JPG', ext: 'jpg' },
  { value: 'image/png', label: 'PNG', ext: 'png' },
  { value: 'image/webp', label: 'WebP', ext: 'webp' },
]

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

export default function ImageEditor() {
  const [tab, setTab] = useState<Tab>('resize')
  const [image, setImage] = useState<ImageState | null>(null)
  const [processing, setProcessing] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Resize state
  const [width, setWidth] = useState(800)
  const [height, setHeight] = useState(600)
  const [keepRatio, setKeepRatio] = useState(true)
  const [resizeQuality, setResizeQuality] = useState(90)

  // Convert state
  const [format, setFormat] = useState<Format>('image/jpeg')
  const [convertQuality, setConvertQuality] = useState(90)

  // Rotate state
  const [rotation, setRotation] = useState(0)
  const [flipH, setFlipH] = useState(false)
  const [flipV, setFlipV] = useState(false)

  // Filter state
  const [brightness, setBrightness] = useState(100)
  const [contrast, setContrast] = useState(100)
  const [saturation, setSaturation] = useState(100)
  const [blur, setBlur] = useState(0)
  const [grayscale, setGrayscale] = useState(0)

  // Watermark state
  const [wmText, setWmText] = useState('© Keyword Mixer')
  const [wmSize, setWmSize] = useState(24)
  const [wmOpacity, setWmOpacity] = useState(50)
  const [wmPosition, setWmPosition] = useState('bottom-right')
  const [wmColor, setWmColor] = useState('#ffffff')

  const loadImage = (file: File) => {
    const reader = new FileReader()
    reader.onload = e => {
      const img = new window.Image()
      img.onload = () => {
        setImage({ src: e.target?.result as string, name: file.name, width: img.width, height: img.height, size: file.size })
        setWidth(img.width); setHeight(img.height)
      }
      img.src = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }

  const processAndDownload = async (processCanvas: (ctx: CanvasRenderingContext2D, img: HTMLImageElement, canvas: HTMLCanvasElement) => void, outFormat: Format = 'image/jpeg', quality = 0.9, suffix = 'edited') => {
    if (!image) return
    setProcessing(true)
    const img = new window.Image(); img.src = image.src
    await new Promise(r => img.onload = r)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!
    processCanvas(ctx, img, canvas)
    canvas.toBlob(blob => {
      if (!blob) return
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a'); a.href = url
      const ext = FORMAT_OPTIONS.find(f => f.value === outFormat)?.ext ?? 'jpg'
      a.download = `${suffix}_${Date.now()}.${ext}`; a.click()
      URL.revokeObjectURL(url)
      setProcessing(false)
    }, outFormat, quality)
  }

  const handleResize = () => processAndDownload((ctx, img, canvas) => {
    canvas.width = width; canvas.height = height
    ctx.drawImage(img, 0, 0, width, height)
  }, 'image/jpeg', resizeQuality / 100, 'resized')

  const handleConvert = () => processAndDownload((ctx, img, canvas) => {
    canvas.width = img.width; canvas.height = img.height
    if (format === 'image/jpeg') { ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, canvas.width, canvas.height) }
    ctx.drawImage(img, 0, 0)
  }, format, convertQuality / 100, 'converted')

  const handleRotate = () => processAndDownload((ctx, img, canvas) => {
    const rad = (rotation * Math.PI) / 180
    const sin = Math.abs(Math.sin(rad)), cos = Math.abs(Math.cos(rad))
    canvas.width = img.width * cos + img.height * sin
    canvas.height = img.width * sin + img.height * cos
    ctx.translate(canvas.width / 2, canvas.height / 2)
    if (flipH) ctx.scale(-1, 1)
    if (flipV) ctx.scale(1, -1)
    ctx.rotate(rad)
    ctx.drawImage(img, -img.width / 2, -img.height / 2)
  }, 'image/png', 1, 'rotated')

  const handleFilter = () => processAndDownload((ctx, img, canvas) => {
    canvas.width = img.width; canvas.height = img.height
    ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) blur(${blur}px) grayscale(${grayscale}%)`
    ctx.drawImage(img, 0, 0)
  }, 'image/jpeg', 0.92, 'filtered')

  const handleWatermark = () => processAndDownload((ctx, img, canvas) => {
    canvas.width = img.width; canvas.height = img.height
    ctx.drawImage(img, 0, 0)
    ctx.globalAlpha = wmOpacity / 100
    ctx.fillStyle = wmColor
    ctx.font = `bold ${wmSize}px Arial`
    ctx.textBaseline = 'bottom'
    const textWidth = ctx.measureText(wmText).width
    const padding = 20
    let x = padding, y = canvas.height - padding
    if (wmPosition === 'top-left') { x = padding; y = wmSize + padding; ctx.textBaseline = 'top' }
    else if (wmPosition === 'top-right') { x = canvas.width - textWidth - padding; y = wmSize + padding; ctx.textBaseline = 'top' }
    else if (wmPosition === 'center') { x = (canvas.width - textWidth) / 2; y = canvas.height / 2; ctx.textBaseline = 'middle' }
    else if (wmPosition === 'bottom-right') { x = canvas.width - textWidth - padding }
    ctx.fillText(wmText, x, y)
    ctx.globalAlpha = 1
  }, 'image/jpeg', 0.92, 'watermarked')

  const TABS = [
    { key: 'resize', label: '리사이즈' },
    { key: 'convert', label: '형식 변환' },
    { key: 'rotate', label: '회전/뒤집기' },
    { key: 'filter', label: '필터/효과' },
    { key: 'watermark', label: '워터마크' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-mono mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
          Free Image Tool
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-3 tracking-tight">이미지 편집기</h1>
        <p className="text-slate-300 text-base max-w-lg mx-auto">
          리사이즈·형식변환·회전·필터·워터마크. 브라우저에서 처리하여 개인정보 보호.
        </p>
      </div>

      {/* Upload */}
      {!image ? (
        <div onClick={() => fileRef.current?.click()}
          onDragOver={e => e.preventDefault()}
          onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f?.type.startsWith('image/')) loadImage(f) }}
          className="rounded-xl border-2 border-dashed border-surface-border hover:border-brand-500/40 hover:bg-brand-500/5 p-12 text-center cursor-pointer transition-all mb-6">
          <Upload size={28} className="mx-auto text-slate-500 mb-3" />
          <p className="text-slate-300 font-medium">클릭하거나 드래그하여 이미지 선택</p>
          <p className="text-slate-500 text-xs mt-1">JPG · PNG · WebP · GIF · BMP 지원</p>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) loadImage(f) }} />
        </div>
      ) : (
        <div className="rounded-xl border border-surface-border bg-surface-card p-4 mb-6 flex items-center gap-4">
          <img src={image.src} alt="preview" className="w-16 h-16 object-cover rounded-lg border border-surface-border" />
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-200">{image.name}</p>
            <p className="text-xs text-slate-500">{image.width} × {image.height}px · {formatSize(image.size)}</p>
          </div>
          <button onClick={() => { setImage(null); if (fileRef.current) fileRef.current.value = '' }}
            className="text-xs px-3 py-1.5 rounded-lg border border-surface-border text-slate-400 hover:text-red-400 hover:border-red-500/40 transition-all">
            변경
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex rounded-xl border border-surface-border overflow-hidden mb-6">
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key as Tab)}
            className={`flex-1 py-2.5 text-xs font-medium transition-all ${tab === t.key ? 'bg-brand-500 text-black font-bold' : 'bg-surface-card text-slate-300 hover:text-white'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* RESIZE */}
      {tab === 'resize' && (
        <div className="rounded-xl border border-surface-border bg-surface-card p-5 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">너비 (px)</label>
              <input type="number" value={width} onChange={e => {
                const w = +e.target.value; setWidth(w)
                if (keepRatio && image) setHeight(Math.round(w * image.height / image.width))
              }} className="w-full bg-surface-DEFAULT border border-surface-border rounded-lg px-3 py-2 text-slate-200 text-sm font-mono focus:outline-none focus:border-brand-500/50 transition-all" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">높이 (px)</label>
              <input type="number" value={height} onChange={e => {
                const h = +e.target.value; setHeight(h)
                if (keepRatio && image) setWidth(Math.round(h * image.width / image.height))
              }} className="w-full bg-surface-DEFAULT border border-surface-border rounded-lg px-3 py-2 text-slate-200 text-sm font-mono focus:outline-none focus:border-brand-500/50 transition-all" />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {[[640,480],[800,600],[1280,720],[1920,1080],[1080,1080]].map(([w,h]) => (
              <button key={`${w}x${h}`} onClick={() => { setWidth(w); setHeight(h) }}
                className="text-xs px-3 py-1.5 rounded-lg border border-surface-border text-slate-300 hover:border-brand-500/40 hover:text-brand-300 bg-surface-DEFAULT transition-all">
                {w}×{h}
              </button>
            ))}
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <div onClick={() => setKeepRatio(!keepRatio)} className={`w-10 h-5 rounded-full relative transition-all ${keepRatio ? 'bg-brand-500' : 'bg-surface-border'}`}>
              <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all shadow ${keepRatio ? 'left-5' : 'left-0.5'}`} />
            </div>
            <span className="text-sm text-slate-300">비율 유지</span>
          </label>
          <div>
            <div className="flex justify-between mb-1"><label className="text-xs text-slate-400">품질</label><span className="text-xs text-brand-400 font-mono">{resizeQuality}%</span></div>
            <input type="range" min={1} max={100} value={resizeQuality} onChange={e => setResizeQuality(+e.target.value)} className="w-full accent-green-500" />
          </div>
          <button onClick={handleResize} disabled={processing || !image}
            className="w-full py-3 rounded-xl bg-brand-500 hover:bg-brand-400 disabled:opacity-40 text-black font-bold text-sm transition-all flex items-center justify-center gap-2">
            {processing ? <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : <Download size={15} />}
            {processing ? '처리 중...' : `${width}×${height}px로 저장`}
          </button>
        </div>
      )}

      {/* CONVERT */}
      {tab === 'convert' && (
        <div className="rounded-xl border border-surface-border bg-surface-card p-5 flex flex-col gap-4">
          <div>
            <p className="text-xs text-slate-400 mb-2 font-medium">변환할 형식</p>
            <div className="flex gap-2">
              {FORMAT_OPTIONS.map(f => (
                <button key={f.value} onClick={() => setFormat(f.value)}
                  className={`flex-1 py-3 rounded-lg border text-sm font-bold transition-all ${format === f.value ? 'bg-brand-500 border-brand-500 text-black' : 'border-surface-border text-slate-300 hover:border-brand-500/40 bg-surface-DEFAULT'}`}>
                  {f.label}
                </button>
              ))}
            </div>
          </div>
          {format !== 'image/png' && (
            <div>
              <div className="flex justify-between mb-1"><label className="text-xs text-slate-400">품질</label><span className="text-xs text-brand-400 font-mono">{convertQuality}%</span></div>
              <input type="range" min={1} max={100} value={convertQuality} onChange={e => setConvertQuality(+e.target.value)} className="w-full accent-green-500" />
            </div>
          )}
          <div className="grid grid-cols-3 gap-2 text-xs text-center">
            <div className="p-2 rounded-lg bg-surface-DEFAULT border border-surface-border text-slate-400"><p className="font-bold text-slate-200">JPG</p><p>작은 용량, 사진</p></div>
            <div className="p-2 rounded-lg bg-surface-DEFAULT border border-surface-border text-slate-400"><p className="font-bold text-slate-200">PNG</p><p>투명 배경, 로고</p></div>
            <div className="p-2 rounded-lg bg-surface-DEFAULT border border-surface-border text-slate-400"><p className="font-bold text-slate-200">WebP</p><p>웹 최적화</p></div>
          </div>
          <button onClick={handleConvert} disabled={processing || !image}
            className="w-full py-3 rounded-xl bg-brand-500 hover:bg-brand-400 disabled:opacity-40 text-black font-bold text-sm transition-all flex items-center justify-center gap-2">
            {processing ? <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : <Download size={15} />}
            {processing ? '처리 중...' : `${FORMAT_OPTIONS.find(f => f.value === format)?.label}로 변환`}
          </button>
        </div>
      )}

      {/* ROTATE */}
      {tab === 'rotate' && (
        <div className="rounded-xl border border-surface-border bg-surface-card p-5 flex flex-col gap-4">
          <div>
            <div className="flex justify-between mb-1"><label className="text-xs text-slate-400">회전 각도</label><span className="text-xs text-brand-400 font-mono">{rotation}°</span></div>
            <input type="range" min={0} max={359} value={rotation} onChange={e => setRotation(+e.target.value)} className="w-full accent-green-500" />
            <div className="flex gap-2 mt-2">
              {[90, 180, 270].map(d => (
                <button key={d} onClick={() => setRotation(d)}
                  className={`flex-1 py-2 rounded-lg border text-xs font-mono transition-all ${rotation === d ? 'bg-brand-500 border-brand-500 text-black font-bold' : 'border-surface-border text-slate-300 hover:border-brand-500/40 bg-surface-DEFAULT'}`}>
                  {d}°
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => setFlipH(!flipH)}
              className={`flex items-center justify-center gap-2 py-3 rounded-lg border text-sm transition-all ${flipH ? 'bg-brand-500 border-brand-500 text-black font-bold' : 'border-surface-border text-slate-300 hover:border-brand-500/40 bg-surface-DEFAULT'}`}>
              <FlipHorizontal size={15} /> 좌우 뒤집기
            </button>
            <button onClick={() => setFlipV(!flipV)}
              className={`flex items-center justify-center gap-2 py-3 rounded-lg border text-sm transition-all ${flipV ? 'bg-brand-500 border-brand-500 text-black font-bold' : 'border-surface-border text-slate-300 hover:border-brand-500/40 bg-surface-DEFAULT'}`}>
              <FlipVertical size={15} /> 상하 뒤집기
            </button>
          </div>
          <button onClick={handleRotate} disabled={processing || !image}
            className="w-full py-3 rounded-xl bg-brand-500 hover:bg-brand-400 disabled:opacity-40 text-black font-bold text-sm transition-all flex items-center justify-center gap-2">
            {processing ? <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : <Download size={15} />}
            {processing ? '처리 중...' : '회전/뒤집기 적용 & 저장'}
          </button>
        </div>
      )}

      {/* FILTER */}
      {tab === 'filter' && (
        <div className="rounded-xl border border-surface-border bg-surface-card p-5 flex flex-col gap-3">
          {[
            { label: '밝기', val: brightness, set: setBrightness, min: 0, max: 200, icon: <Sun size={13} /> },
            { label: '대비', val: contrast, set: setContrast, min: 0, max: 200, icon: <Contrast size={13} /> },
            { label: '채도', val: saturation, set: setSaturation, min: 0, max: 200, icon: <Droplets size={13} /> },
            { label: '흑백', val: grayscale, set: setGrayscale, min: 0, max: 100, icon: null },
            { label: '블러', val: blur, set: setBlur, min: 0, max: 20, icon: null },
          ].map(f => (
            <div key={f.label}>
              <div className="flex justify-between mb-1">
                <label className="text-xs text-slate-400 flex items-center gap-1">{f.icon}{f.label}</label>
                <span className="text-xs text-brand-400 font-mono">{f.val}{f.label === '블러' ? 'px' : '%'}</span>
              </div>
              <input type="range" min={f.min} max={f.max} value={f.val} onChange={e => f.set(+e.target.value)} className="w-full accent-green-500" />
            </div>
          ))}
          <button onClick={() => { setBrightness(100); setContrast(100); setSaturation(100); setBlur(0); setGrayscale(0) }}
            className="text-xs text-slate-500 hover:text-brand-400 transition-all flex items-center gap-1">
            <RotateCcw size={12} /> 초기화
          </button>
          <button onClick={handleFilter} disabled={processing || !image}
            className="w-full py-3 rounded-xl bg-brand-500 hover:bg-brand-400 disabled:opacity-40 text-black font-bold text-sm transition-all flex items-center justify-center gap-2">
            {processing ? <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : <Download size={15} />}
            {processing ? '처리 중...' : '필터 적용 & 저장'}
          </button>
        </div>
      )}

      {/* WATERMARK */}
      {tab === 'watermark' && (
        <div className="rounded-xl border border-surface-border bg-surface-card p-5 flex flex-col gap-4">
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">워터마크 텍스트</label>
            <input value={wmText} onChange={e => setWmText(e.target.value)}
              className="w-full bg-surface-DEFAULT border border-surface-border rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-brand-500/50 transition-all" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between mb-1"><label className="text-xs text-slate-400">글자 크기</label><span className="text-xs text-brand-400 font-mono">{wmSize}px</span></div>
              <input type="range" min={10} max={100} value={wmSize} onChange={e => setWmSize(+e.target.value)} className="w-full accent-green-500" />
            </div>
            <div>
              <div className="flex justify-between mb-1"><label className="text-xs text-slate-400">투명도</label><span className="text-xs text-brand-400 font-mono">{wmOpacity}%</span></div>
              <input type="range" min={10} max={100} value={wmOpacity} onChange={e => setWmOpacity(+e.target.value)} className="w-full accent-green-500" />
            </div>
          </div>
          <div>
            <p className="text-xs text-slate-400 mb-2">위치</p>
            <div className="grid grid-cols-3 gap-1.5">
              {[['top-left','좌상단'],['top-right','우상단'],['center','가운데'],['bottom-left','좌하단'],['bottom-right','우하단']].map(([val, label]) => (
                <button key={val} onClick={() => setWmPosition(val)}
                  className={`py-2 rounded-lg border text-xs transition-all ${wmPosition === val ? 'bg-brand-500 border-brand-500 text-black font-bold' : 'border-surface-border text-slate-300 hover:border-brand-500/40 bg-surface-DEFAULT'}`}>
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <label className="text-xs text-slate-400">색상</label>
            <input type="color" value={wmColor} onChange={e => setWmColor(e.target.value)} className="w-10 h-8 rounded border border-surface-border cursor-pointer bg-transparent" />
            <div className="flex gap-1.5">
              {['#ffffff','#000000','#ff0000','#22c55e','#3b82f6'].map(c => (
                <button key={c} onClick={() => setWmColor(c)} className={`w-7 h-7 rounded border-2 transition-all ${wmColor === c ? 'border-brand-400' : 'border-transparent'}`} style={{ backgroundColor: c }} />
              ))}
            </div>
          </div>
          <button onClick={handleWatermark} disabled={processing || !image || !wmText}
            className="w-full py-3 rounded-xl bg-brand-500 hover:bg-brand-400 disabled:opacity-40 text-black font-bold text-sm transition-all flex items-center justify-center gap-2">
            {processing ? <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : <Download size={15} />}
            {processing ? '처리 중...' : '워터마크 추가 & 저장'}
          </button>
        </div>
      )}

      {/* SEO */}
      <div className="mt-10 p-6 rounded-xl border border-surface-border/30 bg-surface-card/20">
        <p className="text-xs text-slate-500 leading-relaxed">
          이미지 편집기 · 이미지 리사이즈 · 이미지 크기 변환 · JPG PNG 변환 · WebP 변환 · 이미지 회전 ·
          이미지 필터 · 워터마크 추가 · 무료 이미지 편집 · image editor · image resizer · image converter ·
          rotate image · image filter · watermark tool · free online image editor
        </p>
      </div>
    </div>
  )
}
