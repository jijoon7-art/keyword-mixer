import type { Metadata } from 'next'
import LottoGenerator from '@/components/LottoGenerator'
export const metadata: Metadata = {
  title: '로또 번호 생성기 — 무료 로또 자동 번호 | Lotto Number Generator',
  description: '무료 로또 번호 생성기. Free random lotto number generator - generate lucky lottery numbers with custom include/exclude options.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/lotto' },
}
export default function Page() { return <LottoGenerator /> }
