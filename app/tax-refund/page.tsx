import type { Metadata } from 'next'
import TaxRefund from '@/components/TaxRefund'

export const metadata: Metadata = {
  title: '[2025 최신] 연말정산 환급액 계산기 세금 환급 — Year-End Tax Settlement | Keyword Mixer',
  description: '무료 연말정산 환급액 계산기. 연봉·보험료·의료비·교육비·기부금 입력으로 예상 환급액 또는 추가 납부액 계산. 연금저축 세액공제 자동 반영. 2024년 기준. Free Korean year-end tax settlement calculator. Estimate refund or additional payment from deductions.',
  keywords: '연말정산 계산기, 연말정산 환급액, 세금 환급, 연말정산 환급 예상액, 연금저축 세액공제, 소득세 계산, year-end tax Korea, tax refund calculator',
  authors: [{ name: 'Keyword Mixer' }],
  openGraph: {
    title: '[2025 최신] 연말정산 환급액 계산기 세금 환급 — Year-End Tax Settlement | Keyword Mixer',
    description: '무료 연말정산 환급액 계산기. 연봉·보험료·의료비·교육비·기부금 입력으로 예상 환급액 또는 추가 납부액 계산. 연금저축 세액공제 자동 반영. 2024년 기준. Free Korean year-end tax settlement calculator. Estimate refund or additional payment from deductions.',
    url: 'https://keyword-mixer.vercel.app/tax-refund',
    siteName: 'Keyword Mixer — 무료 계산기',
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: '연말정산 환급액 계산기 세금 환급 | Keyword Mixer',
    description: '무료 연말정산 환급액 계산기. 연봉·보험료·의료비·교육비·기부금 입력으로 예상 환급액 또는 추가 납부액 계산. 연금저축 세액공제 자동 반영. 2024년 기준.',
  },
  alternates: {
    canonical: 'https://keyword-mixer.vercel.app/tax-refund',
    languages: { 'ko-KR': 'https://keyword-mixer.vercel.app/tax-refund', 'en-US': 'https://keyword-mixer.vercel.app/tax-refund' },
  },
  robots: { index: true, follow: true },
}

// JSON-LD 구조화 데이터
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: '연말정산 환급액 계산기 — 세금 환급 예상',
  url: 'https://keyword-mixer.vercel.app/tax-refund',
  description: '연봉과 공제 항목으로 연말정산 환급액 또는 추가 납부액을 계산.',
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
  featureList: '연봉과 공제 항목으로 연말정산 환급액 또는 추가 납부액을 계산.',
}

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <TaxRefund />
    </>
  )
}
