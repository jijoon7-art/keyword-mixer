import type { Metadata } from 'next'
import JsonCsvConverter from '@/components/JsonCsvConverter'
export const metadata: Metadata = {
  title: 'JSON CSV 변환기 — 무료 JSON to CSV · CSV to JSON 변환 도구',
  description: '무료 JSON CSV 변환기. JSON을 CSV로, CSV를 JSON으로 즉시 변환. 중첩 객체 자동 평탄화, 엑셀 다운로드 지원. 브라우저에서 처리되어 데이터 보안 보장.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/json-csv' },
}
export default function Page() { return <JsonCsvConverter /> }
