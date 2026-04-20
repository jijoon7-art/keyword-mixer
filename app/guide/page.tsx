import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '계산기 사용 가이드 — 퇴직금·세금·대출·건강 계산 방법 완벽 정리 | Keyword Mixer',
  description: '퇴직금 계산 방법, 부가세 계산법, 주택담보대출 한도, BMI 기준 등 생활에 필요한 계산 가이드를 제공합니다. 어렵게 느껴지는 계산을 쉽게 이해하세요.',
  keywords: '퇴직금 계산 방법, 부가세 계산법, BMI 기준, 주택담보대출 한도, 연말정산 방법, 계산기 가이드',
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://keyword-mixer.vercel.app/guide' },
  openGraph: {
    title: '계산기 사용 가이드 | Keyword Mixer',
    description: '퇴직금·세금·대출·건강 계산 방법 완벽 가이드',
    url: 'https://keyword-mixer.vercel.app/guide',
    type: 'website',
  },
}

const GUIDES = [
  {
    category: '💰 금융·세금',
    items: [
      { href: '/guide/severance-pay-guide', title: '퇴직금 계산 방법 완벽 가이드', desc: '평균임금 계산부터 퇴직소득세, IRP까지 단계별 설명', tags: ['퇴직금', '퇴직소득세', 'IRP'] },
      { href: '/guide/tax-guide', title: '연말정산 환급액 계산하는 법', desc: '공제 항목별 절세 방법과 환급액 최대화 전략', tags: ['연말정산', '세액공제', '환급'] },
      { href: '/guide/mortgage-guide', title: '주택담보대출 한도·이자 계산법', desc: 'LTV, DSR, DTI 규제와 월 상환액 계산 방법', tags: ['주담대', 'LTV', 'DSR'] },
    ],
  },
  {
    category: '🏥 건강·다이어트',
    items: [
      { href: '/guide/bmi-guide', title: 'BMI 계산법과 한국인 비만 기준', desc: '한국인에게 맞는 아시아 기준 BMI와 건강 체중 관리법', tags: ['BMI', '비만도', '체질량지수'] },
    ],
  },
]

export default function GuidePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-mono mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400" />계산기 가이드
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-4">계산기 사용 가이드</h1>
        <p className="text-slate-300 text-lg max-w-2xl mx-auto">
          퇴직금, 세금, 대출, 건강 계산 방법을 쉽게 설명합니다.
          어렵게 느껴지는 계산 공식을 단계별로 이해하세요.
        </p>
      </div>

      <div className="space-y-8">
        {GUIDES.map(group => (
          <div key={group.category}>
            <h2 className="text-lg font-bold text-white mb-4">{group.category}</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {group.items.map(item => (
                <Link key={item.href} href={item.href}
                  className="block rounded-xl border border-surface-border bg-[#1a1d27] p-5 hover:border-brand-500/40 transition-all group">
                  <h3 className="text-sm font-bold text-slate-200 mb-2 group-hover:text-brand-300 transition-all">{item.title}</h3>
                  <p className="text-xs text-slate-400 mb-3 leading-relaxed">{item.desc}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {item.tags.map(tag => (
                      <span key={tag} className="text-xs px-2 py-0.5 rounded border border-surface-border bg-[#0f1117] text-slate-500">{tag}</span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-xl border border-surface-border bg-[#1a1d27] p-5">
        <h2 className="text-sm font-bold text-slate-200 mb-3">🔢 바로 계산하기</h2>
        <div className="flex flex-wrap gap-2">
          {[
            ['퇴직금 계산기', '/severance-pay'],
            ['BMI 계산기', '/bmi-calculator-pro'],
            ['부가세 계산기', '/vat-calculator'],
            ['연말정산 계산기', '/tax-refund'],
            ['주택담보대출', '/mortgage-calculator'],
            ['최저임금 계산기', '/minimum-wage'],
          ].map(([label, href]) => (
            <Link key={href} href={href}
              className="text-xs px-3 py-1.5 rounded-lg border border-surface-border bg-[#0f1117] text-slate-300 hover:border-brand-500/40 hover:text-brand-300 transition-all">
              {label} →
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
