import type { Metadata } from 'next'
import TipCalculator from '@/components/TipCalculator'
export const metadata: Metadata = {
  title: '팁 계산기 / 더치페이 계산기 — 식사비 인당 계산 | Tip Calculator',
  description: '무료 팁 계산기. 팁 비율 계산, 인원별 더치페이 자동 계산. 나라별 팁 문화 가이드. Free tip calculator and bill splitter with country tip guide.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/tip-calculator' },
}
export default function Page() { return <TipCalculator /> }
