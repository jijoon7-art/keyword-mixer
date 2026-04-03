import type { Metadata } from 'next'
import AgeCalculator from '@/components/AgeCalculator'

export const metadata: Metadata = {
  title: '나이 계산기 — 만 나이·한국 나이·태어난 요일 계산 2025 | Keyword Mixer',
  description: '무료 나이 계산기. 2025년 기준 만 나이와 한국식 나이 동시 계산. 태어난 요일, 다음 생일까지 남은 일수, 생일이 무슨 요일인지 확인. 띠·별자리도 제공.',
  keywords: '나이 계산기, 만 나이 계산, 한국 나이, 내 나이 계산기, 2025 나이 계산, age calculator Korea, Korean age, 만나이 계산기',
  openGraph: {
    title: '나이 계산기 — 만 나이·한국 나이·태어난 요일 계산 2025 | Keyword Mixer',
    description: '무료 나이 계산기. 2025년 기준 만 나이와 한국식 나이 동시 계산. 태어난 요일, 다음 생일까지 남은 일수, 생일이 무슨 요일인지 확인. 띠·별자리도 제공.',
    url: 'https://keyword-mixer.vercel.app/age-calculator',
    siteName: 'Keyword Mixer — 무료 계산기·도구 모음',
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '나이 계산기 — 만 나이·한국 나이·태어난 요일 계산 2025 | Keyword Mixer',
    description: '무료 나이 계산기. 2025년 기준 만 나이와 한국식 나이 동시 계산. 태어난 요일, 다음 생일까지 남은 일수, 생일이 무슨 요일인지 확인. 띠·별자리도 제공.',
  },
  alternates: {
    canonical: 'https://keyword-mixer.vercel.app/age-calculator',
    languages: { 'ko-KR': 'https://keyword-mixer.vercel.app/age-calculator', 'en-US': 'https://keyword-mixer.vercel.app/age-calculator' },
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: '나이 계산기 — 만 나이·한국 나이',
  url: 'https://keyword-mixer.vercel.app/age-calculator',
  description: '2025년 기준 만 나이와 한국 나이 계산. 태어난 요일·다음 생일 정보 제공.',
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
      <AgeCalculator />
    </>
  )
}
