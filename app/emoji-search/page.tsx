import type { Metadata } from 'next'
import EmojiSearch from '@/components/EmojiSearch'

export const metadata: Metadata = {
  title: '이모지 검색기 — 무료 이모티콘 찾기 · 한국어 이모지 검색 · 복사 | Keyword Mixer',
  description: '무료 이모지 검색기. 한국어로 이모지(이모티콘)를 검색하고 클릭 한 번으로 복사. 카카오톡·SNS·문서 작성에 활용. 3,600개 이상의 이모지 지원.',
  keywords: '이모지 검색기, 이모티콘 찾기, 한국어 이모지, 이모지 복사, emoji search Korean, emoticon search, emoji copy paste',
  openGraph: {
    title: '이모지 검색기 — 무료 이모티콘 찾기 · 한국어 이모지 검색 · 복사 | Keyword Mixer',
    description: '무료 이모지 검색기. 한국어로 이모지(이모티콘)를 검색하고 클릭 한 번으로 복사. 카카오톡·SNS·문서 작성에 활용. 3,600개 이상의 이모지 지원.',
    url: 'https://keyword-mixer.vercel.app/emoji-search',
    siteName: 'Keyword Mixer — 무료 계산기·도구 모음',
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '이모지 검색기 — 무료 이모티콘 찾기 · 한국어 이모지 검색 · 복사 | Keyword Mixer',
    description: '무료 이모지 검색기. 한국어로 이모지(이모티콘)를 검색하고 클릭 한 번으로 복사. 카카오톡·SNS·문서 작성에 활용. 3,600개 이상의 이모지 지원.',
  },
  alternates: {
    canonical: 'https://keyword-mixer.vercel.app/emoji-search',
    languages: { 'ko-KR': 'https://keyword-mixer.vercel.app/emoji-search', 'en-US': 'https://keyword-mixer.vercel.app/emoji-search' },
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: '이모지 검색기',
  url: 'https://keyword-mixer.vercel.app/emoji-search',
  description: '한국어로 이모지를 검색하고 클릭 한 번으로 복사.',
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
      <EmojiSearch />
    </>
  )
}
