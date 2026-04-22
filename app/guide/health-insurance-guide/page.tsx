import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '2025년 건강보험료 계산 방법 완벽 가이드 — 직장·지역 가입자 4대보험 | Keyword Mixer',
  description: '2025년 건강보험료 계산 방법 완벽 가이드. 직장가입자·지역가입자 건강보험료 계산법, 장기요양보험료, 4대보험 요율 총정리. 건강보험료 줄이는 방법도 포함.',
  keywords: '2025 건강보험료 계산, 직장가입자 건강보험료, 지역가입자 건강보험료, 4대보험 요율, 장기요양보험료, 건강보험료 산정, 건강보험료 줄이는 방법',
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://keyword-mixer.vercel.app/guide/health-insurance-guide' },
  openGraph: {
    title: '2025년 건강보험료 계산 방법 완벽 가이드',
    description: '직장·지역가입자 건강보험료 계산법과 4대보험 요율 총정리',
    url: 'https://keyword-mixer.vercel.app/guide/health-insurance-guide',
    type: 'article',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: '2025년 건강보험료 계산 방법 완벽 가이드',
  description: '직장가입자·지역가입자 건강보험료 계산법과 4대보험 요율.',
  url: 'https://keyword-mixer.vercel.app/guide/health-insurance-guide',
  author: { '@type': 'Organization', name: 'Keyword Mixer' },
  publisher: { '@type': 'Organization', name: 'Keyword Mixer' },
  dateModified: '2025-04-22',
  inLanguage: 'ko',
}

