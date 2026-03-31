import type { Metadata } from 'next'
import Biorhythm from '@/components/Biorhythm'

export const metadata: Metadata = {
  title: '[2025 최신] 바이오리듬 계산기 오늘 바이오리듬 | Keyword Mixer 무료 계산기',
  description: '무료 바이오리듬 계산기. 생년월일로 신체·감성·지성·직관 4사이클 계산. 7일 미니 차트 제공. Free biorhythm calculator.',
  keywords: '바이오리듬 계산기, 오늘의 바이오리듬, 신체 감성 지성 바이오리듬, biorhythm calculator',
  openGraph: {
    title: '[2025] 바이오리듬 계산기 오늘 바이오리듬 | Keyword Mixer',
    description: '무료 바이오리듬 계산기. 생년월일로 신체·감성·지성·직관 4사이클 계산. 7일 미니 차트 제공. Free biorhythm calculator.',
    url: 'https://keyword-mixer.vercel.app/biorhythm',
    siteName: 'Keyword Mixer — 무료 계산기',
    locale: 'ko_KR',
    type: 'website',
  },
  alternates: {
    canonical: 'https://keyword-mixer.vercel.app/biorhythm',
    languages: { 'ko-KR': 'https://keyword-mixer.vercel.app/biorhythm', 'en-US': 'https://keyword-mixer.vercel.app/biorhythm' },
  },
  robots: { index: true, follow: true },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: '바이오리듬 계산기 오늘 바이오리듬',
  url: 'https://keyword-mixer.vercel.app/biorhythm',
  applicationCategory: 'UtilitiesApplication',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'KRW' },
  isAccessibleForFree: true,
  inLanguage: ['ko', 'en'],
}

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Biorhythm />
    </>
  )
}
