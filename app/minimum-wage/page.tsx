import type { Metadata } from 'next'
import MinimumWage from '@/components/MinimumWage'

export const metadata: Metadata = {
  title: '[2025 최신] 최저임금 계산기 2025 최저시급 — Minimum Wage Calculator Korea | Keyword Mixer',
  description: '무료 최저임금 계산기. 2025년 최저시급 10,030원 기준 일급·주급·월급·연봉 즉시 계산. 주휴수당 자동 포함. 최저임금 위반 여부 확인. 세후 실수령액 추정. Free 2025 Korean minimum wage calculator. Calculate daily, weekly, monthly pay including holiday allowance.',
  keywords: '최저임금 계산기, 2025 최저시급, 최저임금 월급, 주휴수당 계산, 시급 계산기, 10030원, 알바 월급 계산, minimum wage Korea 2025',
  authors: [{ name: 'Keyword Mixer' }],
  openGraph: {
    title: '[2025 최신] 최저임금 계산기 2025 최저시급 — Minimum Wage Calculator Korea | Keyword Mixer',
    description: '무료 최저임금 계산기. 2025년 최저시급 10,030원 기준 일급·주급·월급·연봉 즉시 계산. 주휴수당 자동 포함. 최저임금 위반 여부 확인. 세후 실수령액 추정. Free 2025 Korean minimum wage calculator. Calculate daily, weekly, monthly pay including holiday allowance.',
    url: 'https://keyword-mixer.vercel.app/minimum-wage',
    siteName: 'Keyword Mixer — 무료 계산기',
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: '최저임금 계산기 2025 최저시급 | Keyword Mixer',
    description: '무료 최저임금 계산기. 2025년 최저시급 10,030원 기준 일급·주급·월급·연봉 즉시 계산. 주휴수당 자동 포함. 최저임금 위반 여부 확인. 세후 실수령액 추정.',
  },
  alternates: {
    canonical: 'https://keyword-mixer.vercel.app/minimum-wage',
    languages: { 'ko-KR': 'https://keyword-mixer.vercel.app/minimum-wage', 'en-US': 'https://keyword-mixer.vercel.app/minimum-wage' },
  },
  robots: { index: true, follow: true },
}

// JSON-LD 구조화 데이터
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: '최저임금 계산기 — 2025 최저시급 10,030원',
  url: 'https://keyword-mixer.vercel.app/minimum-wage',
  description: '2025년 최저시급 10,030원 기준 일급·주급·월급·주휴수당 자동 계산.',
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
  featureList: '2025년 최저시급 10,030원 기준 일급·주급·월급·주휴수당 자동 계산.',
}

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <MinimumWage />
    </>
  )
}
