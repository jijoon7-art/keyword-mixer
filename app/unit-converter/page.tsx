import type { Metadata } from 'next'
import UnitConverter from '@/components/UnitConverter'
export const metadata: Metadata = {
  title: '단위 변환기 — 길이·무게·온도 변환 | Unit Converter',
  description: '무료 단위 변환기. Free unit converter - length, weight, temperature, area, speed. Convert meters to feet, Celsius to Fahrenheit, kg to pounds instantly.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/unit-converter' },
}
export default function Page() { return <UnitConverter /> }
