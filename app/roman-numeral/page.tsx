import type { Metadata } from 'next'
import RomanNumeral from '@/components/RomanNumeral'
export const metadata: Metadata = {
  title: '로마 숫자 변환기 — 아라비아 숫자↔로마 숫자 | Roman Numeral',
  description: '무료 로마 숫자 변환기. 숫자↔로마 숫자 즉시 변환. 2024=MMXXIV. Free Roman numeral converter with reference table.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/roman-numeral' },
}
export default function Page() { return <RomanNumeral /> }
