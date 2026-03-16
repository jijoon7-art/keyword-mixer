import type { Metadata } from 'next'
import LottoGenerator from '@/components/LottoGenerator'
export const metadata: Metadata = {
  title: '로또 번호 생성기 — 무료 로또 번호 추천 자동 생성',
  description: '무료 로또 번호 생성기. 랜덤 로또 6/45 번호 자동 생성. 포함/제외 번호 설정, 최대 10게임 동시 생성, 행운의 번호 추천.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/lotto' },
}
export default function Page() { return <LottoGenerator /> }
