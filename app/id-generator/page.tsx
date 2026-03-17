import type { Metadata } from 'next'
import IdGenerator from '@/components/IdGenerator'
export const metadata: Metadata = {
  title: '주민등록번호 생성기 — 테스트용 가상 번호 | Korean ID Generator',
  description: '테스트용 가상 주민등록번호 생성. 개발 테스트 전용. Fake Korean RRN generator for testing only.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/id-generator' },
}
export default function Page() { return <IdGenerator /> }
