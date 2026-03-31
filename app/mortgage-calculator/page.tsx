import type { Metadata } from 'next'
import MortgageCalculator from '@/components/MortgageCalculator'

export const metadata: Metadata = {
  title: '[2025 최신] 주택담보대출 계산기 LTV DSR — Mortgage Calculator Korea | Keyword Mixer',
  description: '무료 주택담보대출 계산기. 월 상환액·총 이자·대출 한도 계산. LTV 40%/50%/70% 기준 한도, DSR 40% 최대 대출 금액 자동 계산. 원리금균등·원금균등·만기일시 비교. Free Korean mortgage calculator. Monthly payment, LTV limits, DSR 40% max loan calculation.',
  keywords: '주택담보대출 계산기, 아파트 대출 계산, 월 상환액, LTV 계산기, DSR 계산기, 대출 한도 계산, 원리금균등, mortgage calculator Korea, home loan',
  authors: [{ name: 'Keyword Mixer' }],
  openGraph: {
    title: '[2025 최신] 주택담보대출 계산기 LTV DSR — Mortgage Calculator Korea | Keyword Mixer',
    description: '무료 주택담보대출 계산기. 월 상환액·총 이자·대출 한도 계산. LTV 40%/50%/70% 기준 한도, DSR 40% 최대 대출 금액 자동 계산. 원리금균등·원금균등·만기일시 비교. Free Korean mortgage calculator. Monthly payment, LTV limits, DSR 40% max loan calculation.',
    url: 'https://keyword-mixer.vercel.app/mortgage-calculator',
    siteName: 'Keyword Mixer — 무료 계산기',
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: '주택담보대출 계산기 LTV DSR | Keyword Mixer',
    description: '무료 주택담보대출 계산기. 월 상환액·총 이자·대출 한도 계산. LTV 40%/50%/70% 기준 한도, DSR 40% 최대 대출 금액 자동 계산. 원리금균등·원금균등·만기일시 비교.',
  },
  alternates: {
    canonical: 'https://keyword-mixer.vercel.app/mortgage-calculator',
    languages: { 'ko-KR': 'https://keyword-mixer.vercel.app/mortgage-calculator', 'en-US': 'https://keyword-mixer.vercel.app/mortgage-calculator' },
  },
  robots: { index: true, follow: true },
}

// JSON-LD 구조화 데이터
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: '주택담보대출 계산기 — 월 상환액·LTV·DSR 한도',
  url: 'https://keyword-mixer.vercel.app/mortgage-calculator',
  description: '아파트 매매 시 주택담보대출 월 상환액과 LTV·DSR 기준 최대 대출 한도를 계산.',
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
  featureList: '아파트 매매 시 주택담보대출 월 상환액과 LTV·DSR 기준 최대 대출 한도를 계산.',
}

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <MortgageCalculator />
    </>
  )
}
