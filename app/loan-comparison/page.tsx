import type { Metadata } from 'next'
import LoanComparison from '@/components/LoanComparison'

export const metadata: Metadata = {
  title: '[2025 최신] 대출 비교 계산기 금리 비교 | Keyword Mixer 무료 계산기',
  description: '무료 대출 비교 계산기. 최대 5개 대출 상품 동시 비교. 원리금균등·원금균등 방식 총 이자 비교. Free loan comparison calculator.',
  keywords: '대출 비교, 금리 비교, 대출 상품 비교, 총 이자 비교, loan comparison calculator',
  openGraph: {
    title: '[2025] 대출 비교 계산기 금리 비교 | Keyword Mixer',
    description: '무료 대출 비교 계산기. 최대 5개 대출 상품 동시 비교. 원리금균등·원금균등 방식 총 이자 비교. Free loan comparison calculator.',
    url: 'https://keyword-mixer.vercel.app/loan-comparison',
    siteName: 'Keyword Mixer — 무료 계산기',
    locale: 'ko_KR',
    type: 'website',
  },
  alternates: {
    canonical: 'https://keyword-mixer.vercel.app/loan-comparison',
    languages: { 'ko-KR': 'https://keyword-mixer.vercel.app/loan-comparison', 'en-US': 'https://keyword-mixer.vercel.app/loan-comparison' },
  },
  robots: { index: true, follow: true },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: '대출 비교 계산기 금리 비교',
  url: 'https://keyword-mixer.vercel.app/loan-comparison',
  applicationCategory: 'UtilitiesApplication',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'KRW' },
  isAccessibleForFree: true,
  inLanguage: ['ko', 'en'],
}

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <LoanComparison />
    </>
  )
}
