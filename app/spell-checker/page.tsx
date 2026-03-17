import type { Metadata } from 'next'
import SpellChecker from '@/components/SpellChecker'
export const metadata: Metadata = {
  title: '맞춤법 검사기 — 한국어 맞춤법 교정 가이드',
  description: '자주 틀리는 한국어 맞춤법 확인. 네이버 맞춤법 검사기 바로가기. Korean spelling guide.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/spell-checker' },
}
export default function Page() { return <SpellChecker /> }
