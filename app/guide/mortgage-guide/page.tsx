import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '주택담보대출 한도·이자 계산 방법 2025 — LTV DSR DTI 완벽 가이드 | Keyword Mixer',
  description: '2025년 주택담보대출 한도와 이자 계산 방법 완벽 가이드. LTV·DSR·DTI 규제 쉽게 이해하기. 원리금균등·원금균등·만기일시 상환 방식 차이. 실수령 가능 대출 한도 계산법.',
  keywords: '주택담보대출 한도 계산, LTV 계산법, DSR 계산, 주담대 이자 계산, 원리금균등상환, 원금균등상환, 아파트 대출 한도, 주택담보대출 조건',
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://keyword-mixer.vercel.app/guide/mortgage-guide' },
  openGraph: {
    title: '주택담보대출 한도·이자 계산 방법 2025 완벽 가이드',
    description: 'LTV·DSR·DTI 규제와 월 상환액 계산법 쉽게 이해하기',
    url: 'https://keyword-mixer.vercel.app/guide/mortgage-guide',
    type: 'article',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: '주택담보대출 한도·이자 계산 방법 2025 완벽 가이드',
  description: 'LTV, DSR, DTI 규제와 월 상환액 계산 방법 안내.',
  url: 'https://keyword-mixer.vercel.app/guide/mortgage-guide',
  author: { '@type': 'Organization', name: 'Keyword Mixer' },
  publisher: { '@type': 'Organization', name: 'Keyword Mixer' },
  dateModified: '2025-04-01',
  inLanguage: 'ko',
}

