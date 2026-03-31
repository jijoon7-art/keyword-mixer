import type { Metadata } from 'next'
import HealthInsurance from '@/components/HealthInsurance'

export const metadata: Metadata = {
  title: '[2025 최신] 건강보험료 계산기 4대보험 | Keyword Mixer 무료 계산기',
  description: '무료 건강보험료 계산기. 직장·지역가입자 건강보험·장기요양·고용·산재보험 통합 계산. Free Korean health insurance calculator.',
  keywords: '건강보험료 계산기, 4대보험 계산, 직장가입자 건강보험, 지역가입자 건강보험, health insurance Korea',
  openGraph: {
    title: '[2025] 건강보험료 계산기 4대보험 | Keyword Mixer',
    description: '무료 건강보험료 계산기. 직장·지역가입자 건강보험·장기요양·고용·산재보험 통합 계산. Free Korean health insurance calculator.',
    url: 'https://keyword-mixer.vercel.app/health-insurance',
    siteName: 'Keyword Mixer — 무료 계산기',
    locale: 'ko_KR',
    type: 'website',
  },
  alternates: {
    canonical: 'https://keyword-mixer.vercel.app/health-insurance',
    languages: { 'ko-KR': 'https://keyword-mixer.vercel.app/health-insurance', 'en-US': 'https://keyword-mixer.vercel.app/health-insurance' },
  },
  robots: { index: true, follow: true },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: '건강보험료 계산기 4대보험',
  url: 'https://keyword-mixer.vercel.app/health-insurance',
  applicationCategory: 'UtilitiesApplication',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'KRW' },
  isAccessibleForFree: true,
  inLanguage: ['ko', 'en'],
}

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HealthInsurance />
    </>
  )
}
