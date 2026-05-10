import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '환율 계산 방법 완벽 가이드 2025 — 달러·엔·유로 원화 환산 | Keyword Mixer',
  description: '2025년 환율 계산 방법. 달러·엔화·유로·위안 원화 환산법, 환전 수수료 절약 팁, 가장 저렴하게 환전하는 방법 총정리.',
  keywords: '환율 계산, 달러 원화 환산, 엔화 환율, 유로 환율, 환전 수수료, 저렴한 환전, 여행 환전 팁',
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://keyword-mixer.vercel.app/guide/exchange-rate-guide' },
}

export default function ExchangeRateGuide() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
        <Link href="/" className="hover:text-brand-400">홈</Link><span>›</span>
        <Link href="/guide" className="hover:text-brand-400">가이드</Link><span>›</span>
        <span className="text-slate-400">환율 계산 가이드</span>
      </div>

      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs mb-4">
          💱 금융 가이드 · 2025년 기준
        </div>
        <h1 className="text-3xl font-extrabold text-white mb-4">환율 계산 방법 완벽 가이드 2025</h1>
        <p className="text-slate-300 leading-relaxed">
          달러·엔화·유로를 원화로 환산하는 방법부터 환전 수수료 아끼는 팁까지 정리했습니다.
        </p>
      </div>

      <div className="rounded-xl border border-brand-500/30 bg-brand-500/10 p-4 mb-8 flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-brand-300 mb-1">🔢 환율 바로 계산하기</p>
          <p className="text-xs text-slate-400">달러·엔·유로·위안 → 원화 즉시 환산</p>
        </div>
        <Link href="/exchange-rate" className="px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-400 text-white text-xs font-bold transition-all flex-shrink-0">
          계산기 열기 →
        </Link>
      </div>

      <div className="space-y-10 text-slate-300">

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">1. 환율 계산 기본 공식</h2>
          <div className="rounded-xl border border-brand-500/30 bg-[#1a1d27] p-5 mb-4">
            <p className="text-xs text-slate-400 mb-2">원화 환산 공식</p>
            <p className="text-base font-bold text-brand-400 font-mono mb-3">원화 금액 = 외화 금액 × 매매기준율</p>
            <div className="grid grid-cols-2 gap-2 text-xs mt-3">
              {[
                { ex: '$100 (달러)', result: '= 138,000원' },
                { ex: '¥10,000 (엔화)', result: '= 92,000원' },
                { ex: '€100 (유로)', result: '= 152,000원' },
                { ex: '¥1,000 (위안)', result: '= 190,000원' },
              ].map(r => (
                <div key={r.ex} className="rounded-lg border border-surface-border bg-[#0f1117] p-2.5">
                  <p className="text-slate-400">{r.ex}</p>
                  <p className="text-brand-400 font-bold font-mono">{r.result}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-600 mt-2">* 2025년 4월 기준 참고 환율</p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">2. 엔화 100엔 기준 읽는 법</h2>
          <p className="text-sm mb-4 text-slate-400">네이버에서 "엔화 920원"은 <strong className="text-white">100엔 기준</strong>입니다.</p>
          <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4 font-mono text-sm space-y-2">
            <div className="flex justify-between py-1.5 border-b border-surface-border">
              <span className="text-slate-400">표시 환율</span><span className="text-slate-200">100엔 = 920원</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-surface-border">
              <span className="text-slate-400">1엔 가격</span><span className="text-brand-400">920 ÷ 100 = 9.2원</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-400">10,000엔</span><span className="text-brand-400 font-bold">10,000 × 9.2 = 92,000원</span>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">3. 환전 방법별 수수료 비교</h2>
          <div className="rounded-xl border border-surface-border bg-[#1a1d27] overflow-hidden">
            <div className="grid grid-cols-3 bg-[#0f1117] px-4 py-2 text-xs text-slate-500 font-medium">
              <span>환전 방법</span><span className="text-center">수수료</span><span className="text-right">추천도</span>
            </div>
            {[
              { method: '공항 환전소', fee: '2~3%', rec: '❌ 비추천', color: 'text-red-400' },
              { method: '은행 창구', fee: '1~1.75%', rec: '△ 보통', color: 'text-yellow-400' },
              { method: '은행 앱 환전', fee: '50~90% 우대', rec: '✅ 추천', color: 'text-brand-400' },
              { method: '트래블카드 (WISE 등)', fee: '0~0.5%', rec: '✅ 강추', color: 'text-brand-400' },
            ].map((row, i) => (
              <div key={i} className="grid grid-cols-3 px-4 py-2.5 border-t border-surface-border text-xs">
                <span className="text-slate-300">{row.method}</span>
                <span className={`text-center font-bold ${row.color}`}>{row.fee}</span>
                <span className={`text-right ${row.color}`}>{row.rec}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">4. 자주 묻는 질문</h2>
          <div className="space-y-3">
            {[
              { q: '가장 저렴하게 환전하는 방법은?', a: '은행 앱 인터넷 환전(50~90% 우대) 또는 트래블로그·WISE 트래블카드 사용. 공항 환전소는 가장 비쌉니다.' },
              { q: '엔화 환율 920원이면 1만엔은 얼마?', a: '100엔 = 920원이므로 10,000엔 = 920 × 100 = 92,000원입니다.' },
              { q: '해외에서 카드 vs 현금 어느 게 유리?', a: '트래블카드(WISE, 트래블로그)는 실시간 환율로 결제해 수수료 거의 없음. 일반 신용카드는 해외 결제 수수료 1~2% 붙습니다.' },
              { q: '남은 외화는 어떻게 처리하나요?', a: '은행에서 재환전하거나 외화통장에 보관하세요. 다음 여행을 위해 보관하는 것도 좋습니다.' },
            ].map((faq, i) => (
              <div key={i} className="rounded-xl border border-surface-border bg-[#1a1d27] p-4">
                <p className="text-sm font-bold text-slate-200 mb-2">Q. {faq.q}</p>
                <p className="text-sm text-slate-400 leading-relaxed">A. {faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="rounded-xl border border-brand-500/30 bg-brand-500/10 p-5 text-center">
          <p className="text-base font-bold text-white mb-1">환율 바로 계산하기</p>
          <p className="text-xs text-slate-400 mb-3">달러·엔·유로·위안 ↔ 원화 즉시 환산</p>
          <Link href="/exchange-rate" className="inline-block px-6 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-white font-bold text-sm transition-all">
            환율 계산기 열기 →
          </Link>
        </div>

        <div className="border-t border-surface-border pt-4 text-xs text-slate-600">
          환율은 실시간 변동됩니다. 정확한 환율은 네이버 금융 또는 각 은행 앱에서 확인하세요.
        </div>
      </div>
    </div>
  )
}
