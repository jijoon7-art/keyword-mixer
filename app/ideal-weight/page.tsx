import type { Metadata } from 'next'
import IdealWeight from '@/components/IdealWeight'

export const metadata: Metadata = {
  title: '[2025 최신] 이상 체중 계산기 표준 체중 BMI | Keyword Mixer 무료 계산기',
  description: '무료 이상 체중 계산기. 키·성별로 표준 체중·BMI·정상 범위·감량 목표 칼로리 계산. Free ideal weight calculator.',
  keywords: '이상 체중, 표준 체중, 적정 체중, 체중 감량 목표, ideal weight calculator, target weight',
  openGraph: {
    title: '[2025] 이상 체중 계산기 표준 체중 BMI | Keyword Mixer',
    description: '무료 이상 체중 계산기. 키·성별로 표준 체중·BMI·정상 범위·감량 목표 칼로리 계산. Free ideal weight calculator.',
    url: 'https://keyword-mixer.vercel.app/ideal-weight',
    siteName: 'Keyword Mixer — 무료 계산기',
    locale: 'ko_KR',
    type: 'website',
  },
  alternates: {
    canonical: 'https://keyword-mixer.vercel.app/ideal-weight',
    languages: { 'ko-KR': 'https://keyword-mixer.vercel.app/ideal-weight', 'en-US': 'https://keyword-mixer.vercel.app/ideal-weight' },
  },
  robots: { index: true, follow: true },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: '이상 체중 계산기 표준 체중 BMI',
  url: 'https://keyword-mixer.vercel.app/ideal-weight',
  applicationCategory: 'UtilitiesApplication',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'KRW' },
  isAccessibleForFree: true,
  inLanguage: ['ko', 'en'],
}

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <IdealWeight />
    </>
  )
}
