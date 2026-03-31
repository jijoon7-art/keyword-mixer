import type { Metadata } from 'next'
import DateDiffCalculator from '@/components/DateDiffCalculator'

export const metadata: Metadata = {
  title: '[2025 최신] 날짜 계산기 두 날짜 사이 일수 | Keyword Mixer 무료 계산기',
  description: '무료 날짜 계산기. 두 날짜 사이 일수·근무일 계산. 날짜 더하기/빼기. D-day 계산. Free date difference calculator.',
  keywords: '날짜 계산기, 두 날짜 사이 일수, 근무일 계산, 날짜 더하기, D-day 계산, date calculator',
  openGraph: {
    title: '[2025] 날짜 계산기 두 날짜 사이 일수 | Keyword Mixer',
    description: '무료 날짜 계산기. 두 날짜 사이 일수·근무일 계산. 날짜 더하기/빼기. D-day 계산. Free date difference calculator.',
    url: 'https://keyword-mixer.vercel.app/date-diff-calculator',
    siteName: 'Keyword Mixer — 무료 계산기',
    locale: 'ko_KR',
    type: 'website',
  },
  alternates: {
    canonical: 'https://keyword-mixer.vercel.app/date-diff-calculator',
    languages: { 'ko-KR': 'https://keyword-mixer.vercel.app/date-diff-calculator', 'en-US': 'https://keyword-mixer.vercel.app/date-diff-calculator' },
  },
  robots: { index: true, follow: true },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: '날짜 계산기 두 날짜 사이 일수',
  url: 'https://keyword-mixer.vercel.app/date-diff-calculator',
  applicationCategory: 'UtilitiesApplication',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'KRW' },
  isAccessibleForFree: true,
  inLanguage: ['ko', 'en'],
}

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <DateDiffCalculator />
    </>
  )
}
