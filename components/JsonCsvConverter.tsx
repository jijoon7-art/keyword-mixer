'use client'

import { useState } from 'react'
import { Copy, CheckCheck, Download, RotateCcw, ArrowLeftRight } from 'lucide-react'

type Mode = 'json2csv' | 'csv2json'

function flattenObject(obj: Record<string, unknown>, prefix = ''): Record<string, string> {
  return Object.keys(obj).reduce((acc: Record<string, string>, key) => {
    const fullKey = prefix ? `${prefix}.${key}` : key
    const val = obj[key]
    if (val !== null && typeof val === 'object' && !Array.isArray(val)) {
      Object.assign(acc, flattenObject(val as Record<string, unknown>, fullKey))
    } else {
      acc[fullKey] = String(val ?? '')
    }
    return acc
  }, {})
}

function jsonToCsv(json: string, delimiter: string): string {
  const data = JSON.parse(json)
  const arr = Array.isArray(data) ? data : [data]
  const flat = arr.map(item => flattenObject(item as Record<string, unknown>))
  const headers = Array.from(new Set(flat.flatMap(Object.keys)))
  const rows = flat.map(row => headers.map(h => {
    const v = row[h] ?? ''
    return `"${String(v).replace(/"/g, '""')}"`
  }).join(delimiter))
  return [headers.join(delimiter), ...rows].join('\n')
}

function csvToJson(csv: string, delimiter: string): string {
  const lines = csv.trim().split('\n')
  if (lines.length < 2) throw new Error('데이터가 부족합니다')
  const headers = lines[0].split(delimiter).map(h => h.trim().replace(/^"|"$/g, ''))
  const result = lines.slice(1).map(line => {
    const vals = line.split(delimiter).map(v => v.trim().replace(/^"|"$/g, ''))
    const obj: Record<string, string> = {}
    headers.forEach((h, i) => { obj[h] = vals[i] ?? '' })
    return obj
  })
  return JSON.stringify(result, null, 2)
}

const SAMPLE_JSON = `[
  {"name": "홍길동", "age": 30, "city": "서울"},
  {"name": "김철수", "age": 25, "city": "부산"},
  {"name": "이영희", "age": 35, "city": "대구"}
]`

const SAMPLE_CSV = `name,age,city
홍길동,30,서울
김철수,25,부산
이영희,35,대구`

