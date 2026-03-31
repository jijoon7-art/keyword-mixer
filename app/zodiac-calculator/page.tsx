import type { Metadata } from 'next'
import ZodiacCalculator from '@/components/ZodiacCalculator'

export const metadata: Metadata = {
  title: '[2025 최신] 띠 계산기 별자리 생년월일 — Zodiac Star Sign Calculator | Keyword Mixer',
  description: '무료 띠·별자리 계산기. 생년월일 입력으로 12간지 띠·서양 별자리·사주 연주·오행을 즉시 계산. 나이·태어난 요일·계절 정보 제공. 동서양 통합 운세 계산기. Free zodiac and star sign calculator. Chinese zodiac, Western star sign, birth year pillar from date of birth.',
  keywords: '띠 계산기, 별자리 계산기, 나의 띠, 생년월일 별자리, 사주 연주, 오행, zodiac calculator, star sign calculator, Chinese zodiac',
  authors: [{ name: 'Keyword Mixer' }],
  openGraph: {
    title: '[2025 최신] 띠 계산기 별자리 생년월일 — Zodiac Star Sign Calculator | Keyword Mixer',
    description: '무료 띠·별자리 계산기. 생년월일 입력으로 12간지 띠·서양 별자리·사주 연주·오행을 즉시 계산. 나이·태어난 요일·계절 정보 제공. 동서양 통합 운세 계산기. Free zodiac and star sign calculator. Chinese zodiac, Western star sign, birth year pillar from date of birth.',
    url: 'https://keyword-mixer.vercel.app/zodiac-calculator',
    siteName: 'Keyword Mixer — 무료 계산기',
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: '띠 계산기 별자리 생년월일 | Keyword Mixer',
    description: '무료 띠·별자리 계산기. 생년월일 입력으로 12간지 띠·서양 별자리·사주 연주·오행을 즉시 계산. 나이·태어난 요일·계절 정보 제공. 동서양 통합 운세 계산기.',
  },
  alternates: {
    canonical: 'https://keyword-mixer.vercel.app/zodiac-calculator',
    languages: { 'ko-KR': 'https://keyword-mixer.vercel.app/zodiac-calculator', 'en-US': 'https://keyword-mixer.vercel.app/zodiac-calculator' },
  },
  robots: { index: true, follow: true },
}

// JSON-LD 구조화 데이터
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: '띠·별자리 계산기 — 생년월일로 12간지·별자리 계산',
  url: 'https://keyword-mixer.vercel.app/zodiac-calculator',
  description: '생년월일로 12간지 띠와 서양 별자리를 즉시 계산. 사주 연주·오행 포함.',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Web Browser',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'KRW',
    availability: 'https://schema.org/InStock',
  },
  inLanguage: ['ko', 'en'],
  isAccessibleForFree: true,
  browserRequirements: 'Requires JavaScript',
  featureList: '생년월일로 12간지 띠와 서양 별자리를 즉시 계산. 사주 연주·오행 포함.',
}

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ZodiacCalculator />
    </>
  )
}
