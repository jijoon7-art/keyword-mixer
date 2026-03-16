'use client'

import { useState } from 'react'
import { Copy, CheckCheck, RotateCcw } from 'lucide-react'

interface DiffLine {
  type: 'same' | 'added' | 'removed'
  content: string
  lineNum1?: number
  lineNum2?: number
}

function computeDiff(text1: string, text2: string): DiffLine[] {
  const lines1 = text1.split('\n')
  const lines2 = text2.split('\n')
  const result: DiffLine[] = []

  // Simple LCS-based diff
  const m = lines1.length
  const n = lines2.length
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0))

  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = lines1[i-1] === lines2[j-1] ? dp[i-1][j-1] + 1 : Math.max(dp[i-1][j], dp[i][j-1])

  const diff: DiffLine[] = []
  let i = m, j = n
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && lines1[i-1] === lines2[j-1]) {
      diff.unshift({ type: 'same', content: lines1[i-1], lineNum1: i, lineNum2: j })
      i--; j--
    } else if (j > 0 && (i === 0 || dp[i][j-1] >= dp[i-1][j])) {
      diff.unshift({ type: 'added', content: lines2[j-1], lineNum2: j })
      j--
    } else {
      diff.unshift({ type: 'removed', content: lines1[i-1], lineNum1: i })
      i--
    }
  }

  return diff
}

const SAMPLE1 = `안녕하세요, 반갑습니다.
오늘 날씨가 정말 좋네요.
내일도 좋을 것 같아요.
주말에 여행을 가고 싶어요.
서울 여행 계획 중입니다.`

const SAMPLE2 = `안녕하세요, 반갑습니다.
오늘 날씨가 정말 좋네요.
내일은 비가 올 것 같아요.
주말에 등산을 가고 싶어요.
서울 여행 계획 중입니다.
다음에 또 만나요!`

