import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '2025년 최저임금 완벽 가이드 — 최저시급 10,030원 주휴수당 월급 계산 | Keyword Mixer',
  description: '2025년 최저시급 10,030원 완벽 가이드. 최저임금 월급 계산법, 주휴수당 계산 방법, 최저임금 위반 신고 방법, 수습기간 감액 기준까지 모두 정리했습니다.',
  keywords: '2025 최저임금, 최저시급 10030원, 최저임금 월급 계산, 주휴수당 계산, 최저임금 위반 신고, 수습기간 최저임금, 알바 최저시급',
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://keyword-mixer.vercel.app/guide/minimum-wage-guide' },
  openGraph: {
    title: '2025년 최저임금 완벽 가이드 — 최저시급 10,030원',
    description: '최저임금 월급 계산법, 주휴수당, 위반 신고 방법 완벽 정리',
    url: 'https://keyword-mixer.vercel.app/guide/minimum-wage-guide',
    type: 'article',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: '2025년 최저임금 완벽 가이드 — 최저시급 10,030원',
  description: '최저임금 계산법, 주휴수당, 월급 환산, 위반 신고 방법.',
  url: 'https://keyword-mixer.vercel.app/guide/minimum-wage-guide',
  author: { '@type': 'Organization', name: 'Keyword Mixer' },
  publisher: { '@type': 'Organization', name: 'Keyword Mixer' },
  dateModified: '2025-04-01',
  inLanguage: 'ko',
}

