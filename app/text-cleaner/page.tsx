import type { Metadata } from 'next'
import TextCleaner from '@/components/TextCleaner'
export const metadata: Metadata = {
  title: '텍스트 정리 청소기 — 공백 제거 HTML 태그 제거 | Text Cleaner',
  description: '무료 텍스트 정리 도구. 공백·HTML 태그·특수문자 한번에 제거. Free text cleaner and formatter.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/text-cleaner' },
}
export default function Page() { return <TextCleaner /> }