export default function HealthInsuranceGuide() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
        <Link href="/" className="hover:text-brand-400 transition-all">홈</Link>
        <span>›</span>
        <Link href="/guide" className="hover:text-brand-400 transition-all">가이드</Link>
        <span>›</span>
        <span className="text-slate-400">건강보험료 가이드</span>
      </div>

      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs mb-4">
          🏥 4대보험 가이드 · 2025년 기준
        </div>
        <h1 className="text-3xl font-extrabold text-white mb-4">
          2025년 건강보험료 계산 방법 완벽 가이드
        </h1>
        <p className="text-slate-300 leading-relaxed">
          건강보험료는 매달 급여에서 자동으로 공제되지만 얼마나 납부하는지 정확히 아는 사람은 드뭅니다.
          직장가입자, 지역가입자별 계산법과 2025년 최신 요율을 정리했습니다.
        </p>
      </div>

      <div className="rounded-xl border border-brand-500/30 bg-brand-500/10 p-4 mb-8 flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-brand-300 mb-1">🔢 건강보험료 바로 계산하기</p>
          <p className="text-xs text-slate-400">월급 입력 → 건강보험·장기요양·고용·산재 즉시 계산</p>
        </div>
        <Link href="/health-insurance"
          className="px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-400 text-white text-xs font-bold transition-all flex-shrink-0">
          계산기 열기 →
        </Link>
      </div>

      <div className="space-y-10 text-slate-300">

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">1. 2025년 4대보험 요율 총정리</h2>
          <div className="rounded-xl border border-surface-border bg-[#1a1d27] overflow-hidden">
            <div className="grid grid-cols-4 bg-[#0f1117] px-4 py-2.5 text-xs text-slate-500 font-medium">
              <span>보험 종류</span>
              <span className="text-center">전체 요율</span>
              <span className="text-center">근로자 부담</span>
              <span className="text-right">회사 부담</span>
            </div>
            {[
              { name: '건강보험', total: '7.09%', worker: '3.545%', company: '3.545%', highlight: true },
              { name: '장기요양보험', total: '건강보험료의 12.95%', worker: '50%', company: '50%', highlight: false },
              { name: '국민연금', total: '9.0%', worker: '4.5%', company: '4.5%', highlight: false },
              { name: '고용보험', total: '1.8%+', worker: '0.9%', company: '0.9~1.65%', highlight: false },
              { name: '산재보험', total: '업종별 상이', worker: '없음', company: '전액', highlight: false },
            ].map((row, i) => (
              <div key={i} className={`grid grid-cols-4 px-4 py-2.5 border-t border-surface-border text-xs ${row.highlight ? 'bg-brand-500/5' : ''}`}>
                <span className={`font-medium ${row.highlight ? 'text-brand-400' : 'text-slate-300'}`}>{row.name}</span>
                <span className="text-center text-slate-400 font-mono">{row.total}</span>
                <span className="text-center text-brand-400 font-bold">{row.worker}</span>
                <span className="text-right text-slate-400">{row.company}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-600 mt-2">* 2025년 기준. 국민연금 기준소득월액 상한 617만원, 하한 39만원</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">2. 직장가입자 건강보험료 계산</h2>
          <p className="text-sm mb-4 text-slate-400">직장가입자는 보수월액(세전 월급)을 기준으로 계산합니다.</p>
          <div className="rounded-xl border border-brand-500/30 bg-[#1a1d27] p-5 mb-4">
            <p className="text-xs text-slate-400 mb-2">계산 공식</p>
            <div className="space-y-1.5 text-sm font-mono">
              <p><span className="text-slate-400">건강보험료 =</span> <span className="text-brand-400 font-bold">보수월액 × 3.545%</span></p>
              <p><span className="text-slate-400">장기요양보험료 =</span> <span className="text-brand-400 font-bold">건강보험료 × 12.95%</span></p>
              <p><span className="text-slate-400">고용보험료 =</span> <span className="text-brand-400 font-bold">보수월액 × 0.9%</span></p>
              <p><span className="text-slate-400">국민연금 =</span> <span className="text-brand-400 font-bold">보수월액 × 4.5%</span></p>
            </div>
            <div className="border-t border-surface-border mt-3 pt-3">
              <p className="text-xs text-slate-500 mb-2">예시: 월급 350만원</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { label: '건강보험', amount: '124,075원', calc: '3,500,000 × 3.545%' },
                  { label: '장기요양', amount: '16,068원', calc: '124,075 × 12.95%' },
                  { label: '고용보험', amount: '31,500원', calc: '3,500,000 × 0.9%' },
                  { label: '국민연금', amount: '157,500원', calc: '3,500,000 × 4.5%' },
                ].map(r => (
                  <div key={r.label} className="rounded-lg border border-surface-border bg-[#0f1117] p-2.5">
                    <p className="text-slate-400">{r.label}</p>
                    <p className="text-brand-400 font-bold font-mono">{r.amount}</p>
                    <p className="text-slate-600 font-mono text-xs">{r.calc}</p>
                  </div>
                ))}
              </div>
              <div className="mt-2 rounded-lg border border-brand-500/30 bg-brand-500/10 p-2.5 text-center">
                <p className="text-xs text-slate-400">4대보험 합계 (근로자 부담)</p>
                <p className="text-lg font-extrabold text-brand-400 font-mono">329,143원 / 월</p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">3. 지역가입자 건강보험료 계산</h2>
          <p className="text-sm mb-4">
            직장이 없는 자영업자·프리랜서·퇴직자 등이 해당됩니다.
            소득·재산·자동차를 점수화해 보험료를 산정합니다.
          </p>
          <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-5 mb-4">
            <p className="text-xs text-slate-400 mb-3">지역가입자 보험료 산정 구조</p>
            <div className="space-y-2">
              {[
                { label: '소득 점수', desc: '사업·금융·근로·연금·기타 소득 → 점수 환산', color: 'text-blue-400' },
                { label: '재산 점수', desc: '토지·건물·전세·금융재산 → 점수 환산', color: 'text-purple-400' },
                { label: '자동차 점수', desc: '4,000만원 초과 차량만 해당 (이하 면제)', color: 'text-orange-400' },
              ].map(item => (
                <div key={item.label} className="flex items-start gap-3 text-xs">
                  <span className={`font-bold w-20 flex-shrink-0 ${item.color}`}>{item.label}</span>
                  <span className="text-slate-400">{item.desc}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-surface-border mt-3 pt-3 text-sm font-mono">
              <p className="text-brand-400 font-bold">보험료 = 부과점수 합계 × 208.4원 (2024년)</p>
            </div>
          </div>
          <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-4">
            <p className="text-yellow-300 text-sm font-bold mb-2">💡 직장 퇴직 후 지역가입자 전환 시</p>
            <ul className="text-xs text-slate-400 space-y-1">
              <li>• 퇴직 다음 달부터 지역가입자로 전환</li>
              <li>• 퇴직 전 직장 보험료보다 크게 증가할 수 있음</li>
              <li>• 임의계속가입 제도: 퇴직 후 2년간 직장가입자 자격 유지 가능</li>
              <li>• 가족 직장가입자의 피부양자 등록 시 보험료 없음</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">4. 건강보험료 절감 방법</h2>
          <div className="space-y-3">
            {[
              {
                title: '직장인: 비과세 수당 활용',
                desc: '식대(월 20만원), 자가운전보조금(월 20만원), 연구보조비 등 비과세 수당은 보수월액에서 제외됩니다.',
                tag: '직장가입자',
                tagColor: 'text-brand-400 border-brand-500/30',
              },
              {
                title: '지역가입자: 피부양자 등록',
                desc: '직장가입자인 배우자·부모·자녀의 피부양자로 등록하면 건강보험료를 내지 않아도 됩니다. 단, 소득 기준(연 2,000만원 이하)을 충족해야 합니다.',
                tag: '지역가입자',
                tagColor: 'text-blue-400 border-blue-500/30',
              },
              {
                title: '퇴직 후: 임의계속가입',
                desc: '퇴직 후 최대 36개월간 직장가입자 자격을 유지할 수 있습니다. 지역가입자로 전환될 경우보다 보험료가 낮은 경우 활용하면 유리합니다.',
                tag: '퇴직자',
                tagColor: 'text-orange-400 border-orange-500/30',
              },
            ].map(item => (
              <div key={item.title} className="rounded-xl border border-surface-border bg-[#1a1d27] p-4">
                <div className="flex items-center gap-2 mb-2">
                  <p className="text-sm font-bold text-slate-200">{item.title}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${item.tagColor}`}>{item.tag}</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">5. 건강보험 관련 유용한 정보</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: '🏥', title: '건강보험 적용 항목', desc: '입원비·외래진료·약제비의 70~80% 건강보험에서 부담. 본인부담금은 20~30%.' },
              { icon: '💊', title: '본인부담 상한제', desc: '연간 본인부담 의료비가 소득 구간별 상한액 초과 시 초과분 환급.' },
              { icon: '📋', title: '건강보험료 환급', desc: '퇴직 또는 소득 변경 시 정산 후 초과 납부분은 환급됩니다.' },
              { icon: '📞', title: '문의처', desc: '국민건강보험공단 고객센터 ☎1577-1000 또는 nhis.or.kr' },
            ].map(item => (
              <div key={item.title} className="rounded-xl border border-surface-border bg-[#1a1d27] p-4">
                <p className="text-2xl mb-2">{item.icon}</p>
                <p className="text-sm font-bold text-slate-200 mb-1">{item.title}</p>
                <p className="text-xs text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">6. 자주 묻는 질문</h2>
          <div className="space-y-3">
            {[
              { q: '건강보험료는 언제 정산되나요?', a: '직장가입자는 매년 4월에 전년도 보수 총액을 기준으로 정산합니다. 전년도 소득이 높으면 추가 납부, 낮으면 환급됩니다.' },
              { q: '프리랜서(3.3% 원천징수)는 어느 쪽인가요?', a: '프리랜서는 사업소득자로 지역가입자입니다. 단, 연 소득이 2,000만원 이하이고 재산·차량이 기준 이하면 가족 직장가입자의 피부양자로 등록 가능합니다.' },
              { q: '육아휴직 중에도 건강보험료를 내나요?', a: '육아휴직 기간 중에는 직장가입자 자격이 유지되지만 실제 소득이 없으므로 보험료가 경감됩니다. 휴직 전 납부액의 60%가 면제됩니다.' },
              { q: '건강보험료 미납 시 어떻게 되나요?', a: '6개월 이상 체납 시 보험급여가 제한될 수 있습니다. 분할납부·납부유예 제도를 활용할 수 있습니다. 건강보험공단(1577-1000)에 상담하세요.' },
            ].map((faq, i) => (
              <div key={i} className="rounded-xl border border-surface-border bg-[#1a1d27] p-4">
                <p className="text-sm font-bold text-slate-200 mb-2">Q. {faq.q}</p>
                <p className="text-sm text-slate-400 leading-relaxed">A. {faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="rounded-xl border border-brand-500/30 bg-brand-500/10 p-6 text-center">
          <p className="text-lg font-bold text-white mb-2">내 건강보험료 바로 계산하기</p>
          <p className="text-sm text-slate-400 mb-4">월급 입력으로 4대보험 근로자·회사 부담분 즉시 계산</p>
          <Link href="/health-insurance"
            className="inline-block px-8 py-3 rounded-xl bg-brand-500 hover:bg-brand-400 text-white font-bold transition-all">
            건강보험료 계산기 열기 →
          </Link>
        </div>

        <div className="border-t border-surface-border pt-4 text-xs text-slate-600">
          본 가이드는 2025년 기준 일반적인 정보 제공 목적입니다.
          정확한 보험료는 국민건강보험공단(nhis.or.kr) 또는 ☎1577-1000에서 확인하세요.
        </div>
      </div>
    </div>
  )
}
