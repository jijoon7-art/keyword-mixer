import type { Metadata } from 'next'
import ColorTemperature from '@/components/ColorTemperature'
export const metadata: Metadata = {
  title: '색온도 변환기 (K↔RGB) — 켈빈 색온도 | Color Temperature',
  description: '무료 색온도 변환기. 켈빈(K)을 RGB·HEX 색상으로 변환. 조명 색온도 시각화. Free Kelvin to RGB color temperature converter.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/color-temperature' },
}
export default function Page() { return <ColorTemperature /> }
