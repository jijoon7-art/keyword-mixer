import type { Metadata } from 'next'
import NumberConverter from '@/components/NumberConverter'
export const metadata: Metadata = {
  title: '진법 변환기 — 2진수·16진수 변환 | Number Base Converter',
  description: '무료 진법 변환기. 2/8/10/16진수 즉시 변환. ASCII 코드 변환. Free binary hex decimal converter.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/number-converter' },
}
export default function Page() { return <NumberConverter /> }
