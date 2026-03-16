import type { Metadata } from 'next'
import AgeCalculator from '@/components/AgeCalculator'
export const metadata: Metadata = {
  title: '나이 계산기 — 만 나이·한국 나이·띠·다음 생일 계산',
  description: '무료 나이 계산기. 만 나이·한국 나이·태어난 날수 즉시 계산. 띠·다음 생일 D-day·100일 기념일까지 한번에 확인.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/age-calculator' },
}
export default function Page() { return <AgeCalculator /> }
