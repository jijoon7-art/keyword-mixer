import type { Metadata } from 'next'
import Base64Tool from '@/components/Base64Tool'
export const metadata: Metadata = {
  title: 'Base64 인코더 디코더 — 무료 온라인 Base64 변환기',
  description: '무료 Base64 인코더/디코더. 텍스트를 Base64로 인코딩하거나 디코딩. URL-safe 모드, 한국어 완벽 지원. 브라우저에서 처리되어 데이터 보안 보장.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/base64' },
}
export default function Page() { return <Base64Tool /> }
