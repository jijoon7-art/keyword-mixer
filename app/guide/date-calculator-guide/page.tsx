import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '날짜 계산 방법 완벽 가이드 2025 — 만 나이·D-day·근무일 계산 | Keyword Mixer',
  description: '2025년 날짜 계산 완벽 가이드. 만 나이 계산법, 두 날짜 사이 일수, 근무일 계산, D-day 계산, 날짜 더하기 빼기 방법. 태어난 날수 계산 방법도 포함.',
  keywords: '날짜 계산, 만 나이 계산, 두 날짜 사이 일수, 근무일 계산, D-day 계산, 날짜 더하기, 태어난 날수 계산, 생년월일 날수',
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://keyword-mixer.vercel.app/guide/date-calculator-guide' },
  openGraph: {
    title: '날짜 계산 방법 완벽 가이드 2025',
    description: '만 나이·D-day·근무일·날짜 더하기 계산 방법 총정리',
    url: 'https://keyword-mixer.vercel.app/guide/date-calculator-guide',
    type: 'article',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: '날짜 계산 방법 완벽 가이드 2025',
  description: '만 나이, D-day, 근무일, 날짜 더하기 계산 방법.',
  url: 'https://keyword-mixer.vercel.app/guide/date-calculator-guide',
  author: { '@type': 'Organization', name: 'Keyword Mixer' },
  publisher: { '@type': 'Organization', name: 'Keyword Mixer' },
  dateModified: '2025-04-22',
  inLanguage: 'ko',
}

