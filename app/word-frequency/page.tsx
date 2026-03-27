import type { Metadata } from 'next'
import WordFrequency from '@/components/WordFrequency'
export const metadata: Metadata = {
  title: '단어 빈도 분석기 — 텍스트 키워드 빈도 SEO 분석 | Word Frequency',
  description: '무료 단어 빈도 분석기. 텍스트에서 단어 빈도 분석. SEO 키워드 밀도 확인. Free word frequency analyzer.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/word-frequency' },
}
export default function Page() { return <WordFrequency /> }
