import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '퇴직금 계산 방법 완벽 가이드 2025 — 평균임금·퇴직소득세·IRP | Keyword Mixer',
  description: '2025년 퇴직금 계산 방법 완벽 가이드. 평균임금 계산법, 퇴직소득세 공제, IRP 절세 혜택까지 단계별로 설명. 1년 미만 퇴직금, 상여금 포함 방법도 확인하세요.',
  keywords: '퇴직금 계산 방법, 평균임금 계산, 퇴직소득세 계산, IRP 퇴직금, 퇴직금 공식, 1년 미만 퇴직금, 상여금 퇴직금',
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://keyword-mixer.vercel.app/guide/severance-pay-guide' },
  openGraph: {
    title: '퇴직금 계산 방법 완벽 가이드 2025',
    description: '평균임금 계산부터 퇴직소득세, IRP 절세까지 단계별 설명',
    url: 'https://keyword-mixer.vercel.app/guide/severance-pay-guide',
    type: 'article',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: '퇴직금 계산 방법 완벽 가이드 2025',
  description: '2025년 퇴직금 계산 방법. 평균임금 계산법, 퇴직소득세, IRP 절세 혜택.',
  url: 'https://keyword-mixer.vercel.app/guide/severance-pay-guide',
  author: { '@type': 'Organization', name: 'Keyword Mixer' },
  publisher: { '@type': 'Organization', name: 'Keyword Mixer' },
  dateModified: '2025-04-01',
  inLanguage: 'ko',
}

