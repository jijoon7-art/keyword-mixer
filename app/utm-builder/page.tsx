import type { Metadata } from 'next'
import UtmBuilder from '@/components/UtmBuilder'

export const metadata: Metadata = {
  title: 'UTM 빌더 — 무료 UTM 링크 생성기 · 마케팅 URL 파라미터 자동 생성 | Keyword Mixer',
  description: '무료 UTM 빌더. utm_source·utm_medium·utm_campaign 파라미터를 자동으로 생성. Google Analytics 캠페인 추적 URL을 1초 만에 완성. 마케터 필수 도구.',
  keywords: 'UTM 빌더, UTM 링크 생성기, utm_source, utm_campaign, 마케팅 URL, Google Analytics UTM, UTM builder free, campaign URL builder',
  openGraph: {
    title: 'UTM 빌더 — 무료 UTM 링크 생성기 · 마케팅 URL 파라미터 자동 생성 | Keyword Mixer',
    description: '무료 UTM 빌더. utm_source·utm_medium·utm_campaign 파라미터를 자동으로 생성. Google Analytics 캠페인 추적 URL을 1초 만에 완성. 마케터 필수 도구.',
    url: 'https://keyword-mixer.vercel.app/utm-builder',
    siteName: 'Keyword Mixer — 무료 계산기·도구 모음',
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UTM 빌더 — 무료 UTM 링크 생성기 · 마케팅 URL 파라미터 자동 생성 | Keyword Mixer',
    description: '무료 UTM 빌더. utm_source·utm_medium·utm_campaign 파라미터를 자동으로 생성. Google Analytics 캠페인 추적 URL을 1초 만에 완성. 마케터 필수 도구.',
  },
  alternates: {
    canonical: 'https://keyword-mixer.vercel.app/utm-builder',
    languages: { 'ko-KR': 'https://keyword-mixer.vercel.app/utm-builder', 'en-US': 'https://keyword-mixer.vercel.app/utm-builder' },
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'UTM 빌더 — UTM 링크 생성기',
  url: 'https://keyword-mixer.vercel.app/utm-builder',
  description: 'utm_source·utm_medium·utm_campaign 파라미터 자동 생성. Google Analytics 캠페인 추적 URL 완성.',
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
      <UtmBuilder />
    </>
  )
}
