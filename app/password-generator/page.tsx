import type { Metadata } from 'next'
import PasswordGenerator from '@/components/PasswordGenerator'
export const metadata: Metadata = {
  title: '비밀번호 생성기 — 무료 안전한 비밀번호 | Password Generator',
  description: '무료 비밀번호 생성기. Free strong password generator - create secure random passwords with custom length and character options. No data stored.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/password-generator' },
}
export default function Page() { return <PasswordGenerator /> }
