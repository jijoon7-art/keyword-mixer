'use client'

import { useState, useCallback, useRef } from 'react'
import {
  Plus, Trash2, Copy, CheckCheck, Download,
  FileSpreadsheet, FileText, ChevronDown,
  Shuffle, Settings2,
} from 'lucide-react'
import { parseKeywords, combineKeywords, generatePatterns } from '@/lib/combiner'
import { downloadExcel, downloadCSV, downloadTXT } from '@/lib/exportExcel'
import { t, type Lang } from '@/lib/i18n'

const SEPARATORS = [
  { value: ' ', label: '공백 ( )' },
  { value: '',  label: '없음' },
  { value: ',', label: '쉼표 (,)' },
  { value: '_', label: '언더스코어 (_)' },
  { value: '-', label: '하이픈 (-)' },
] as const

const SEPARATORS_EN = [
  { value: ' ', label: 'Space ( )' },
  { value: '',  label: 'None' },
  { value: ',', label: 'Comma (,)' },
  { value: '_', label: 'Underscore (_)' },
  { value: '-', label: 'Dash (-)' },
] as const

const DEFAULT_GROUPS = [
  { id: 'g0', raw: '' },
  { id: 'g1', raw: '' },
  { id: 'g2', raw: '' },
  { id: 'g3', raw: '' },
]

const MAX_KEYWORDS_PER_GROUP = 100