export default function SeverancePayGuide() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* 브레드크럼 */}
      <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
        <Link href="/" className="hover:text-brand-400 transition-all">홈</Link>
        <span>›</span>
        <Link href="/guide" className="hover:text-brand-400 transition-all">가이드</Link>
        <span>›</span>
        <span className="text-slate-400">퇴직금 계산 방법</span>
      </div>

      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs mb-4">
          💰 금융 가이드 · 2025년 기준
        </div>
        <h1 className="text-3xl font-extrabold text-white mb-4">퇴직금 계산 방법 완벽 가이드</h1>
        <p className="text-slate-300 leading-relaxed">
          퇴직금은 근로자퇴직급여보장법에 따라 1년 이상 근무한 근로자에게 지급되는 법정 급여입니다.
          이 가이드에서는 퇴직금 계산 공식, 평균임금 산정, 퇴직소득세, IRP 절세 방법까지
          단계별로 알기 쉽게 설명합니다.
        </p>
      </div>

      {/* 빠른 계산기 링크 */}
      <div className="rounded-xl border border-brand-500/30 bg-brand-500/10 p-4 mb-8 flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-brand-300 mb-1">🔢 퇴직금 바로 계산하기</p>
          <p className="text-xs text-slate-400">입사일과 월급만 입력하면 즉시 계산됩니다</p>
        </div>
        <Link href="/severance-pay"
          className="px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-400 text-white text-xs font-bold transition-all flex-shrink-0">
          계산기 열기 →
        </Link>
      </div>

      <div className="prose prose-invert max-w-none space-y-10 text-slate-300">

        {/* 1. 퇴직금 기본 조건 */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">1. 퇴직금 받는 조건</h2>
          <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-5 mb-4">
            <h3 className="text-brand-400 font-semibold mb-3">✅ 퇴직금 발생 요건</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-brand-400 font-bold flex-shrink-0">①</span>
                <span><strong className="text-slate-200">계속 근로기간 1년 이상</strong> — 입사일부터 퇴직일까지 1년(365일) 이상 근무해야 합니다.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-400 font-bold flex-shrink-0">②</span>
                <span><strong className="text-slate-200">주 15시간 이상 근무</strong> — 주당 소정 근로시간이 15시간 이상이어야 합니다. 단기 아르바이트도 이 조건을 충족하면 퇴직금이 발생합니다.</span>
              </li>
            </ul>
          </div>
          <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-4">
            <p className="text-yellow-300 text-sm font-semibold mb-1">⚠️ 1년 미만 근무 시</p>
            <p className="text-sm text-slate-400">1년 미만 근무 시 퇴직금이 발생하지 않습니다. 단, 계약직의 경우 계약 만료 시점에 1년을 충족하면 지급됩니다.</p>
          </div>
        </section>

        {/* 2. 퇴직금 계산 공식 */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">2. 퇴직금 계산 공식</h2>
          <div className="rounded-xl border border-brand-500/30 bg-[#1a1d27] p-5 mb-4">
            <p className="text-xs text-slate-400 mb-2 font-mono">퇴직금 계산 공식</p>
            <p className="text-lg font-bold text-brand-400 font-mono mb-3">
              퇴직금 = 1일 평균임금 × 30일 × (재직일수 ÷ 365)
            </p>
            <div className="border-t border-surface-border pt-3 mt-3">
              <p className="text-xs text-slate-500">예시: 월급 350만원, 5년 근무 시</p>
              <p className="text-xs text-slate-400 font-mono mt-1">
                1일 평균임금 = (350만원 × 3개월) ÷ 90일 ≈ 116,667원<br />
                퇴직금 = 116,667원 × 30일 × (1825일 ÷ 365) = <span className="text-brand-400 font-bold">약 1,750만원</span>
              </p>
            </div>
          </div>
        </section>

        {/* 3. 평균임금 계산 */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">3. 평균임금 계산 방법</h2>
          <p className="text-sm mb-4">평균임금은 퇴직 전 3개월간 받은 임금 총액을 그 기간의 총 일수(보통 90~92일)로 나눈 금액입니다.</p>
          <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-5 mb-4">
            <h3 className="text-sm font-bold text-slate-200 mb-3">평균임금에 포함되는 항목</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: '✅ 포함', items: ['기본급', '직책수당', '식대 (통상적 지급)', '교통비 (통상적 지급)', '연장·야간·휴일근로수당', '상여금 (연간 총액 ÷ 12 × 3개월분)'], color: 'brand' },
                { label: '❌ 미포함', items: ['실비 변상적 수당 (출장비 등)', '결혼·조의금 등 일시 지급금', '4대보험 회사 부담분', '퇴직금 자체'], color: 'red' },
              ].map(g => (
                <div key={g.label} className={`rounded-lg border p-3 ${g.color === 'brand' ? 'border-brand-500/30 bg-brand-500/5' : 'border-red-500/30 bg-red-500/5'}`}>
                  <p className={`text-xs font-bold mb-2 ${g.color === 'brand' ? 'text-brand-400' : 'text-red-400'}`}>{g.label}</p>
                  <ul className="space-y-1">
                    {g.items.map(item => <li key={item} className="text-xs text-slate-400">{item}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-4">
            <p className="text-blue-300 text-sm font-semibold mb-1">💡 상여금 반영 방법</p>
            <p className="text-sm text-slate-400">연간 상여금을 12로 나누고 3을 곱해 3개월치를 평균임금에 추가합니다.</p>
            <p className="text-xs font-mono text-blue-400 mt-1">예: 연간 상여금 600만원 → (600만원 ÷ 12) × 3 = 150만원 추가</p>
          </div>
        </section>

        {/* 4. 퇴직소득세 */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">4. 퇴직소득세 계산</h2>
          <p className="text-sm mb-4">퇴직금에는 소득세와 지방소득세(소득세의 10%)가 부과됩니다. 근속연수가 길수록 공제가 커져 세금이 줄어듭니다.</p>
          <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-5">
            <h3 className="text-sm font-bold text-slate-200 mb-3">근속연수 공제액</h3>
            <div className="space-y-2">
              {[
                { years: '5년 이하', deduct: '30만원 × 근속연수' },
                { years: '5년 초과~10년 이하', deduct: '150만원 + 50만원 × (근속연수 - 5년)' },
                { years: '10년 초과~20년 이하', deduct: '400만원 + 80만원 × (근속연수 - 10년)' },
                { years: '20년 초과', deduct: '1,200만원 + 120만원 × (근속연수 - 20년)' },
              ].map(r => (
                <div key={r.years} className="flex justify-between text-xs py-1.5 border-b border-surface-border last:border-0">
                  <span className="text-slate-400">{r.years}</span>
                  <span className="text-slate-200 font-mono">{r.deduct}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. IRP */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">5. IRP로 퇴직소득세 55% 절감</h2>
          <div className="rounded-xl border border-purple-500/30 bg-purple-500/10 p-5">
            <h3 className="text-purple-300 font-semibold mb-3">IRP(개인형 퇴직연금) 절세 효과</h3>
            <div className="space-y-3 text-sm">
              <p>퇴직금을 IRP 계좌로 이전하면 <strong className="text-purple-300">퇴직소득세의 55%를 절감</strong>할 수 있습니다.</p>
              <div className="grid grid-cols-2 gap-3 mt-3">
                <div className="rounded-lg border border-purple-500/20 bg-[#1a1d27] p-3">
                  <p className="text-xs text-slate-400 mb-1">IRP 미이전 시</p>
                  <p className="text-sm font-bold text-red-400">퇴직소득세 100% 납부</p>
                </div>
                <div className="rounded-lg border border-purple-500/20 bg-[#1a1d27] p-3">
                  <p className="text-xs text-slate-400 mb-1">IRP 이전 후 55세 이후 수령</p>
                  <p className="text-sm font-bold text-purple-400">연금소득세 3.3~5.5%만 납부</p>
                </div>
              </div>
              <p className="text-xs text-slate-500">※ IRP 계좌는 55세 이후 수령 시 세금 혜택이 발생합니다. 중도 해지 시 불이익이 있습니다.</p>
            </div>
          </div>
        </section>

        {/* 6. 자주 묻는 질문 */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">6. 자주 묻는 질문 (FAQ)</h2>
          <div className="space-y-3">
            {[
              { q: '아르바이트도 퇴직금을 받을 수 있나요?', a: '네. 1년 이상 주 15시간 이상 근무한 아르바이트 근로자도 퇴직금을 받을 권리가 있습니다. 사업주가 이를 거부하면 고용노동부에 신고할 수 있습니다.' },
              { q: '퇴직금은 언제까지 지급받아야 하나요?', a: '퇴직일로부터 14일 이내에 지급해야 합니다. 특별한 사정이 있는 경우 당사자 합의로 연장할 수 있습니다.' },
              { q: '퇴직금 중간정산이 가능한가요?', a: '무주택자의 주택 구입, 본인·배우자·부양가족의 6개월 이상 요양, 파산·회생절차 개시 등 법에 정해진 경우에만 중간정산이 가능합니다.' },
              { q: '계약직 근로자도 퇴직금이 있나요?', a: '네. 계약직도 동일하게 1년 이상 근무하면 퇴직금이 발생합니다. 계약 갱신으로 1년을 초과한 경우에도 마찬가지입니다.' },
              { q: '퇴직금과 실업급여를 동시에 받을 수 있나요?', a: '네. 퇴직금과 실업급여는 별개입니다. 퇴직금은 사용자(회사)가 지급하고, 실업급여는 고용보험에서 지급됩니다.' },
            ].map((faq, i) => (
              <div key={i} className="rounded-xl border border-surface-border bg-[#1a1d27] p-4">
                <p className="text-sm font-bold text-slate-200 mb-2">Q. {faq.q}</p>
                <p className="text-sm text-slate-400 leading-relaxed">A. {faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="rounded-xl border border-brand-500/30 bg-brand-500/10 p-6 text-center">
          <p className="text-lg font-bold text-white mb-2">내 퇴직금 직접 계산해보기</p>
          <p className="text-sm text-slate-400 mb-4">입사일, 퇴직일, 월급만 입력하면 퇴직소득세까지 자동 계산됩니다</p>
          <Link href="/severance-pay"
            className="inline-block px-8 py-3 rounded-xl bg-brand-500 hover:bg-brand-400 text-white font-bold transition-all">
            퇴직금 계산기 열기 →
          </Link>
        </div>

        <div className="border-t border-surface-border pt-4 text-xs text-slate-600">
          본 가이드는 일반적인 정보 제공을 목적으로 하며, 개인 상황에 따라 다를 수 있습니다.
          정확한 퇴직금 계산은 고용노동부(moel.go.kr) 또는 노무사에게 확인하세요.
        </div>
      </div>
    </div>
  )
}
