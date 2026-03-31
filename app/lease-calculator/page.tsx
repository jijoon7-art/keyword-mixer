import type { Metadata } from 'next'
import LeaseCalculator from '@/components/LeaseCalculator'

export const metadata: Metadata = {
  title: '[2025 최신] 전세자금대출 계산기 전세 이자 — Jeonse Loan Calculator | Keyword Mixer',
  description: '무료 전세자금대출 계산기. 전세 보증금·금리로 월 이자와 총 이자 계산. HUG·HF 보증 한도 자동 계산. 매매 vs 전세 비용 비교. 버팀목전세자금대출 안내. Free Korean Jeonse lease deposit loan calculator. Monthly interest, HUG/HF guarantee limits.',
  keywords: '전세자금대출 계산기, 전세 이자 계산, HUG 보증 한도, HF 보증 한도, 전세대출 금리, 버팀목전세자금, 전세 vs 매매, Jeonse loan calculator Korea',
  authors: [{ name: 'Keyword Mixer' }],
  openGraph: {
    title: '[2025 최신] 전세자금대출 계산기 전세 이자 — Jeonse Loan Calculator | Keyword Mixer',
    description: '무료 전세자금대출 계산기. 전세 보증금·금리로 월 이자와 총 이자 계산. HUG·HF 보증 한도 자동 계산. 매매 vs 전세 비용 비교. 버팀목전세자금대출 안내. Free Korean Jeonse lease deposit loan calculator. Monthly interest, HUG/HF guarantee limits.',
    url: 'https://keyword-mixer.vercel.app/lease-calculator',
    siteName: 'Keyword Mixer — 무료 계산기',
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: '전세자금대출 계산기 전세 이자 | Keyword Mixer',
    description: '무료 전세자금대출 계산기. 전세 보증금·금리로 월 이자와 총 이자 계산. HUG·HF 보증 한도 자동 계산. 매매 vs 전세 비용 비교. 버팀목전세자금대출 안내.',
  },
  alternates: {
    canonical: 'https://keyword-mixer.vercel.app/lease-calculator',
    languages: { 'ko-KR': 'https://keyword-mixer.vercel.app/lease-calculator', 'en-US': 'https://keyword-mixer.vercel.app/lease-calculator' },
  },
  robots: { index: true, follow: true },
}

// JSON-LD 구조화 데이터
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: '전세자금대출 계산기 — 월 이자·보증 한도 계산',
  url: 'https://keyword-mixer.vercel.app/lease-calculator',
  description: '전세 보증금과 금리로 월 이자와 HUG·HF 보증 한도를 계산.',
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
  featureList: '전세 보증금과 금리로 월 이자와 HUG·HF 보증 한도를 계산.',
}

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LeaseCalculator />
    </>
  )
}
