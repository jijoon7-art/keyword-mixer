import type { Metadata } from 'next'
import HeightPredictor from '@/components/HeightPredictor'
export const metadata: Metadata = {
  title: '키 성장 예측기 — 부모 키로 아이 키 예측 | Height Predictor',
  description: '무료 키 성장 예측기. 부모 키로 자녀 예상 성인키 계산. Free child adult height predictor from parents heights.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/height-predictor' },
}
export default function Page() { return <HeightPredictor /> }
