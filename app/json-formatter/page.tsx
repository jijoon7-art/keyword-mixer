import type { Metadata } from 'next'
import JsonFormatter from '@/components/JsonFormatter'
export const metadata: Metadata = {
  title: 'JSON 포맷터 — 무료 JSON 정렬·압축·검증기',
  description: '무료 JSON 포맷터. JSON 보기 좋게 정렬·압축·키 정렬·유효성 검증. 오류 위치 표시, 통계 분석, JSON 파일 다운로드.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/json-formatter' },
}
export default function Page() { return <JsonFormatter /> }