export default function MinimumWageGuide() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
        <Link href="/" className="hover:text-brand-400 transition-all">홈</Link>
        <span>›</span>
        <Link href="/guide" className="hover:text-brand-400 transition-all">가이드</Link>
        <span>›</span>
        <span className="text-slate-400">최저임금 가이드</span>
      </div>

      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs mb-4">
          💰 노동·임금 가이드 · 2025년 기준
        </div>
        <h1 className="text-3xl font-extrabold text-white mb-4">
          2025년 최저임금 완벽 가이드
        </h1>
        <div className="rounded-xl border border-brand-500/40 bg-brand-500/10 p-4 mb-4">
          <p className="text-4xl font-extrabold text-brand-400 font-mono">₩10,030</p>
          <p className="text-sm text-slate-300 mt-1">2025년 법정 최저시급 (2024년 ₩9,860 대비 +₩170, +1.7% 인상)</p>
        </div>
        <p className="text-slate-300 leading-relaxed">
          2025년 최저시급은 10,030원입니다. 이 가이드에서 최저임금 월급 환산, 주휴수당 계산,
          최저임금 미만 신고 방법까지 모두 알아봅니다.
        </p>
      </div>

      <div className="rounded-xl border border-brand-500/30 bg-brand-500/10 p-4 mb-8 flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-brand-300 mb-1">🔢 최저임금 바로 계산하기</p>
          <p className="text-xs text-slate-400">시급·근무시간 입력 → 일급·주급·월급·연봉 즉시 계산</p>
        </div>
        <Link href="/minimum-wage"
          className="px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-400 text-white text-xs font-bold transition-all flex-shrink-0">
          계산기 열기 →
        </Link>
      </div>

      <div className="space-y-10 text-slate-300">

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">1. 연도별 최저임금 변화</h2>
          <div className="rounded-xl border border-surface-border bg-[#1a1d27] overflow-hidden">
            <div className="grid grid-cols-4 bg-[#0f1117] px-4 py-2 text-xs text-slate-500 font-medium">
              <span>연도</span><span className="text-center">최저시급</span><span className="text-center">인상액</span><span className="text-right">인상률</span>
            </div>
            {[
              { year: '2025', wage: '10,030원', diff: '+170원', rate: '+1.7%', highlight: true },
              { year: '2024', wage: '9,860원', diff: '+240원', rate: '+2.5%', highlight: false },
              { year: '2023', wage: '9,620원', diff: '+460원', rate: '+5.0%', highlight: false },
              { year: '2022', wage: '9,160원', diff: '+440원', rate: '+5.1%', highlight: false },
              { year: '2021', wage: '8,720원', diff: '+130원', rate: '+1.5%', highlight: false },
            ].map((row, i) => (
              <div key={i} className={`grid grid-cols-4 px-4 py-2.5 border-t border-surface-border text-xs ${row.highlight ? 'bg-brand-500/10' : ''}`}>
                <span className={row.highlight ? 'text-brand-400 font-bold' : 'text-slate-400'}>{row.year}</span>
                <span className={`text-center font-mono font-bold ${row.highlight ? 'text-brand-400' : 'text-slate-300'}`}>{row.wage}</span>
                <span className="text-center text-slate-400">{row.diff}</span>
                <span className="text-right text-slate-400">{row.rate}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">2. 최저임금 월급·연봉 환산</h2>
          <p className="text-sm mb-4 text-slate-400">주 40시간(하루 8시간, 주 5일) 근무 기준 월급 환산입니다.</p>
          <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-5 mb-4">
            <p className="text-xs text-slate-500 mb-3 font-mono">월 환산 공식</p>
            <div className="space-y-2 text-sm font-mono">
              <p className="text-slate-300">월 소정근로시간 = (40시간 + 주휴 8시간) × (365일 ÷ 7일 ÷ 12개월)</p>
              <p className="text-slate-300">= 48시간 × 4.345주 = <span className="text-brand-400">209시간</span></p>
              <div className="border-t border-surface-border pt-3 mt-3">
                <p className="text-brand-400 font-bold">2025 최저 월급 = 10,030원 × 209시간 = <span className="text-xl">2,096,270원</span></p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: '일급 (8시간)', amount: '80,240원', sub: '10,030 × 8' },
              { label: '주급 (40시간+주휴)', amount: '481,440원', sub: '10,030 × 48' },
              { label: '월급 (209시간)', amount: '2,096,270원', sub: '10,030 × 209', highlight: true },
              { label: '연봉', amount: '25,155,240원', sub: '월급 × 12' },
            ].map(item => (
              <div key={item.label} className={`rounded-xl border p-3 ${item.highlight ? 'border-brand-500/40 bg-brand-500/10' : 'border-surface-border bg-[#1a1d27]'}`}>
                <p className="text-xs text-slate-400 mb-1">{item.label}</p>
                <p className={`text-base font-bold font-mono ${item.highlight ? 'text-brand-400' : 'text-slate-200'}`}>{item.amount}</p>
                <p className="text-xs text-slate-600 font-mono">{item.sub}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">3. 주휴수당이란?</h2>
          <p className="text-sm mb-4">
            <strong className="text-white">주휴수당</strong>은 1주일에 15시간 이상 근무한 근로자에게
            유급 휴일(1일)에 대해 지급하는 수당입니다.
            아르바이트·파트타임도 해당됩니다.
          </p>
          <div className="rounded-xl border border-brand-500/30 bg-[#1a1d27] p-5 mb-4">
            <p className="text-xs text-slate-400 mb-2">주휴수당 계산 공식</p>
            <p className="text-base font-bold text-brand-400 font-mono mb-3">
              주휴수당 = (주간 근무시간 ÷ 40시간) × 8시간 × 시급
            </p>
            <div className="border-t border-surface-border pt-3">
              <p className="text-xs text-slate-500 mb-1">예시: 주 25시간 근무, 시급 10,030원</p>
              <p className="text-xs font-mono text-slate-300">
                주휴수당 = (25 ÷ 40) × 8 × 10,030원 = <span className="text-brand-400 font-bold">50,150원/주</span>
              </p>
            </div>
          </div>
          <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-3">
            <p className="text-xs text-yellow-300">⚠️ 주의사항</p>
            <ul className="text-xs text-slate-400 mt-1 space-y-1">
              <li>• 주 15시간 미만 근무자는 주휴수당 없음</li>
              <li>• 계약서에 '주휴수당 포함' 문구가 있어도 최저임금은 별도로 보장</li>
              <li>• 주휴수당 미지급은 최저임금법 위반</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">4. 최저임금 적용 제외·감액 가능 경우</h2>
          <div className="space-y-3">
            {[
              {
                title: '수습 기간 감액 (90% 적용)',
                desc: '1년 이상 계약직의 최초 3개월 수습 기간에 한해 최저임금의 90%까지 감액 가능합니다.',
                calc: '10,030원 × 90% = 9,027원',
                color: 'border-orange-500/30 bg-orange-500/5',
              },
              {
                title: '감시·단속적 근로자',
                desc: '경비원, 주차관리원 등 고용노동부 장관의 적용 제외 인가를 받은 경우 감액 가능합니다.',
                calc: '고용노동부 별도 인가 필요',
                color: 'border-blue-500/30 bg-blue-500/5',
              },
            ].map(item => (
              <div key={item.title} className={`rounded-xl border p-4 ${item.color}`}>
                <p className="text-sm font-bold text-slate-200 mb-1">{item.title}</p>
                <p className="text-xs text-slate-400 mb-2">{item.desc}</p>
                <p className="text-xs font-mono text-brand-400">{item.calc}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">5. 최저임금 위반 신고 방법</h2>
          <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-5">
            <p className="text-red-400 font-bold text-sm mb-3">🚨 최저임금보다 적게 받고 있다면</p>
            <div className="space-y-3">
              {[
                { step: '1', title: '증거 수집', desc: '급여명세서, 통장 입금내역, 근무 기록(사진/문자) 등을 보관하세요.' },
                { step: '2', title: '신고 방법', desc: '고용노동부 고객상담센터(☎1350) 또는 가까운 고용노동지청에 신고합니다. 온라인 신고: 민원마당(minwon.moel.go.kr)' },
                { step: '3', title: '처벌 규정', desc: '최저임금법 위반 시 3년 이하 징역 또는 2,000만원 이하 벌금에 처해질 수 있습니다.' },
              ].map(item => (
                <div key={item.step} className="flex gap-3">
                  <span className="text-red-400 font-bold text-lg flex-shrink-0">{item.step}</span>
                  <div>
                    <p className="text-sm font-bold text-slate-200">{item.title}</p>
                    <p className="text-xs text-slate-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">6. 자주 묻는 질문</h2>
          <div className="space-y-3">
            {[
              { q: '식비, 교통비도 최저임금에 포함되나요?', a: '매달 정기적으로 지급되는 식비·교통비는 최저임금 산입 범위에 포함됩니다. 단, 월 최저임금의 일정 비율(식비 월 5.8%, 숙박비 2.9% 등)만 산입됩니다(2025년 기준).' },
              { q: '투잡으로 여러 회사에서 일하면?', a: '각 사업장별로 독립적으로 적용됩니다. A회사에서 주 20시간, B회사에서 주 20시간 일해도 각각 주 15시간 이상이면 각 회사에서 주휴수당을 받을 수 있습니다.' },
              { q: '일당제로 일하면 최저임금은?', a: '일당제라도 1시간당 임금이 최저시급(10,030원) 이상이어야 합니다. 하루 8시간 일한다면 일당이 최소 80,240원 이상이어야 합니다.' },
              { q: '2026년 최저임금은 얼마인가요?', a: '2026년 최저임금은 매년 8월 5일경 결정됩니다. 최저임금위원회에서 노사 협의 후 발표합니다. 발표 후 업데이트 예정입니다.' },
            ].map((faq, i) => (
              <div key={i} className="rounded-xl border border-surface-border bg-[#1a1d27] p-4">
                <p className="text-sm font-bold text-slate-200 mb-2">Q. {faq.q}</p>
                <p className="text-sm text-slate-400 leading-relaxed">A. {faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="rounded-xl border border-brand-500/30 bg-brand-500/10 p-6 text-center">
          <p className="text-lg font-bold text-white mb-2">내 최저임금 월급 계산하기</p>
          <p className="text-sm text-slate-400 mb-4">시급·근무시간으로 일급·주급·월급·주휴수당 즉시 계산</p>
          <Link href="/minimum-wage"
            className="inline-block px-8 py-3 rounded-xl bg-brand-500 hover:bg-brand-400 text-white font-bold transition-all">
            최저임금 계산기 열기 →
          </Link>
        </div>

        <div className="border-t border-surface-border pt-4 text-xs text-slate-600">
          본 가이드는 2025년 기준 일반적인 정보 제공 목적입니다.
          개인 상황에 따라 다를 수 있으며 정확한 내용은 고용노동부(moel.go.kr)에서 확인하세요.
        </div>
      </div>
    </div>
  )
}
