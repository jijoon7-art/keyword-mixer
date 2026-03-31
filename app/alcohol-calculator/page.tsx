import type { Metadata } from 'next'
import AlcoholCalculator from '@/components/AlcoholCalculator'

export const metadata: Metadata = {
  title: '[2025 최신] 음주 계산기 혈중알코올농도 BAC — BAC Calculator Korea | Keyword Mixer',
  description: '무료 음주 계산기. 혈중알코올농도(BAC) 추정. 소주·맥주·막걸리·와인 등 8가지 주류 지원. 한국 음주운전 기준(0.03%·0.08%) 판단. 술 완전히 깨는 시간 계산. Free Korean BAC calculator. Estimate blood alcohol content from soju, beer, wine. Korean DUI limits.',
  keywords: '음주 계산기, 혈중알코올농도 계산, BAC 계산기, 음주운전 기준, 술 깨는 시간, 소주 BAC, BAC calculator Korea, blood alcohol content',
  authors: [{ name: 'Keyword Mixer' }],
  openGraph: {
    title: '[2025 최신] 음주 계산기 혈중알코올농도 BAC — BAC Calculator Korea | Keyword Mixer',
    description: '무료 음주 계산기. 혈중알코올농도(BAC) 추정. 소주·맥주·막걸리·와인 등 8가지 주류 지원. 한국 음주운전 기준(0.03%·0.08%) 판단. 술 완전히 깨는 시간 계산. Free Korean BAC calculator. Estimate blood alcohol content from soju, beer, wine. Korean DUI limits.',
    url: 'https://keyword-mixer.vercel.app/alcohol-calculator',
    siteName: 'Keyword Mixer — 무료 계산기',
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: '음주 계산기 혈중알코올농도 BAC | Keyword Mixer',
    description: '무료 음주 계산기. 혈중알코올농도(BAC) 추정. 소주·맥주·막걸리·와인 등 8가지 주류 지원. 한국 음주운전 기준(0.03%·0.08%) 판단. 술 완전히 깨는 시간 계산.',
  },
  alternates: {
    canonical: 'https://keyword-mixer.vercel.app/alcohol-calculator',
    languages: { 'ko-KR': 'https://keyword-mixer.vercel.app/alcohol-calculator', 'en-US': 'https://keyword-mixer.vercel.app/alcohol-calculator' },
  },
  robots: { index: true, follow: true },
}

// JSON-LD 구조화 데이터
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: '음주 계산기 (BAC) — 혈중알코올농도·음주운전 판단',
  url: 'https://keyword-mixer.vercel.app/alcohol-calculator',
  description: '음주량으로 혈중알코올농도를 추정. 한국 음주운전 기준과 해소 시간 계산.',
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
  featureList: '음주량으로 혈중알코올농도를 추정. 한국 음주운전 기준과 해소 시간 계산.',
}

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AlcoholCalculator />
    </>
  )
}
