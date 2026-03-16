import type { Metadata } from 'next'
import UnitConverter from '@/components/UnitConverter'
export const metadata: Metadata = {
  title: '단위 변환기 — 무료 길이/무게/온도/넓이/속도 단위 변환',
  description: '무료 단위 변환기. 길이·무게·온도·넓이·속도·용량 단위를 즉시 변환. 미터↔인치, 섭씨↔화씨, kg↔lb, 평↔m² 등 모든 단위 한번에 변환.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/unit-converter' },
}
export default function Page() { return <UnitConverter /> }
