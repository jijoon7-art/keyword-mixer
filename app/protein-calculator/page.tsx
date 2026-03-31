import type { Metadata } from 'next'
import ProteinCalculator from '@/components/ProteinCalculator'

export const metadata: Metadata = {
  title: '[2025 최신] 단백질 섭취량 계산기 하루 단백질 | Keyword Mixer 무료 계산기',
  description: '무료 단백질 섭취량 계산기. 체중·목표·활동량으로 하루 권장 단백질. 고단백 식품 목록 제공. Free daily protein intake calculator.',
  keywords: '단백질 섭취량, 하루 단백질 권장량, 근성장 단백질, 체중별 단백질, protein calculator',
  openGraph: {
    title: '[2025] 단백질 섭취량 계산기 하루 단백질 | Keyword Mixer',
    description: '무료 단백질 섭취량 계산기. 체중·목표·활동량으로 하루 권장 단백질. 고단백 식품 목록 제공. Free daily protein intake calculator.',
    url: 'https://keyword-mixer.vercel.app/protein-calculator',
    siteName: 'Keyword Mixer — 무료 계산기',
    locale: 'ko_KR',
    type: 'website',
  },
  alternates: {
    canonical: 'https://keyword-mixer.vercel.app/protein-calculator',
    languages: { 'ko-KR': 'https://keyword-mixer.vercel.app/protein-calculator', 'en-US': 'https://keyword-mixer.vercel.app/protein-calculator' },
  },
  robots: { index: true, follow: true },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: '단백질 섭취량 계산기 하루 단백질',
  url: 'https://keyword-mixer.vercel.app/protein-calculator',
  applicationCategory: 'UtilitiesApplication',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'KRW' },
  isAccessibleForFree: true,
  inLanguage: ['ko', 'en'],
}

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ProteinCalculator />
    </>
  )
}
