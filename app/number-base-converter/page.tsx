import type { Metadata } from 'next'
import NumberBaseConverter from '@/components/NumberBaseConverter'

export const metadata: Metadata = {
  title: '[2025 최신] 진법 변환기 2진수 16진수 — Number Base Converter Binary Hex | Keyword Mixer',
  description: '무료 진법 변환기. 2진수(Binary)·8진수(Octal)·10진수(Decimal)·16진수(Hexadecimal) 즉시 변환. 비트 시각화. 컴퓨터 과학·프로그래밍 학습 필수 도구. Free number base converter. Convert binary, octal, decimal, hexadecimal instantly with bit visualization.',
  keywords: '진법 변환기, 2진수 변환, 16진수 변환, 이진수 변환, 10진법 2진법, binary converter, hexadecimal calculator, number base converter',
  authors: [{ name: 'Keyword Mixer' }],
  openGraph: {
    title: '[2025 최신] 진법 변환기 2진수 16진수 — Number Base Converter Binary Hex | Keyword Mixer',
    description: '무료 진법 변환기. 2진수(Binary)·8진수(Octal)·10진수(Decimal)·16진수(Hexadecimal) 즉시 변환. 비트 시각화. 컴퓨터 과학·프로그래밍 학습 필수 도구. Free number base converter. Convert binary, octal, decimal, hexadecimal instantly with bit visualization.',
    url: 'https://keyword-mixer.vercel.app/number-base-converter',
    siteName: 'Keyword Mixer — 무료 계산기',
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: '진법 변환기 2진수 16진수 | Keyword Mixer',
    description: '무료 진법 변환기. 2진수(Binary)·8진수(Octal)·10진수(Decimal)·16진수(Hexadecimal) 즉시 변환. 비트 시각화. 컴퓨터 과학·프로그래밍 학습 필수 도구.',
  },
  alternates: {
    canonical: 'https://keyword-mixer.vercel.app/number-base-converter',
    languages: { 'ko-KR': 'https://keyword-mixer.vercel.app/number-base-converter', 'en-US': 'https://keyword-mixer.vercel.app/number-base-converter' },
  },
  robots: { index: true, follow: true },
}

// JSON-LD 구조화 데이터
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: '진법 변환기 — 2진수·8진수·16진수 즉시 변환',
  url: 'https://keyword-mixer.vercel.app/number-base-converter',
  description: '2·8·10·16진법 동시 변환. 비트 시각화로 컴퓨터 과학 학습 지원.',
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
  featureList: '2·8·10·16진법 동시 변환. 비트 시각화로 컴퓨터 과학 학습 지원.',
}

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <NumberBaseConverter />
    </>
  )
}