export default function JsonCsvConverter() {
  const [mode, setMode] = useState<Mode>('json2csv')
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [delimiter, setDelimiter] = useState(',')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const convert = () => {
    setError('')
    try {
      if (!input.trim()) { setError('입력값을 입력해주세요'); return }
      const result = mode === 'json2csv' ? jsonToCsv(input, delimiter) : csvToJson(input, delimiter)
      setOutput(result)
    } catch (e) {
      setError(`변환 오류: ${(e as Error).message}`)
      setOutput('')
    }
  }

  const copy = async () => {
    if (!output) return
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const download = () => {
    if (!output) return
    const ext = mode === 'json2csv' ? 'csv' : 'json'
    const mime = mode === 'json2csv' ? 'text/csv' : 'application/json'
    const blob = new Blob(['\uFEFF' + output], { type: mime })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `converted.${ext}`
    a.click(); URL.revokeObjectURL(url)
  }

  const loadSample = () => {
    setInput(mode === 'json2csv' ? SAMPLE_JSON : SAMPLE_CSV)
    setOutput(''); setError('')
  }

  const switchMode = () => {
    setMode(m => m === 'json2csv' ? 'csv2json' : 'json2csv')
    setInput(output); setOutput(''); setError('')
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Hero */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-mono mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
          Free Developer Tool
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-3 tracking-tight">JSON ↔ CSV 변환기</h1>
        <p className="text-slate-300 text-base max-w-xl mx-auto">
          JSON을 CSV로, CSV를 JSON으로 즉시 변환. 중첩 객체 자동 평탄화, Excel 다운로드 지원.
        </p>
      </div>

      {/* Mode & Options */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        {/* Mode toggle */}
        <div className="flex rounded-lg border border-surface-border overflow-hidden">
          <button
            onClick={() => { setMode('json2csv'); setInput(''); setOutput(''); setError('') }}
            className={`px-4 py-2 text-sm font-medium transition-all ${mode === 'json2csv' ? 'bg-brand-500 text-black' : 'bg-surface-card text-slate-300 hover:text-white'}`}
          >
            JSON → CSV
          </button>
          <button
            onClick={() => { setMode('csv2json'); setInput(''); setOutput(''); setError('') }}
            className={`px-4 py-2 text-sm font-medium transition-all ${mode === 'csv2json' ? 'bg-brand-500 text-black' : 'bg-surface-card text-slate-300 hover:text-white'}`}
          >
            CSV → JSON
          </button>
        </div>

        {/* Delimiter */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">구분자:</span>
          {[
            { val: ',', label: '쉼표 (,)' },
            { val: '\t', label: '탭' },
            { val: ';', label: '세미콜론 (;)' },
          ].map(d => (
            <button
              key={d.label}
              onClick={() => setDelimiter(d.val)}
              className={`text-xs px-2.5 py-1.5 rounded-lg border transition-all ${delimiter === d.val ? 'bg-brand-500 border-brand-500 text-black font-bold' : 'border-surface-border text-slate-300 hover:border-brand-500/40 hover:text-brand-300'}`}
            >
              {d.label}
            </button>
          ))}
        </div>

        <button onClick={loadSample} className="text-xs px-3 py-1.5 rounded-lg border border-surface-border text-slate-300 hover:text-brand-400 hover:border-brand-500/40 transition-all ml-auto">
          샘플 데이터
        </button>
      </div>

      {/* Editor */}
      <div className="grid md:grid-cols-2 gap-4 mb-4">
        {/* Input */}
        <div className="rounded-xl border border-surface-border bg-surface-card overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-surface-border bg-surface-hover/30">
            <span className="text-sm font-medium text-slate-200">{mode === 'json2csv' ? 'JSON 입력' : 'CSV 입력'}</span>
            <button onClick={() => { setInput(''); setOutput(''); setError('') }} className="text-xs text-slate-400 hover:text-red-400 flex items-center gap-1 transition-all">
              <RotateCcw size={12} /> 초기화
            </button>
          </div>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={mode === 'json2csv' ? '{"key": "value"} 또는 [{...}]' : 'name,age\n홍길동,30'}
            rows={16}
            className="w-full bg-transparent px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none resize-none font-mono leading-relaxed"
          />
        </div>

        {/* Output */}
        <div className="rounded-xl border border-surface-border bg-surface-card overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-surface-border bg-surface-hover/30">
            <span className="text-sm font-medium text-slate-200">{mode === 'json2csv' ? 'CSV 출력' : 'JSON 출력'}</span>
            <div className="flex gap-2">
              {output && (
                <>
                  <button onClick={switchMode} className="text-xs px-2.5 py-1.5 rounded-lg border border-surface-border text-slate-300 hover:border-brand-500/40 hover:text-brand-300 transition-all flex items-center gap-1">
                    <ArrowLeftRight size={12} /> 결과로 역변환
                  </button>
                  <button onClick={copy} className={`text-xs px-2.5 py-1.5 rounded-lg border transition-all flex items-center gap-1 ${copied ? 'bg-brand-500/20 border-brand-500/40 text-brand-400' : 'border-surface-border text-slate-300 hover:border-brand-500/40 hover:text-brand-300'}`}>
                    {copied ? <CheckCheck size={12} /> : <Copy size={12} />}
                    {copied ? '복사됨' : '복사'}
                  </button>
                  <button onClick={download} className="text-xs px-2.5 py-1.5 rounded-lg border border-brand-500/30 bg-brand-500/15 text-brand-400 hover:bg-brand-500/25 transition-all flex items-center gap-1">
                    <Download size={12} /> 다운로드
                  </button>
                </>
              )}
            </div>
          </div>
          {error ? (
            <div className="px-4 py-3 text-sm text-red-400 font-mono">{error}</div>
          ) : (
            <textarea
              value={output}
              readOnly
              placeholder="변환 결과가 여기에 표시됩니다"
              rows={16}
              className="w-full bg-transparent px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none resize-none font-mono leading-relaxed"
            />
          )}
        </div>
      </div>

      {/* Convert button */}
      <button
        onClick={convert}
        disabled={!input.trim()}
        className="w-full py-3 rounded-xl bg-brand-500 hover:bg-brand-400 disabled:opacity-40 disabled:cursor-not-allowed text-black font-bold text-sm transition-all shadow-[0_4px_15px_rgba(34,197,94,0.3)] flex items-center justify-center gap-2"
      >
        <ArrowLeftRight size={16} />
        {mode === 'json2csv' ? 'JSON → CSV 변환' : 'CSV → JSON 변환'}
      </button>

      {/* Features */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { title: '중첩 객체 지원', desc: 'a.b.c 형태로 자동 평탄화' },
          { title: '브라우저 처리', desc: '서버 전송 없이 완전 로컬' },
          { title: '다운로드 지원', desc: 'CSV/JSON 파일로 저장' },
          { title: '역변환 가능', desc: '결과를 다시 입력으로 활용' },
        ].map(f => (
          <div key={f.title} className="rounded-lg border border-surface-border bg-surface-card p-3">
            <p className="text-sm font-semibold text-slate-200 mb-1">{f.title}</p>
            <p className="text-xs text-slate-400">{f.desc}</p>
          </div>
        ))}
      </div>

      {/* SEO */}
      <div className="mt-16 p-6 rounded-xl border border-surface-border/30 bg-surface-card/20">
        <p className="text-xs text-slate-500 leading-relaxed">
          JSON CSV 변환기 · JSON to CSV · CSV to JSON · JSON 변환 · CSV 변환 · 데이터 변환 도구 ·
          JSON 파싱 · CSV 다운로드 · 엑셀 변환 · JSON converter · CSV converter · free JSON to CSV ·
          online JSON converter · JSON to Excel · data format converter
        </p>
      </div>
    </div>
  )
}
