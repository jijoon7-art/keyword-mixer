import type { Metadata } from 'next'
import PasswordStrength from '@/components/PasswordStrength'

export const metadata: Metadata = {
  title: '[2025 최신] 비밀번호 강도 검사기 보안 — Password Strength Checker | Keyword Mixer',
  description: '무료 비밀번호 강도 검사기. 비밀번호 보안 강도·크래킹 예상 시간 즉시 분석. 100% 브라우저 로컬 처리 (서버 전송 없음). 강력한 비밀번호 생성기 포함. Free password strength checker. Instant security score, crack time estimate. 100% local processing, never sent to server.',
  keywords: '비밀번호 강도 검사, 비밀번호 보안, 패스워드 강도, 비밀번호 생성기, 안전한 비밀번호, password strength checker, password security test',
  authors: [{ name: 'Keyword Mixer' }],
  openGraph: {
    title: '[2025 최신] 비밀번호 강도 검사기 보안 — Password Strength Checker | Keyword Mixer',
    description: '무료 비밀번호 강도 검사기. 비밀번호 보안 강도·크래킹 예상 시간 즉시 분석. 100% 브라우저 로컬 처리 (서버 전송 없음). 강력한 비밀번호 생성기 포함. Free password strength checker. Instant security score, crack time estimate. 100% local processing, never sent to server.',
    url: 'https://keyword-mixer.vercel.app/password-strength',
    siteName: 'Keyword Mixer — 무료 계산기',
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: '비밀번호 강도 검사기 보안 | Keyword Mixer',
    description: '무료 비밀번호 강도 검사기. 비밀번호 보안 강도·크래킹 예상 시간 즉시 분석. 100% 브라우저 로컬 처리 (서버 전송 없음). 강력한 비밀번호 생성기 포함.',
  },
  alternates: {
    canonical: 'https://keyword-mixer.vercel.app/password-strength',
    languages: { 'ko-KR': 'https://keyword-mixer.vercel.app/password-strength', 'en-US': 'https://keyword-mixer.vercel.app/password-strength' },
  },
  robots: { index: true, follow: true },
}

// JSON-LD 구조화 데이터
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: '비밀번호 강도 검사기 — 보안 강도·크래킹 시간 분석',
  url: 'https://keyword-mixer.vercel.app/password-strength',
  description: '비밀번호 보안 강도와 크래킹 예상 시간을 분석. 100% 로컬 처리로 안전.',
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
  featureList: '비밀번호 보안 강도와 크래킹 예상 시간을 분석. 100% 로컬 처리로 안전.',
}

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PasswordStrength />
    </>
  )
}
