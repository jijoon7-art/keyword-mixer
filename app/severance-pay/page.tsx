import type { Metadata } from 'next'
import SeverancePay from '@/components/SeverancePay'

export const metadata: Metadata = {
  title: '[2025 최신] 퇴직금 계산기 법정 퇴직금 — Severance Pay Calculator | Keyword Mixer',
  description: '무료 퇴직금 계산기. 입사일·퇴직일·월급으로 법정 퇴직금 정확히 계산. 퇴직소득세·IRP 절세 55% 혜택까지. 고용노동부 기준 평균임금 공식 적용. Free Korean severance pay calculator. Calculate legal severance, retirement tax, and IRP benefits.',
  keywords: '퇴직금 계산기, 퇴직금 계산, 법정 퇴직금, 퇴직소득세 계산, 퇴직금 얼마, IRP 세금, 평균임금 계산, 퇴직금 공식, severance pay calculator Korea',
  authors: [{ name: 'Keyword Mixer' }],
  openGraph: {
    title: '[2025 최신] 퇴직금 계산기 법정 퇴직금 — Severance Pay Calculator | Keyword Mixer',
    description: '무료 퇴직금 계산기. 입사일·퇴직일·월급으로 법정 퇴직금 정확히 계산. 퇴직소득세·IRP 절세 55% 혜택까지. 고용노동부 기준 평균임금 공식 적용. Free Korean severance pay calculator. Calculate legal severance, retirement tax, and IRP benefits.',
    url: 'https://keyword-mixer.vercel.app/severance-pay',
    siteName: 'Keyword Mixer — 무료 계산기',
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: '퇴직금 계산기 법정 퇴직금 | Keyword Mixer',
    description: '무료 퇴직금 계산기. 입사일·퇴직일·월급으로 법정 퇴직금 정확히 계산. 퇴직소득세·IRP 절세 55% 혜택까지. 고용노동부 기준 평균임금 공식 적용.',
  },
  alternates: {
    canonical: 'https://keyword-mixer.vercel.app/severance-pay',
    languages: { 'ko-KR': 'https://keyword-mixer.vercel.app/severance-pay', 'en-US': 'https://keyword-mixer.vercel.app/severance-pay' },
  },
  robots: { index: true, follow: true },
}

// JSON-LD 구조화 데이터
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: '퇴직금 계산기 — 법정 퇴직금·퇴직소득세 계산',
  url: 'https://keyword-mixer.vercel.app/severance-pay',
  description: '입사일과 월급으로 법정 퇴직금과 퇴직소득세를 계산. IRP 절세 혜택 포함.',
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
  featureList: '입사일과 월급으로 법정 퇴직금과 퇴직소득세를 계산. IRP 절세 혜택 포함.',
}

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SeverancePay />
    </>
  )
}
