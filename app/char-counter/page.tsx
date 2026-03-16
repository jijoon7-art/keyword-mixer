import type { Metadata } from 'next'
import CharCounter from '@/components/CharCounter'

export const metadata: Metadata = {
  title: '글자수 세기 — 무료 글자수 카운터 · 바이트 계산기',
  description: '무료 글자수 세기 도구. 공백 포함/제외 글자수, 바이트, 단어수, 문장수 실시간 계산. 네이버 블로그·카카오·SNS 글자수 제한 확인.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/char-counter' },
}

export default function CharCounterPage() {
  return <CharCounter />
}
