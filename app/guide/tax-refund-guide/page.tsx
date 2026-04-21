import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '연말정산 환급액 계산 방법 2025 — 공제 항목·절세 전략 완벽 가이드 | Keyword Mixer',
  description: '2025년 연말정산 환급액 계산 방법 완벽 가이드. 근로소득공제·인적공제·의료비·교육비·신용카드 공제 항목별 절세 전략. 연금저축 세액공제로 환급액 최대화하는 법.',
  keywords: '연말정산 계산 방법, 연말정산 공제 항목, 연말정산 환급액 계산, 연금저축 세액공제, 의료비 공제, 교육비 공제, 신용카드 공제, 연말정산 절세',
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://keyword-mixer.vercel.app/guide/tax-refund-guide' },
  openGraph: {
    title: '연말정산 환급액 계산 방법 2025 완벽 가이드',
    description: '공제 항목별 절세 전략과 환급액 최대화 방법',
    url: 'https://keyword-mixer.vercel.app/guide/tax-refund-guide',
    type: 'article',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: '연말정산 환급액 계산 방법 2025 완벽 가이드',
  description: '연말정산 공제 항목별 설명과 환급액 최대화 전략.',
  url: 'https://keyword-mixer.vercel.app/guide/tax-refund-guide',
  author: { '@type': 'Organization', name: 'Keyword Mixer' },
  publisher: { '@type': 'Organization', name: 'Keyword Mixer' },
  dateModified: '2025-04-01',
  inLanguage: 'ko',
}