export default function DateCalculatorGuide() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
        <Link href="/" className="hover:text-brand-400 transition-all">홈</Link>
        <span>›</span>
        <Link href="/guide" className="hover:text-brand-400 transition-all">가이드</Link>
        <span>›</span>
        <span className="text-slate-400">날짜 계산 가이드</span>
      </div>

      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs mb-4">
          📅 생활 가이드 · 2025년 기준
        </div>
        <h1 className="text-3xl font-extrabold text-white mb-4">
          날짜 계산 방법 완벽 가이드
        </h1>
        <p className="text-slate-300 leading-relaxed">
          만 나이 계산, 두 날짜 사이 일수, 근무일 계산, D-day 설정, 날짜 더하기·빼기까지
          일상에서 자주 쓰는 날짜 계산 방법을 모두 정리했습니다.
        </p>
      </div>

      {/* 빠른 도구 링크 */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        {[
          { label: '📅 날짜 계산기 Pro', sub: '두 날짜 사이 일수·근무일', href: '/date-diff-calculator' },
          { label: '🎂 나이 계산기', sub: '만 나이·한국 나이·태어난 날수', href: '/age-calculator' },
          { label: '⏰ D-day 계산기', sub: '목표일까지 남은 일수', href: '/dday-calculator' },
          { label: '📆 날짜 계산기', sub: '날짜 더하기·빼기', href: '/date-calculator' },
        ].map(item => (
          <Link key={item.href} href={item.href}
            className="rounded-xl border border-surface-border bg-[#1a1d27] p-3 hover:border-brand-500/40 transition-all">
            <p className="text-sm font-bold text-slate-200">{item.label}</p>
            <p className="text-xs text-slate-500 mt-0.5">{item.sub}</p>
          </Link>
        ))}
      </div>

      <div className="space-y-10 text-slate-300">

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">1. 만 나이 계산법 (2025년 기준)</h2>
          <p className="text-sm mb-4">
            2023년 6월부터 한국도 공식적으로 <strong className="text-white">만 나이</strong>를 사용합니다.
            만 나이는 생일이 지났으면 올해 연도에서 출생 연도를 빼고, 생일이 안 지났으면 1을 더 뺍니다.
          </p>
          <div className="rounded-xl border border-brand-500/30 bg-[#1a1d27] p-5 mb-4">
            <p className="text-xs text-slate-400 mb-2">만 나이 계산 공식</p>
            <div className="space-y-2 font-mono text-sm">
              <p className="text-brand-400 font-bold">생일 지난 경우: 올해 연도 - 출생 연도</p>
              <p className="text-blue-400 font-bold">생일 안 지난 경우: 올해 연도 - 출생 연도 - 1</p>
            </div>
            <div className="border-t border-surface-border mt-3 pt-3 space-y-2 text-xs">
              <p className="text-slate-500">예시: 1995년 3월 15일생 → 2025년 4월 기준</p>
              <p className="text-slate-300 font-mono">생일(3월 15일)이 지남 → 2025 - 1995 = <span className="text-brand-400 font-bold">만 30세</span></p>
              <p className="text-slate-500 mt-2">예시: 1995년 12월 1일생 → 2025년 4월 기준</p>
              <p className="text-slate-300 font-mono">생일(12월 1일)이 안 지남 → 2025 - 1995 - 1 = <span className="text-brand-400 font-bold">만 29세</span></p>
            </div>
          </div>

          <div className="rounded-xl border border-surface-border bg-[#1a1d27] overflow-hidden">
            <div className="grid grid-cols-3 bg-[#0f1117] px-4 py-2 text-xs text-slate-500 font-medium">
              <span>나이 종류</span><span className="text-center">계산법</span><span className="text-right">2025년 예시 (1995년생)</span>
            </div>
            {[
              { type: '만 나이 (공식)', calc: '올해 - 출생연도 (생일 전 -1)', ex: '30세 또는 29세', color: 'text-brand-400' },
              { type: '한국 나이 (세는 나이)', calc: '올해 - 출생연도 + 1', ex: '31세', color: 'text-blue-400' },
              { type: '연 나이', calc: '올해 - 출생연도', ex: '30세', color: 'text-slate-300' },
            ].map((row, i) => (
              <div key={i} className="grid grid-cols-3 px-4 py-2.5 border-t border-surface-border text-xs">
                <span className={`font-medium ${row.color}`}>{row.type}</span>
                <span className="text-slate-400 text-center">{row.calc}</span>
                <span className="text-slate-300 text-right font-bold">{row.ex}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">2. 태어난 날수 계산 (살아온 일수)</h2>
          <p className="text-sm mb-4">
            태어난 날부터 오늘까지 며칠을 살았는지 계산하는 방법입니다.
            <strong className="text-white"> 100일·1000일 기념일</strong> 계산에도 활용됩니다.
          </p>
          <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-5 mb-4">
            <p className="text-xs text-slate-400 mb-2">계산 방법</p>
            <p className="text-sm text-slate-300 mb-3">오늘 날짜 - 생년월일 = 살아온 일수</p>
            <div className="border-t border-surface-border pt-3 text-xs">
              <p className="text-slate-500">예시: 1990년 1월 1일생 → 2025년 4월 22일 기준</p>
              <p className="text-brand-400 font-bold font-mono mt-1">약 12,895일 (35년 3개월 21일)</p>
            </div>
          </div>
          <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-4">
            <p className="text-yellow-300 text-sm font-bold mb-2">🎂 기념일 계산 활용</p>
            <div className="grid grid-cols-3 gap-2 text-xs text-center">
              {[
                { days: '100일', when: '출생 후 99일째 날' },
                { days: '1,000일', when: '출생 후 999일째 날' },
                { days: '10,000일', when: '약 27.4년 후' },
              ].map(item => (
                <div key={item.days} className="rounded-lg border border-yellow-500/20 bg-[#1a1d27] p-2">
                  <p className="text-yellow-400 font-bold">{item.days}</p>
                  <p className="text-slate-500 mt-0.5">{item.when}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">3. 두 날짜 사이 일수 계산</h2>
          <p className="text-sm mb-4">계약 기간, 프로젝트 기간, 여행 일수 등을 계산할 때 사용합니다.</p>
          <div className="rounded-xl border border-brand-500/30 bg-[#1a1d27] p-5 mb-4">
            <p className="text-xs text-slate-400 mb-2">공식</p>
            <p className="text-sm font-bold text-brand-400 font-mono">일수 = 종료일 - 시작일 (종료일 포함 시 +1)</p>
            <div className="border-t border-surface-border mt-3 pt-3 text-xs space-y-2">
              <div>
                <p className="text-slate-500">예시: 2025년 1월 1일 ~ 2025년 12월 31일</p>
                <p className="text-slate-300 font-mono">365일 (포함 계산 시 365일, 미포함 시 364일)</p>
              </div>
              <div className="rounded-lg border border-surface-border bg-[#0f1117] p-2">
                <p className="text-yellow-400 text-xs">⚠️ 헷갈리는 포함/미포함 계산</p>
                <p className="text-slate-400 mt-1">계약 기간: 보통 시작일·종료일 모두 포함</p>
                <p className="text-slate-400">여행 일수: 출발일·도착일 모두 포함</p>
                <p className="text-slate-400">나이 계산: 생일 미포함 (생일 당일부터 다음날이 1일)</p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">4. 근무일 계산 (주말 제외)</h2>
          <p className="text-sm mb-4">
            계약서의 근무일, 납품 기한, 법적 기한 계산 시 주말을 제외한 영업일만 세야 합니다.
          </p>
          <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-5 mb-4">
            <p className="text-sm font-bold text-slate-200 mb-3">근무일 계산 방법</p>
            <ol className="space-y-2 text-xs text-slate-400 list-decimal list-inside">
              <li>시작일과 종료일 사이 총 일수 계산</li>
              <li>토요일과 일요일 수 계산해서 빼기</li>
              <li>공휴일은 별도로 확인해서 빼기 (자동 계산 불가)</li>
            </ol>
            <div className="border-t border-surface-border mt-3 pt-3 text-xs">
              <p className="text-slate-500">예시: 2025년 4월 1일(화) ~ 4월 30일(수)</p>
              <p className="text-slate-300 font-mono">총 30일 - 주말 8일 = <span className="text-brand-400 font-bold">22 근무일</span></p>
              <p className="text-slate-500 mt-1">* 공휴일(식목일 4/5 등) 추가 제외 시 21일</p>
            </div>
          </div>
          <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-3">
            <p className="text-xs text-blue-300">💡 법적 기한 계산 주의</p>
            <p className="text-xs text-slate-400 mt-1">민사소송법 등 법적 기간 계산은 초일 불산입이 원칙입니다. 즉 1월 1일 시작이면 1월 2일부터 계산됩니다.</p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">5. D-day 계산 방법</h2>
          <p className="text-sm mb-4">수능, 결혼식, 여행 출발 등 중요한 날까지 남은 일수를 계산합니다.</p>
          <div className="rounded-xl border border-brand-500/30 bg-[#1a1d27] p-5">
            <p className="text-xs text-slate-400 mb-2">D-day 계산 공식</p>
            <p className="text-sm font-bold text-brand-400 font-mono mb-3">D-day = 목표일 - 오늘</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { case: 'D-30', meaning: '목표일까지 30일 남음', color: 'text-brand-400' },
                { case: 'D-1', meaning: '내일이 목표일', color: 'text-yellow-400' },
                { case: 'D-day', meaning: '오늘이 목표일', color: 'text-red-400' },
                { case: 'D+10', meaning: '목표일로부터 10일 지남', color: 'text-slate-400' },
              ].map(item => (
                <div key={item.case} className="rounded-lg border border-surface-border bg-[#0f1117] p-2.5">
                  <p className={`font-bold font-mono ${item.color}`}>{item.case}</p>
                  <p className="text-slate-500 text-xs mt-0.5">{item.meaning}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">6. 자주 묻는 질문</h2>
          <div className="space-y-3">
            {[
              { q: '만 나이와 한국 나이 차이는?', a: '만 나이는 생일이 지나야 1살을 더합니다. 한국식 나이(세는 나이)는 태어난 해를 1살로 시작해 새해 1월 1일마다 1살씩 더합니다. 2023년 6월부터 법적·행정적 나이는 만 나이가 공식 기준입니다.' },
              { q: '근로계약 1년이면 실제 며칠인가요?', a: '2025년 1월 1일~12월 31일은 365일입니다. 윤년(2024년, 2028년 등)에는 366일이 됩니다. 근로기준법상 1년은 365일(윤년 366일)을 기준으로 합니다.' },
              { q: '공휴일을 자동으로 계산할 수 있나요?', a: '공휴일은 매년 국무회의에서 결정되며 임시공휴일이 추가될 수 있어 자동 계산이 어렵습니다. 정확한 근무일 계산은 인사혁신처(www.mois.go.kr) 공휴일 공고를 확인하세요.' },
              { q: '임신 주수 계산은 어떻게 하나요?', a: '마지막 생리 시작일부터 계산합니다. 임신 40주(280일)가 만삭입니다. 예정일 = 마지막 생리 시작일 + 280일(또는 -3개월 +7일 네겔레 법칙).' },
            ].map((faq, i) => (
              <div key={i} className="rounded-xl border border-surface-border bg-[#1a1d27] p-4">
                <p className="text-sm font-bold text-slate-200 mb-2">Q. {faq.q}</p>
                <p className="text-sm text-slate-400 leading-relaxed">A. {faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-2 gap-3">
          {[
            { label: '날짜 계산기 Pro', sub: '두 날짜 사이 일수·근무일', href: '/date-diff-calculator', icon: '📅' },
            { label: '나이 계산기', sub: '만 나이·태어난 날수', href: '/age-calculator', icon: '🎂' },
          ].map(item => (
            <div key={item.href} className="rounded-xl border border-brand-500/30 bg-brand-500/10 p-4 text-center">
              <p className="text-2xl mb-2">{item.icon}</p>
              <p className="text-sm font-bold text-white mb-1">{item.label}</p>
              <p className="text-xs text-slate-400 mb-3">{item.sub}</p>
              <Link href={item.href}
                className="inline-block px-4 py-1.5 rounded-lg bg-brand-500 hover:bg-brand-400 text-white text-xs font-bold transition-all">
                계산기 열기 →
              </Link>
            </div>
          ))}
        </div>

        <div className="border-t border-surface-border pt-4 text-xs text-slate-600">
          본 가이드는 일반적인 정보 제공 목적입니다. 법적 효력이 있는 날짜 계산은 관련 기관에 확인하세요.
        </div>
      </div>
    </div>
  )
}
