import type { Metadata } from 'next'
import TextDiff from '@/components/TextDiff'

export const metadata: Metadata = {
  title: '텍스트 비교기 — 무료 텍스트 차이 비교 · diff 도구 · 문서 변경사항 찾기 | Keyword Mixer',
  description: '무료 텍스트 비교기(diff). 두 텍스트의 차이점을 빨간색/초록색으로 강조 표시. 문서 수정 전후 비교, 코드 변경 확인에 필수. 줄 단위·단어 단위 비교 지원.',
  keywords: '텍스트 비교기, 텍스트 diff, 문서 비교, 텍스트 차이점 찾기, diff 도구, 변경사항 비교, text diff tool, text compare, document compare',
  openGraph: {
    title: '텍스트 비교기 — 무료 텍스트 차이 비교 · diff 도구 · 문서 변경사항 찾기 | Keyword Mixer',
    description: '무료 텍스트 비교기(diff). 두 텍스트의 차이점을 빨간색/초록색으로 강조 표시. 문서 수정 전후 비교, 코드 변경 확인에 필수. 줄 단위·단어 단위 비교 지원.',
    url: 'https://keyword-mixer.vercel.app/text-diff',
    siteName: 'Keyword Mixer — 무료 계산기·도구 모음',
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '텍스트 비교기 — 무료 텍스트 차이 비교 · diff 도구 · 문서 변경사항 찾기 | Keyword Mixer',
    description: '무료 텍스트 비교기(diff). 두 텍스트의 차이점을 빨간색/초록색으로 강조 표시. 문서 수정 전후 비교, 코드 변경 확인에 필수. 줄 단위·단어 단위 비교 지원.',
  },
  alternates: {
    canonical: 'https://keyword-mixer.vercel.app/text-diff',
    languages: { 'ko-KR': 'https://keyword-mixer.vercel.app/text-diff', 'en-US': 'https://keyword-mixer.vercel.app/text-diff' },
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: '텍스트 비교기 (Diff)',
  url: 'https://keyword-mixer.vercel.app/text-diff',
  description: '두 텍스트의 차이점을 강조 표시. 문서 수정 전후 비교.',
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
      <TextDiff />
    </>
  )
}
