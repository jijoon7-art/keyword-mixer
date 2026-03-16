'use client'

import { useState, useRef, useCallback } from 'react'
import { Upload, Download, Trash2, X, ArrowUp, ArrowDown, FileText, Scissors, Layers } from 'lucide-react'

type Tab = 'merge' | 'split' | 'delete'

interface PDFFile {
  id: string
  name: string
  size: number
  file: File
  pageCount?: number
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

export default function PdfTools() {
  const [tab, setTab] = useState<Tab>('merge')
  const [files, setFiles] = useState<PDFFile[]>([])
  const [splitFile, setSplitFile] = useState<PDFFile | null>(null)
  const [splitRanges, setSplitRanges] = useState('')
  const [deleteFile, setDeleteFile] = useState<PDFFile | null>(null)
  const [deletePages, setDeletePages] = useState('')
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const mergeRef = useRef<HTMLInputElement>(null)
  const splitRef = useRef<HTMLInputElement>(null)
  const deleteRef = useRef<HTMLInputElement>(null)

  const addFiles = (newFiles: File[]) => {
    const pdfs = newFiles.filter(f => f.type === 'application/pdf')
    setFiles(prev => [...prev, ...pdfs.map(f => ({
      id: `${Date.now()}_${Math.random()}`,
      name: f.name, size: f.size, file: f
    }))])
  }

  const moveFile = (idx: number, dir: 'up' | 'down') => {
    setFiles(prev => {
      const arr = [...prev]
      const target = dir === 'up' ? idx - 1 : idx + 1
      if (target < 0 || target >= arr.length) return arr;
      [arr[idx], arr[target]] = [arr[target], arr[idx]]
      return arr
    })
  }

  const mergePDFs = async () => {
    if (files.length < 2) { setError('2개 이상의 PDF를 추가하세요'); return }
    setProcessing(true); setError(''); setSuccess('')
    try {
      const { PDFDocument } = await import('pdf-lib')
      const merged = await PDFDocument.create()
      for (const f of files) {
        const bytes = await f.file.arrayBuffer()
        const doc = await PDFDocument.load(bytes)
        const pages = await merged.copyPages(doc, doc.getPageIndices())
        pages.forEach(p => merged.addPage(p))
      }
      const out = await merged.save()
      const blob = new Blob([out as unknown as BlobPart], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a'); a.href = url
      a.download = `merged_${Date.now()}.pdf`; a.click()
      URL.revokeObjectURL(url)
      setSuccess(`✅ ${files.length}개 PDF 합치기 완료!`)
    } catch (e) {
      setError(`오류: ${(e as Error).message}`)
    }
    setProcessing(false)
  }

  const splitPDF = async () => {
    if (!splitFile) { setError('PDF 파일을 선택하세요'); return }
    setProcessing(true); setError(''); setSuccess('')
    try {
      const { PDFDocument } = await import('pdf-lib')
      const bytes = await splitFile.file.arrayBuffer()
      const src = await PDFDocument.load(bytes)
      const total = src.getPageCount()

      // Parse ranges: "1-3, 4-6, 7" etc
      const ranges = splitRanges.trim()
        ? splitRanges.split(',').map(r => r.trim())
        : Array.from({ length: total }, (_, i) => String(i + 1))

      let count = 0
      for (const range of ranges) {
        const doc = await PDFDocument.create()
        const parts = range.split('-').map(n => parseInt(n.trim()) - 1)
        const from = parts[0] ?? 0
        const to = parts[1] ?? from
        const indices = Array.from({ length: to - from + 1 }, (_, i) => from + i)
          .filter(i => i >= 0 && i < total)
        if (!indices.length) continue
        const pages = await doc.copyPages(src, indices)
        pages.forEach(p => doc.addPage(p))
        const out = await doc.save()
        const blob = new Blob([out as unknown as BlobPart], { type: 'application/pdf' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a'); a.href = url
        a.download = `split_${range.replace('-', '_')}_${Date.now()}.pdf`; a.click()
        URL.revokeObjectURL(url)
        count++
        await new Promise(r => setTimeout(r, 200))
      }
      setSuccess(`✅ ${count}개 파일로 분리 완료!`)
    } catch (e) {
      setError(`오류: ${(e as Error).message}`)
    }
    setProcessing(false)
  }

  const deletePagesFromPDF = async () => {
    if (!deleteFile) { setError('PDF 파일을 선택하세요'); return }
    if (!deletePages.trim()) { setError('삭제할 페이지를 입력하세요'); return }
    setProcessing(true); setError(''); setSuccess('')
    try {
      const { PDFDocument } = await import('pdf-lib')
      const bytes = await deleteFile.file.arrayBuffer()
      const src = await PDFDocument.load(bytes)
      const total = src.getPageCount()

      const toDelete = new Set<number>()
      deletePages.split(',').forEach(r => {
        const parts = r.trim().split('-').map(n => parseInt(n.trim()) - 1)
        if (parts.length === 2) {
          for (let i = parts[0]; i <= parts[1]; i++) toDelete.add(i)
        } else {
          toDelete.add(parts[0])
        }
      })

      const keep = Array.from({ length: total }, (_, i) => i).filter(i => !toDelete.has(i))
      if (!keep.length) { setError('모든 페이지를 삭제할 수 없습니다'); setProcessing(false); return }

      const doc = await PDFDocument.create()
      const pages = await doc.copyPages(src, keep)
      pages.forEach(p => doc.addPage(p))
      const out = await doc.save()
      const blob = new Blob([out as unknown as BlobPart], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a'); a.href = url
      a.download = `edited_${Date.now()}.pdf`; a.click()
      URL.revokeObjectURL(url)
      setSuccess(`✅ ${toDelete.size}개 페이지 삭제 완료! (${keep.length}페이지 유지)`)
    } catch (e) {
      setError(`오류: ${(e as Error).message}`)
    }
    setProcessing(false)
  }

  const TABS = [
    { key: 'merge', label: 'PDF 합치기', icon: <Layers size={14} /> },
    { key: 'split', label: 'PDF 분리', icon: <Scissors size={14} /> },
    { key: 'delete', label: '페이지 삭제', icon: <Trash2 size={14} /> },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-mono mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
          Free PDF Tool
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-3 tracking-tight">PDF 도구</h1>
        <p className="text-slate-300 text-base max-w-lg mx-auto">
          PDF 합치기·분리·페이지 삭제. 브라우저에서 처리하여 파일이 서버에 업로드되지 않아 보안 안전.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex rounded-xl border border-surface-border overflow-hidden mb-6">
        {TABS.map(t => (
          <button key={t.key} onClick={() => { setTab(t.key as Tab); setError(''); setSuccess('') }}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-all ${tab === t.key ? 'bg-brand-500 text-black font-bold' : 'bg-surface-card text-slate-300 hover:text-white'}`}>
            {t.icon}{t.label}
          </button>
        ))}
      </div>

      {/* Status messages */}
      {error && <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">{error}</div>}
      {success && <div className="mb-4 p-3 rounded-lg bg-brand-500/10 border border-brand-500/30 text-brand-400 text-sm">{success}</div>}

      {/* MERGE */}
      {tab === 'merge' && (
        <div className="flex flex-col gap-4">
          <div
            onDragOver={e => e.preventDefault()}
            onDrop={e => { e.preventDefault(); addFiles(Array.from(e.dataTransfer.files)) }}
            onClick={() => mergeRef.current?.click()}
            className="rounded-xl border-2 border-dashed border-surface-border hover:border-brand-500/40 hover:bg-brand-500/5 p-10 text-center cursor-pointer transition-all"
          >
            <Upload size={24} className="mx-auto text-slate-500 mb-3" />
            <p className="text-slate-300 text-sm font-medium">PDF 파일을 클릭하거나 드래그하여 추가</p>
            <p className="text-slate-500 text-xs mt-1">여러 파일 동시 선택 가능</p>
            <input ref={mergeRef} type="file" accept=".pdf" multiple className="hidden" onChange={e => addFiles(Array.from(e.target.files ?? []))} />
          </div>

          {files.length > 0 && (
            <div className="rounded-xl border border-surface-border bg-surface-card overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-surface-border">
                <span className="text-sm font-medium text-slate-200">{files.length}개 파일 · 순서대로 합쳐집니다</span>
                <button onClick={() => setFiles([])} className="text-xs text-slate-500 hover:text-red-400 transition-all">전체 삭제</button>
              </div>
              {files.map((f, i) => (
                <div key={f.id} className="flex items-center gap-3 px-4 py-3 border-b border-surface-border last:border-0">
                  <FileText size={16} className="text-red-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-200 truncate">{f.name}</p>
                    <p className="text-xs text-slate-500">{formatSize(f.size)}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-slate-600 font-mono w-5 text-center">{i + 1}</span>
                    <button onClick={() => moveFile(i, 'up')} disabled={i === 0} className="p-1 rounded text-slate-600 hover:text-brand-400 disabled:opacity-30 transition-all"><ArrowUp size={13} /></button>
                    <button onClick={() => moveFile(i, 'down')} disabled={i === files.length - 1} className="p-1 rounded text-slate-600 hover:text-brand-400 disabled:opacity-30 transition-all"><ArrowDown size={13} /></button>
                    <button onClick={() => setFiles(prev => prev.filter(x => x.id !== f.id))} className="p-1 rounded text-slate-600 hover:text-red-400 transition-all"><X size={13} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <button onClick={mergePDFs} disabled={processing || files.length < 2}
            className="w-full py-3 rounded-xl bg-brand-500 hover:bg-brand-400 disabled:opacity-40 disabled:cursor-not-allowed text-black font-bold text-sm transition-all shadow-[0_4px_15px_rgba(34,197,94,0.3)] flex items-center justify-center gap-2">
            {processing ? <><span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />처리 중...</> : <><Download size={15} />PDF 합치기 & 다운로드</>}
          </button>
        </div>
      )}

      {/* SPLIT */}
      {tab === 'split' && (
        <div className="flex flex-col gap-4">
          <div onClick={() => splitRef.current?.click()}
            className="rounded-xl border-2 border-dashed border-surface-border hover:border-brand-500/40 hover:bg-brand-500/5 p-8 text-center cursor-pointer transition-all">
            <Upload size={24} className="mx-auto text-slate-500 mb-3" />
            <p className="text-slate-300 text-sm font-medium">{splitFile ? splitFile.name : 'PDF 파일 선택'}</p>
            <p className="text-slate-500 text-xs mt-1">{splitFile ? formatSize(splitFile.size) : '클릭하여 파일 선택'}</p>
            <input ref={splitRef} type="file" accept=".pdf" className="hidden" onChange={e => {
              const f = e.target.files?.[0]
              if (f) setSplitFile({ id: Date.now().toString(), name: f.name, size: f.size, file: f })
            }} />
          </div>

          <div className="rounded-xl border border-surface-border bg-surface-card p-4">
            <label className="text-xs text-slate-400 mb-2 block font-medium">분리 범위 (비워두면 페이지별 분리)</label>
            <input value={splitRanges} onChange={e => setSplitRanges(e.target.value)}
              placeholder="예: 1-3, 4-6, 7-10 (쉼표로 구분)"
              className="w-full bg-surface-DEFAULT border border-surface-border rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-brand-500/50 transition-all" />
            <p className="text-xs text-slate-500 mt-1.5">• 비워두면: 페이지 1개씩 분리 &nbsp;•&nbsp; 1-3: 1~3페이지를 하나로 &nbsp;•&nbsp; 1-3,4-6: 2개 파일로 분리</p>
          </div>

          <button onClick={splitPDF} disabled={processing || !splitFile}
            className="w-full py-3 rounded-xl bg-brand-500 hover:bg-brand-400 disabled:opacity-40 disabled:cursor-not-allowed text-black font-bold text-sm transition-all shadow-[0_4px_15px_rgba(34,197,94,0.3)] flex items-center justify-center gap-2">
            {processing ? <><span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />처리 중...</> : <><Scissors size={15} />PDF 분리 & 다운로드</>}
          </button>
        </div>
      )}

      {/* DELETE PAGES */}
      {tab === 'delete' && (
        <div className="flex flex-col gap-4">
          <div onClick={() => deleteRef.current?.click()}
            className="rounded-xl border-2 border-dashed border-surface-border hover:border-brand-500/40 hover:bg-brand-500/5 p-8 text-center cursor-pointer transition-all">
            <Upload size={24} className="mx-auto text-slate-500 mb-3" />
            <p className="text-slate-300 text-sm font-medium">{deleteFile ? deleteFile.name : 'PDF 파일 선택'}</p>
            <p className="text-slate-500 text-xs mt-1">{deleteFile ? formatSize(deleteFile.size) : '클릭하여 파일 선택'}</p>
            <input ref={deleteRef} type="file" accept=".pdf" className="hidden" onChange={e => {
              const f = e.target.files?.[0]
              if (f) setDeleteFile({ id: Date.now().toString(), name: f.name, size: f.size, file: f })
            }} />
          </div>

          <div className="rounded-xl border border-surface-border bg-surface-card p-4">
            <label className="text-xs text-slate-400 mb-2 block font-medium">삭제할 페이지 번호</label>
            <input value={deletePages} onChange={e => setDeletePages(e.target.value)}
              placeholder="예: 1, 3, 5-7, 10"
              className="w-full bg-surface-DEFAULT border border-surface-border rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-brand-500/50 transition-all" />
            <p className="text-xs text-slate-500 mt-1.5">• 개별: 1, 3, 5 &nbsp;•&nbsp; 범위: 5-7 &nbsp;•&nbsp; 혼합: 1, 3, 5-7, 10</p>
          </div>

          <button onClick={deletePagesFromPDF} disabled={processing || !deleteFile}
            className="w-full py-3 rounded-xl bg-brand-500 hover:bg-brand-400 disabled:opacity-40 disabled:cursor-not-allowed text-black font-bold text-sm transition-all shadow-[0_4px_15px_rgba(34,197,94,0.3)] flex items-center justify-center gap-2">
            {processing ? <><span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />처리 중...</> : <><Trash2 size={15} />페이지 삭제 & 다운로드</>}
          </button>
        </div>
      )}

      {/* Security note */}
      <div className="mt-6 p-4 rounded-xl border border-surface-border/30 bg-surface-card/20 flex items-start gap-3">
        <span className="text-brand-400 text-lg">🔒</span>
        <div>
          <p className="text-sm font-medium text-slate-300">100% 브라우저에서 처리</p>
          <p className="text-xs text-slate-500 mt-0.5">파일이 서버에 업로드되지 않습니다. 개인정보와 기업 문서를 안전하게 처리하세요.</p>
        </div>
      </div>

      {/* SEO */}
      <div className="mt-10 p-6 rounded-xl border border-surface-border/30 bg-surface-card/20">
        <p className="text-xs text-slate-500 leading-relaxed">
          PDF 합치기 · PDF 분리 · PDF 페이지 삭제 · PDF 편집 · PDF 도구 무료 · PDF 합병 · PDF 병합 ·
          PDF merger · PDF splitter · PDF editor · merge PDF · split PDF · delete PDF pages ·
          free PDF tool · online PDF editor · PDF combiner
        </p>
      </div>
    </div>
  )
}
