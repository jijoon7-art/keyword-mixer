import type { Metadata } from 'next'
import HashtagGenerator from '@/components/HashtagGenerator'

export const metadata: Metadata = {
  title: '해시태그 생성기 — 무료 인스타그램·유튜브·트위터 해시태그 자동 생성 | Keyword Mixer',
  description: '무료 해시태그 생성기. 키워드 입력으로 인스타그램·유튜브·트위터 최적화 해시태그 자동 생성. 인기 해시태그 추천, 팔로워 늘리는 SNS 마케팅 필수 도구.',
  keywords: '해시태그 생성기, 인스타그램 해시태그, 유튜브 해시태그, 해시태그 추천, hashtag generator, Instagram hashtag, YouTube hashtag',
  openGraph: {
    title: '해시태그 생성기 — 무료 인스타그램·유튜브·트위터 해시태그 자동 생성 | Keyword Mixer',
    description: '무료 해시태그 생성기. 키워드 입력으로 인스타그램·유튜브·트위터 최적화 해시태그 자동 생성. 인기 해시태그 추천, 팔로워 늘리는 SNS 마케팅 필수 도구.',
    url: 'https://keyword-mixer.vercel.app/hashtag-generator',
    siteName: 'Keyword Mixer — 무료 계산기·도구 모음',
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '해시태그 생성기 — 무료 인스타그램·유튜브·트위터 해시태그 자동 생성 | Keyword Mixer',
    description: '무료 해시태그 생성기. 키워드 입력으로 인스타그램·유튜브·트위터 최적화 해시태그 자동 생성. 인기 해시태그 추천, 팔로워 늘리는 SNS 마케팅 필수 도구.',
  },
  alternates: {
    canonical: 'https://keyword-mixer.vercel.app/hashtag-generator',
    languages: { 'ko-KR': 'https://keyword-mixer.vercel.app/hashtag-generator', 'en-US': 'https://keyword-mixer.vercel.app/hashtag-generator' },
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: '해시태그 생성기',
  url: 'https://keyword-mixer.vercel.app/hashtag-generator',
  description: '키워드로 인스타그램·유튜브 최적화 해시태그 자동 생성.',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Web Browser',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'KRW' },
  isAccessibleForFree: true,
  inLanguage: ['ko', 'en'],
}

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HashtagGenerator />
    </>
  )
}
