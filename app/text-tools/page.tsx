import type { Metadata } from 'next'
import TextTools from '@/components/TextTools'
export const metadata: Metadata = {
  title: '텍스트 도구 모음 — 대소문자·중복제거 | Text Tools',
  description: '무료 텍스트 도구. Free online text tools - convert uppercase/lowercase, remove duplicates, sort lines, add line numbers, and 20+ text transformations.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/text-tools' },
}
export default function Page() { return <TextTools /> }
