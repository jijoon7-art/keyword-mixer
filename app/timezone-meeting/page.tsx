import type { Metadata } from 'next'
import TimezoneMeeting from '@/components/TimezoneMeeting'

export const metadata: Metadata = {
  title: '[2025 최신] 국제 미팅 시간 조율기 세계 시간대 — International Meeting Time Finder | Keyword Mixer',
  description: '무료 국제 화상 미팅 시간 조율기. 서울·뉴욕·런던 등 13개 도시의 업무시간 겹치는 최적 시간 자동 계산. 24시간 시각화 차트. 재택근무 글로벌 팀 필수. Free international meeting time finder. Find overlapping business hours across 13 cities worldwide.',
  keywords: '국제 미팅 시간, 세계 시간대 계산, 화상회의 시간 조율, 시차 계산기, timezone meeting, meeting time finder, international time overlap',
  authors: [{ name: 'Keyword Mixer' }],
  openGraph: {
    title: '[2025 최신] 국제 미팅 시간 조율기 세계 시간대 — International Meeting Time Finder | Keyword Mixer',
    description: '무료 국제 화상 미팅 시간 조율기. 서울·뉴욕·런던 등 13개 도시의 업무시간 겹치는 최적 시간 자동 계산. 24시간 시각화 차트. 재택근무 글로벌 팀 필수. Free international meeting time finder. Find overlapping business hours across 13 cities worldwide.',
    url: 'https://keyword-mixer.vercel.app/timezone-meeting',
    siteName: 'Keyword Mixer — 무료 계산기',
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: '국제 미팅 시간 조율기 세계 시간대 | Keyword Mixer',
    description: '무료 국제 화상 미팅 시간 조율기. 서울·뉴욕·런던 등 13개 도시의 업무시간 겹치는 최적 시간 자동 계산. 24시간 시각화 차트. 재택근무 글로벌 팀 필수.',
  },
  alternates: {
    canonical: 'https://keyword-mixer.vercel.app/timezone-meeting',
    languages: { 'ko-KR': 'https://keyword-mixer.vercel.app/timezone-meeting', 'en-US': 'https://keyword-mixer.vercel.app/timezone-meeting' },
  },
  robots: { index: true, follow: true },
}

// JSON-LD 구조화 데이터
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: '국제 미팅 시간 조율기 — 세계 업무시간 겹침 자동 계산',
  url: 'https://keyword-mixer.vercel.app/timezone-meeting',
  description: '13개 도시의 업무시간 겹치는 최적 화상 미팅 시간을 자동으로 찾아줌.',
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
  featureList: '13개 도시의 업무시간 겹치는 최적 화상 미팅 시간을 자동으로 찾아줌.',
}

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <TimezoneMeeting />
    </>
  )
}