export default function MortgageGuide() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
        <Link href="/" className="hover:text-brand-400 transition-all">홈</Link>
        <span>›</span>
        <Link href="/guide" className="hover:text-brand-400 transition-all">가이드</Link>
        <span>›</span>
        <span className="text-slate-400">주택담보대출 가이드</span>
      </div>

      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs mb-4">
          🏠 부동산·대출 가이드 · 2025년 기준
        </div>
        <h1 className="text-3xl font-extrabold text-white mb-4">
          주택담보대출 한도·이자 계산 방법 완벽 가이드
        </h1>
        <p className="text-slate-300 leading-relaxed">
          아파트나 주택을 살 때 가장 먼저 확인해야 하는 것이 대출 한도입니다.
          LTV, DSR, DTI 규제가 복잡하게 얽혀있어 헷갈리는 경우가 많습니다.
          이 가이드에서 쉽고 명확하게 설명합니다.
        </p>
      </div>

      <div className="rounded-xl border border-brand-500/30 bg-brand-500/10 p-4 mb-8 flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-brand-300 mb-1">🔢 주택담보대출 바로 계산하기</p>
          <p className="text-xs text-slate-400">월 상환액·총 이자·LTV·DSR 한도 즉시 계산</p>
        </div>
        <Link href="/mortgage-calculator"
          className="px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-400 text-white text-xs font-bold transition-all flex-shrink-0">
          계산기 열기 →
        </Link>
      </div>

      <div className="space-y-10 text-slate-300">

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">1. LTV — 담보인정비율</h2>
          <p className="text-sm mb-4">
            <strong className="text-white">LTV(Loan to Value)</strong>는 주택 가격 대비 대출 가능 비율입니다.
            집값이 5억원이고 LTV 50%라면 최대 2억 5천만원까지 대출받을 수 있습니다.
          </p>
          <div className="rounded-xl border border-surface-border bg-[#1a1d27] overflow-hidden mb-4">
            <div className="px-4 py-2.5 bg-[#0f1117] text-xs text-slate-500 font-medium grid grid-cols-3">
              <span>지역·주택 구분</span>
              <span className="text-center">LTV 한도</span>
              <span className="text-right">5억 집 기준</span>
            </div>
            {[
              { area: '투기지역·조정지역 (2주택 이상)', ltv: '30~40%', amount: '최대 1.5~2억' },
              { area: '투기지역 1주택 (무주택자)', ltv: '50%', amount: '최대 2.5억' },
              { area: '조정지역 1주택 (무주택자)', ltv: '50%', amount: '최대 2.5억' },
              { area: '비규제지역 (일반)', ltv: '70%', amount: '최대 3.5억' },
              { area: '지방 비규제지역', ltv: '70~80%', amount: '최대 3.5~4억' },
            ].map((row, i) => (
              <div key={i} className="grid grid-cols-3 px-4 py-2.5 border-t border-surface-border text-xs">
                <span className="text-slate-400">{row.area}</span>
                <span className="text-brand-400 font-bold text-center">{row.ltv}</span>
                <span className="text-slate-300 text-right">{row.amount}</span>
              </div>
            ))}
          </div>
          <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-3">
            <p className="text-xs text-yellow-300">⚠️ 주의</p>
            <p className="text-xs text-slate-400 mt-1">LTV는 최대 한도이며, DSR 규제를 동시에 충족해야 합니다. 둘 중 낮은 금액이 실제 대출 한도가 됩니다.</p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">2. DSR — 총부채원리금상환비율</h2>
          <p className="text-sm mb-4">
            <strong className="text-white">DSR(Debt Service Ratio)</strong>은 연간 원리금 상환액이 연 소득의 몇 %인지 나타냅니다.
            2024년 기준 40%가 상한선입니다.
          </p>
          <div className="rounded-xl border border-brand-500/30 bg-[#1a1d27] p-5 mb-4">
            <p className="text-xs text-slate-400 mb-2 font-mono">DSR 계산 공식</p>
            <p className="text-base font-bold text-brand-400 font-mono mb-3">
              DSR = (연간 원리금 상환액 ÷ 연 소득) × 100
            </p>
            <div className="border-t border-surface-border pt-3">
              <p className="text-xs text-slate-500 mb-1">예시: 연 소득 6,000만원, 연간 상환액 2,400만원</p>
              <p className="text-xs font-mono text-slate-300">
                DSR = (2,400만원 ÷ 6,000만원) × 100 = <span className="text-brand-400 font-bold">40%</span> (한도 딱 맞음)
              </p>
            </div>
          </div>
          <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-4">
            <p className="text-blue-300 text-sm font-semibold mb-2">💡 DSR 40% 기준 대출 가능 금액</p>
            <div className="grid grid-cols-3 gap-2 text-xs">
              {[
                { income: '연 소득 4,000만원', max: '약 1.8억원' },
                { income: '연 소득 6,000만원', max: '약 2.7억원' },
                { income: '연 소득 8,000만원', max: '약 3.6억원' },
              ].map(r => (
                <div key={r.income} className="rounded-lg border border-blue-500/20 bg-[#1a1d27] p-2.5 text-center">
                  <p className="text-slate-400 mb-1">{r.income}</p>
                  <p className="text-blue-400 font-bold">{r.max}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-500 mt-2">* 30년 만기 연 4.5% 원리금균등상환 기준 추정값</p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">3. 상환 방식 3가지 비교</h2>
          <p className="text-sm mb-4 text-slate-400">같은 대출이라도 상환 방식에 따라 월 납부액과 총 이자가 크게 달라집니다.</p>
          <div className="space-y-3">
            {[
              {
                title: '원리금균등상환',
                desc: '매달 같은 금액을 납부합니다. 초기 부담이 낮아 가장 많이 사용됩니다.',
                pros: '매달 일정한 금액으로 계획적 관리 가능',
                cons: '원금균등보다 총 이자 부담이 큼',
                color: 'border-brand-500/30 bg-brand-500/5',
              },
              {
                title: '원금균등상환',
                desc: '원금을 매달 동일하게 나눠 갚고, 이자는 줄어듭니다. 초기 납부액이 높지만 총 이자가 적습니다.',
                pros: '총 이자 절감, 시간이 지날수록 납부액 감소',
                cons: '초기 월 납부액이 원리금균등보다 높음',
                color: 'border-blue-500/30 bg-blue-500/5',
              },
              {
                title: '만기일시상환',
                desc: '대출 기간 동안 이자만 납부하고 만기에 원금 전액 상환.',
                pros: '월 이자만 납부해 초기 부담 최소',
                cons: '총 이자 부담이 가장 크고 만기 원금 마련 필요',
                color: 'border-orange-500/30 bg-orange-500/5',
              },
            ].map(item => (
              <div key={item.title} className={`rounded-xl border p-4 ${item.color}`}>
                <p className="text-sm font-bold text-slate-200 mb-2">{item.title}</p>
                <p className="text-xs text-slate-400 mb-2">{item.desc}</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-brand-400">✓ 장점: </span>
                    <span className="text-slate-400">{item.pros}</span>
                  </div>
                  <div>
                    <span className="text-red-400">✗ 단점: </span>
                    <span className="text-slate-400">{item.cons}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4 mt-4">
            <p className="text-xs text-slate-400 font-medium mb-2">
              💡 3억원 대출, 30년, 금리 4.5% 시 비교
            </p>
            <div className="grid grid-cols-3 gap-2 text-xs text-center">
              {[
                { type: '원리금균등', monthly: '월 152만원', total: '총 이자 2.47억' },
                { type: '원금균등', monthly: '첫달 196만원\n→ 점감', total: '총 이자 2.03억' },
                { type: '만기일시', monthly: '월 113만원\n(이자만)', total: '총 이자 4.05억' },
              ].map(r => (
                <div key={r.type} className="rounded-lg border border-surface-border bg-[#0f1117] p-3">
                  <p className="text-slate-300 font-bold mb-1">{r.type}</p>
                  <p className="text-brand-400">{r.monthly}</p>
                  <p className="text-red-400 text-xs mt-1">{r.total}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">4. 실제 대출 가능 금액 계산 순서</h2>
          <div className="space-y-2">
            {[
              { step: '1', title: 'LTV 한도 계산', desc: '주택 가격 × LTV 비율 = LTV 기준 최대 대출액', example: '5억 × 50% = 2.5억' },
              { step: '2', title: 'DSR 한도 계산', desc: '연 소득 × 40% ÷ 12개월 = 월 최대 상환 가능액', example: '6,000만원 × 40% ÷ 12 = 월 200만원' },
              { step: '3', title: 'DSR 기준 대출 한도', desc: '월 최대 상환액으로 역산한 대출 원금', example: '월 200만원 → 약 3억원 (30년, 4.5% 기준)' },
              { step: '4', title: '실제 한도 = 둘 중 낮은 금액', desc: 'LTV 한도와 DSR 한도 중 낮은 금액이 실제 대출 한도', example: '2.5억(LTV) vs 3억(DSR) → 2.5억 대출 가능' },
            ].map(item => (
              <div key={item.step} className="flex gap-4 rounded-xl border border-surface-border bg-[#1a1d27] p-4">
                <span className="text-2xl font-extrabold text-brand-400 flex-shrink-0 w-8">{item.step}</span>
                <div>
                  <p className="text-sm font-bold text-slate-200 mb-1">{item.title}</p>
                  <p className="text-xs text-slate-400">{item.desc}</p>
                  <p className="text-xs text-brand-400 font-mono mt-1">예: {item.example}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">5. 금리 종류 선택 가이드</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              {
                title: '고정금리',
                icon: '🔒',
                desc: '대출 기간 동안 금리가 변하지 않습니다.',
                good: '금리 상승기, 장기 대출, 안정 선호',
                bad: '금리 하락 시 혜택 없음',
                color: 'border-blue-500/30',
              },
              {
                title: '변동금리',
                icon: '📈',
                desc: '6개월 또는 1년마다 시장금리에 따라 변동됩니다.',
                good: '금리 하락기, 단기 대출',
                bad: '금리 상승 시 부담 증가',
                color: 'border-orange-500/30',
              },
            ].map(item => (
              <div key={item.title} className={`rounded-xl border ${item.color} bg-[#1a1d27] p-4`}>
                <p className="text-xl mb-2">{item.icon}</p>
                <p className="text-sm font-bold text-slate-200 mb-2">{item.title}</p>
                <p className="text-xs text-slate-400 mb-2">{item.desc}</p>
                <p className="text-xs text-brand-400">✓ 유리한 경우: {item.good}</p>
                <p className="text-xs text-red-400 mt-1">✗ 불리한 경우: {item.bad}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">6. 자주 묻는 질문</h2>
          <div className="space-y-3">
            {[
              { q: 'LTV와 DSR 중 어느 것이 더 중요한가요?', a: '둘 다 중요합니다. 실제 대출 한도는 LTV 한도와 DSR 한도 중 낮은 금액이 적용됩니다. 수도권 규제지역에서는 LTV가, 소득이 낮을 때는 DSR이 더 큰 제약이 됩니다.' },
              { q: '생애최초 주택구입자는 혜택이 있나요?', a: '생애최초 주택구입자는 LTV가 최대 80%까지 완화되는 경우가 있습니다. 또한 디딤돌대출 등 저금리 정책 대출을 이용할 수 있습니다. 주택금융공사 홈페이지에서 확인하세요.' },
              { q: '전세자금대출은 주담대와 어떻게 다른가요?', a: '주택담보대출은 주택을 담보로 구매 자금을 빌리는 것이고, 전세자금대출은 전세 보증금 마련을 위한 대출입니다. 전세대출은 보증기관(HUG, HF)의 보증을 받아 실행됩니다.' },
              { q: '중도상환수수료란?', a: '대출 만기 전에 갚을 때 부과되는 수수료입니다. 보통 대출 실행 후 3년 이내 상환 시 잔액의 1~1.5%가 부과됩니다. 3년 이후에는 면제되는 경우가 많습니다.' },
            ].map((faq, i) => (
              <div key={i} className="rounded-xl border border-surface-border bg-[#1a1d27] p-4">
                <p className="text-sm font-bold text-slate-200 mb-2">Q. {faq.q}</p>
                <p className="text-sm text-slate-400 leading-relaxed">A. {faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="rounded-xl border border-brand-500/30 bg-brand-500/10 p-6 text-center">
          <p className="text-lg font-bold text-white mb-2">내 주택담보대출 한도 계산하기</p>
          <p className="text-sm text-slate-400 mb-4">주택가격·소득 입력으로 LTV·DSR 한도와 월 상환액 즉시 계산</p>
          <Link href="/mortgage-calculator"
            className="inline-block px-8 py-3 rounded-xl bg-brand-500 hover:bg-brand-400 text-white font-bold transition-all">
            주담대 계산기 열기 →
          </Link>
        </div>

        <div className="border-t border-surface-border pt-4 text-xs text-slate-600">
          본 가이드는 일반적인 정보 제공 목적입니다. 실제 대출 한도는 금융기관·개인 신용도·정책 변경에 따라 다를 수 있습니다.
          정확한 한도는 해당 은행이나 주택금융공사(hf.go.kr)에서 확인하세요.
        </div>
      </div>
    </div>
  )
}
