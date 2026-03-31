import type { Metadata } from 'next'
import BmiCalculatorPro from '@/components/BmiCalculatorPro'

export const metadata: Metadata = {
  title: '[2025 최신] BMI 계산기 체질량지수 비만도 — BMI Calculator Korea | Keyword Mixer',
  description: '무료 BMI 계산기. 키·몸무게로 체질량지수·비만도·정상체중·기초대사율 즉시 계산. 한국 기준(BMI 23 과체중, 25 비만) 적용. 체지방률·활동별 칼로리도 제공. Free BMI calculator with Korean/Asian standards. Calculate BMI, obesity level, body fat, and BMR.',
  keywords: 'BMI 계산기, 체질량지수 계산, 비만도 계산기, 나의 BMI, BMI 정상범위, 한국 BMI 기준, 체지방률 계산, 기초대사율 BMR, BMI calculator, body mass index Korea',
  authors: [{ name: 'Keyword Mixer' }],
  openGraph: {
    title: '[2025 최신] BMI 계산기 체질량지수 비만도 — BMI Calculator Korea | Keyword Mixer',
    description: '무료 BMI 계산기. 키·몸무게로 체질량지수·비만도·정상체중·기초대사율 즉시 계산. 한국 기준(BMI 23 과체중, 25 비만) 적용. 체지방률·활동별 칼로리도 제공. Free BMI calculator with Korean/Asian standards. Calculate BMI, obesity level, body fat, and BMR.',
    url: 'https://keyword-mixer.vercel.app/bmi-calculator-pro',
    siteName: 'Keyword Mixer — 무료 계산기',
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'BMI 계산기 체질량지수 비만도 | Keyword Mixer',
    description: '무료 BMI 계산기. 키·몸무게로 체질량지수·비만도·정상체중·기초대사율 즉시 계산. 한국 기준(BMI 23 과체중, 25 비만) 적용. 체지방률·활동별 칼로리도 제공.',
  },
  alternates: {
    canonical: 'https://keyword-mixer.vercel.app/bmi-calculator-pro',
    languages: { 'ko-KR': 'https://keyword-mixer.vercel.app/bmi-calculator-pro', 'en-US': 'https://keyword-mixer.vercel.app/bmi-calculator-pro' },
  },
  robots: { index: true, follow: true },
}

// JSON-LD 구조화 데이터
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'BMI 계산기 — 체질량지수·비만도 측정',
  url: 'https://keyword-mixer.vercel.app/bmi-calculator-pro',
  description: '키와 몸무게로 BMI 체질량지수와 비만도를 즉시 계산. 한국 아시아 기준 적용.',
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
  featureList: '키와 몸무게로 BMI 체질량지수와 비만도를 즉시 계산. 한국 아시아 기준 적용.',
}

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BmiCalculatorPro />
    </>
  )
}
