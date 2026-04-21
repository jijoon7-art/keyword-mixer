import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '부가세 계산 방법 완벽 가이드 2025 — 공급가액·세금계산서 역산 | Keyword Mixer',
  description: '2025년 부가세(VAT) 계산 방법 완벽 가이드. 공급가액에서 부가세 추가, 합계에서 역산하는 방법. 세금계산서 발행 조건, 면세·영세율 품목, 간이과세자 기준까지.',
  keywords: '부가세 계산 방법, 부가가치세 계산법, 공급가액 계산, 세금계산서 발행, 부가세 역산, VAT 계산, 면세 품목, 간이과세자',
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://keyword-mixer.vercel.app/guide/vat-guide' },
  openGraph: {
    title: '부가세 계산 방법 완벽 가이드 2025',
    description: '공급가액·부가세·합계 계산법과 세금계산서 발행 조건 완벽 정리',
    url: 'https://keyword-mixer.vercel.app/guide/vat-guide',
    type: 'article',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: '부가세 계산 방법 완벽 가이드 2025',
  description: '부가세 계산법, 공급가액 역산, 세금계산서 발행 조건.',
  url: 'https://keyword-mixer.vercel.app/guide/vat-guide',
  author: { '@type': 'Organization', name: 'Keyword Mixer' },
  publisher: { '@type': 'Organization', name: 'Keyword Mixer' },
  dateModified: '2025-04-01',
  inLanguage: 'ko',
}

