import type { Metadata } from 'next'
import FileSizeConverter from '@/components/FileSizeConverter'

export const metadata: Metadata = {
  title: '[2025 최신] 파일 크기 단위 변환기 KB MB GB — File Size Converter | Keyword Mixer',
  description: '무료 파일 크기 단위 변환기. Byte·KB·MB·GB·TB·PB 즉시 변환. USB·Wi-Fi·5G 등 6가지 속도별 전송 시간 계산. 클라우드 저장용량 계산에 유용. Free file size converter. Convert Byte, KB, MB, GB, TB, PB instantly with transfer time calculation.',
  keywords: '파일 크기 변환, KB MB GB 변환, 파일 용량 단위, 파일 크기 계산기, file size converter, KB to MB, MB to GB, storage converter',
  authors: [{ name: 'Keyword Mixer' }],
  openGraph: {
    title: '[2025 최신] 파일 크기 단위 변환기 KB MB GB — File Size Converter | Keyword Mixer',
    description: '무료 파일 크기 단위 변환기. Byte·KB·MB·GB·TB·PB 즉시 변환. USB·Wi-Fi·5G 등 6가지 속도별 전송 시간 계산. 클라우드 저장용량 계산에 유용. Free file size converter. Convert Byte, KB, MB, GB, TB, PB instantly with transfer time calculation.',
    url: 'https://keyword-mixer.vercel.app/file-size-converter',
    siteName: 'Keyword Mixer — 무료 계산기',
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: '파일 크기 단위 변환기 KB MB GB | Keyword Mixer',
    description: '무료 파일 크기 단위 변환기. Byte·KB·MB·GB·TB·PB 즉시 변환. USB·Wi-Fi·5G 등 6가지 속도별 전송 시간 계산. 클라우드 저장용량 계산에 유용.',
  },
  alternates: {
    canonical: 'https://keyword-mixer.vercel.app/file-size-converter',
    languages: { 'ko-KR': 'https://keyword-mixer.vercel.app/file-size-converter', 'en-US': 'https://keyword-mixer.vercel.app/file-size-converter' },
  },
  robots: { index: true, follow: true },
}

// JSON-LD 구조화 데이터
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: '파일 크기 단위 변환기 — KB·MB·GB·TB 즉시 변환',
  url: 'https://keyword-mixer.vercel.app/file-size-converter',
  description: 'Byte부터 PB까지 6개 단위 즉시 변환. 전송 속도별 예상 전송 시간 제공.',
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
  featureList: 'Byte부터 PB까지 6개 단위 즉시 변환. 전송 속도별 예상 전송 시간 제공.',
}

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <FileSizeConverter />
    </>
  )
}
