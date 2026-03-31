import type { Metadata } from 'next'
import PaintCalculator from '@/components/PaintCalculator'

export const metadata: Metadata = {
  title: '[2025 최신] 페인트 계산기 도배 계산기 | Keyword Mixer 무료 계산기',
  description: '무료 페인트/도배 계산기. 방 크기로 필요한 페인트 양과 도배지 롤 수 자동 계산. 문·창문 면적 자동 공제. Free paint calculator.',
  keywords: '페인트 계산기, 도배 계산기, 페인트 필요량, 도배지 롤 수, paint calculator',
  openGraph: {
    title: '[2025] 페인트 계산기 도배 계산기 | Keyword Mixer',
    description: '무료 페인트/도배 계산기. 방 크기로 필요한 페인트 양과 도배지 롤 수 자동 계산. 문·창문 면적 자동 공제. Free paint calculator.',
    url: 'https://keyword-mixer.vercel.app/paint-calculator',
    siteName: 'Keyword Mixer — 무료 계산기',
    locale: 'ko_KR',
    type: 'website',
  },
  alternates: {
    canonical: 'https://keyword-mixer.vercel.app/paint-calculator',
    languages: { 'ko-KR': 'https://keyword-mixer.vercel.app/paint-calculator', 'en-US': 'https://keyword-mixer.vercel.app/paint-calculator' },
  },
  robots: { index: true, follow: true },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: '페인트 계산기 도배 계산기',
  url: 'https://keyword-mixer.vercel.app/paint-calculator',
  applicationCategory: 'UtilitiesApplication',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'KRW' },
  isAccessibleForFree: true,
  inLanguage: ['ko', 'en'],
}

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PaintCalculator />
    </>
  )
}
