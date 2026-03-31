import type { Metadata } from 'next'
import StopWatch from '@/components/StopWatch'

export const metadata: Metadata = {
  title: '[2025 최신] 스톱워치 온라인 랩 타임 — Online Stopwatch Lap Timer | Keyword Mixer',
  description: '무료 온라인 스톱워치. 밀리초 단위 정밀 측정. 랩 타임 기록·최고/최저 랩 자동 강조. 전체 기록 텍스트 복사. 운동·스포츠·공부에 활용 가능. Free online stopwatch with millisecond precision. Lap timing with best/worst highlighting and record copy.',
  keywords: '스톱워치, 온라인 스톱워치, 랩 타이머, 스톱워치 온라인, 시간 측정, stopwatch online, lap timer, online stopwatch',
  authors: [{ name: 'Keyword Mixer' }],
  openGraph: {
    title: '[2025 최신] 스톱워치 온라인 랩 타임 — Online Stopwatch Lap Timer | Keyword Mixer',
    description: '무료 온라인 스톱워치. 밀리초 단위 정밀 측정. 랩 타임 기록·최고/최저 랩 자동 강조. 전체 기록 텍스트 복사. 운동·스포츠·공부에 활용 가능. Free online stopwatch with millisecond precision. Lap timing with best/worst highlighting and record copy.',
    url: 'https://keyword-mixer.vercel.app/stopwatch',
    siteName: 'Keyword Mixer — 무료 계산기',
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: '스톱워치 온라인 랩 타임 | Keyword Mixer',
    description: '무료 온라인 스톱워치. 밀리초 단위 정밀 측정. 랩 타임 기록·최고/최저 랩 자동 강조. 전체 기록 텍스트 복사. 운동·스포츠·공부에 활용 가능.',
  },
  alternates: {
    canonical: 'https://keyword-mixer.vercel.app/stopwatch',
    languages: { 'ko-KR': 'https://keyword-mixer.vercel.app/stopwatch', 'en-US': 'https://keyword-mixer.vercel.app/stopwatch' },
  },
  robots: { index: true, follow: true },
}

// JSON-LD 구조화 데이터
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: '스톱워치 — 밀리초 정밀 랩 타임 기록',
  url: 'https://keyword-mixer.vercel.app/stopwatch',
  description: '밀리초 단위 정밀 스톱워치. 랩 타임 기록과 최고·최저 랩 자동 분석.',
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
  featureList: '밀리초 단위 정밀 스톱워치. 랩 타임 기록과 최고·최저 랩 자동 분석.',
}

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <StopWatch />
    </>
  )
}
