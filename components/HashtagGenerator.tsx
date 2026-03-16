'use client'

import { useState } from 'react'
import { Copy, CheckCheck } from 'lucide-react'

const PLATFORMS = ['인스타그램', '유튜브', '트위터/X', '틱톡', '페이스북']

const POPULAR: Record<string, string[]> = {
  '일상': ['#일상', '#daily', '#오늘의일상', '#일상스타그램', '#소통'],
  '맛집': ['#맛집', '#먹스타그램', '#맛스타그램', '#foodstagram', '#맛집추천'],
  '여행': ['#여행', '#여행스타그램', '#travel', '#여행스타', '#국내여행'],
  '패션': ['#패션', '#ootd', '#오오티디', '#패션스타그램', '#데일리룩'],
  '운동': ['#운동', '#헬스', '#다이어트', '#fitness', '#workout'],
}

export default function HashtagGenerator() {
  const [keywords, setKeywords] = useState('')
  const [platform, setPlatform] = useState('인스타그램')
  const [hashtags, setHashtags] = useState<string[]>([])
  const [copied, setCopied] = useState(false)
  const [generated, setGenerated] = useState(false)

  const generate = () => {
    const words = keywords.split(/[\n,]+/).map(k => k.trim()).filter(k => k.length > 0)
    const result = new Set<string>()

    words.forEach(w => {
      result.add(`#${w.replace(/\s+/g, '')}`)
      result.add(`#${w.replace(/\s+/g, '_')}`)
      result.add(`#${w}스타그램`)
      result.add(`#${w}추천`)
    })

    // 2단어 조합
    for (let i = 0; i < Math.min(words.length, 5); i++) {
      for (let j = 0; j < Math.min(words.length, 5); j++) {
        if (i !== j) {
          result.add(`#${words[i].replace(/\s+/g, '')}${words[j].replace(/\s+/g, '')}`)
        }
      }
    }

    // 인기 태그 추가
    words.forEach(w => {
      if (POPULAR[w]) {
        POPULAR[w].forEach(tag => result.add(tag))
      }
    })

    setHashtags(Array.from(result).slice(0, 30))
    setGenerated(true)
  }

  const copyAll = async () => {
    await navigator.clipboard.writeText(hashtags.join(' '))
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const removeTag = (idx: number) => setHashtags(prev => prev.filter((_, i) => i !== idx))

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-mono mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
          Free Tool
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-3 tracking-tight">해시태그 생성기</h1>
        <p className="text-slate-400 text-base max-w-lg mx-auto">
          키워드 입력으로 인스타그램·유튜브·틱톡 최적화 해시태그를 자동 생성하세요.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Input */}
        <div className="rounded-xl border border-surface-border bg-surface-card p-5 flex flex-col gap-4">
          <h2 className="text-sm font-semibold text-slate-200">입력</h2>

          {/* Platform */}
          <div>
            <label className="text-xs text-slate-500 mb-2 block font-medium">플랫폼</label>
            <div className="flex flex-wrap gap-1.5">
              {PLATFORMS.map(p => (
                <button
                  key={p}
                  onClick={() => setPlatform(p)}
                  className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                    platform === p
                      ? 'bg-brand-500 border-brand-500 text-black font-bold'
                      : 'border-surface-border text-slate-400 hover:border-brand-500/40 hover:text-brand-300'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Keywords */}
          <div>
            <label className="text-xs text-slate-500 mb-1.5 block font-medium">키워드 (한 줄에 하나씩)</label>
            <textarea
              value={keywords}
              onChange={e => setKeywords(e.target.value)}
              placeholder={"맛집\n서울\n여행\n일상"}
              rows={8}
              className="w-full bg-surface-DEFAULT border border-surface-border rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-brand-500/50 transition-all resize-none font-mono"
            />
          </div>

          <button
            onClick={generate}
            disabled={!keywords.trim()}
            className="w-full py-3 rounded-xl bg-brand-500 hover:bg-brand-400 disabled:opacity-40 disabled:cursor-not-allowed text-black font-bold text-sm transition-all shadow-[0_4px_15px_rgba(34,197,94,0.3)]"
          >
            해시태그 생성하기
          </button>
        </div>

        {/* Result */}
        <div className="rounded-xl border border-surface-border bg-surface-card p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-200">
              생성된 해시태그 {generated && <span className="text-brand-400 font-mono">{hashtags.length}개</span>}
            </h2>
            {generated && (
              <button onClick={copyAll} className={`flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg border transition-all ${
                copied ? 'bg-brand-500/20 border-brand-500/40 text-brand-400' : 'border-surface-border text-slate-400 hover:border-brand-500/40 hover:text-brand-300'
              }`}>
                {copied ? <CheckCheck size={12} /> : <Copy size={12} />}
                {copied ? '복사됨' : '전체 복사'}
              </button>
            )}
          </div>

          {generated ? (
            <div className="flex flex-wrap gap-2">
              {hashtags.map((tag, i) => (
                <span key={i} className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg bg-surface-DEFAULT border border-brand-500/20 text-brand-300 hover:border-brand-500/40 transition-all">
                  {tag}
                  <button onClick={() => removeTag(i)} className="text-slate-600 hover:text-red-400 transition-all ml-0.5">×</button>
                </span>
              ))}
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-600 text-sm min-h-[200px]">
              키워드를 입력하고 해시태그를 생성하세요
            </div>
          )}
        </div>
      </div>

      {/* SEO block */}
      <div className="mt-16 p-6 rounded-xl border border-surface-border/30 bg-surface-card/20">
        <p className="text-xs text-slate-600 leading-relaxed">
          해시태그 생성기 · 인스타그램 해시태그 · 유튜브 해시태그 · 틱톡 해시태그 · 해시태그 추천 ·
          hashtag generator · instagram hashtag generator · free hashtag tool · hashtag maker
        </p>
      </div>
    </div>
  )
}
