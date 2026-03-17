import type { Metadata } from 'next'
import UrlEncoder from '@/components/UrlEncoder'
export const metadata: Metadata = {
  title: 'URL 인코더/디코더 — Base64·HTML 엔티티 변환 | URL Encoder',
  description: '무료 URL 인코더/디코더. URL·Base64·HTML 엔티티 8가지 변환. 개발자 필수 도구. Free URL encoder decoder with Base64 and HTML entity conversion.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/url-encoder' },
}
export default function Page() { return <UrlEncoder /> }
