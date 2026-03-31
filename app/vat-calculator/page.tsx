import type { Metadata } from 'next'
import VatCalculator from '@/components/VatCalculator'

export const metadata: Metadata = {
  title: '[2025 최신] 부가세 계산기 부가가치세 역산 — VAT Calculator Korea | Keyword Mixer',
  description: '무료 부가세 계산기. 공급가액에서 부가세 추가(정방향) 및 합계에서 공급가액 역산(역방향). 세금계산서 발행 금액 계산. 10% 부가가치세 즉시 계산. Free Korean VAT calculator. Add or extract 10% VAT. Calculate tax invoice amounts instantly.',
  keywords: '부가세 계산기, 부가가치세 계산, VAT 계산기, 공급가액 계산, 부가세 역산, 세금계산서 금액, 10% 부가세, VAT calculator Korea, tax invoice',
  authors: [{ name: 'Keyword Mixer' }],
  openGraph: {
    title: '[2025 최신] 부가세 계산기 부가가치세 역산 — VAT Calculator Korea | Keyword Mixer',
    description: '무료 부가세 계산기. 공급가액에서 부가세 추가(정방향) 및 합계에서 공급가액 역산(역방향). 세금계산서 발행 금액 계산. 10% 부가가치세 즉시 계산. Free Korean VAT calculator. Add or extract 10% VAT. Calculate tax invoice amounts instantly.',
    url: 'https://keyword-mixer.vercel.app/vat-calculator',
    siteName: 'Keyword Mixer — 무료 계산기',
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: '부가세 계산기 부가가치세 역산 | Keyword Mixer',
    description: '무료 부가세 계산기. 공급가액에서 부가세 추가(정방향) 및 합계에서 공급가액 역산(역방향). 세금계산서 발행 금액 계산. 10% 부가가치세 즉시 계산.',
  },
  alternates: {
    canonical: 'https://keyword-mixer.vercel.app/vat-calculator',
    languages: { 'ko-KR': 'https://keyword-mixer.vercel.app/vat-calculator', 'en-US': 'https://keyword-mixer.vercel.app/vat-calculator' },
  },
  robots: { index: true, follow: true },
}

// JSON-LD 구조화 데이터
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: '부가세 계산기 — 공급가액·부가세·합계 즉시 계산',
  url: 'https://keyword-mixer.vercel.app/vat-calculator',
  description: '공급가액에 10% 부가세를 추가하거나 합계에서 공급가액을 역산.',
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
  featureList: '공급가액에 10% 부가세를 추가하거나 합계에서 공급가액을 역산.',
}

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <VatCalculator />
    </>
  )
}
