import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'BMI 계산법과 한국인 비만 기준 완벽 가이드 2025 | Keyword Mixer',
  description: '2025년 한국인 BMI 계산법과 비만 기준 완벽 가이드. 아시아 기준 BMI 정상범위, 체지방률, 비만 예방법까지. BMI 18.5 이하 저체중, 23 이상 과체중 기준 설명.',
  keywords: 'BMI 계산법, 한국인 BMI 기준, 비만도 기준, 체질량지수 정상범위, BMI 18.5, BMI 23, 체지방률, 아시아 비만 기준',
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://keyword-mixer.vercel.app/guide/bmi-guide' },
  openGraph: {
    title: 'BMI 계산법과 한국인 비만 기준 2025',
    description: '한국인에게 맞는 아시아 기준 BMI 정상범위와 건강 체중 관리법',
    url: 'https://keyword-mixer.vercel.app/guide/bmi-guide',
    type: 'article',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'BMI 계산법과 한국인 비만 기준 완벽 가이드 2025',
  description: '한국인 BMI 정상범위와 체지방률 계산법, 비만 예방법.',
  url: 'https://keyword-mixer.vercel.app/guide/bmi-guide',
  author: { '@type': 'Organization', name: 'Keyword Mixer' },
  publisher: { '@type': 'Organization', name: 'Keyword Mixer' },
  dateModified: '2025-04-01',
  inLanguage: 'ko',
}

