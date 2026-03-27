import type { Metadata } from 'next'
import NumberBaseConverter from '@/components/NumberBaseConverter'
export const metadata: Metadata = {
  title: '진법 변환기 — 2진수 8진수 16진수 10진수 변환 | Number Base',
  description: '무료 진법 변환기. 2·8·10·16진법 즉시 변환, 비트 시각화. Free binary octal hexadecimal converter.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/number-base-converter' },
}
export default function Page() { return <NumberBaseConverter /> }
