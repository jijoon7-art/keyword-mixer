import type { Metadata } from 'next'
import ScientificCalculator from '@/components/ScientificCalculator'

export const metadata: Metadata = {
  title: '[2025 최신] 공학용 계산기 온라인 삼각함수 — Scientific Calculator Online | Keyword Mixer',
  description: '무료 온라인 공학용 계산기. sin·cos·tan 삼각함수, log·ln 로그, 제곱근·팩토리얼·지수 계산. 라디안·도(Degree) 전환. 계산 이력 10개 저장. 무료 사용. Free online scientific calculator. Trig functions, log, ln, sqrt, factorial. Radian/degree toggle with history.',
  keywords: '공학용 계산기, 과학 계산기 온라인, sin cos tan 계산, 삼각함수 계산기, 로그 계산기, scientific calculator, trig calculator online',
  authors: [{ name: 'Keyword Mixer' }],
  openGraph: {
    title: '[2025 최신] 공학용 계산기 온라인 삼각함수 — Scientific Calculator Online | Keyword Mixer',
    description: '무료 온라인 공학용 계산기. sin·cos·tan 삼각함수, log·ln 로그, 제곱근·팩토리얼·지수 계산. 라디안·도(Degree) 전환. 계산 이력 10개 저장. 무료 사용. Free online scientific calculator. Trig functions, log, ln, sqrt, factorial. Radian/degree toggle with history.',
    url: 'https://keyword-mixer.vercel.app/scientific-calculator',
    siteName: 'Keyword Mixer — 무료 계산기',
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: '공학용 계산기 온라인 삼각함수 | Keyword Mixer',
    description: '무료 온라인 공학용 계산기. sin·cos·tan 삼각함수, log·ln 로그, 제곱근·팩토리얼·지수 계산. 라디안·도(Degree) 전환. 계산 이력 10개 저장. 무료 사용.',
  },
  alternates: {
    canonical: 'https://keyword-mixer.vercel.app/scientific-calculator',
    languages: { 'ko-KR': 'https://keyword-mixer.vercel.app/scientific-calculator', 'en-US': 'https://keyword-mixer.vercel.app/scientific-calculator' },
  },
  robots: { index: true, follow: true },
}

// JSON-LD 구조화 데이터
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: '공학용 계산기 온라인 — 삼각함수·로그·지수',
  url: 'https://keyword-mixer.vercel.app/scientific-calculator',
  description: 'sin·cos·tan·log·ln·팩토리얼 지원 공학용 계산기. 이력 저장 기능.',
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
  featureList: 'sin·cos·tan·log·ln·팩토리얼 지원 공학용 계산기. 이력 저장 기능.',
}

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ScientificCalculator />
    </>
  )
}
