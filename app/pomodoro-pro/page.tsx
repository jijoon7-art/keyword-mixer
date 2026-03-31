import type { Metadata } from 'next'
import PomodoroTimer from '@/components/PomodoroTimer'

export const metadata: Metadata = {
  title: '[2025 최신] 포모도로 타이머 집중 타이머 — Pomodoro Timer Online | Keyword Mixer',
  description: '무료 포모도로 타이머. 25분 집중 + 5분 휴식 반복으로 생산성 극대화. 브라우저 탭에 남은 시간 표시. 알림음·자동 전환·세션 기록. 집중력 향상 공부 타이머. Free Pomodoro timer. 25min focus + 5min break. Browser tab countdown, notification sound, session log.',
  keywords: '포모도로 타이머, 뽀모도로 타이머, 집중 타이머, 공부 타이머, 25분 타이머, 시간 관리, Pomodoro timer online, focus timer, study timer',
  authors: [{ name: 'Keyword Mixer' }],
  openGraph: {
    title: '[2025 최신] 포모도로 타이머 집중 타이머 — Pomodoro Timer Online | Keyword Mixer',
    description: '무료 포모도로 타이머. 25분 집중 + 5분 휴식 반복으로 생산성 극대화. 브라우저 탭에 남은 시간 표시. 알림음·자동 전환·세션 기록. 집중력 향상 공부 타이머. Free Pomodoro timer. 25min focus + 5min break. Browser tab countdown, notification sound, session log.',
    url: 'https://keyword-mixer.vercel.app/pomodoro-pro',
    siteName: 'Keyword Mixer — 무료 계산기',
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: '포모도로 타이머 집중 타이머 | Keyword Mixer',
    description: '무료 포모도로 타이머. 25분 집중 + 5분 휴식 반복으로 생산성 극대화. 브라우저 탭에 남은 시간 표시. 알림음·자동 전환·세션 기록. 집중력 향상 공부 타이머.',
  },
  alternates: {
    canonical: 'https://keyword-mixer.vercel.app/pomodoro-pro',
    languages: { 'ko-KR': 'https://keyword-mixer.vercel.app/pomodoro-pro', 'en-US': 'https://keyword-mixer.vercel.app/pomodoro-pro' },
  },
  robots: { index: true, follow: true },
}

// JSON-LD 구조화 데이터
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: '포모도로 타이머 — 집중력 향상 25분 타이머',
  url: 'https://keyword-mixer.vercel.app/pomodoro-pro',
  description: '25분 집중+5분 휴식 반복 포모도로 기법. 알림음과 자동 전환으로 생산성 극대화.',
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
  featureList: '25분 집중+5분 휴식 반복 포모도로 기법. 알림음과 자동 전환으로 생산성 극대화.',
}

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PomodoroTimer />
    </>
  )
}
