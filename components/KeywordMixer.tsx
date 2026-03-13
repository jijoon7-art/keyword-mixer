'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import {
  Plus, Trash2, Copy, CheckCheck, Download,
  FileSpreadsheet, FileText, ChevronDown, ChevronUp,
  Shuffle, Settings2, ArrowRight, Info
} from 'lucide-react'
import { parseKeywords, combineKeywords, generatePatterns } from '@/lib/combiner'
import { downloadExcel, downloadCSV, downloadTXT } from '@/lib/exportExcel'
import { t, type Lang } from '@/lib/i18n'

const SEPARATORS = [
  { value: ' ', key: 'separatorSpace' },
  { value: '',  key: 'separatorNone' },
  { value: ',', key: 'separatorComma' },
  { value: '_', key: 'separatorUnderscore' },
  { value: '-', key: 'separatorDash' },
] as const

const DEFAULT_GROUPS = [
  { id: 'g0', raw: '' },
  { id: 'g1', raw: '' },
  { id: 'g2', raw: '' },
]

export default function KeywordMixer() {
  const [lang, setLang] = useState<Lang>('ko')
  const T = t[lang]

  // Groups
  const [groups, setGroups] = useState(DEFAULT_GROUPS)

  // Patterns
  const [selectedPatterns, setSelectedPatterns] = useState<Set<string>>(new Set())

  // Options
  const [separator, setSeparator] = useState(' ')
  const [dedup, setDedup] = useState(true)
  const [lowercase, setLowercase] = useState(false)
  const [showOptions, setShowOptions] = useState(false)

  // Result
  const [result, setResult] = useState<string[]>([])
  const [combining, setCombining] = useState(false)
  const [copied, setCopied] = useState(false)
  const [hasRun, setHasRun] = useState(false)

  const resultRef = useRef<HTMLDivElement>(null)

  // Parsed keyword arrays
  const parsedGroups = groups.map((g) => parseKeywords(g.raw))
  const totalInput = parsedGroups.reduce((s, kws) => s + kws.length, 0)
  const activeGroups = parsedGroups.filter((kws) => kws.length > 0)

  // Generate pattern options based on how many groups have keywords
  const filledCount = parsedGroups.filter(kws => kws.length > 0).length
  const groupDataForCombine = groups.map((g, i) => ({
    id: g.id,
    label: `${i + 1}`,
    keywords: parsedGroups[i],
  }))

  const allPatterns = generatePatterns(groups.length)

  // ---- Handlers ----

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
    setGroups((prev) => prev.map((g) => (g.id === id ? { ...g, raw } : g)))
  }

  const togglePattern = (key: string) => {
    setSelectedPatterns((prev) => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })
  }

  const selectAll = () => {
    setSelectedPatterns(new Set(allPatterns.map((p) => p.pattern.join(','))))
  }

  const deselectAll = () => setSelectedPatterns(new Set())

  const handleCombine = useCallback(async () => {
    if (selectedPatterns.size === 0) return
    setCombining(true)
    setHasRun(true)

    await new Promise((r) => setTimeout(r, 60)) // allow UI to update

    const patterns = allPatterns
      .filter((p) => selectedPatterns.has(p.pattern.join(',')))
      .map((p) => p.pattern.map(String))

    const combined = combineKeywords(groupDataForCombine, patterns, {
      separator,
      deduplicate: dedup,
      lowercase,
      trim: true,
    })

    setResult(combined)
    setCombining(false)

    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }, [selectedPatterns, groups, separator, dedup, lowercase])

  const copyAll = async () => {
    await navigator.clipboard.writeText(result.join('\n'))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const patternsBySize: Record<number, typeof allPatterns> = {}
  for (const p of allPatterns) {
    const size = p.pattern.length
    if (!patternsBySize[size]) patternsBySize[size] = []
    patternsBySize[size].push(p)
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
            <span className="font-display font-700 text-white text-lg tracking-tight">
              Keyword<span className="text-brand-400">Mixer</span>
            </span>
          </div>
          <button
            onClick={() => setLang(lang === 'ko' ? 'en' : 'ko')}
            className="text-xs px-3 py-1.5 rounded-full border border-surface-border text-slate-400 hover:text-white hover:border-slate-500 transition-all"
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
          <h1 className="font-display text-4xl md:text-5xl font-800 text-white mb-3 tracking-tight">
            {T.tagline}
          </h1>
          <p className="text-slate-400 text-base max-w-xl mx-auto leading-relaxed">
            {T.subtitle}
          </p>
          {totalInput > 0 && (
            <p className="mt-3 text-brand-400 text-sm font-mono animate-fade-in">
              {T.inputTotal(totalInput)}
            </p>
          )}
        </div>

        {/* === GROUPS === */}
        <section className="mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {groups.map((group, idx) => {
              const count = parsedGroups[idx].length
              return (
                <div
                  key={group.id}
                  className="rounded-xl border border-surface-border bg-surface-card p-4 flex flex-col gap-3 transition-all hover:border-brand-500/30 group/card"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-md bg-brand-500/15 text-brand-400 text-xs font-mono font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="text-sm font-semibold text-slate-300">
                        {T.groupLabel(idx + 1)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {count > 0 && (
                        <span className="text-xs font-mono text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded-full">
                          {T.groupCount(count)}
                        </span>
                      )}
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
                    placeholder={T.groupPlaceholder(idx + 1)}
                    rows={6}
                    className="w-full bg-surface-DEFAULT/60 border border-surface-border rounded-lg px-3 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/20 transition-all leading-relaxed font-mono"
                  />
                </div>
              )
            })}

            {/* Add Group button */}
            {groups.length < 6 && (
              <button
                onClick={addGroup}
                className="rounded-xl border border-dashed border-surface-border bg-surface-card/30 p-4 flex flex-col items-center justify-center gap-2 text-slate-600 hover:text-brand-400 hover:border-brand-500/40 hover:bg-brand-500/5 transition-all min-h-[180px]"
              >
                <Plus size={20} />
                <span className="text-sm">{T.addGroup}</span>
              </button>
            )}
          </div>
        </section>

        {/* === RULES & OPTIONS === */}
        <section className="mb-8 grid lg:grid-cols-3 gap-4">
          {/* Combination Rules */}
          <div className="lg:col-span-2 rounded-xl border border-surface-border bg-surface-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-slate-200">{T.combineRules}</h2>
              <div className="flex gap-2">
                <button
                  onClick={selectAll}
                  className="text-xs px-2.5 py-1 rounded-md bg-brand-500/10 text-brand-400 hover:bg-brand-500/20 transition-all"
                >
                  {T.selectAll}
                </button>
                <button
                  onClick={deselectAll}
                  className="text-xs px-2.5 py-1 rounded-md bg-surface-hover text-slate-500 hover:text-slate-300 transition-all"
                >
                  {T.deselectAll}
                </button>
              </div>
            </div>

            {Object.entries(patternsBySize).map(([size, patterns]) => (
              <div key={size} className="mb-4">
                <p className="text-xs text-slate-600 mb-2 font-mono">
                  {size === '1' ? 'Single' : size === '2' ? '2-Group' : size === '3' ? '3-Group' : '4-Group'} combos
                </p>
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
                            ? 'bg-brand-500/20 border-brand-500/50 text-brand-300 shadow-[0_0_8px_rgba(34,197,94,0.15)]'
                            : 'bg-surface-DEFAULT border-surface-border text-slate-500 hover:border-slate-600 hover:text-slate-300'
                        }`}
                      >
                        {p.label}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}

            <p className="text-xs text-slate-600 mt-2">
              {selectedPatterns.size > 0
                ? `${selectedPatterns.size}개 규칙 선택됨`
                : '조합 규칙을 선택하세요'}
            </p>
          </div>

          {/* Options */}
          <div className="rounded-xl border border-surface-border bg-surface-card p-5 flex flex-col gap-4">
            <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Settings2 size={14} className="text-brand-400" />
              {T.options}
            </h2>

            {/* Separator */}
            <div>
              <p className="text-xs text-slate-500 mb-2">{T.separator}</p>
              <div className="flex flex-wrap gap-1.5">
                {SEPARATORS.map((s) => (
                  <button
                    key={s.value}
                    onClick={() => setSeparator(s.value)}
                    className={`text-xs px-3 py-1.5 rounded-lg border transition-all font-mono ${
                      separator === s.value
                        ? 'bg-brand-500/20 border-brand-500/50 text-brand-300'
                        : 'bg-surface-DEFAULT border-surface-border text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {T[s.key as keyof typeof T] as string}
                  </button>
                ))}
              </div>
            </div>

            {/* Toggles */}
            <div className="flex flex-col gap-3">
              {[
                { key: 'dedup', val: dedup, set: setDedup, label: T.dedup },
                { key: 'lower', val: lowercase, set: setLowercase, label: T.lowercase },
              ].map((opt) => (
                <label key={opt.key} className="flex items-center justify-between cursor-pointer group/toggle">
                  <span className="text-sm text-slate-400 group-hover/toggle:text-slate-200 transition-colors">
                    {opt.label}
                  </span>
                  <div
                    onClick={() => opt.set(!opt.val)}
                    className={`w-10 h-5 rounded-full relative transition-all ${
                      opt.val ? 'bg-brand-500' : 'bg-surface-border'
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all shadow ${
                        opt.val ? 'left-5' : 'left-0.5'
                      }`}
                    />
                  </div>
                </label>
              ))}
            </div>

            {/* Combine button */}
            <button
              onClick={handleCombine}
              disabled={combining || selectedPatterns.size === 0 || totalInput === 0}
              className="mt-auto w-full py-3 rounded-xl bg-brand-500 hover:bg-brand-400 disabled:opacity-40 disabled:cursor-not-allowed text-black font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(34,197,94,0.25)] hover:shadow-[0_4px_28px_rgba(34,197,94,0.4)] active:scale-[0.98] btn-glow"
            >
              {combining ? (
                <>
                  <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  {T.combining}
                </>
              ) : (
                <>
                  <Shuffle size={15} />
                  {T.combine}
                </>
              )}
            </button>
          </div>
        </section>

        {/* === RESULTS === */}
        {hasRun && (
          <section ref={resultRef} className="animate-slide-up">
            <div className="rounded-xl border border-surface-border bg-surface-card overflow-hidden">
              {/* Result header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-surface-border bg-surface-hover/30">
                <div>
                  <h2 className="text-sm font-semibold text-slate-200">{T.result}</h2>
                  <p className="text-xs text-brand-400 font-mono mt-0.5">
                    {T.resultCount(result.length)}
                  </p>
                </div>

                {result.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {/* Copy */}
                    <button
                      onClick={copyAll}
                      className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg border border-surface-border bg-surface-DEFAULT hover:border-slate-500 text-slate-400 hover:text-white transition-all"
                    >
                      {copied ? <CheckCheck size={13} className="text-brand-400" /> : <Copy size={13} />}
                      {copied ? T.copied : T.copyAll}
                    </button>

                    {/* Excel */}
                    <button
                      onClick={() => downloadExcel(result, 'keywords')}
                      className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg bg-emerald-600/20 border border-emerald-600/30 text-emerald-400 hover:bg-emerald-600/30 transition-all"
                    >
                      <FileSpreadsheet size={13} />
                      {T.dlExcel}
                    </button>

                    {/* CSV */}
                    <button
                      onClick={() => downloadCSV(result, 'keywords')}
                      className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg bg-blue-600/20 border border-blue-600/30 text-blue-400 hover:bg-blue-600/30 transition-all"
                    >
                      <Download size={13} />
                      {T.dlCSV}
                    </button>

                    {/* TXT */}
                    <button
                      onClick={() => downloadTXT(result, 'keywords')}
                      className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg bg-slate-600/20 border border-slate-600/30 text-slate-400 hover:bg-slate-600/30 transition-all"
                    >
                      <FileText size={13} />
                      {T.dlTXT}
                    </button>
                  </div>
                )}
              </div>

              {/* Result list */}
              {result.length === 0 ? (
                <div className="py-16 text-center text-slate-600 text-sm">{T.noResult}</div>
              ) : (
                <div className="max-h-[480px] overflow-y-auto">
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-surface-card border-b border-surface-border">
                      <tr>
                        <th className="w-14 text-left px-4 py-2.5 text-xs text-slate-600 font-mono">#</th>
                        <th className="text-left px-3 py-2.5 text-xs text-slate-600">Keyword</th>
                        <th className="w-10 px-3 py-2.5"></th>
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
                      표시 제한: 5,000개 (전체 {result.length.toLocaleString()}개는 다운로드로 확인)
                    </p>
                  )}
                </div>
              )}
            </div>
          </section>
        )}

        {/* === HOW TO USE (SEO) === */}
        <section className="mt-20 grid md:grid-cols-2 gap-10">
          <div>
            <h2 className="text-xl font-display font-700 text-white mb-5">{T.howTitle}</h2>
            <ol className="space-y-3">
              {[T.how1, T.how2, T.how3, T.how4].map((step, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-400 text-sm">
                  <span className="mt-0.5 w-5 h-5 rounded-full bg-brand-500/15 text-brand-400 text-xs flex items-center justify-center font-mono flex-shrink-0">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>

          <div>
            <h2 className="text-xl font-display font-700 text-white mb-5">{T.faqTitle}</h2>
            <div className="space-y-3">
              {T.faq.map((item, i) => (
                <details key={i} className="group rounded-lg border border-surface-border bg-surface-card overflow-hidden">
                  <summary className="flex items-center justify-between px-4 py-3 cursor-pointer text-sm text-slate-300 hover:text-white list-none">
                    {item.q}
                    <ChevronDown size={14} className="text-slate-600 group-open:rotate-180 transition-transform" />
                  </summary>
                  <p className="px-4 pb-3 text-sm text-slate-500 leading-relaxed">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* SEO long-tail keyword block (hidden visually, visible to crawlers) */}
        <section className="mt-16 p-6 rounded-xl border border-surface-border/30 bg-surface-card/20">
          <h2 className="text-base font-semibold text-slate-400 mb-3">관련 도구 및 키워드</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            키워드 조합기 · 키워드 믹서 · SEO 키워드 생성기 · 네이버 키워드 조합 · 구글 키워드 조합 ·
            롱테일 키워드 생성 · 쇼핑 키워드 조합 · 유튜브 태그 생성기 · 키워드 순열 생성기 ·
            keyword combiner · keyword mixer · SEO keyword tool · long tail keyword generator ·
            Google Ads keyword tool · bulk keyword generator · keyword permutation tool ·
            free keyword research tool · Naver SEO tool · Coupang keyword tool
          </p>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-surface-border/50 py-8 mt-10">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-slate-600 text-sm">
            © {new Date().getFullYear()} <span className="text-brand-500">Keyword</span>Mixer —{' '}
            {T.madeWith}
          </p>
          <p className="text-slate-700 text-xs mt-2">
            keywordmixer.app · 키워드 조합기 · keyword combiner · SEO tool
          </p>
        </div>
      </footer>
    </div>
  )
}

/* ---- Sub-component: single result row with copy-on-click ---- */
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
        {copied ? (
          <CheckCheck size={12} className="text-brand-400" />
        ) : (
          <Copy size={12} className="text-slate-700 opacity-0 group-hover/row:opacity-100 transition-opacity" />
        )}
      </td>
    </tr>
  )
}
