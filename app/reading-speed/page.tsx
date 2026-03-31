import type { Metadata } from 'next'
import ReadingSpeed from '@/components/ReadingSpeed'

export const metadata: Metadata = {
  title: '[2025 최신] 독서 속도 완독 시간 계산기 WPM | Keyword Mixer 무료 계산기',
  description: '무료 독서 속도 계산기. WPM으로 완독 시간과 하루 독서 계획 계산. 인기 책 프리셋 포함. Free reading speed calculator.',
  keywords: '독서 속도 계산기, WPM 계산, 완독 시간, 책 읽는 시간, reading speed calculator',
  openGraph: {
    title: '[2025] 독서 속도 완독 시간 계산기 WPM | Keyword Mixer',
    description: '무료 독서 속도 계산기. WPM으로 완독 시간과 하루 독서 계획 계산. 인기 책 프리셋 포함. Free reading speed calculator.',
    url: 'https://keyword-mixer.vercel.app/reading-speed',
    siteName: 'Keyword Mixer — 무료 계산기',
    locale: 'ko_KR',
    type: 'website',
  },
  alternates: {
    canonical: 'https://keyword-mixer.vercel.app/reading-speed',
    languages: { 'ko-KR': 'https://keyword-mixer.vercel.app/reading-speed', 'en-US': 'https://keyword-mixer.vercel.app/reading-speed' },
  },
  robots: { index: true, follow: true },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: '독서 속도 완독 시간 계산기 WPM',
  url: 'https://keyword-mixer.vercel.app/reading-speed',
  applicationCategory: 'UtilitiesApplication',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'KRW' },
  isAccessibleForFree: true,
  inLanguage: ['ko', 'en'],
}

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ReadingSpeed />
    </>
  )
}
