import type { Metadata } from 'next'
import UnitPriceCalculator from '@/components/UnitPriceCalculator'

export const metadata: Metadata = {
  title: '[2025 최신] 단가 계산기 가성비 최저가 비교 | Keyword Mixer 무료 계산기',
  description: '무료 단가 계산기. 여러 상품의 단위당 가격 비교로 최저가 자동 표시. 마트 장보기 필수. Free unit price comparison.',
  keywords: '단가 계산기, 가성비 비교, 단위당 가격, 마트 가격 비교, unit price calculator',
  openGraph: {
    title: '[2025] 단가 계산기 가성비 최저가 비교 | Keyword Mixer',
    description: '무료 단가 계산기. 여러 상품의 단위당 가격 비교로 최저가 자동 표시. 마트 장보기 필수. Free unit price comparison.',
    url: 'https://keyword-mixer.vercel.app/unit-price-calculator',
    siteName: 'Keyword Mixer — 무료 계산기',
    locale: 'ko_KR',
    type: 'website',
  },
  alternates: {
    canonical: 'https://keyword-mixer.vercel.app/unit-price-calculator',
    languages: { 'ko-KR': 'https://keyword-mixer.vercel.app/unit-price-calculator', 'en-US': 'https://keyword-mixer.vercel.app/unit-price-calculator' },
  },
  robots: { index: true, follow: true },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: '단가 계산기 가성비 최저가 비교',
  url: 'https://keyword-mixer.vercel.app/unit-price-calculator',
  applicationCategory: 'UtilitiesApplication',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'KRW' },
  isAccessibleForFree: true,
  inLanguage: ['ko', 'en'],
}

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <UnitPriceCalculator />
    </>
  )
}