export default function TaxRefundGuide() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
        <Link href="/" className="hover:text-brand-400 transition-all">홈</Link>
        <span>›</span>
        <Link href="/guide" className="hover:text-brand-400 transition-all">가이드</Link>
        <span>›</span>
        <span className="text-slate-400">연말정산 가이드</span>
      </div>

      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs mb-4">
          💰 세금 가이드 · 2025년 기준
        </div>
        <h1 className="text-3xl font-extrabold text-white mb-4">연말정산 환급액 계산 방법 2025</h1>
        <p className="text-slate-300 leading-relaxed">
          연말정산은 1년 동안 원천징수된 세금과 실제 납부해야 할 세금을 비교해 차액을 환급받거나 추가 납부하는 절차입니다.
          공제 항목을 최대한 활용하면 환급액을 늘릴 수 있습니다.
        </p>
      </div>

      <div className="rounded-xl border border-brand-500/30 bg-brand-500/10 p-4 mb-8 flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-brand-300 mb-1">🔢 연말정산 환급액 바로 계산</p>
          <p className="text-xs text-slate-400">연봉·공제 항목 입력 → 예상 환급액 즉시 계산</p>
        </div>
        <Link href="/tax-refund"
          className="px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-400 text-white text-xs font-bold transition-all flex-shrink-0">
          계산기 열기 →
        </Link>
      </div>

      <div className="space-y-10 text-slate-300">

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">1. 연말정산 기본 구조</h2>
          <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-5">
            <div className="space-y-2 text-sm font-mono">
              {[
                { label: '총 급여액', color: 'text-slate-200' },
                { label: '- 근로소득공제', color: 'text-blue-400' },
                { label: '= 근로소득금액', color: 'text-slate-200' },
                { label: '- 인적공제 · 연금보험료공제 등', color: 'text-blue-400' },
                { label: '= 과세표준', color: 'text-slate-200' },
                { label: '× 세율 적용', color: 'text-orange-400' },
                { label: '= 산출세액', color: 'text-slate-200' },
                { label: '- 세액공제 (자녀·연금저축·의료비 등)', color: 'text-brand-400' },
                { label: '= 결정세액', color: 'text-white font-bold' },
              ].map((row, i) => (
                <div key={i} className={`${row.color} py-1 ${i > 0 ? 'border-t border-surface-border' : ''}`}>
                  {row.label}
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-surface-border text-xs text-slate-500">
              환급액 = 기납부세액(원천징수) - 결정세액 (양수면 환급, 음수면 추가 납부)
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">2. 주요 소득공제 항목</h2>
          <div className="space-y-3">
            {[
              {
                title: '근로소득공제',
                desc: '근로소득에서 자동으로 공제. 연봉 500만원 이하 70%, 최대 2,000만원 한도.',
                tag: '자동 적용',
                tagColor: 'bg-brand-500/20 text-brand-400',
              },
              {
                title: '인적공제',
                desc: '본인 150만원. 배우자·부양가족 1인당 150만원. 70세 이상 경로우대 100만원 추가.',
                tag: '서류 제출 필요',
                tagColor: 'bg-blue-500/20 text-blue-400',
              },
              {
                title: '신용카드·체크카드 공제',
                desc: '연간 사용액 중 총급여 25% 초과분에 대해 공제. 체크카드(30%) > 신용카드(15%) > 전통시장(40%).',
                tag: '홈택스 자동 조회',
                tagColor: 'bg-purple-500/20 text-purple-400',
              },
            ].map(item => (
              <div key={item.title} className="rounded-xl border border-surface-border bg-[#1a1d27] p-4">
                <div className="flex items-center gap-2 mb-2">
                  <p className="text-sm font-bold text-slate-200">{item.title}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${item.tagColor}`}>{item.tag}</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">3. 주요 세액공제 항목 (환급액에 직접 영향)</h2>
          <div className="rounded-xl border border-surface-border bg-[#1a1d27] overflow-hidden mb-4">
            <div className="grid grid-cols-3 bg-[#0f1117] px-4 py-2 text-xs text-slate-500 font-medium">
              <span>공제 항목</span><span className="text-center">공제율</span><span className="text-right">한도</span>
            </div>
            {[
              { item: '의료비', rate: '15%', limit: '총급여 3% 초과분, 한도 없음' },
              { item: '교육비 (본인)', rate: '15%', limit: '한도 없음' },
              { item: '교육비 (자녀·형제자매)', rate: '15%', limit: '1인당 300만원' },
              { item: '연금저축', rate: '15% (저소득 12%)', limit: '600만원 (IRP포함 900만원)' },
              { item: '기부금', rate: '15~30%', limit: '소득의 30% 한도' },
              { item: '자녀세액공제', rate: '1명 15만원', limit: '2명 이상 추가' },
            ].map((row, i) => (
              <div key={i} className="grid grid-cols-3 px-4 py-2.5 border-t border-surface-border text-xs">
                <span className="text-slate-300 font-medium">{row.item}</span>
                <span className="text-brand-400 font-bold text-center">{row.rate}</span>
                <span className="text-slate-500 text-right">{row.limit}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">4. 환급액 최대화 전략</h2>
          <div className="space-y-3">
            {[
              {
                rank: '1',
                title: '연금저축·IRP 납입',
                desc: '연금저축 600만원 + IRP 300만원 = 최대 900만원, 세액공제 최대 135만원. 가장 효과적인 절세 수단.',
                effect: '최대 135만원 절세',
                color: 'border-brand-500/40 bg-brand-500/10',
                tagColor: 'text-brand-400',
              },
              {
                rank: '2',
                title: '체크카드 전략적 사용',
                desc: '신용카드(15%) 대신 체크카드(30%)·전통시장(40%)을 활용하면 공제율이 2배. 총급여 25% 이상 사용한 금액부터 공제.',
                effect: '공제율 2배',
                color: 'border-blue-500/40 bg-blue-500/10',
                tagColor: 'text-blue-400',
              },
              {
                rank: '3',
                title: '의료비 몰아주기',
                desc: '가족 의료비를 소득이 낮은 배우자에게 몰아주면 더 많은 공제 가능. 총급여 3% 초과분부터 공제.',
                effect: '초과분 15% 공제',
                color: 'border-purple-500/40 bg-purple-500/10',
                tagColor: 'text-purple-400',
              },
            ].map(item => (
              <div key={item.rank} className={`rounded-xl border p-4 ${item.color}`}>
                <div className="flex items-start gap-3">
                  <span className={`text-2xl font-extrabold flex-shrink-0 ${item.tagColor}`}>{item.rank}</span>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-bold text-slate-200">{item.title}</p>
                      <span className={`text-xs font-bold ${item.tagColor}`}>{item.effect}</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">5. 연말정산 일정</h2>
          <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4">
            <div className="space-y-2">
              {[
                { period: '매년 1월~2월', action: '회사에서 연말정산 자료 제출 요청', color: 'text-blue-400' },
                { period: '1월 중순', action: '국세청 홈택스 간소화 서비스 개통 (15일부터)', color: 'text-brand-400' },
                { period: '2월', action: '회사에 공제 자료 제출', color: 'text-yellow-400' },
                { period: '2월 급여일', action: '환급액 지급 또는 추가 납부 공제', color: 'text-brand-400' },
                { period: '5월', action: '종합소득세 신고 (개인 추가 공제 누락분 신청 가능)', color: 'text-purple-400' },
              ].map((row, i) => (
                <div key={i} className="flex items-start gap-3 py-1.5 border-b border-surface-border last:border-0">
                  <span className={`text-xs font-bold flex-shrink-0 w-24 ${row.color}`}>{row.period}</span>
                  <span className="text-xs text-slate-400">{row.action}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">6. 자주 묻는 질문</h2>
          <div className="space-y-3">
            {[
              { q: '연말정산 환급액은 언제 받나요?', a: '보통 2월 급여일에 함께 지급됩니다. 회사마다 다를 수 있으며, 2월~4월 사이에 지급하는 경우도 있습니다.' },
              { q: '중도 입사·퇴사한 경우 연말정산은?', a: '중도 퇴사 시 퇴직월 급여에서 연말정산을 합니다. 이후 다른 회사 취업 시 전 회사 근로소득원천징수영수증을 제출해 합산 정산합니다.' },
              { q: '연말정산을 놓쳤을 때는?', a: '5월 종합소득세 신고 기간에 추가로 공제를 신청할 수 있습니다. 지난 5년치도 경정청구로 환급받을 수 있습니다.' },
              { q: '맞벌이 부부는 어떻게 하면 유리한가요?', a: '자녀 인적공제는 소득이 높은 쪽에, 의료비는 소득이 낮은 쪽에 몰아주는 것이 일반적으로 유리합니다. 시뮬레이션으로 비교해보세요.' },
            ].map((faq, i) => (
              <div key={i} className="rounded-xl border border-surface-border bg-[#1a1d27] p-4">
                <p className="text-sm font-bold text-slate-200 mb-2">Q. {faq.q}</p>
                <p className="text-sm text-slate-400 leading-relaxed">A. {faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="rounded-xl border border-brand-500/30 bg-brand-500/10 p-6 text-center">
          <p className="text-lg font-bold text-white mb-2">내 연말정산 환급액 계산하기</p>
          <p className="text-sm text-slate-400 mb-4">연봉과 공제 항목 입력으로 예상 환급액 즉시 확인</p>
          <Link href="/tax-refund"
            className="inline-block px-8 py-3 rounded-xl bg-brand-500 hover:bg-brand-400 text-white font-bold transition-all">
            연말정산 계산기 열기 →
          </Link>
        </div>

        <div className="border-t border-surface-border pt-4 text-xs text-slate-600">
          본 가이드는 일반적인 정보 제공 목적입니다. 실제 세무 처리는 세무사 또는 국세청 홈택스(hometax.go.kr)에서 확인하세요.
        </div>
      </div>
    </div>
  )
}