export default function TextDiff() {
  const [text1, setText1] = useState('')
  const [text2, setText2] = useState('')
  const [diff, setDiff] = useState<DiffLine[]>([])
  const [compared, setCompared] = useState(false)
  const [ignoreWhitespace, setIgnoreWhitespace] = useState(false)
  const [ignoreCase, setIgnoreCase] = useState(false)
  const [copied, setCopied] = useState(false)

  const compare = () => {
    let t1 = text1
    let t2 = text2
    if (ignoreWhitespace) { t1 = t1.replace(/\s+/g, ' ').trim(); t2 = t2.replace(/\s+/g, ' ').trim() }
    if (ignoreCase) { t1 = t1.toLowerCase(); t2 = t2.toLowerCase() }
    setDiff(computeDiff(t1, t2))
    setCompared(true)
  }

  const loadSample = () => { setText1(SAMPLE1); setText2(SAMPLE2); setCompared(false) }

  const addedCount = diff.filter(d => d.type === 'added').length
  const removedCount = diff.filter(d => d.type === 'removed').length
  const sameCount = diff.filter(d => d.type === 'same').length

  const copyDiff = async () => {
    const text = diff.map(d => {
      const prefix = d.type === 'added' ? '+ ' : d.type === 'removed' ? '- ' : '  '
      return prefix + d.content
    }).join('\n')
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-mono mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
          Free Tool
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-3 tracking-tight">텍스트 비교기</h1>
        <p className="text-slate-300 text-base max-w-lg mx-auto">
          두 텍스트의 차이점을 한눈에 비교. 추가·삭제·동일 줄을 색상으로 구분, diff 결과 복사·저장.
        </p>
      </div>

      {/* Options */}
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <div onClick={() => setIgnoreWhitespace(!ignoreWhitespace)} className={`w-10 h-5 rounded-full relative transition-all ${ignoreWhitespace ? 'bg-brand-500' : 'bg-surface-border'}`}>
            <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all shadow ${ignoreWhitespace ? 'left-5' : 'left-0.5'}`} />
          </div>
          <span className="text-sm text-slate-300">공백 무시</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <div onClick={() => setIgnoreCase(!ignoreCase)} className={`w-10 h-5 rounded-full relative transition-all ${ignoreCase ? 'bg-brand-500' : 'bg-surface-border'}`}>
            <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all shadow ${ignoreCase ? 'left-5' : 'left-0.5'}`} />
          </div>
          <span className="text-sm text-slate-300">대소문자 무시</span>
        </label>
        <button onClick={loadSample} className="text-xs px-3 py-1.5 rounded-lg border border-surface-border text-slate-300 hover:text-brand-400 hover:border-brand-500/40 transition-all ml-auto">
          샘플 데이터
        </button>
      </div>

      {/* Text inputs */}
      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div className="rounded-xl border border-surface-border bg-surface-card overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-surface-border bg-surface-hover/30">
            <span className="text-sm font-medium text-slate-200">원본 텍스트</span>
            <button onClick={() => { setText1(''); setCompared(false) }} className="text-xs text-slate-500 hover:text-red-400 flex items-center gap-1 transition-all">
              <RotateCcw size={12} /> 초기화
            </button>
          </div>
          <textarea value={text1} onChange={e => { setText1(e.target.value); setCompared(false) }}
            placeholder="원본 텍스트를 입력하세요" rows={12}
            className="w-full bg-transparent px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none resize-none font-mono leading-relaxed" />
        </div>
        <div className="rounded-xl border border-surface-border bg-surface-card overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-surface-border bg-surface-hover/30">
            <span className="text-sm font-medium text-slate-200">비교할 텍스트</span>
            <button onClick={() => { setText2(''); setCompared(false) }} className="text-xs text-slate-500 hover:text-red-400 flex items-center gap-1 transition-all">
              <RotateCcw size={12} /> 초기화
            </button>
          </div>
          <textarea value={text2} onChange={e => { setText2(e.target.value); setCompared(false) }}
            placeholder="비교할 텍스트를 입력하세요" rows={12}
            className="w-full bg-transparent px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none resize-none font-mono leading-relaxed" />
        </div>
      </div>

      <button onClick={compare} disabled={!text1.trim() || !text2.trim()}
        className="w-full py-3 rounded-xl bg-brand-500 hover:bg-brand-400 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm transition-all shadow-[0_4px_15px_rgba(34,197,94,0.3)] mb-6">
        텍스트 비교하기
      </button>

      {/* Diff result */}
      {compared && (
        <div className="rounded-xl border border-surface-border bg-surface-card overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-surface-border bg-surface-hover/30">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-slate-200">비교 결과</span>
              <div className="flex gap-3 text-xs font-mono">
                <span className="text-brand-400">+{addedCount} 추가</span>
                <span className="text-red-400">-{removedCount} 삭제</span>
                <span className="text-slate-500">{sameCount} 동일</span>
              </div>
            </div>
            <button onClick={copyDiff} className={`text-xs px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1 ${copied ? 'bg-brand-500/20 border-brand-500/40 text-brand-400' : 'border-surface-border text-slate-300 hover:border-brand-500/40 hover:text-brand-300'}`}>
              {copied ? <CheckCheck size={12} /> : <Copy size={12} />} {copied ? '복사됨' : 'diff 복사'}
            </button>
          </div>
          <div className="max-h-[500px] overflow-y-auto font-mono text-sm">
            {diff.map((line, i) => (
              <div key={i} className={`flex items-start px-4 py-1 ${
                line.type === 'added' ? 'bg-brand-500/10 border-l-2 border-brand-500' :
                line.type === 'removed' ? 'bg-red-500/10 border-l-2 border-red-500' :
                'border-l-2 border-transparent'
              }`}>
                <span className={`w-5 flex-shrink-0 text-xs mr-3 ${
                  line.type === 'added' ? 'text-brand-400' :
                  line.type === 'removed' ? 'text-red-400' : 'text-slate-600'
                }`}>
                  {line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' '}
                </span>
                <span className={`flex-1 ${
                  line.type === 'added' ? 'text-brand-300' :
                  line.type === 'removed' ? 'text-red-300' : 'text-slate-400'
                }`}>
                  {line.content || ' '}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SEO */}
      <div className="mt-10 p-6 rounded-xl border border-surface-border/30 bg-surface-card/20">
        <p className="text-xs text-slate-500 leading-relaxed">
          텍스트 비교기 · 텍스트 차이 비교 · diff 도구 · 문서 비교 · 글 비교기 · 온라인 diff ·
          text diff tool · text compare · diff checker · compare text online · find differences ·
          free diff tool · online text comparison
        </p>
      </div>
    </div>
  )
}
