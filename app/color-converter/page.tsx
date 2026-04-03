import type { Metadata } from 'next'
import ColorConverter from '@/components/ColorConverter'

export const metadata: Metadata = {
  title: '색상 코드 변환기 — 무료 HEX RGB HSL CMYK 색상 변환 도구 | Keyword Mixer',
  description: '무료 색상 코드 변환기. HEX→RGB→HSL→CMYK 색상 코드 즉시 변환. 색상 피커, 보색·유사색 계산, 웹 디자인 색상 추출. 디자이너·개발자 필수.',
  keywords: '색상 코드 변환기, HEX RGB 변환, HSL CMYK 변환, 색상 피커, color converter, HEX to RGB, RGB to HSL, color code converter',
  openGraph: {
    title: '색상 코드 변환기 — 무료 HEX RGB HSL CMYK 색상 변환 도구 | Keyword Mixer',
    description: '무료 색상 코드 변환기. HEX→RGB→HSL→CMYK 색상 코드 즉시 변환. 색상 피커, 보색·유사색 계산, 웹 디자인 색상 추출. 디자이너·개발자 필수.',
    url: 'https://keyword-mixer.vercel.app/color-converter',
    siteName: 'Keyword Mixer — 무료 계산기·도구 모음',
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '색상 코드 변환기 — 무료 HEX RGB HSL CMYK 색상 변환 도구 | Keyword Mixer',
    description: '무료 색상 코드 변환기. HEX→RGB→HSL→CMYK 색상 코드 즉시 변환. 색상 피커, 보색·유사색 계산, 웹 디자인 색상 추출. 디자이너·개발자 필수.',
  },
  alternates: {
    canonical: 'https://keyword-mixer.vercel.app/color-converter',
    languages: { 'ko-KR': 'https://keyword-mixer.vercel.app/color-converter', 'en-US': 'https://keyword-mixer.vercel.app/color-converter' },
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: '색상 코드 변환기',
  url: 'https://keyword-mixer.vercel.app/color-converter',
  description: 'HEX·RGB·HSL·CMYK 색상 코드 즉시 변환. 색상 피커 포함.',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Web Browser',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'KRW' },
  isAccessibleForFree: true,
  inLanguage: ['ko', 'en'],
}

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ColorConverter />
    </>
  )
}
