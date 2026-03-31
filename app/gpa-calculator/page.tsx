import type { Metadata } from 'next'
import GpaCalculator from '@/components/GpaCalculator'

export const metadata: Metadata = {
  title: '[2025 최신] 학점 계산기 GPA 대학교 — GPA Calculator Korea | Keyword Mixer',
  description: '무료 대학교 학점 계산기. 4.5점·4.3점·4.0점 만점 선택. 과목별 성적·학점 입력으로 GPA 자동 계산. 목표 GPA 달성을 위한 앞으로 필요한 성적 시뮬레이터. 장학금 기준 비교. Free Korean university GPA calculator. Supports 4.5, 4.3, 4.0 scales with target GPA simulator.',
  keywords: '학점 계산기, GPA 계산기, 대학교 학점, 평균 학점 계산, 4.5 학점, 목표 학점, 장학금 기준, GPA calculator Korea, university grade',
  authors: [{ name: 'Keyword Mixer' }],
  openGraph: {
    title: '[2025 최신] 학점 계산기 GPA 대학교 — GPA Calculator Korea | Keyword Mixer',
    description: '무료 대학교 학점 계산기. 4.5점·4.3점·4.0점 만점 선택. 과목별 성적·학점 입력으로 GPA 자동 계산. 목표 GPA 달성을 위한 앞으로 필요한 성적 시뮬레이터. 장학금 기준 비교. Free Korean university GPA calculator. Supports 4.5, 4.3, 4.0 scales with target GPA simulator.',
    url: 'https://keyword-mixer.vercel.app/gpa-calculator',
    siteName: 'Keyword Mixer — 무료 계산기',
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: '학점 계산기 GPA 대학교 | Keyword Mixer',
    description: '무료 대학교 학점 계산기. 4.5점·4.3점·4.0점 만점 선택. 과목별 성적·학점 입력으로 GPA 자동 계산. 목표 GPA 달성을 위한 앞으로 필요한 성적 시뮬레이터. 장학금 기준 비교.',
  },
  alternates: {
    canonical: 'https://keyword-mixer.vercel.app/gpa-calculator',
    languages: { 'ko-KR': 'https://keyword-mixer.vercel.app/gpa-calculator', 'en-US': 'https://keyword-mixer.vercel.app/gpa-calculator' },
  },
  robots: { index: true, follow: true },
}

// JSON-LD 구조화 데이터
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: '학점 계산기 (GPA) — 대학교 성적 평균 계산',
  url: 'https://keyword-mixer.vercel.app/gpa-calculator',
  description: '4.5/4.3/4.0 만점 GPA 자동 계산. 목표 GPA 달성을 위한 성적 시뮬레이터.',
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
  featureList: '4.5/4.3/4.0 만점 GPA 자동 계산. 목표 GPA 달성을 위한 성적 시뮬레이터.',
}

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <GpaCalculator />
    </>
  )
}