export default function KeywordMixer() {
  const [lang, setLang] = useState<Lang>('ko')
  const T = t[lang]
  const seps = lang === 'ko' ? SEPARATORS : SEPARATORS_EN

  const [groups, setGroups] = useState(DEFAULT_GROUPS)
  const [selectedPatterns, setSelectedPatterns] = useState<Set<string>>(new Set())

  const [separator, setSeparator] = useState(' ')
  const [dedup, setDedup] = useState(true)
  const [caseMode, setCaseMode] = useState<'none' | 'lower' | 'upper'>('none')

  const [result, setResult] = useState<string[]>([])
  const [combining, setCombining] = useState(false)
  const [copied, setCopied] = useState(false)
  const [hasRun, setHasRun] = useState(false)

  const resultRef = useRef<HTMLDivElement>(null)

  const parsedGroups = groups.map((g) => parseKeywords(g.raw).slice(0, MAX_KEYWORDS_PER_GROUP))
  const totalInput = parsedGroups.reduce((s, kws) => s + kws.length, 0)

  const groupDataForCombine = groups.map((g, i) => ({
    id: g.id,
    label: `${i + 1}`,
    keywords: parsedGroups[i],
  }))

  const allPatterns = generatePatterns(groups.length)

  const patternsBySize: Record<number, typeof allPatterns> = {}
  for (const p of allPatterns) {
    const size = p.pattern.length
    if (!patternsBySize[size]) patternsBySize[size] = []
    patternsBySize[size].push(p)
  }

  const addGroup = () => {
    if (groups.length >= 6) return
    setGroups((prev) => [...prev, { id: `g${Date.now()}`, raw: '' }])
  }

  const removeGroup = (id: string) => {
    if (groups.length <= 2) return
    setGroups((prev) => prev.filter((g) => g.id !== id))
    setSelectedPatterns(new Set())
  }

  const updateGroup = (id: string, raw: string) => {
    const lines = raw.split('\n').slice(0, MAX_KEYWORDS_PER_GROUP)
    setGroups((prev) => prev.map((g) => (g.id === id ? { ...g, raw: lines.join('\n') } : g)))
  }

  const togglePattern = (key: string) => {
    setSelectedPatterns((prev) => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })
  }

  const selectAll = () => setSelectedPatterns(new Set(allPatterns.map((p) => p.pattern.join(','))))
  const deselectAll = () => setSelectedPatterns(new Set())

  const handleCombine = useCallback(async () => {
    if (selectedPatterns.size === 0) return
    setCombining(true)
    setHasRun(true)
    await new Promise((r) => setTimeout(r, 60))

    const patterns = allPatterns
      .filter((p) => selectedPatterns.has(p.pattern.join(',')))
      .map((p) => p.pattern.map(String))

    let combined = combineKeywords(groupDataForCombine, patterns, {
      separator,
      deduplicate: dedup,
      lowercase: caseMode === 'lower',
      trim: true,
    })

    if (caseMode === 'upper') combined = combined.map((k) => k.toUpperCase())

    setResult(combined)
    setCombining(false)
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }, [selectedPatterns, groups, separator, dedup, caseMode, allPatterns, groupDataForCombine])

  const copyAll = async () => {
    await navigator.clipboard.writeText(result.join('\n'))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const sizeLabel: Record<number, string> = {
    1: lang === 'ko' ? '단일 그룹' : 'Single',
    2: lang === 'ko' ? '2그룹 조합' : '2-Group',
    3: lang === 'ko' ? '3그룹 조합' : '3-Group',
    4: lang === 'ko' ? '4그룹 조합' : '4-Group',
    5: lang === 'ko' ? '5그룹 조합' : '5-Group',
    6: lang === 'ko' ? '6그룹 조합' : '6-Group',
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-surface-border/50 sticky top-0 z-50 backdrop-blur-md bg-surface-DEFAULT/80">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center shadow-[0_0_12px_rgba(34,197,94,0.4)]">
              <Shuffle size={16} className="text-black" />
            </div>
            <span className="font-display font-bold text-white text-lg tracking-tight">
              Keyword<span className="text-brand-400">Mixer</span>
            </span>
          </div>
          <button
            onClick={() => setLang(lang === 'ko' ? 'en' : 'ko')}
            className="text-xs px-3 py-1.5 rounded-full border border-brand-500/40 text-brand-400 hover:bg-brand-500/10 transition-all"
          >
            {T.langToggle}
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-10">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-mono mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
            Free SEO Tool
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-extrabold text-white mb-3 tracking-tight">
            {T.tagline}
          </h1>
          <p className="text-slate-400 text-base max-w-xl mx-auto leading-relaxed">{T.subtitle}</p>
          {totalInput > 0 && (
            <p className="mt-3 text-brand-400 text-sm font-mono">{T.inputTotal(totalInput)}</p>
          )}
        </div>

        {/* Groups */}
        <section className="mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {groups.map((group, idx) => {
              const count = parsedGroups[idx].length
              const isAtLimit = count >= MAX_KEYWORDS_PER_GROUP
              return (
                <div
                  key={group.id}
                  className="rounded-xl border border-surface-border bg-surface-card p-4 flex flex-col gap-3 transition-all hover:border-brand-500/40 group/card"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-md bg-brand-500/20 text-brand-400 text-xs font-mono font-bold flex items-center justify-center border border-brand-500/30">
                        {idx + 1}
                      </span>
                      <span className="text-sm font-semibold text-slate-200">
                        {lang === 'ko' ? `그룹 ${idx + 1}` : `Group ${idx + 1}`}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-mono px-2 py-0.5 rounded-full border ${
                        isAtLimit
                          ? 'text-amber-400 bg-amber-500/10 border-amber-500/30'
                          : 'text-brand-400 bg-brand-500/10 border-brand-500/20'
                      }`}>
                        {count}/{MAX_KEYWORDS_PER_GROUP}
                      </span>
                      {groups.length > 2 && (
                        <button
                          onClick={() => removeGroup(group.id)}
                          className="opacity-0 group-hover/card:opacity-100 w-6 h-6 flex items-center justify-center rounded text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-all"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  </div>

                  <textarea
                    value={group.raw}
                    onChange={(e) => updateGroup(group.id, e.target.value)}
                    placeholder={
                      lang === 'ko'
                        ? `키워드 입력 (한 줄에 하나씩)\n최대 ${MAX_KEYWORDS_PER_GROUP}개\n\n예: 서울\n부산\n대구`
                        : `One keyword per line\nMax ${MAX_KEYWORDS_PER_GROUP} keywords\n\ne.g. Seoul\nBusan`
                    }
                    rows={7}
                    className="w-full bg-surface-DEFAULT/60 border border-surface-border rounded-lg px-3 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-brand-500/60 focus:ring-1 focus:ring-brand-500/25 transition-all leading-relaxed font-mono resize-none"
                  />

                  {isAtLimit && (
                    <p className="text-xs text-amber-400/80">
                      {lang === 'ko' ? `⚠ 최대 ${MAX_KEYWORDS_PER_GROUP}개 입력 완료` : `⚠ Max ${MAX_KEYWORDS_PER_GROUP} reached`}
                    </p>
                  )}
                </div>
              )
            })}

            {/* Add Group */}
            {groups.length < 6 && (
              <button
                onClick={addGroup}
                className="rounded-xl border-2 border-dashed border-surface-border bg-surface-card/30 p-4 flex flex-col items-center justify-center gap-2 text-slate-600 hover:text-brand-400 hover:border-brand-500/40 hover:bg-brand-500/5 transition-all min-h-[200px]"
              >
                <div className="w-10 h-10 rounded-full border-2 border-dashed border-current flex items-center justify-center">
                  <Plus size={18} />
                </div>
                <span className="text-sm font-medium">{lang === 'ko' ? '그룹 추가' : 'Add Group'}</span>
                <span className="text-xs opacity-60">{lang === 'ko' ? '최대 6그룹' : 'Max 6 groups'}</span>
              </button>
            )}
          </div>
        </section>

        {/* Rules & Options */}
        <section className="mb-8 grid lg:grid-cols-3 gap-4">
          {/* Rules */}
          <div className="lg:col-span-2 rounded-xl border border-surface-border bg-surface-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-slate-200">
                {lang === 'ko' ? '조합 규칙 선택' : 'Combination Rules'}
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={selectAll}
                  className="text-xs px-3 py-1.5 rounded-lg bg-brand-500/15 border border-brand-500/30 text-brand-400 hover:bg-brand-500/25 hover:border-brand-500/50 transition-all font-medium"
                >
                  {lang === 'ko' ? '전체 선택' : 'Select All'}
                </button>
                <button
                  onClick={deselectAll}
                  className="text-xs px-3 py-1.5 rounded-lg bg-surface-hover border border-surface-border text-slate-500 hover:text-slate-300 hover:border-slate-500 transition-all"
                >
                  {lang === 'ko' ? '전체 해제' : 'Deselect All'}
                </button>
              </div>
            </div>

            {Object.entries(patternsBySize).map(([size, patterns]) => (
              <div key={size} className="mb-5">
                <div className="flex items-center gap-2 mb-2.5">
                  <span className="text-xs font-semibold text-brand-400 bg-brand-500/10 border border-brand-500/20 px-2 py-0.5 rounded-md font-mono">
                    {sizeLabel[parseInt(size)]}
                  </span>
                  <span className="text-xs text-slate-600">{patterns.length}{lang === 'ko' ? '가지' : ' combos'}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {patterns.map((p) => {
                    const key = p.pattern.join(',')
                    const active = selectedPatterns.has(key)
                    return (
                      <button
                        key={key}
                        onClick={() => togglePattern(key)}
                        className={`text-xs font-mono px-3 py-1.5 rounded-lg border transition-all ${
                          active
                            ? 'bg-brand-500 border-brand-500 text-black font-bold shadow-[0_0_10px_rgba(34,197,94,0.3)]'
                            : 'bg-surface-DEFAULT border-surface-border text-slate-400 hover:border-brand-500/40 hover:text-brand-300'
                        }`}
                      >
                        {p.label}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}

            <p className="text-xs mt-1 font-mono">
              {selectedPatterns.size > 0
                ? <span className="text-brand-400">✓ {selectedPatterns.size}{lang === 'ko' ? '개 규칙 선택됨' : ' rules selected'}</span>
                : <span className="text-slate-600">{lang === 'ko' ? '규칙을 선택하세요' : 'Select rules above'}</span>
              }
            </p>
          </div>

          {/* Options */}
          <div className="rounded-xl border border-surface-border bg-surface-card p-5 flex flex-col gap-5">
            <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Settings2 size={14} className="text-brand-400" />
              {lang === 'ko' ? '옵션' : 'Options'}
            </h2>

            {/* Separator */}
            <div>
              <p className="text-xs text-slate-500 mb-2 font-medium">{lang === 'ko' ? '키워드 구분자' : 'Separator'}</p>
              <div className="flex flex-wrap gap-1.5">
                {seps.map((s) => (
                  <button
                    key={s.value + s.label}
                    onClick={() => setSeparator(s.value)}
                    className={`text-xs px-2.5 py-1.5 rounded-lg border transition-all font-mono ${
                      separator === s.value
                        ? 'bg-brand-500 border-brand-500 text-black font-bold'
                        : 'bg-surface-DEFAULT border-surface-border text-slate-400 hover:border-brand-500/40 hover:text-brand-300'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Dedup */}
            <label className="flex items-center justify-between cursor-pointer group/toggle">
              <span className="text-sm text-slate-400 group-hover/toggle:text-slate-200 transition-colors">
                {lang === 'ko' ? '중복 제거' : 'Remove Duplicates'}
              </span>
              <div
                onClick={() => setDedup(!dedup)}
                className={`w-11 h-6 rounded-full relative transition-all cursor-pointer ${dedup ? 'bg-brand-500' : 'bg-surface-border'}`}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow ${dedup ? 'left-6' : 'left-1'}`} />
              </div>
            </label>

            {/* Case */}
            <div>
              <p className="text-xs text-slate-500 mb-2 font-medium">
                {lang === 'ko' ? '대/소문자 변환' : 'Case Conversion'}
              </p>
              <div className="flex gap-1.5">
                {[
                  { val: 'none' as const, label: lang === 'ko' ? '기본' : 'None' },
                  { val: 'lower' as const, label: lang === 'ko' ? '소문자' : 'lower' },
                  { val: 'upper' as const, label: lang === 'ko' ? '대문자' : 'UPPER' },
                ].map((opt) => (
                  <button
                    key={opt.val}
                    onClick={() => setCaseMode(opt.val)}
                    className={`flex-1 text-xs py-2 rounded-lg border transition-all font-medium ${
                      caseMode === opt.val
                        ? 'bg-brand-500 border-brand-500 text-black font-bold'
                        : 'bg-surface-DEFAULT border-surface-border text-slate-400 hover:border-brand-500/40 hover:text-brand-300'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Combine Button */}
            <button
              onClick={handleCombine}
              disabled={combining || selectedPatterns.size === 0 || totalInput === 0}
              className="mt-auto w-full py-3 rounded-xl bg-brand-500 hover:bg-brand-400 disabled:opacity-40 disabled:cursor-not-allowed text-black font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(34,197,94,0.3)] hover:shadow-[0_4px_28px_rgba(34,197,94,0.5)] active:scale-[0.98]"
            >
              {combining ? (
                <>
                  <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  {lang === 'ko' ? '조합 중...' : 'Combining...'}
                </>
              ) : (
                <>
                  <Shuffle size={15} />
                  {lang === 'ko' ? '키워드 조합하기' : 'Combine Keywords'}
                </>
              )}
            </button>
          </div>
        </section>

        {/* Results */}
        {hasRun && (
          <section ref={resultRef} className="animate-slide-up">
            <div className="rounded-xl border border-surface-border bg-surface-card overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-surface-border bg-surface-hover/30">
                <div>
                  <h2 className="text-sm font-semibold text-slate-200">
                    {lang === 'ko' ? '조합 결과' : 'Results'}
                  </h2>
                  <p className="text-xs text-brand-400 font-mono mt-0.5">
                    {lang === 'ko'
                      ? `조합된 키워드: ${result.length.toLocaleString()}개`
                      : `Total: ${result.length.toLocaleString()} keywords`}
                  </p>
                </div>
                {result.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={copyAll}
                      className={`flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg border transition-all ${
                        copied
                          ? 'bg-brand-500/20 border-brand-500/40 text-brand-400'
                          : 'border-surface-border bg-surface-DEFAULT text-slate-400 hover:border-brand-500/40 hover:text-brand-300'
                      }`}
                    >
                      {copied ? <CheckCheck size={13} /> : <Copy size={13} />}
                      {copied ? (lang === 'ko' ? '복사됨!' : 'Copied!') : (lang === 'ko' ? '전체 복사' : 'Copy All')}
                    </button>
                    <button
                      onClick={() => downloadExcel(result, 'keywords')}
                      className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg bg-brand-500/15 border border-brand-500/30 text-brand-400 hover:bg-brand-500/25 hover:border-brand-500/50 transition-all font-medium"
                    >
                      <FileSpreadsheet size={13} />
                      {lang === 'ko' ? '엑셀 다운로드' : 'Excel'}
                    </button>
                    <button
                      onClick={() => downloadCSV(result, 'keywords')}
                      className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg bg-blue-600/15 border border-blue-600/30 text-blue-400 hover:bg-blue-600/25 transition-all"
                    >
                      <Download size={13} />
                      CSV
                    </button>
                    <button
                      onClick={() => downloadTXT(result, 'keywords')}
                      className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg bg-slate-600/15 border border-slate-600/30 text-slate-400 hover:bg-slate-600/25 transition-all"
                    >
                      <FileText size={13} />
                      TXT
                    </button>
                  </div>
                )}
              </div>

              {result.length === 0 ? (
                <div className="py-16 text-center text-slate-600 text-sm">
                  {lang === 'ko' ? '조합 규칙을 선택하고 키워드를 입력하세요' : 'Select rules and enter keywords'}
                </div>
              ) : (
                <div className="max-h-[480px] overflow-y-auto">
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-surface-card border-b border-surface-border">
                      <tr>
                        <th className="w-14 text-left px-4 py-2.5 text-xs text-slate-600 font-mono">#</th>
                        <th className="text-left px-3 py-2.5 text-xs text-slate-600">Keyword</th>
                        <th className="w-10 px-3 py-2.5" />
                      </tr>
                    </thead>
                    <tbody>
                      {result.slice(0, 5000).map((kw, i) => (
                        <ResultRow key={i} index={i + 1} keyword={kw} />
                      ))}
                    </tbody>
                  </table>
                  {result.length > 5000 && (
                    <p className="text-center text-xs text-slate-600 py-4">
                      {lang === 'ko'
                        ? `표시 제한: 5,000개 (전체 ${result.length.toLocaleString()}개는 다운로드로 확인)`
                        : `Showing 5,000 of ${result.length.toLocaleString()} — download for full list`}
                    </p>
                  )}
                </div>
              )}
            </div>
          </section>
        )}

        {/* How to Use & FAQ */}
        <section className="mt-20 grid md:grid-cols-2 gap-10">
          <div>
            <h2 className="text-xl font-bold text-white mb-5">
              {lang === 'ko' ? '사용 방법' : 'How to Use'}
            </h2>
            <ol className="space-y-3">
              {(lang === 'ko'
                ? [
                    '각 그룹에 키워드를 입력합니다 (그룹당 최대 100개)',
                    '원하는 조합 규칙을 선택합니다 (1+2, 1+2+3 등)',
                    '키워드 조합하기 버튼을 누릅니다',
                    '결과를 복사하거나 엑셀·CSV·TXT로 다운로드합니다',
                  ]
                : [
                    'Enter keywords in each group (max 100 per group)',
                    'Select combination rules (1+2, 1+2+3, etc.)',
                    'Click "Combine Keywords"',
                    'Copy or download as Excel · CSV · TXT',
                  ]
              ).map((step, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-400 text-sm">
                  <span className="mt-0.5 w-5 h-5 rounded-full bg-brand-500/15 border border-brand-500/30 text-brand-400 text-xs flex items-center justify-center font-mono flex-shrink-0">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-5">FAQ</h2>
            <div className="space-y-3">
              {T.faq.map((item, i) => (
                <details key={i} className="group rounded-lg border border-surface-border bg-surface-card overflow-hidden">
                  <summary className="flex items-center justify-between px-4 py-3 cursor-pointer text-sm text-slate-300 hover:text-white list-none">
                    {item.q}
                    <ChevronDown size={14} className="text-brand-400 group-open:rotate-180 transition-transform" />
                  </summary>
                  <p className="px-4 pb-3 text-sm text-slate-500 leading-relaxed">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* SEO block */}
        <section className="mt-16 p-6 rounded-xl border border-surface-border/30 bg-surface-card/20">
          <h2 className="text-base font-semibold text-slate-400 mb-3">관련 도구 및 키워드</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            키워드 조합기 · SEO키워드 · 키워드 생성기 · 키워드 믹서 · 키워드 자동 조합 · 키워드 조합 도구 ·
            네이버 키워드 조합기 · 롱테일 키워드 생성기 · 쇼핑 키워드 조합기 · 유튜브 태그 생성기 ·
            스마트스토어 키워드 조합 · 쿠팡 키워드 조합 · 블로그 키워드 조합기 ·
            keyword combiner · keyword mixer · keyword generator · free keyword combiner ·
            keyword combination tool · keyword permutation tool · bulk keyword generator ·
            long tail keyword generator · SEO keyword tool · keyword merge tool ·
            Google Ads keyword tool · PPC keyword generator · combine keywords free ·
            keyword list generator · merge keywords online · keyword mixing tool
          </p>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-surface-border/50 py-8 mt-10">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-slate-600 text-sm">
            © {new Date().getFullYear()} <span className="text-brand-500">Keyword</span>Mixer — {T.madeWith}
          </p>
          <p className="text-slate-700 text-xs mt-2">
            keywordmixer.app · 키워드 조합기 · keyword combiner · SEO tool
          </p>
        </div>
      </footer>
    </div>
  )
}

function ResultRow({ index, keyword }: { index: number; keyword: string }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    await navigator.clipboard.writeText(keyword)
    setCopied(true)
    setTimeout(() => setCopied(false), 1200)
  }
  return (
    <tr className="result-row group/row cursor-pointer" onClick={copy}>
      <td className="px-4 py-2.5 text-slate-700 font-mono text-xs">{index}</td>
      <td className="px-3 py-2.5 text-slate-300 text-sm">{keyword}</td>
      <td className="px-3 py-2.5 w-8">
        {copied
          ? <CheckCheck size={12} className="text-brand-400" />
          : <Copy size={12} className="text-slate-700 opacity-0 group-hover/row:opacity-100 transition-opacity" />
        }
      </td>
    </tr>
  )
}
