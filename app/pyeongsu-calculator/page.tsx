import type { Metadata } from 'next'
import PyeongsuCalculator from '@/components/PyeongsuCalculator'
export const metadata: Metadata = {
  title: '평수 계산기 — 평 m² 변환 · Pyeong to Square Meter Converter',
  description: '무료 평수 계산기. 아파트 평수↔제곱미터 즉시 변환. 33평 몇m²? 전용면적·공급면적 안내. Free Korean Pyeong to square meter converter.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/pyeongsu-calculator' },
}
export default function Page() { return <PyeongsuCalculator /> }
