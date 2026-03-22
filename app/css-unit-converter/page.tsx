import type { Metadata } from 'next'
import CssUnitConverter from '@/components/CssUnitConverter'
export const metadata: Metadata = {
  title: 'CSS 단위 변환기 — px rem em vw vh 변환 | CSS Units',
  description: '무료 CSS 단위 변환기. px·em·rem·vw·vh·pt·cm 즉시 변환. Free CSS unit converter for responsive web development.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/css-unit-converter' },
}
export default function Page() { return <CssUnitConverter /> }
