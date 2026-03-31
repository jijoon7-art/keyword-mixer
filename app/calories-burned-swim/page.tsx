import type { Metadata } from 'next'
import CaloriesBurnedSwim from '@/components/CaloriesBurnedSwim'

export const metadata: Metadata = {
  title: '[2025 최신] 수영 칼로리 소모 계산기 영법별 | Keyword Mixer 무료 계산기',
  description: '무료 수영 칼로리 계산기. 자유형·배영·평영·접영·아쿠아에어로빅 등 8가지 영법별 소모 칼로리. Free swimming calorie calculator.',
  keywords: '수영 칼로리, 자유형 칼로리, 평영 접영 칼로리, 수영 칼로리 소모, swimming calorie calculator',
  openGraph: {
    title: '[2025] 수영 칼로리 소모 계산기 영법별 | Keyword Mixer',
    description: '무료 수영 칼로리 계산기. 자유형·배영·평영·접영·아쿠아에어로빅 등 8가지 영법별 소모 칼로리. Free swimming calorie calculator.',
    url: 'https://keyword-mixer.vercel.app/calories-burned-swim',
    siteName: 'Keyword Mixer — 무료 계산기',
    locale: 'ko_KR',
    type: 'website',
  },
  alternates: {
    canonical: 'https://keyword-mixer.vercel.app/calories-burned-swim',
    languages: { 'ko-KR': 'https://keyword-mixer.vercel.app/calories-burned-swim', 'en-US': 'https://keyword-mixer.vercel.app/calories-burned-swim' },
  },
  robots: { index: true, follow: true },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: '수영 칼로리 소모 계산기 영법별',
  url: 'https://keyword-mixer.vercel.app/calories-burned-swim',
  applicationCategory: 'UtilitiesApplication',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'KRW' },
  isAccessibleForFree: true,
  inLanguage: ['ko', 'en'],
}

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <CaloriesBurnedSwim />
    </>
  )
}
