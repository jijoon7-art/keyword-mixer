import type { Metadata } from 'next'
import LineBreakRemover from '@/components/LineBreakRemover'
export const metadata: Metadata = {
  title: '줄바꿈 제거기 — 텍스트 정리 · Line Break Remover',
  description: '줄바꿈·공백 텍스트 정리. PDF 복사 텍스트 정리에 최적. Remove line breaks and clean text instantly.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/line-break-remover' },
}
export default function Page() { return <LineBreakRemover /> }
