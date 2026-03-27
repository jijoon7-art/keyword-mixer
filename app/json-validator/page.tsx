import type { Metadata } from 'next'
import JsonValidator from '@/components/JsonValidator'
export const metadata: Metadata = {
  title: 'JSON 유효성 검사기 정렬기 — JSON Validator Formatter | JSON',
  description: '무료 JSON 유효성 검사기. JSON 오류 감지·정렬·축소·타입 분석. Free JSON validator and formatter online.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/json-validator' },
}
export default function Page() { return <JsonValidator /> }
