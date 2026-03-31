import type { Metadata } from 'next'
import ConcreteCalculator from '@/components/ConcreteCalculator'

export const metadata: Metadata = {
  title: '[2025 최신] 콘크리트 계산기 시멘트 포대 수 | Keyword Mixer 무료 계산기',
  description: '무료 콘크리트 계산기. 면적·두께로 시멘트·모래·자갈 필요량과 시멘트 포대 수 계산. Free concrete calculator.',
  keywords: '콘크리트 계산기, 시멘트 계산기, 시멘트 포대 수, 콘크리트 양 계산, concrete calculator',
  openGraph: {
    title: '[2025] 콘크리트 계산기 시멘트 포대 수 | Keyword Mixer',
    description: '무료 콘크리트 계산기. 면적·두께로 시멘트·모래·자갈 필요량과 시멘트 포대 수 계산. Free concrete calculator.',
    url: 'https://keyword-mixer.vercel.app/concrete-calculator',
    siteName: 'Keyword Mixer — 무료 계산기',
    locale: 'ko_KR',
    type: 'website',
  },
  alternates: {
    canonical: 'https://keyword-mixer.vercel.app/concrete-calculator',
    languages: { 'ko-KR': 'https://keyword-mixer.vercel.app/concrete-calculator', 'en-US': 'https://keyword-mixer.vercel.app/concrete-calculator' },
  },
  robots: { index: true, follow: true },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: '콘크리트 계산기 시멘트 포대 수',
  url: 'https://keyword-mixer.vercel.app/concrete-calculator',
  applicationCategory: 'UtilitiesApplication',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'KRW' },
  isAccessibleForFree: true,
  inLanguage: ['ko', 'en'],
}

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ConcreteCalculator />
    </>
  )
}
