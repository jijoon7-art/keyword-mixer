import type { Metadata } from 'next'
import TextToTable from '@/components/TextToTable'
export const metadata: Metadata = {
  title: '텍스트 표 변환기 — CSV HTML Markdown JSON 변환 | Text to Table',
  description: '무료 텍스트 표 변환기. CSV·TSV를 HTML·Markdown·JSON 표로 즉시 변환. Free text to table converter.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/text-to-table' },
}
export default function Page() { return <TextToTable /> }
