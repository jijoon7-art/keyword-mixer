import type { Metadata } from 'next'
import JwtDecoder from '@/components/JwtDecoder'
export const metadata: Metadata = {
  title: 'JWT 디코더 — JSON Web Token 파싱 | JWT Decoder',
  description: '무료 JWT 디코더. 토큰 헤더·페이로드·만료시간 분석. Free JSON Web Token decoder.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/jwt-decoder' },
}
export default function Page() { return <JwtDecoder /> }
