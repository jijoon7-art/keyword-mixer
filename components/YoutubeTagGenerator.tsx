'use client'

import { useState } from 'react'
import { Copy, CheckCheck, RotateCcw, Plus } from 'lucide-react'

export default function YoutubeTagGenerator() {
  const [title, setTitle] = useState('')
  const [keywords, setKeywords] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [copied, setCopied] = useState(false)
  const [generated, setGenerated] = useState(false)

  const generate = () => {
    const titleWords = title.split(/[\s,]+/).filter(w => w.length > 1)
    const keywordList = keywords.split(/[\n,]+/).map(k => k.trim()).filter(k => k.length > 0)

    const generated = new Set<string>()

    // 직접 키워드
    keywordList.forEach(k => generated.add(k))

    // 제목 단어 조합
    titleWords.forEach(w => generated.add(w))

    // 제목 전체
    if (title.trim()) generated.add(title.trim())

    // 2단어 조합
    for (let i = 0; i < keywordList.length; i++) {
      for (let j = 0; j < keywordList.length; j++) {
        if (i !== j && keywordList[i].length > 0 && keywordList[j].length > 0) {
          generated.add(`${keywordList[i]} ${keywordList[j]}`)
        }
      }
    }

    // 제목 + 키워드 조합
    titleWords.slice(0, 3).forEach(w => {
      keywordList.slice(0, 5).forEach(k => {
        generated.add(`${w} ${k}`)
        generated.add(`${k} ${w}`)
      })
    })

    setTags(Array.from(generated).slice(0, 30))
    setGenerated(true)
  }

  const copyAll = async () => {
    await navigator.clipboard.writeText(tags.join(', '))
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const removeTag = (idx: number) => {
    setTags(prev => prev.filter((_, i) => i !== idx))
  }

  const totalChars = tags.join(', ').length

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-mono mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
          Free Tool
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-3 tracking-tight">유튜브 태그 생성기</h1>
        <p className="text-slate-400 text-base max-w-lg mx-auto">
          제목과 키워드로 유튜브 SEO 최적화 태그를 자동 생성하세요.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Input */}
        <div className="rounded-xl border border-surface-border bg-surface-card p-5 flex flex-col gap-4">
          <h2 className="text-sm font-semibold text-slate-200">입력</h2>

          <div>
            <label className="text-xs text-slate-500 mb-1.5 block font-medium">영상 제목</label>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="예: 2026 맛집 추천 서울 강남"
              className="w-full bg-surface-DEFAULT border border-surface-border rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-brand-500/50 transition-all"
            />
          </div>

          <div>
            <label className="text-xs text-slate-500 mb-1.5 block font-medium">핵심 키워드 (한 줄에 하나씩)</label>
            <textarea
              value={keywords}
              onChange={e => setKeywords(e.target.value)}
              placeholder={"맛집\n강남\n서울 여행\n음식 추천"}
              rows={8}
              className="w-full bg-surface-DEFAULT border border-surface-border rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-brand-500/50 transition-all resize-none font-mono"
            />
          </div>

          <button
            onClick={generate}
            disabled={!title && !keywords}
            className="w-full py-3 rounded-xl bg-brand-500 hover:bg-brand-400 disabled:opacity-40 disabled:cursor-not-allowed text-black font-bold text-sm transition-all shadow-[0_4px_15px_rgba(34,197,94,0.3)]"
          >
            태그 생성하기
          </button>
        </div>

        {/* Result */}
        <div className="rounded-xl border border-surface-border bg-surface-card p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-200">
              생성된 태그 {generated && <span className="text-brand-400 font-mono">{tags.length}개</span>}
            </h2>
            {generated && (
              <div className="flex gap-2">
                <span className={`text-xs font-mono ${totalChars > 500 ? 'text-red-400' : 'text-slate-500'}`}>
                  {totalChars}/500자
                </span>
                <button onClick={copyAll} className={`flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg border transition-all ${
                  copied ? 'bg-brand-500/20 border-brand-500/40 text-brand-400' : 'border-surface-border text-slate-400 hover:border-brand-500/40 hover:text-brand-300'
                }`}>
                  {copied ? <CheckCheck size={12} /> : <Copy size={12} />}
                  {copied ? '복사됨' : '전체 복사'}
                </button>
              </div>
            )}
          </div>

          {generated ? (
            <div className="flex flex-wrap gap-2 flex-1">
              {tags.map((tag, i) => (
                <span
                  key={i}
                  className="group flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg bg-surface-DEFAULT border border-surface-border text-slate-300 hover:border-brand-500/40 transition-all"
                >
                  {tag}
                  <button onClick={() => removeTag(i)} className="text-slate-600 hover:text-red-400 transition-all ml-0.5">×</button>
                </span>
              ))}
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-600 text-sm">
              제목과 키워드를 입력하고 태그를 생성하세요
            </div>
          )}

          {totalChars > 500 && (
            <p className="text-xs text-red-400">⚠ 유튜브 태그 최대 500자 초과. 일부 태그를 삭제하세요.</p>
          )}
        </div>
      </div>

      {/* SEO block */}
      <div className="mt-16 p-6 rounded-xl border border-surface-border/30 bg-surface-card/20">
        <p className="text-xs text-slate-600 leading-relaxed">
          유튜브 태그 생성기 · 유튜브 태그 추천 · 유튜브 SEO · 유튜브 태그 추출 · 유튜브 키워드 ·
          YouTube tag generator · YouTube SEO tool · YouTube tags · free YouTube tag generator
        </p>
      </div>
    </div>
  )
}
