import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '투자 수익률 복리 계산 방법 2025 — CAGR 72의법칙 실질수익률 완벽 가이드 | Keyword Mixer',
  description: '투자 수익률과 복리 계산 방법 완벽 가이드. 단리 vs 복리 차이, CAGR 연평균성장률 계산법, 72의 법칙으로 원금 2배 시간 계산, 물가상승률 반영 실질 수익률까지.',
  keywords: '투자 수익률 계산, 복리 계산법, CAGR 계산, 72의 법칙, 단리 복리 차이, 실질 수익률, 연평균 수익률, 투자 원금 2배',
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://keyword-mixer.vercel.app/guide/investment-guide' },
  openGraph: {
    title: '투자 수익률·복리 계산 방법 완벽 가이드 2025',
    description: '복리·CAGR·72의 법칙·실질수익률 계산법 총정리',
    url: 'https://keyword-mixer.vercel.app/guide/investment-guide',
    type: 'article',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: '투자 수익률·복리 계산 방법 완벽 가이드 2025',
  description: '단리·복리 차이, CAGR, 72의 법칙, 실질수익률 계산법.',
  url: 'https://keyword-mixer.vercel.app/guide/investment-guide',
  author: { '@type': 'Organization', name: 'Keyword Mixer' },
  publisher: { '@type': 'Organization', name: 'Keyword Mixer' },
  dateModified: '2025-04-23',
  inLanguage: 'ko',
}

