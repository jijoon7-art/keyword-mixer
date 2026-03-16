import type { Metadata } from 'next'
import TextTools from '@/components/TextTools'
export const metadata: Metadata = {
  title: '텍스트 도구 모음 — 무료 대소문자·줄번호·중복제거·정렬',
  description: '무료 텍스트 도구 모음. 대소문자 변환, 줄번호 추가/제거, 중복 줄 제거, 정렬, 공백 처리 등 20가지 텍스트 변환.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/text-tools' },
}
export default function Page() { return <TextTools /> }
