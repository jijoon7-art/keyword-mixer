import type { Metadata } from 'next'
import MbtiCompatibility from '@/components/MbtiCompatibility'

export const metadata: Metadata = {
  title: '[2025 최신] MBTI 궁합 계산기 황금 궁합 | Keyword Mixer 무료 계산기',
  description: '무료 MBTI 궁합 계산기. 16가지 유형별 궁합 점수와 황금 궁합 분석. 관계 특성 설명 포함. Free MBTI compatibility calculator.',
  keywords: 'MBTI 궁합, MBTI 황금 궁합, mbti 궁합 계산기, MBTI 유형 궁합, MBTI compatibility',
  openGraph: {
    title: '[2025] MBTI 궁합 계산기 황금 궁합 | Keyword Mixer',
    description: '무료 MBTI 궁합 계산기. 16가지 유형별 궁합 점수와 황금 궁합 분석. 관계 특성 설명 포함. Free MBTI compatibility calculator.',
    url: 'https://keyword-mixer.vercel.app/mbti-compatibility',
    siteName: 'Keyword Mixer — 무료 계산기',
    locale: 'ko_KR',
    type: 'website',
  },
  alternates: {
    canonical: 'https://keyword-mixer.vercel.app/mbti-compatibility',
    languages: { 'ko-KR': 'https://keyword-mixer.vercel.app/mbti-compatibility', 'en-US': 'https://keyword-mixer.vercel.app/mbti-compatibility' },
  },
  robots: { index: true, follow: true },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'MBTI 궁합 계산기 황금 궁합',
  url: 'https://keyword-mixer.vercel.app/mbti-compatibility',
  applicationCategory: 'UtilitiesApplication',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'KRW' },
  isAccessibleForFree: true,
  inLanguage: ['ko', 'en'],
}

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <MbtiCompatibility />
    </>
  )
}
