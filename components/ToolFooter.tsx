'use client'

import { useState } from 'react'
import ShareButtons from './ShareButtons'
import { ChevronDown, ChevronUp, Send } from 'lucide-react'

interface FAQItem {
  q: string
  a: string
}

interface ToolFooterProps {
  // 도구 기본 정보
  toolName: string
  toolUrl: string
  description: string

  // 사용 방법
  howToUse: { step: string; desc: string }[]

  // 이 도구가 필요한 이유
  whyUse: { title: string; desc: string }[]

  // FAQ
  faqs: FAQItem[]

  // SEO 키워드
  keywords: string
}

export default function ToolFooter({
  toolName, toolUrl, description,
  howToUse, whyUse, faqs, keywords
}: ToolFooterProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [feedback, setFeedback] = useState('')
  const [feedbackTool, setFeedbackTool] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleFeedback = async () => {
    if (!feedback.trim()) return
    setSubmitting(true)
    try {
      // Supabase 연동 전까지 localStorage에 임시 저장
      const existing = JSON.parse(localStorage.getItem('km_feedback') ?? '[]')
      existing.push({
        tool: feedbackTool || toolName,
        message: feedback,
        created_at: new Date().toISOString(),
      })
      localStorage.setItem('km_feedback', JSON.stringify(existing))
      setSubmitted(true)
      setFeedback('')
    } catch {
      setSubmitted(true)
    }
    setSubmitting(false)
  }

  return (
    <div className="mt-12 flex flex-col gap-4">

      {/* ── 사용 방법 ── */}
      <div className="rounded-xl border border-surface-border bg-[#1a1d27] overflow-hidden">
        <div className="px-5 py-3 border-b border-surface-border bg-[#0f1117]">
          <h2 className="text-sm font-bold text-slate-200">📖 사용 방법</h2>
        </div>
        <div className="p-4">
          <div className="grid gap-2">
            {howToUse.map((item, i) => (
              <div key={i} className="flex gap-3 items-start p-3 rounded-lg bg-[#0f1117] border border-surface-border">
                <span className="w-6 h-6 rounded-full bg-brand-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                <div>
                  <p className="text-sm font-semibold text-slate-200">{item.step}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 이 도구가 필요한 이유 ── */}
      <div className="rounded-xl border border-surface-border bg-[#1a1d27] overflow-hidden">
        <div className="px-5 py-3 border-b border-surface-border bg-[#0f1117]">
          <h2 className="text-sm font-bold text-slate-200">💡 이 도구가 필요한 이유</h2>
        </div>
        <div className="p-4">
          <div className="grid sm:grid-cols-2 gap-2">
            {whyUse.map((item, i) => (
              <div key={i} className="p-3 rounded-lg bg-[#0f1117] border border-surface-border">
                <p className="text-sm font-semibold text-brand-400 mb-1">{item.title}</p>
                <p className="text-xs text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── FAQ ── */}
      <div className="rounded-xl border border-surface-border bg-[#1a1d27] overflow-hidden">
        <div className="px-5 py-3 border-b border-surface-border bg-[#0f1117]">
          <h2 className="text-sm font-bold text-slate-200">❓ 자주 묻는 질문 (FAQ)</h2>
        </div>
        <div className="p-4 flex flex-col gap-2">
          {faqs.map((faq, i) => (
            <div key={i} className="rounded-lg border border-surface-border overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-surface-hover/20 transition-all"
              >
                <span className="text-sm font-medium text-slate-200">{faq.q}</span>
                {openFaq === i
                  ? <ChevronUp size={14} className="text-brand-400 flex-shrink-0" />
                  : <ChevronDown size={14} className="text-slate-500 flex-shrink-0" />
                }
              </button>
              {openFaq === i && (
                <div className="px-4 pb-3 bg-[#0f1117]">
                  <p className="text-sm text-slate-400 leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── 공유 버튼 ── */}
      <ShareButtons title={`${toolName} — 무료 온라인 도구 | Keyword Mixer`} description={description} />

      {/* ── 피드백 폼 ── */}
      <div className="rounded-xl border border-brand-500/20 bg-brand-500/5 p-5">
        <h2 className="text-sm font-bold text-slate-200 mb-1">💬 필요한 도구를 알려주세요</h2>
        <p className="text-xs text-slate-500 mb-3">원하는 기능이나 개선점을 자유롭게 남겨주세요. 실제로 반영합니다!</p>

        {submitted ? (
          <div className="text-center py-4">
            <p className="text-brand-400 font-medium text-sm">✅ 소중한 의견 감사합니다!</p>
            <p className="text-xs text-slate-500 mt-1">빠르게 반영하도록 노력할게요 😊</p>
            <button onClick={() => setSubmitted(false)} className="mt-3 text-xs text-slate-500 hover:text-brand-400 transition-all underline">
              한 번 더 남기기
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <input
              value={feedbackTool}
              onChange={e => setFeedbackTool(e.target.value)}
              placeholder="어떤 도구가 필요하신가요? (선택)"
              className="w-full bg-[#0f1117] border border-surface-border rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-brand-500/50 transition-all"
            />
            <div className="flex gap-2">
              <textarea
                value={feedback}
                onChange={e => setFeedback(e.target.value)}
                placeholder="자유롭게 의견을 남겨주세요. 예: &quot;일본어 번역기 있으면 좋겠어요&quot;"
                rows={2}
                className="flex-1 bg-[#0f1117] border border-surface-border rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-brand-500/50 transition-all resize-none"
              />
              <button
                onClick={handleFeedback}
                disabled={!feedback.trim() || submitting}
                className="px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-400 disabled:opacity-40 text-white font-bold text-sm transition-all flex items-center gap-1.5 self-end"
              >
                <Send size={13} />
                {submitting ? '...' : '전송'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* SEO 키워드 */}
      <div className="p-4 rounded-xl border border-surface-border/20 bg-[#1a1d27]/30">
        <p className="text-xs text-slate-600 leading-relaxed">{keywords}</p>
      </div>
    </div>
  )
}
