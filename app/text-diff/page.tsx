import type { Metadata } from 'next'
import TextDiff from '@/components/TextDiff'
export const metadata: Metadata = {
  title: '텍스트 비교기 DIFF — 무료 온라인 Diff 도구 | Text Diff Checker',
  description: '무료 텍스트 DIFF 비교기. 두 텍스트의 차이점을 즉시 비교. 추가·삭제 줄 색상 구분. Free online text diff tool - compare two texts and find differences instantly.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/text-diff' },
}
export default function Page() { return <TextDiff /> }
