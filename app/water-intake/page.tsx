import type { Metadata } from 'next'
import WaterIntake from '@/components/WaterIntake'

export const metadata: Metadata = {
  title: '[2025 최신] 물 섭취량 계산기 하루 물 권장량 | Keyword Mixer 무료 계산기',
  description: '무료 물 섭취량 계산기. 체중·활동량·날씨로 하루 권장 물 섭취량 계산. 개인 음수 시간표 생성. Free daily water intake calculator.',
  keywords: '물 섭취량, 하루 물 권장량, 체중별 물 섭취, 음수 시간표, water intake calculator',
  openGraph: {
    title: '[2025] 물 섭취량 계산기 하루 물 권장량 | Keyword Mixer',
    description: '무료 물 섭취량 계산기. 체중·활동량·날씨로 하루 권장 물 섭취량 계산. 개인 음수 시간표 생성. Free daily water intake calculator.',
    url: 'https://keyword-mixer.vercel.app/water-intake',
    siteName: 'Keyword Mixer — 무료 계산기',
    locale: 'ko_KR',
    type: 'website',
  },
  alternates: {
    canonical: 'https://keyword-mixer.vercel.app/water-intake',
    languages: { 'ko-KR': 'https://keyword-mixer.vercel.app/water-intake', 'en-US': 'https://keyword-mixer.vercel.app/water-intake' },
  },
  robots: { index: true, follow: true },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: '물 섭취량 계산기 하루 물 권장량',
  url: 'https://keyword-mixer.vercel.app/water-intake',
  applicationCategory: 'UtilitiesApplication',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'KRW' },
  isAccessibleForFree: true,
  inLanguage: ['ko', 'en'],
}

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <WaterIntake />
    </>
  )
}
