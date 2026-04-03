import type { Metadata } from 'next'
import RegexTester from '@/components/RegexTester'

export const metadata: Metadata = {
  title: '정규식 테스터 — 무료 정규표현식 검사기 · Regex 실시간 테스트 | Keyword Mixer',
  description: '무료 정규식(Regex) 테스터. 정규표현식을 실시간으로 테스트하고 매칭 결과를 확인. 그룹 캡처, 플래그 설정, 자주 쓰는 정규식 패턴 제공. 개발자 필수 도구.',
  keywords: '정규식 테스터, 정규표현식 검사기, regex tester, 정규식 실시간 테스트, 정규표현식 패턴, regular expression tester online',
  openGraph: {
    title: '정규식 테스터 — 무료 정규표현식 검사기 · Regex 실시간 테스트 | Keyword Mixer',
    description: '무료 정규식(Regex) 테스터. 정규표현식을 실시간으로 테스트하고 매칭 결과를 확인. 그룹 캡처, 플래그 설정, 자주 쓰는 정규식 패턴 제공. 개발자 필수 도구.',
    url: 'https://keyword-mixer.vercel.app/regex-tester',
    siteName: 'Keyword Mixer — 무료 계산기·도구 모음',
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '정규식 테스터 — 무료 정규표현식 검사기 · Regex 실시간 테스트 | Keyword Mixer',
    description: '무료 정규식(Regex) 테스터. 정규표현식을 실시간으로 테스트하고 매칭 결과를 확인. 그룹 캡처, 플래그 설정, 자주 쓰는 정규식 패턴 제공. 개발자 필수 도구.',
  },
  alternates: {
    canonical: 'https://keyword-mixer.vercel.app/regex-tester',
    languages: { 'ko-KR': 'https://keyword-mixer.vercel.app/regex-tester', 'en-US': 'https://keyword-mixer.vercel.app/regex-tester' },
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: '정규식 테스터 (Regex Tester)',
  url: 'https://keyword-mixer.vercel.app/regex-tester',
  description: '정규표현식 실시간 테스트. 매칭 결과 강조 표시.',
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
      <RegexTester />
    </>
  )
}
