'use client'

import { useState } from 'react'
import { Copy, CheckCheck, RotateCcw } from 'lucide-react'

const PRESETS = {
  source: ['google', 'naver', 'kakao', 'facebook', 'instagram', 'youtube', 'newsletter', 'direct'],
  medium: ['cpc', 'organic', 'social', 'email', 'banner', 'affiliate', 'referral'],
  campaign: ['sale', 'brand', 'seasonal', 'launch', 'retargeting', 'awareness'],
}

export default function UtmBuilder() {
  const [url, setUrl] = useState('')
  const [source, setSource] = useState('')
  const [medium, setMedium] = useState('')
  const [campaign, setCampaign] = useState('')
  const [term, setTerm] = useState('')
  const [content, setContent] = useState('')
  const [copied, setCopied] = useState(false)

  const buildUrl = () => {
    if (!url) return ''
    const params = new URLSearchParams()
    if (source) params.set('utm_source', source)
    if (medium) params.set('utm_medium', medium)
    if (campaign) params.set('utm_campaign', campaign)
    if (term) params.set('utm_term', term)
    if (content) params.set('utm_content', content)
    const query = params.toString()
    if (!query) return url
    const separator = url.includes('?') ? '&' : '?'
    return `${url}${separator}${query}`
  }

  const result = buildUrl()

  const copy = async () => {
    if (!result) return
    await navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const reset = () => {
    setUrl(''); setSource(''); setMedium('')
    setCampaign(''); setTerm(''); setContent('')
  }

  const fields = [
    { label: 'URL *', value: url, set: setUrl, placeholder: 'https://example.com', preset: null, required: true },
    { label: 'utm_source *', value: source, set: setSource, placeholder: 'google, naver, kakao...', preset: 'source', required: true },
    { label: 'utm_medium *', value: medium, set: setMedium, placeholder: 'cpc, social, email...', preset: 'medium', required: true },
    { label: 'utm_campaign *', value: campaign, set: setCampaign, placeholder: 'sale, brand, launch...', preset: 'campaign', required: true },
    { label: 'utm_term', value: term, set: setTerm, placeholder: '키워드 (선택)', preset: null, required: false },
    { label: 'utm_content', value: content, set: setContent, placeholder: '광고 구분 (선택)', preset: null, required: false },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Hero */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-mono mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
          Free Tool
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-3 tracking-tight">UTM Builder</h1>
        <p className="text-slate-400 text-base max-w-lg mx-auto">
          UTM 파라미터 링크 자동 생성. 구글 애널리틱스 캠페인 추적용 URL을 빠르게 만드세요.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Input fields */}
        <div className="rounded-xl border border-surface-border bg-surface-card p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-200">파라미터 입력</h2>
            <button onClick={reset} className="text-xs text-slate-500 hover:text-red-400 flex items-center gap-1 transition-all">
              <RotateCcw size={12} /> 초기화
            </button>
          </div>

          {fields.map((f) => (
            <div key={f.label}>
              <label className="text-xs text-slate-500 mb-1.5 block font-medium">{f.label}</label>
              <input
                value={f.value}
                onChange={(e) => f.set(e.target.value)}
                placeholder={f.placeholder}
                className="w-full bg-surface-DEFAULT border border-surface-border rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/20 transition-all"
              />
              {f.preset && (
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {PRESETS[f.preset as keyof typeof PRESETS].map((p) => (
                    <button
                      key={p}
                      onClick={() => f.set(p)}
                      className={`text-xs px-2 py-0.5 rounded border transition-all ${
                        f.value === p
                          ? 'bg-brand-500 border-brand-500 text-white font-bold'
                          : 'border-surface-border text-slate-500 hover:text-brand-400 hover:border-brand-500/40'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Result */}
        <div className="flex flex-col gap-4">
          <div className="rounded-xl border border-surface-border bg-surface-card p-5 flex flex-col gap-3 flex-1">
            <h2 className="text-sm font-semibold text-slate-200">생성된 URL</h2>
            <div className="flex-1 min-h-[120px] bg-surface-DEFAULT rounded-lg p-3 text-sm font-mono text-slate-300 break-all leading-relaxed border border-surface-border">
              {result || <span className="text-slate-600">URL을 입력하면 자동으로 생성됩니다</span>}
            </div>
            <button
              onClick={copy}
              disabled={!result}
              className={`w-full py-2.5 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                copied
                  ? 'bg-brand-500/20 border border-brand-500/40 text-brand-400'
                  : result
                  ? 'bg-brand-500 hover:bg-brand-400 text-white shadow-[0_4px_15px_rgba(34,197,94,0.3)]'
                  : 'bg-surface-border text-slate-600 cursor-not-allowed'
              }`}
            >
              {copied ? <><CheckCheck size={15} /> 복사됨!</> : <><Copy size={15} /> URL 복사</>}
            </button>
          </div>

          {/* Guide */}
          <div className="rounded-xl border border-surface-border bg-surface-card p-5">
            <h3 className="text-xs font-semibold text-slate-400 mb-3">파라미터 설명</h3>
            <dl className="space-y-2 text-xs">
              {[
                { k: 'utm_source', v: '유입 출처 (google, naver)' },
                { k: 'utm_medium', v: '마케팅 채널 (cpc, social)' },
                { k: 'utm_campaign', v: '캠페인 이름 (sale, brand)' },
                { k: 'utm_term', v: '검색 키워드 (유료광고)' },
                { k: 'utm_content', v: '광고 소재 구분' },
              ].map(({ k, v }) => (
                <div key={k} className="flex gap-2">
                  <dt className="text-brand-400 font-mono w-28 flex-shrink-0">{k}</dt>
                  <dd className="text-slate-500">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* SEO block */}
      <div className="mt-16 p-6 rounded-xl border border-surface-border/30 bg-surface-card/20">
        <p className="text-xs text-slate-600 leading-relaxed">
          UTM 빌더 · UTM 링크 생성기 · UTM 파라미터 생성 · 구글 애널리틱스 UTM · 캠페인 URL 생성기 ·
          utm_source · utm_medium · utm_campaign · UTM builder · UTM generator · campaign URL builder ·
          Google Analytics UTM · marketing URL builder
        </p>
      </div>
    </div>
  )
}
