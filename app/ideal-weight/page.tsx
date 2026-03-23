import type { Metadata } from 'next'
import IdealWeight from '@/components/IdealWeight'
export const metadata: Metadata = {
  title: '이상 체중 계산기 — 표준 체중 BMI 비만도 | Ideal Weight',
  description: '무료 이상 체중 계산기. 키·성별·나이로 표준 체중·BMI·정상 범위 계산. Free ideal weight and BMI calculator.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/ideal-weight' },
}
export default function Page() { return <IdealWeight /> }
