import type { Metadata } from 'next'
import StampMaker from '@/components/StampMaker'

export const metadata: Metadata = {
  title: '[2025 최신] 도장 만들기 온라인 무료 — Korean Stamp Maker Online Free | Keyword Mixer',
  description: '무료 온라인 도장 만들기. 이름·한글·한자로 원형·사각·타원 도장 즉시 생성. PNG 투명 배경 다운로드. 인주 번짐 효과. 이순신·세종대왕 샘플. 회원가입 없이 무료. Free online Korean stamp maker. Create circle, square, oval stamps with transparent PNG download.',
  keywords: '도장 만들기, 온라인 도장, 이름 도장, 인감도장 만들기, 도장 이미지, 무료 도장 생성기, stamp maker Korea, online stamp, Korean stamp generator',
  authors: [{ name: 'Keyword Mixer' }],
  openGraph: {
    title: '[2025 최신] 도장 만들기 온라인 무료 — Korean Stamp Maker Online Free | Keyword Mixer',
    description: '무료 온라인 도장 만들기. 이름·한글·한자로 원형·사각·타원 도장 즉시 생성. PNG 투명 배경 다운로드. 인주 번짐 효과. 이순신·세종대왕 샘플. 회원가입 없이 무료. Free online Korean stamp maker. Create circle, square, oval stamps with transparent PNG download.',
    url: 'https://keyword-mixer.vercel.app/stamp-maker',
    siteName: 'Keyword Mixer — 무료 계산기',
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: '도장 만들기 온라인 무료 | Keyword Mixer',
    description: '무료 온라인 도장 만들기. 이름·한글·한자로 원형·사각·타원 도장 즉시 생성. PNG 투명 배경 다운로드. 인주 번짐 효과. 이순신·세종대왕 샘플. 회원가입 없이 무료.',
  },
  alternates: {
    canonical: 'https://keyword-mixer.vercel.app/stamp-maker',
    languages: { 'ko-KR': 'https://keyword-mixer.vercel.app/stamp-maker', 'en-US': 'https://keyword-mixer.vercel.app/stamp-maker' },
  },
  robots: { index: true, follow: true },
}

// JSON-LD 구조화 데이터
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: '도장 만들기 — 온라인 무료 이름 도장 PNG 생성',
  url: 'https://keyword-mixer.vercel.app/stamp-maker',
  description: '이름으로 원형·사각·타원 도장 즉시 생성. 투명 PNG 다운로드.',
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
  featureList: '이름으로 원형·사각·타원 도장 즉시 생성. 투명 PNG 다운로드.',
}

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <StampMaker />
    </>
  )
}
