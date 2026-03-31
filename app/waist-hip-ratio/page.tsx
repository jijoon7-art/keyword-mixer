import type { Metadata } from 'next'
import WaistHipRatio from '@/components/WaistHipRatio'

export const metadata: Metadata = {
  title: '[2025 최신] 허리 엉덩이 비율 WHR 복부비만 | Keyword Mixer 무료 계산기',
  description: '무료 허리 엉덩이 비율(WHR) 계산기. WHO 기준 복부비만 위험도 판정. 사과·배 체형 분류. Free WHR calculator.',
  keywords: '허리 엉덩이 비율, WHR, 복부비만, 체형 분류, waist hip ratio calculator',
  openGraph: {
    title: '[2025] 허리 엉덩이 비율 WHR 복부비만 | Keyword Mixer',
    description: '무료 허리 엉덩이 비율(WHR) 계산기. WHO 기준 복부비만 위험도 판정. 사과·배 체형 분류. Free WHR calculator.',
    url: 'https://keyword-mixer.vercel.app/waist-hip-ratio',
    siteName: 'Keyword Mixer — 무료 계산기',
    locale: 'ko_KR',
    type: 'website',
  },
  alternates: {
    canonical: 'https://keyword-mixer.vercel.app/waist-hip-ratio',
    languages: { 'ko-KR': 'https://keyword-mixer.vercel.app/waist-hip-ratio', 'en-US': 'https://keyword-mixer.vercel.app/waist-hip-ratio' },
  },
  robots: { index: true, follow: true },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: '허리 엉덩이 비율 WHR 복부비만',
  url: 'https://keyword-mixer.vercel.app/waist-hip-ratio',
  applicationCategory: 'UtilitiesApplication',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'KRW' },
  isAccessibleForFree: true,
  inLanguage: ['ko', 'en'],
}

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <WaistHipRatio />
    </>
  )
}