export default function BmiGuide() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
        <Link href="/" className="hover:text-brand-400 transition-all">홈</Link>
        <span>›</span>
        <Link href="/guide" className="hover:text-brand-400 transition-all">가이드</Link>
        <span>›</span>
        <span className="text-slate-400">BMI 가이드</span>
      </div>

      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs mb-4">
          🏥 건강 가이드 · 2025년 기준
        </div>
        <h1 className="text-3xl font-extrabold text-white mb-4">BMI 계산법과 한국인 비만 기준 완벽 가이드</h1>
        <p className="text-slate-300 leading-relaxed">
          BMI(체질량지수)는 키와 몸무게로 비만도를 측정하는 지표입니다.
          한국인에게 적용되는 아시아 기준 BMI 정상범위, 계산법, 체지방률과의 차이,
          그리고 건강 체중 관리법까지 정리했습니다.
        </p>
      </div>

      <div className="rounded-xl border border-brand-500/30 bg-brand-500/10 p-4 mb-8 flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-brand-300 mb-1">🔢 BMI 바로 계산하기</p>
          <p className="text-xs text-slate-400">키·몸무게 입력으로 BMI·체지방률·기초대사율 즉시 계산</p>
        </div>
        <Link href="/bmi-calculator-pro"
          className="px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-400 text-white text-xs font-bold transition-all flex-shrink-0">
          계산기 열기 →
        </Link>
      </div>

      <div className="space-y-10 text-slate-300">

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">1. BMI 계산 공식</h2>
          <div className="rounded-xl border border-brand-500/30 bg-[#1a1d27] p-5 mb-4">
            <p className="text-xs text-slate-400 mb-2 font-mono">BMI 계산 공식</p>
            <p className="text-xl font-bold text-brand-400 font-mono mb-3">
              BMI = 체중(kg) ÷ 키(m)²
            </p>
            <div className="border-t border-surface-border pt-3">
              <p className="text-xs text-slate-500">예시: 키 170cm, 체중 68kg</p>
              <p className="text-xs text-slate-400 font-mono mt-1">
                BMI = 68 ÷ (1.70 × 1.70) = 68 ÷ 2.89 = <span className="text-brand-400 font-bold">23.5</span>
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">2. 한국인(아시아) BMI 기준표</h2>
          <p className="text-sm mb-4">
            서양(WHO) 기준과 달리 한국을 포함한 아시아인은 같은 BMI라도 체지방률이 높고
            대사증후군 위험이 크기 때문에 더 엄격한 기준을 사용합니다.
          </p>
          <div className="rounded-xl border border-surface-border bg-[#1a1d27] overflow-hidden mb-4">
            <div className="grid grid-cols-3 bg-[#0f1117] px-4 py-2 text-xs text-slate-500 font-medium">
              <span>BMI 범위</span><span className="text-center">한국/아시아 기준</span><span className="text-right">서양(WHO) 기준</span>
            </div>
            {[
              { bmi: '18.5 미만', korean: '저체중', who: '저체중', koColor: 'text-blue-400', whoColor: 'text-blue-400' },
              { bmi: '18.5 ~ 22.9', korean: '정상', who: '정상', koColor: 'text-brand-400', whoColor: 'text-brand-400' },
              { bmi: '23.0 ~ 24.9', korean: '과체중', who: '정상', koColor: 'text-yellow-400', whoColor: 'text-brand-400' },
              { bmi: '25.0 ~ 29.9', korean: '비만 1단계', who: '과체중', koColor: 'text-orange-400', whoColor: 'text-yellow-400' },
              { bmi: '30.0 이상', korean: '비만 2단계', who: '비만', koColor: 'text-red-400', whoColor: 'text-orange-400' },
            ].map(row => (
              <div key={row.bmi} className="grid grid-cols-3 px-4 py-2.5 border-t border-surface-border text-sm">
                <span className="text-slate-400 font-mono text-xs">{row.bmi}</span>
                <span className={`text-center font-bold text-sm ${row.koColor}`}>{row.korean}</span>
                <span className={`text-right text-sm ${row.whoColor}`}>{row.who}</span>
              </div>
            ))}
          </div>
          <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-4">
            <p className="text-yellow-300 text-sm font-semibold mb-1">⚠️ 핵심 차이점</p>
            <p className="text-sm text-slate-400">
              서양 기준으로 BMI 23~24.9는 "정상"이지만, 한국 기준으로는 "과체중"입니다.
              건강검진 결과에서 "과체중" 판정을 받아 의아했다면 이 차이 때문입니다.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">3. BMI의 한계와 체지방률</h2>
          <p className="text-sm mb-4">BMI는 간단하지만 완벽하지 않습니다. 다음과 같은 한계가 있습니다:</p>
          <div className="grid grid-cols-1 gap-3 mb-4">
            {[
              { title: '근육량 반영 불가', desc: '보디빌더처럼 근육량이 많은 사람은 BMI가 높게 나오지만 실제로는 건강할 수 있습니다.', icon: '💪' },
              { title: '연령 미반영', desc: '나이가 들면 근육량이 줄고 체지방이 늘어나는데, BMI는 이를 구분하지 못합니다.', icon: '👴' },
              { title: '체형 분포 무시', desc: '복부비만인지 균형적인 분포인지를 고려하지 않습니다. 허리-엉덩이 비율(WHR)이 보완 지표가 됩니다.', icon: '📐' },
            ].map(item => (
              <div key={item.title} className="rounded-xl border border-surface-border bg-[#1a1d27] p-4 flex gap-3">
                <span className="text-2xl flex-shrink-0">{item.icon}</span>
                <div>
                  <p className="text-sm font-bold text-slate-200 mb-1">{item.title}</p>
                  <p className="text-xs text-slate-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-4">
            <p className="text-blue-300 text-sm font-semibold mb-2">💡 더 정확한 체성분 측정</p>
            <p className="text-sm text-slate-400">
              병원이나 헬스장의 <strong className="text-blue-300">InBody(생체전기저항분석)</strong>를 이용하면
              체지방량, 근육량, 체수분을 정밀하게 측정할 수 있습니다.
              BMI와 함께 참고하면 더 정확한 건강 상태를 파악할 수 있습니다.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">4. 건강 체중 계산법</h2>
          <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-5">
            <h3 className="text-sm font-bold text-slate-200 mb-3">표준 체중 계산 공식</h3>
            <div className="space-y-3">
              {[
                { label: '남성', formula: '키(m)² × 22', example: '170cm → 1.7² × 22 = 63.5kg' },
                { label: '여성', formula: '키(m)² × 21', example: '160cm → 1.6² × 21 = 53.8kg' },
              ].map(r => (
                <div key={r.label} className="rounded-lg border border-surface-border bg-[#0f1117] p-3">
                  <p className="text-xs font-semibold text-slate-300 mb-1">{r.label}</p>
                  <p className="text-xs font-mono text-brand-400">{r.formula}</p>
                  <p className="text-xs text-slate-500 mt-1">예: {r.example}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">5. 자주 묻는 질문 (FAQ)</h2>
          <div className="space-y-3">
            {[
              { q: 'BMI 정상인데 배가 나왔어요. 괜찮나요?', a: '복부비만은 BMI와 별개입니다. 남성 허리둘레 90cm 이상, 여성 85cm 이상이면 복부비만입니다. 복부비만은 심혈관질환, 당뇨 위험을 높이므로 허리 관리가 중요합니다.' },
              { q: 'BMI가 낮으면 무조건 좋은 건가요?', a: '아닙니다. BMI 18.5 미만의 저체중은 영양 부족, 골다공증, 면역력 저하 등의 문제를 일으킬 수 있습니다. 정상 범위를 유지하는 것이 가장 좋습니다.' },
              { q: '어린이·청소년도 이 기준이 적용되나요?', a: '아니요. 18세 미만은 성장 단계별로 다른 기준(백분위수)을 사용합니다. 소아청소년 비만 기준은 대한비만학회 기준을 따릅니다.' },
              { q: 'BMI가 과체중인데 다이어트를 어떻게 시작하나요?', a: '급격한 식이제한보다 하루 500kcal 부족한 식단 + 주 3회 이상 유산소 운동 조합이 가장 효과적입니다. 월 2~4kg 감량이 건강한 속도입니다.' },
            ].map((faq, i) => (
              <div key={i} className="rounded-xl border border-surface-border bg-[#1a1d27] p-4">
                <p className="text-sm font-bold text-slate-200 mb-2">Q. {faq.q}</p>
                <p className="text-sm text-slate-400 leading-relaxed">A. {faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="rounded-xl border border-brand-500/30 bg-brand-500/10 p-6 text-center">
          <p className="text-lg font-bold text-white mb-2">내 BMI 직접 계산하기</p>
          <p className="text-sm text-slate-400 mb-4">체지방률·기초대사율·이상 체중까지 한번에 확인</p>
          <Link href="/bmi-calculator-pro"
            className="inline-block px-8 py-3 rounded-xl bg-brand-500 hover:bg-brand-400 text-white font-bold transition-all">
            BMI 계산기 열기 →
          </Link>
        </div>

        <div className="border-t border-surface-border pt-4 text-xs text-slate-600">
          본 가이드는 대한비만학회 및 WHO 자료를 참고하여 작성되었습니다.
          의료적 진단이 필요한 경우 전문 의료진과 상담하세요.
        </div>
      </div>
    </div>
  )
}
