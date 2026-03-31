import type { Metadata } from 'next'
import ChildbirthSubsidy from '@/components/ChildbirthSubsidy'

export const metadata: Metadata = {
  title: '[2025 최신] 출산 육아 지원금 계산기 2025 — Childbirth Subsidy Calculator | Keyword Mixer',
  description: '무료 2025년 출산·육아 지원금 계산기. 부모급여(0세 100만원·1세 50만원)·아동수당·첫만남이용권(200~300만원)·육아휴직급여 총액 한눈에 확인. 8년간 총 지원금 계산. Free 2025 Korean childbirth subsidy calculator. Parent pay, child allowance, welcome package total.',
  keywords: '출산 지원금 계산기, 2025 부모급여, 아동수당 계산, 첫만남이용권, 육아휴직급여, 출산 혜택 총정리, 출산 지원금 얼마, childbirth subsidy Korea 2025',
  authors: [{ name: 'Keyword Mixer' }],
  openGraph: {
    title: '[2025 최신] 출산 육아 지원금 계산기 2025 — Childbirth Subsidy Calculator | Keyword Mixer',
    description: '무료 2025년 출산·육아 지원금 계산기. 부모급여(0세 100만원·1세 50만원)·아동수당·첫만남이용권(200~300만원)·육아휴직급여 총액 한눈에 확인. 8년간 총 지원금 계산. Free 2025 Korean childbirth subsidy calculator. Parent pay, child allowance, welcome package total.',
    url: 'https://keyword-mixer.vercel.app/childbirth-subsidy',
    siteName: 'Keyword Mixer — 무료 계산기',
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: '출산 육아 지원금 계산기 2025 | Keyword Mixer',
    description: '무료 2025년 출산·육아 지원금 계산기. 부모급여(0세 100만원·1세 50만원)·아동수당·첫만남이용권(200~300만원)·육아휴직급여 총액 한눈에 확인. 8년간 총 지원금 계산.',
  },
  alternates: {
    canonical: 'https://keyword-mixer.vercel.app/childbirth-subsidy',
    languages: { 'ko-KR': 'https://keyword-mixer.vercel.app/childbirth-subsidy', 'en-US': 'https://keyword-mixer.vercel.app/childbirth-subsidy' },
  },
  robots: { index: true, follow: true },
}

// JSON-LD 구조화 데이터
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: '출산·육아 지원금 계산기 — 2025 부모급여·아동수당',
  url: 'https://keyword-mixer.vercel.app/childbirth-subsidy',
  description: '2025년 출산·육아 정부 지원금 총액 계산. 부모급여·아동수당·첫만남이용권 포함.',
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
  featureList: '2025년 출산·육아 정부 지원금 총액 계산. 부모급여·아동수당·첫만남이용권 포함.',
}

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ChildbirthSubsidy />
    </>
  )
}
