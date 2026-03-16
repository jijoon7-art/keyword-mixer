import type { Metadata } from 'next'
import PasswordGenerator from '@/components/PasswordGenerator'
export const metadata: Metadata = {
  title: '비밀번호 생성기 — 무료 안전한 랜덤 비밀번호 만들기',
  description: '무료 랜덤 비밀번호 생성기. 길이·문자 조합 맞춤 설정, 최대 10개 동시 생성. 강도 표시, 헷갈리는 문자 제외 옵션. 완전 로컬 처리로 보안 안전.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/password-generator' },
}
export default function Page() { return <PasswordGenerator /> }
