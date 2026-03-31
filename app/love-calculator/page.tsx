import type { Metadata } from 'next'
import LoveCalculator from '@/components/LoveCalculator'

export const metadata: Metadata = {
  title: '[2025 최신] 궁합 계산기 커플 테스트 이름 — Love Compatibility Calculator | Keyword Mixer',
  description: '무료 궁합 계산기. 이름·생년월일·혈액형으로 커플 궁합 점수 계산. 띠 궁합·별자리 궁합·혈액형 궁합 3가지 분석. 재미있는 커플 테스트. 카카오톡 공유. Free love compatibility calculator. Calculate couple compatibility from names, birthdays, and blood types.',
  keywords: '궁합 계산기, 이름 궁합, 혈액형 궁합, 커플 궁합 테스트, 생일 궁합, love calculator, compatibility test, couple test Korea',
  authors: [{ name: 'Keyword Mixer' }],
  openGraph: {
    title: '[2025 최신] 궁합 계산기 커플 테스트 이름 — Love Compatibility Calculator | Keyword Mixer',
    description: '무료 궁합 계산기. 이름·생년월일·혈액형으로 커플 궁합 점수 계산. 띠 궁합·별자리 궁합·혈액형 궁합 3가지 분석. 재미있는 커플 테스트. 카카오톡 공유. Free love compatibility calculator. Calculate couple compatibility from names, birthdays, and blood types.',
    url: 'https://keyword-mixer.vercel.app/love-calculator',
    siteName: 'Keyword Mixer — 무료 계산기',
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: '궁합 계산기 커플 테스트 이름 | Keyword Mixer',
    description: '무료 궁합 계산기. 이름·생년월일·혈액형으로 커플 궁합 점수 계산. 띠 궁합·별자리 궁합·혈액형 궁합 3가지 분석. 재미있는 커플 테스트. 카카오톡 공유.',
  },
  alternates: {
    canonical: 'https://keyword-mixer.vercel.app/love-calculator',
    languages: { 'ko-KR': 'https://keyword-mixer.vercel.app/love-calculator', 'en-US': 'https://keyword-mixer.vercel.app/love-calculator' },
  },
  robots: { index: true, follow: true },
}

// JSON-LD 구조화 데이터
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: '궁합 계산기 — 이름·생일·혈액형 커플 테스트',
  url: 'https://keyword-mixer.vercel.app/love-calculator',
  description: '이름·생년월일·혈액형으로 커플 궁합 점수를 재미있게 계산.',
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
  featureList: '이름·생년월일·혈액형으로 커플 궁합 점수를 재미있게 계산.',
}

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LoveCalculator />
    </>
  )
}