export default function InvestmentGuide() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
        <Link href="/" className="hover:text-brand-400 transition-all">홈</Link>
        <span>›</span>
        <Link href="/guide" className="hover:text-brand-400 transition-all">가이드</Link>
        <span>›</span>
        <span className="text-slate-400">투자 수익률 가이드</span>
      </div>

      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs mb-4">
          📈 재테크 가이드 · 2025년 기준
        </div>
        <h1 className="text-3xl font-extrabold text-white mb-4">
          투자 수익률·복리 계산 방법 완벽 가이드
        </h1>
        <p className="text-slate-300 leading-relaxed">
          "복리는 세계 8번째 불가사의"라는 말이 있습니다. 단리와 복리의 차이,
          연평균 수익률(CAGR) 계산법, 원금을 2배로 만드는 72의 법칙까지
          투자 계산의 핵심을 쉽게 설명합니다.
        </p>
      </div>

      <div className="rounded-xl border border-brand-500/30 bg-brand-500/10 p-4 mb-8 flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-brand-300 mb-1">🔢 투자 수익률 바로 계산하기</p>
          <p className="text-xs text-slate-400">원금·수익률·기간 입력 → 복리 수익·CAGR·72의 법칙 즉시 계산</p>
        </div>
        <Link href="/investment-return"
          className="px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-400 text-white text-xs font-bold transition-all flex-shrink-0">
          계산기 열기 →
        </Link>
      </div>

      <div className="space-y-10 text-slate-300">

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">1. 단리 vs 복리 차이</h2>
          <p className="text-sm mb-4">
            같은 원금, 같은 수익률이라도 단리와 복리는 장기적으로 엄청난 차이를 만듭니다.
          </p>
          <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-5 mb-4">
            <div className="grid grid-cols-2 gap-4 text-sm mb-4">
              <div className="rounded-lg border border-slate-600/40 bg-[#0f1117] p-3">
                <p className="text-slate-300 font-bold mb-1">단리 (Simple Interest)</p>
                <p className="text-xs text-slate-400 mb-2">원금에만 이자가 붙습니다</p>
                <p className="text-brand-400 font-mono font-bold">A = P × (1 + r × n)</p>
              </div>
              <div className="rounded-lg border border-brand-500/40 bg-brand-500/10 p-3">
                <p className="text-brand-300 font-bold mb-1">복리 (Compound Interest)</p>
                <p className="text-xs text-slate-400 mb-2">이자에도 이자가 붙습니다</p>
                <p className="text-brand-400 font-mono font-bold">A = P × (1 + r)ⁿ</p>
              </div>
            </div>
            <div className="border-t border-surface-border pt-4">
              <p className="text-xs text-slate-500 mb-3">예시: 1,000만원 투자, 연 7%, 30년 후</p>
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="rounded-lg border border-slate-600/30 bg-[#0f1117] p-3">
                  <p className="text-xs text-slate-400 mb-1">단리</p>
                  <p className="text-xl font-bold text-slate-200 font-mono">3,100만원</p>
                  <p className="text-xs text-slate-500">수익 2,100만원</p>
                </div>
                <div className="rounded-lg border border-brand-500/40 bg-brand-500/10 p-3">
                  <p className="text-xs text-slate-400 mb-1">복리</p>
                  <p className="text-xl font-bold text-brand-400 font-mono">7,612만원</p>
                  <p className="text-xs text-brand-500">수익 6,612만원 🔥</p>
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-4">
            <p className="text-yellow-300 font-bold text-sm mb-1">💡 복리 효과의 핵심: 시간</p>
            <p className="text-sm text-slate-400">
              복리는 시간이 지날수록 가속도가 붙습니다. 30년 투자에서 마지막 10년에 전체 수익의 절반 이상이 발생합니다.
              <strong className="text-yellow-300"> 일찍 시작할수록 유리합니다.</strong>
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">2. CAGR — 연평균 복합 성장률</h2>
          <p className="text-sm mb-4">
            <strong className="text-white">CAGR(Compound Annual Growth Rate)</strong>은 투자 성과를 연 단위로 환산한 수치입니다.
            중간에 오르내려도 최종 결과를 연 수익률로 표현합니다.
          </p>
          <div className="rounded-xl border border-brand-500/30 bg-[#1a1d27] p-5 mb-4">
            <p className="text-xs text-slate-400 mb-2">CAGR 계산 공식</p>
            <p className="text-base font-bold text-brand-400 font-mono mb-3">
              CAGR = (최종금액 ÷ 초기금액)^(1÷기간) - 1
            </p>
            <div className="border-t border-surface-border pt-3">
              <p className="text-xs text-slate-500 mb-1">예시: 1,000만원 → 5년 후 1,800만원</p>
              <p className="text-xs font-mono text-slate-300">
                CAGR = (1,800 ÷ 1,000)^(1÷5) - 1 = 1.8^0.2 - 1 = <span className="text-brand-400 font-bold">12.47%</span>
              </p>
              <p className="text-xs text-slate-500 mt-2">→ 연 12.47%씩 복리로 성장한 것과 동일</p>
            </div>
          </div>
          <div className="rounded-xl border border-surface-border bg-[#1a1d27] overflow-hidden">
            <div className="px-4 py-2.5 bg-[#0f1117] text-xs text-slate-500 font-medium grid grid-cols-3">
              <span>투자 자산</span><span className="text-center">10년 CAGR (참고)</span><span className="text-right">특징</span>
            </div>
            {[
              { asset: '예금', cagr: '3~4%', note: '원금 보장, 낮은 수익' },
              { asset: '국내 주식 (KOSPI)', cagr: '5~8%', note: '변동성 있음' },
              { asset: '미국 S&P 500', cagr: '10~12%', note: '장기 평균 기준' },
              { asset: '부동산 (서울)', cagr: '5~10%', note: '지역·시기별 차이 큼' },
            ].map((row, i) => (
              <div key={i} className="grid grid-cols-3 px-4 py-2.5 border-t border-surface-border text-xs">
                <span className="text-slate-300 font-medium">{row.asset}</span>
                <span className="text-brand-400 font-bold text-center font-mono">{row.cagr}</span>
                <span className="text-slate-500 text-right">{row.note}</span>
              </div>
            ))}
            <p className="text-xs text-slate-600 px-4 py-2">* 과거 수익률이 미래를 보장하지 않습니다. 참고용 수치입니다.</p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">3. 72의 법칙 — 원금 2배 시간</h2>
          <p className="text-sm mb-4">
            <strong className="text-white">72의 법칙</strong>은 원금이 2배가 되는 데 걸리는 시간을 빠르게 추정하는 방법입니다.
          </p>
          <div className="rounded-xl border border-purple-500/30 bg-purple-500/10 p-5 mb-4">
            <p className="text-xs text-slate-400 mb-2">72의 법칙 공식</p>
            <p className="text-xl font-bold text-purple-400 font-mono mb-3">
              원금 2배 기간(년) = 72 ÷ 연 수익률(%)
            </p>
            <div className="border-t border-purple-500/20 pt-3">
              <p className="text-xs text-slate-500 mb-2">예시</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { rate: '연 4% (예금)', years: '18년' },
                  { rate: '연 6%', years: '12년' },
                  { rate: '연 9%', years: '8년' },
                  { rate: '연 12%', years: '6년' },
                ].map(r => (
                  <div key={r.rate} className="rounded-lg border border-purple-500/20 bg-[#1a1d27] p-2.5 flex justify-between">
                    <span className="text-slate-400">{r.rate}</span>
                    <span className="text-purple-400 font-bold font-mono">{r.years}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4">
            <p className="text-sm font-bold text-slate-200 mb-2">💡 인플레이션 역으로 활용</p>
            <p className="text-xs text-slate-400">
              물가상승률 3%라면 72÷3=24년 후 화폐 가치가 반으로 줄어듭니다.
              수익률이 물가상승률보다 높아야 실질적으로 부가 증가합니다.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">4. 실질 수익률 계산 (물가 반영)</h2>
          <p className="text-sm mb-4">명목 수익률에서 물가상승률을 빼면 실질 구매력 기준 수익률이 나옵니다.</p>
          <div className="rounded-xl border border-brand-500/30 bg-[#1a1d27] p-5">
            <p className="text-xs text-slate-400 mb-2">공식 (피셔 방정식 근사)</p>
            <p className="text-base font-bold text-brand-400 font-mono mb-3">
              실질 수익률 ≈ 명목 수익률 - 물가상승률
            </p>
            <div className="grid grid-cols-3 gap-2 text-xs text-center border-t border-surface-border pt-3">
              {[
                { scenario: '예금 4% / 물가 3%', real: '실질 +1%', color: 'text-yellow-400' },
                { scenario: '주식 10% / 물가 3%', real: '실질 +7%', color: 'text-brand-400' },
                { scenario: '예금 2% / 물가 4%', real: '실질 -2%', color: 'text-red-400' },
              ].map(s => (
                <div key={s.scenario} className="rounded-lg border border-surface-border bg-[#0f1117] p-2.5">
                  <p className="text-slate-500 mb-1">{s.scenario}</p>
                  <p className={`font-bold ${s.color}`}>{s.real}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">5. 월 납입 복리 — 적립식 투자</h2>
          <p className="text-sm mb-4">매달 일정 금액을 꾸준히 투자하는 적립식 투자의 복리 효과입니다.</p>
          <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-5">
            <p className="text-xs text-slate-400 mb-2">적립식 최종금액 공식</p>
            <p className="text-sm font-bold text-brand-400 font-mono mb-4">
              FV = PMT × [(1+r)ⁿ - 1] / r
            </p>
            <div className="border-t border-surface-border pt-3">
              <p className="text-xs text-slate-500 mb-3">예시: 월 50만원, 연 7%, 20년 투자</p>
              <div className="grid grid-cols-3 gap-3 text-center text-xs">
                <div className="rounded-lg border border-surface-border bg-[#0f1117] p-3">
                  <p className="text-slate-400">총 납입액</p>
                  <p className="text-slate-200 font-bold font-mono mt-1">1억 2,000만원</p>
                </div>
                <div className="rounded-lg border border-brand-500/30 bg-brand-500/10 p-3">
                  <p className="text-slate-400">최종 금액</p>
                  <p className="text-brand-400 font-bold font-mono mt-1">2억 6,147만원</p>
                </div>
                <div className="rounded-lg border border-surface-border bg-[#0f1117] p-3">
                  <p className="text-slate-400">복리 수익</p>
                  <p className="text-brand-400 font-bold font-mono mt-1">+1억 4,147만원</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">6. 자주 묻는 질문</h2>
          <div className="space-y-3">
            {[
              { q: '연 복리와 월 복리 차이는?', a: '같은 연 수익률이어도 복리 횟수가 많을수록 최종 금액이 커집니다. 연 12% 연복리보다 월 1% 월복리(연 12.68% 실효)가 더 유리합니다. 단, 차이는 크지 않습니다.' },
              { q: 'ETF로 복리 투자 어떻게 하나요?', a: '배당금을 자동 재투자하는 ETF(미국의 경우 DRIP 프로그램)나 국내 증권사 CMA 자동 재투자 서비스를 이용하면 복리 효과를 극대화할 수 있습니다.' },
              { q: '수익률 7%가 현실적인가요?', a: '미국 S&P 500의 물가 조정 후 장기 평균 수익률은 약 7%입니다. 단, 이는 30년 이상 장기 보유 기준이며 단기적으로는 큰 변동이 있습니다.' },
              { q: '세금은 어떻게 되나요?', a: '주식 매매차익은 현재(2025년) 국내 주식의 경우 소액주주는 비과세. 금융소득(이자·배당) 연 2,000만원 초과 시 종합소득세 대상. 해외 ETF·주식은 양도소득세 22% 부과.' },
            ].map((faq, i) => (
              <div key={i} className="rounded-xl border border-surface-border bg-[#1a1d27] p-4">
                <p className="text-sm font-bold text-slate-200 mb-2">Q. {faq.q}</p>
                <p className="text-sm text-slate-400 leading-relaxed">A. {faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="rounded-xl border border-brand-500/30 bg-brand-500/10 p-6 text-center">
          <p className="text-lg font-bold text-white mb-2">내 투자 수익률 계산하기</p>
          <p className="text-sm text-slate-400 mb-4">원금·수익률·기간으로 복리 수익, CAGR, 72의 법칙 즉시 계산</p>
          <Link href="/investment-return"
            className="inline-block px-8 py-3 rounded-xl bg-brand-500 hover:bg-brand-400 text-white font-bold transition-all">
            투자 수익률 계산기 열기 →
          </Link>
        </div>

        <div className="border-t border-surface-border pt-4 text-xs text-slate-600">
          본 가이드는 정보 제공 목적입니다. 투자 결정은 본인 책임이며, 투자에는 원금 손실 위험이 있습니다.
          전문적인 투자 조언은 금융투자업자(증권사·투자자문사)에게 문의하세요.
        </div>
      </div>
    </div>
  )
}
