'use client'

import { useState, useCallback, useRef } from 'react'
import { Upload, Download, Image as ImageIcon, X } from 'lucide-react'

interface ImageFile {
  id: string
  name: string
  originalSize: number
  compressedSize?: number
  originalUrl: string
  compressedUrl?: string
  width?: number
  height?: number
  status: 'pending' | 'compressing' | 'done' | 'error'
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

async function compressImage(file: File, quality: number, maxWidth: number): Promise<{ blob: Blob; width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new window.Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      const canvas = document.createElement('canvas')
      let { width, height } = img
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width)
        width = maxWidth
      }
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, width, height)
      canvas.toBlob(blob => {
        URL.revokeObjectURL(url)
        if (blob) resolve({ blob, width, height })
        else reject(new Error('압축 실패'))
      }, file.type === 'image/png' ? 'image/png' : 'image/jpeg', quality / 100)
    }
    img.onerror = reject
    img.src = url
  })
}

export default function ImageCompressor() {
  const [images, setImages] = useState<ImageFile[]>([])
  const [quality, setQuality] = useState(80)
  const [maxWidth, setMaxWidth] = useState(1920)
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const addFiles = useCallback((files: File[]) => {
    const valid = files.filter(f => f.type.startsWith('image/'))
    const newImages: ImageFile[] = valid.map(f => ({
      id: `${Date.now()}_${Math.random()}`,
      name: f.name,
      originalSize: f.size,
      originalUrl: URL.createObjectURL(f),
      status: 'pending',
    }))
    setImages(prev => [...prev, ...newImages])
  }, [])

  const compressAll = async () => {
    const pending = images.filter(img => img.status === 'pending')
    for (const img of pending) {
      setImages(prev => prev.map(i => i.id === img.id ? { ...i, status: 'compressing' } : i))
      try {
        const file = await fetch(img.originalUrl).then(r => r.blob()).then(b => new File([b], img.name, { type: b.type }))
        const { blob, width, height } = await compressImage(file, quality, maxWidth)
        const compressedUrl = URL.createObjectURL(blob)
        setImages(prev => prev.map(i => i.id === img.id ? {
          ...i, status: 'done', compressedSize: blob.size, compressedUrl, width, height
        } : i))
      } catch {
        setImages(prev => prev.map(i => i.id === img.id ? { ...i, status: 'error' } : i))
      }
    }
  }

  const downloadOne = (img: ImageFile) => {
    if (!img.compressedUrl) return
    const a = document.createElement('a')
    a.href = img.compressedUrl
    a.download = `compressed_${img.name}`
    a.click()
  }

  const downloadAll = () => {
    images.filter(img => img.status === 'done').forEach(downloadOne)
  }

  const removeImage = (id: string) => {
    setImages(prev => prev.filter(i => i.id !== id))
  }

  const totalOriginal = images.reduce((s, i) => s + i.originalSize, 0)
  const totalCompressed = images.filter(i => i.compressedSize).reduce((s, i) => s + (i.compressedSize ?? 0), 0)
  const savingPct = totalOriginal > 0 && totalCompressed > 0 ? Math.round((1 - totalCompressed / totalOriginal) * 100) : 0

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-mono mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
          Free Tool
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-3 tracking-tight">이미지 압축기</h1>
        <p className="text-slate-300 text-base max-w-lg mx-auto">
          이미지 용량 무료 압축. JPG·PNG·WebP 지원, 여러 장 동시 압축, 브라우저에서 처리하여 보안 안전.
        </p>
      </div>

      {/* Settings */}
      <div className="rounded-xl border border-surface-border bg-surface-card p-5 mb-6">
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm text-slate-300 font-medium">압축 품질</label>
              <span className="text-brand-400 font-mono font-bold">{quality}%</span>
            </div>
            <input type="range" min={1} max={100} value={quality} onChange={e => setQuality(+e.target.value)} className="w-full accent-green-500" />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>최대 압축</span><span>고품질</span>
            </div>
          </div>
          <div>
            <label className="text-sm text-slate-300 font-medium block mb-2">최대 너비 (px)</label>
            <div className="flex gap-1.5">
              {[800, 1280, 1920, 3840].map(w => (
                <button key={w} onClick={() => setMaxWidth(w)} className={`flex-1 py-1.5 text-xs rounded-lg border transition-all font-mono ${maxWidth === w ? 'bg-brand-500 border-brand-500 text-white font-bold' : 'border-surface-border text-slate-300 hover:border-brand-500/40 bg-surface-DEFAULT'}`}>
                  {w >= 1000 ? `${w/1000}K` : w}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); addFiles(Array.from(e.dataTransfer.files)) }}
        onClick={() => inputRef.current?.click()}
        className={`rounded-xl border-2 border-dashed p-10 text-center cursor-pointer transition-all mb-6 ${dragging ? 'border-brand-500 bg-brand-500/10' : 'border-surface-border hover:border-brand-500/40 hover:bg-brand-500/5'}`}
      >
        <Upload size={24} className="mx-auto text-slate-500 mb-3" />
        <p className="text-slate-300 text-sm font-medium">클릭하거나 드래그하여 이미지 추가</p>
        <p className="text-slate-600 text-xs mt-1">JPG, PNG, WebP, GIF 지원 · 여러 장 동시 업로드 가능</p>
        <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={e => addFiles(Array.from(e.target.files ?? []))} />
      </div>

      {/* Image list */}
      {images.length > 0 && (
        <div className="rounded-xl border border-surface-border bg-surface-card overflow-hidden mb-6">
          <div className="flex items-center justify-between px-4 py-3 border-b border-surface-border bg-surface-hover/30">
            <div>
              <span className="text-sm font-medium text-slate-200">{images.length}개 이미지</span>
              {savingPct > 0 && (
                <span className="ml-3 text-xs text-brand-400 font-mono">
                  {formatSize(totalOriginal)} → {formatSize(totalCompressed)} ({savingPct}% 절약)
                </span>
              )}
            </div>
            <div className="flex gap-2">
              {images.some(i => i.status === 'done') && (
                <button onClick={downloadAll} className="text-xs px-3 py-1.5 rounded-lg bg-brand-500/15 border border-brand-500/30 text-brand-400 hover:bg-brand-500/25 transition-all flex items-center gap-1">
                  <Download size={12} /> 전체 다운로드
                </button>
              )}
              <button onClick={() => setImages([])} className="text-xs px-3 py-1.5 rounded-lg border border-surface-border text-slate-400 hover:text-red-400 hover:border-red-500/40 transition-all">
                전체 삭제
              </button>
            </div>
          </div>
          <div className="divide-y divide-surface-border max-h-80 overflow-y-auto">
            {images.map(img => (
              <div key={img.id} className="flex items-center gap-3 px-4 py-3">
                <ImageIcon size={16} className="text-slate-500 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-200 truncate">{img.name}</p>
                  <p className="text-xs text-slate-500">
                    {formatSize(img.originalSize)}
                    {img.compressedSize && (
                      <span className="text-brand-400 ml-2">
                        → {formatSize(img.compressedSize)} ({Math.round((1 - img.compressedSize / img.originalSize) * 100)}% 절약)
                      </span>
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {img.status === 'compressing' && <span className="text-xs text-slate-400 animate-pulse">압축 중...</span>}
                  {img.status === 'error' && <span className="text-xs text-red-400">오류</span>}
                  {img.status === 'done' && (
                    <button onClick={() => downloadOne(img)} className="text-xs px-2.5 py-1.5 rounded-lg bg-brand-500/15 border border-brand-500/30 text-brand-400 hover:bg-brand-500/25 transition-all flex items-center gap-1">
                      <Download size={12} /> 저장
                    </button>
                  )}
                  <button onClick={() => removeImage(img.id)} className="p-1 rounded text-slate-600 hover:text-red-400 transition-all">
                    <X size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {images.some(i => i.status === 'pending') && (
        <button onClick={compressAll} className="w-full py-3 rounded-xl bg-brand-500 hover:bg-brand-400 text-white font-bold text-sm transition-all shadow-[0_4px_15px_rgba(34,197,94,0.3)]">
          이미지 압축하기
        </button>
      )}

      {/* SEO */}
      <div className="mt-10 p-6 rounded-xl border border-surface-border/30 bg-surface-card/20">
        <p className="text-xs text-slate-500 leading-relaxed">
          이미지 압축기 · 이미지 용량 줄이기 · 사진 압축 · JPG 압축 · PNG 압축 · 이미지 최적화 ·
          image compressor · compress image online · reduce image size · free image compression ·
          JPG compressor · PNG compressor · 무료 이미지 압축 · 이미지 리사이즈
        </p>
      </div>
    </div>
  )
}
