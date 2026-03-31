import type { Metadata } from 'next'
import InvestmentReturn from '@/components/InvestmentReturn'

export const metadata: Metadata = {
  title: '[2025 최신] 투자 수익률 계산기 복리 CAGR — Investment Return Calculator | Keyword Mixer',
  description: '무료 투자 수익률 계산기. 원금·수익률·기간으로 복리 수익 계산. CAGR 연평균 성장률·72의 법칙·물가상승률 반영 실질 수익률. 월 납입 복리 계산. 연도별 성장 표 제공. Free investment return calculator. Compound interest, CAGR, Rule of 72, real returns.',
  keywords: '투자 수익률 계산기, 복리 계산기, CAGR 계산, 72의 법칙, 월 납입 복리, 실질 수익률, investment return calculator, compound interest Korea',
  authors: [{ name: 'Keyword Mixer' }],
  openGraph: {
    title: '[2025 최신] 투자 수익률 계산기 복리 CAGR — Investment Return Calculator | Keyword Mixer',
    description: '무료 투자 수익률 계산기. 원금·수익률·기간으로 복리 수익 계산. CAGR 연평균 성장률·72의 법칙·물가상승률 반영 실질 수익률. 월 납입 복리 계산. 연도별 성장 표 제공. Free investment return calculator. Compound interest, CAGR, Rule of 72, real returns.',
    url: 'https://keyword-mixer.vercel.app/investment-return',
    siteName: 'Keyword Mixer — 무료 계산기',
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: '투자 수익률 계산기 복리 CAGR | Keyword Mixer',
    description: '무료 투자 수익률 계산기. 원금·수익률·기간으로 복리 수익 계산. CAGR 연평균 성장률·72의 법칙·물가상승률 반영 실질 수익률. 월 납입 복리 계산. 연도별 성장 표 제공.',
  },
  alternates: {
    canonical: 'https://keyword-mixer.vercel.app/investment-return',
    languages: { 'ko-KR': 'https://keyword-mixer.vercel.app/investment-return', 'en-US': 'https://keyword-mixer.vercel.app/investment-return' },
  },
  robots: { index: true, follow: true },
}

// JSON-LD 구조화 데이터
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: '투자 수익률 계산기 — 복리·CAGR·72의 법칙',
  url: 'https://keyword-mixer.vercel.app/investment-return',
  description: '원금과 수익률로 복리 수익과 CAGR·실질 수익률을 계산. 연도별 성장 표 제공.',
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
  featureList: '원금과 수익률로 복리 수익과 CAGR·실질 수익률을 계산. 연도별 성장 표 제공.',
}

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <InvestmentReturn />
    </>
  )
}
