import type { Metadata } from 'next'
import TextDiff from '@/components/TextDiff'
export const metadata: Metadata = {
  title: '텍스트 비교기 — 무료 텍스트 차이 비교 · diff 도구',
  description: '무료 텍스트 비교기. 두 텍스트의 차이점을 한눈에 비교. 추가·삭제·동일 줄을 색상으로 구분. 공백·대소문자 무시 옵션, diff 결과 복사.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/text-diff' },
}
export default function Page() { return <TextDiff /> }
