import type { Metadata } from 'next'
import LuckyNumber from '@/components/LuckyNumber'

export const metadata: Metadata = {
  title: '[2025 최신] 행운 번호 생성기 수비학 인생번호 | Keyword Mixer 무료 계산기',
  description: '무료 수비학 행운 번호 생성기. 이름·생년월일로 인생번호·운명번호·오늘의 행운번호 계산. Free numerology lucky number generator.',
  keywords: '행운 번호, 수비학, 인생 번호, 운명 번호, 오늘의 행운 번호, lucky number generator, numerology',
  openGraph: {
    title: '[2025] 행운 번호 생성기 수비학 인생번호 | Keyword Mixer',
    description: '무료 수비학 행운 번호 생성기. 이름·생년월일로 인생번호·운명번호·오늘의 행운번호 계산. Free numerology lucky number generator.',
    url: 'https://keyword-mixer.vercel.app/lucky-number',
    siteName: 'Keyword Mixer — 무료 계산기',
    locale: 'ko_KR',
    type: 'website',
  },
  alternates: {
    canonical: 'https://keyword-mixer.vercel.app/lucky-number',
    languages: { 'ko-KR': 'https://keyword-mixer.vercel.app/lucky-number', 'en-US': 'https://keyword-mixer.vercel.app/lucky-number' },
  },
  robots: { index: true, follow: true },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: '행운 번호 생성기 수비학 인생번호',
  url: 'https://keyword-mixer.vercel.app/lucky-number',
  applicationCategory: 'UtilitiesApplication',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'KRW' },
  isAccessibleForFree: true,
  inLanguage: ['ko', 'en'],
}

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <LuckyNumber />
    </>
  )
}