export default function VatGuide() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
        <Link href="/" className="hover:text-brand-400 transition-all">홈</Link>
        <span>›</span>
        <Link href="/guide" className="hover:text-brand-400 transition-all">가이드</Link>
        <span>›</span>
        <span className="text-slate-400">부가세 계산 방법</span>
      </div>

      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs mb-4">
          💰 세금 가이드 · 2025년 기준
        </div>
        <h1 className="text-3xl font-extrabold text-white mb-4">부가세 계산 방법 완벽 가이드 2025</h1>
        <p className="text-slate-300 leading-relaxed">
          부가가치세(VAT)는 물건을 팔거나 서비스를 제공할 때 붙는 세금입니다.
          이 가이드에서는 공급가액에서 부가세를 추가하는 방법, 합계 금액에서 공급가액을 역산하는 방법,
          세금계산서 발행 조건까지 쉽게 설명합니다.
        </p>
      </div>

      <div className="rounded-xl border border-brand-500/30 bg-brand-500/10 p-4 mb-8 flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-brand-300 mb-1">🔢 부가세 바로 계산하기</p>
          <p className="text-xs text-slate-400">공급가액 입력 → 부가세·합계 즉시 계산. 역산도 지원</p>
        </div>
        <Link href="/vat-calculator"
          className="px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-400 text-white text-xs font-bold transition-all flex-shrink-0">
          계산기 열기 →
        </Link>
      </div>

      <div className="space-y-10 text-slate-300">

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">1. 부가세란?</h2>
          <p className="text-sm mb-4">
            부가가치세(付加價値稅, VAT)는 상품이나 서비스의 거래 단계마다 창출되는 부가가치에 부과하는 세금입니다.
            대한민국 표준 세율은 <strong className="text-white">10%</strong>이며,
            최종 소비자가 실질적으로 부담하고 사업자가 대신 납부합니다.
          </p>
          <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-5">
            <div className="flex items-center justify-between text-sm">
              <div className="text-center">
                <p className="text-2xl mb-1">🏭</p>
                <p className="text-slate-400 text-xs">제조사</p>
                <p className="text-brand-400 font-bold">공급가 100만원</p>
                <p className="text-xs text-slate-500">+VAT 10만원</p>
              </div>
              <span className="text-slate-600 text-lg">→</span>
              <div className="text-center">
                <p className="text-2xl mb-1">🏪</p>
                <p className="text-slate-400 text-xs">도매상</p>
                <p className="text-brand-400 font-bold">공급가 150만원</p>
                <p className="text-xs text-slate-500">+VAT 15만원</p>
              </div>
              <span className="text-slate-600 text-lg">→</span>
              <div className="text-center">
                <p className="text-2xl mb-1">👤</p>
                <p className="text-slate-400 text-xs">소비자</p>
                <p className="text-red-400 font-bold">165만원 납부</p>
                <p className="text-xs text-slate-500">VAT 포함</p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">2. 부가세 계산 공식 (정방향)</h2>
          <p className="text-sm mb-4 text-slate-400">공급가액을 알고 있을 때 — 부가세와 합계를 구하는 방법</p>
          <div className="rounded-xl border border-brand-500/30 bg-[#1a1d27] p-5 mb-4">
            <div className="space-y-3 font-mono text-sm">
              <div className="flex justify-between py-2 border-b border-surface-border">
                <span className="text-slate-400">부가세</span>
                <span className="text-brand-400 font-bold">= 공급가액 × 10%</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-400">합계금액 (세금계산서)</span>
                <span className="text-brand-400 font-bold">= 공급가액 + 부가세</span>
              </div>
            </div>
            <div className="border-t border-surface-border mt-3 pt-3">
              <p className="text-xs text-slate-500 mb-1">예시: 공급가액 1,000,000원</p>
              <p className="text-xs font-mono text-slate-300">
                부가세 = 1,000,000 × 0.1 = <span className="text-brand-400">100,000원</span><br />
                합계 = 1,000,000 + 100,000 = <span className="text-brand-400">1,100,000원</span>
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">3. 부가세 역산 (합계에서 공급가액 구하기)</h2>
          <p className="text-sm mb-4 text-slate-400">VAT 포함 합계 금액을 알고 있을 때 — 공급가액을 구하는 방법</p>
          <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-5 mb-4">
            <div className="space-y-3 font-mono text-sm">
              <div className="flex justify-between py-2 border-b border-blue-500/20">
                <span className="text-slate-400">공급가액</span>
                <span className="text-blue-400 font-bold">= 합계 ÷ 1.1</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-400">부가세</span>
                <span className="text-blue-400 font-bold">= 합계 - 공급가액</span>
              </div>
            </div>
            <div className="border-t border-blue-500/20 mt-3 pt-3">
              <p className="text-xs text-slate-500 mb-1">예시: 합계금액 1,100,000원</p>
              <p className="text-xs font-mono text-slate-300">
                공급가액 = 1,100,000 ÷ 1.1 = <span className="text-blue-400">1,000,000원</span><br />
                부가세 = 1,100,000 - 1,000,000 = <span className="text-blue-400">100,000원</span>
              </p>
            </div>
          </div>
          <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-3">
            <p className="text-xs text-yellow-300">💡 실무 활용</p>
            <p className="text-xs text-slate-400 mt-1">카드 영수증에 찍힌 금액(VAT 포함)에서 공급가액을 구할 때, 또는 거래처에서 받은 금액에서 세금계산서 금액을 역산할 때 사용합니다.</p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">4. 세금계산서 발행 조건</h2>
          <div className="space-y-3">
            <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4">
              <h3 className="text-sm font-bold text-slate-200 mb-2">✅ 세금계산서를 발행해야 하는 경우</h3>
              <ul className="space-y-1 text-xs text-slate-400">
                <li>• 일반과세자 사업자 간 거래 (B2B)</li>
                <li>• 공급가액 1만원 이상 거래</li>
                <li>• 부가세 과세 대상 재화·서비스 거래</li>
              </ul>
            </div>
            <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4">
              <h3 className="text-sm font-bold text-slate-200 mb-2">⚠️ 세금계산서 발행 의무 없는 경우</h3>
              <ul className="space-y-1 text-xs text-slate-400">
                <li>• 간이과세자 (연 매출 1억 400만원 미만, 2024년 기준)</li>
                <li>• 면세 사업자 (농산물, 의료, 교육 등)</li>
                <li>• 소비자(B2C) 직접 거래 — 영수증 발급 가능</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">5. 면세 품목 vs 과세 품목</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-brand-500/30 bg-brand-500/5 p-4">
              <h3 className="text-xs font-bold text-brand-400 mb-2">✅ 면세 품목 (VAT 0%)</h3>
              <ul className="space-y-1 text-xs text-slate-400">
                <li>• 농·축·수산물 (가공 전)</li>
                <li>• 의료·보건 서비스</li>
                <li>• 교육 서비스</li>
                <li>• 도서·신문·잡지</li>
                <li>• 금융·보험 서비스</li>
                <li>• 주택 임대 (국민주택)</li>
              </ul>
            </div>
            <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-4">
              <h3 className="text-xs font-bold text-red-400 mb-2">💳 과세 품목 (VAT 10%)</h3>
              <ul className="space-y-1 text-xs text-slate-400">
                <li>• 음식점 (외식)</li>
                <li>• 의류·잡화</li>
                <li>• 전자제품</li>
                <li>• 소프트웨어·IT 서비스</li>
                <li>• 숙박업</li>
                <li>• 대부분의 서비스업</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">6. 부가세 신고 일정</h2>
          <div className="rounded-xl border border-surface-border bg-[#1a1d27] overflow-hidden">
            <div className="grid grid-cols-3 bg-[#0f1117] px-4 py-2 text-xs text-slate-500 font-medium">
              <span>구분</span><span>과세 기간</span><span>신고·납부 기한</span>
            </div>
            {[
              { type: '일반과세자 1기', period: '1월~6월', deadline: '7월 25일' },
              { type: '일반과세자 2기', period: '7월~12월', deadline: '다음해 1월 25일' },
              { type: '간이과세자', period: '1월~12월', deadline: '다음해 1월 25일' },
            ].map((row, i) => (
              <div key={i} className="grid grid-cols-3 px-4 py-2.5 border-t border-surface-border text-xs">
                <span className="text-slate-300">{row.type}</span>
                <span className="text-slate-400">{row.period}</span>
                <span className="text-brand-400 font-bold">{row.deadline}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">7. 자주 묻는 질문</h2>
          <div className="space-y-3">
            {[
              { q: '간이과세자도 세금계산서를 발행할 수 있나요?', a: '간이과세자 중 직전연도 공급대가가 4,800만원 이상인 경우 세금계산서 발행 의무가 있습니다. 미만인 경우 영수증을 발행합니다.' },
              { q: '부가세 포함 가격을 표시해야 하나요?', a: '소비자에게 직접 판매하는 경우(B2C) 부가세 포함 가격을 표시해야 합니다. 기업 간 거래(B2B)는 공급가액과 부가세를 분리 표시합니다.' },
              { q: '영세율(0%)과 면세의 차이는?', a: '영세율은 세율이 0%이지만 과세 대상이므로 세금계산서를 발행해야 합니다(수출 등). 면세는 아예 과세 대상이 아니라 세금계산서 발행 불가입니다.' },
              { q: '매입세액 공제란?', a: '사업자가 재화·서비스를 구매할 때 낸 VAT는 매출 VAT에서 공제받을 수 있습니다. 매출세액 - 매입세액 = 실제 납부 세액입니다.' },
            ].map((faq, i) => (
              <div key={i} className="rounded-xl border border-surface-border bg-[#1a1d27] p-4">
                <p className="text-sm font-bold text-slate-200 mb-2">Q. {faq.q}</p>
                <p className="text-sm text-slate-400 leading-relaxed">A. {faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="rounded-xl border border-brand-500/30 bg-brand-500/10 p-6 text-center">
          <p className="text-lg font-bold text-white mb-2">부가세 바로 계산하기</p>
          <p className="text-sm text-slate-400 mb-4">공급가액·부가세·합계 즉시 계산. 역산 기능도 지원</p>
          <Link href="/vat-calculator"
            className="inline-block px-8 py-3 rounded-xl bg-brand-500 hover:bg-brand-400 text-white font-bold transition-all">
            부가세 계산기 열기 →
          </Link>
        </div>

        <div className="border-t border-surface-border pt-4 text-xs text-slate-600">
          본 가이드는 일반적인 정보 제공 목적입니다. 실제 세무 처리는 세무사에게 확인하세요.
          국세청 홈택스(hometax.go.kr)에서 정확한 세율과 신고 방법을 확인할 수 있습니다.
        </div>
      </div>
    </div>
  )
}
