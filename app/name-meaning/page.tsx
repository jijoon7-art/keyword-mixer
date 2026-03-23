import type { Metadata } from 'next'
import NameMeaning from '@/components/NameMeaning'
export const metadata: Metadata = {
  title: '이름 의미 분석기 — 한글 이름 뜻 성씨 유래 | Name Meaning',
  description: '무료 한글 이름 의미 분석기. 성씨 유래, 이름자 한자 의미, 오행 분석. Free Korean name analyzer.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/name-meaning' },
}
export default function Page() { return <NameMeaning /> }
