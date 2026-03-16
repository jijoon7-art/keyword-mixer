import type { Metadata } from 'next'
import KeywordMixer from '@/components/KeywordMixer'

export const metadata: Metadata = {
  title: '키워드 조합기 — 무료 키워드 생성기 · SEO키워드 자동 조합 도구',
  description:
    '무료 키워드 조합기 · 키워드 생성기. SEO키워드를 그룹별로 자동 조합하고 중복 제거 후 엑셀·CSV·TXT로 다운로드. 키워드 믹서 · 키워드 자동 조합 · 네이버·구글·쿠팡 SEO 최적화. Free keyword combiner tool.',
  alternates: { canonical: 'https://keywordmixer.app' },
  openGraph: {
    title: '키워드 조합기 — 무료 키워드 생성기 · SEO키워드 조합 도구',
    description: '무료 키워드 조합기 · 키워드 생성기. SEO키워드 자동 조합 → 엑셀·CSV 다운로드.',
  },
}

export default function HomePage() {
  return <KeywordMixer />
}
