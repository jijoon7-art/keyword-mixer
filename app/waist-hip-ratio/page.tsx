import type { Metadata } from 'next'
import WaistHipRatio from '@/components/WaistHipRatio'
export const metadata: Metadata = {
  title: '허리 엉덩이 비율 계산기 WHR — 복부비만 판정 | WHR',
  description: '무료 허리 엉덩이 비율(WHR) 계산기. WHO 기준 복부비만 위험도 판정. Free waist-hip ratio calculator.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/waist-hip-ratio' },
}
export default function Page() { return <WaistHipRatio /> }
