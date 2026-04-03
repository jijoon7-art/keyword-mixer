import type { Metadata } from 'next'
import CharCounter from '@/components/CharCounter'

export const metadata: Metadata = {
  title: '글자수 세기 — 무료 글자수·바이트·공백 카운터 · SNS 글자수 제한 확인 | Keyword Mixer',
  description: '무료 글자수 세기. 한글·영어·특수문자 글자수, 바이트 수, 공백 포함/제외 카운트. 트위터 280자, 카카오톡, 인스타그램, 네이버 블로그 글자수 제한 확인. 실시간 카운팅.',
  keywords: '글자수 세기, 글자수 카운터, 바이트 계산기, 공백 제외 글자수, SNS 글자수 제한, 트위터 글자수, character counter, byte counter',
  openGraph: {
    title: '글자수 세기 — 무료 글자수·바이트·공백 카운터 · SNS 글자수 제한 확인 | Keyword Mixer',
    description: '무료 글자수 세기. 한글·영어·특수문자 글자수, 바이트 수, 공백 포함/제외 카운트. 트위터 280자, 카카오톡, 인스타그램, 네이버 블로그 글자수 제한 확인. 실시간 카운팅.',
    url: 'https://keyword-mixer.vercel.app/char-counter',
    siteName: 'Keyword Mixer — 무료 계산기·도구 모음',
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '글자수 세기 — 무료 글자수·바이트·공백 카운터 · SNS 글자수 제한 확인 | Keyword Mixer',
    description: '무료 글자수 세기. 한글·영어·특수문자 글자수, 바이트 수, 공백 포함/제외 카운트. 트위터 280자, 카카오톡, 인스타그램, 네이버 블로그 글자수 제한 확인. 실시간 카운팅.',
  },
  alternates: {
    canonical: 'https://keyword-mixer.vercel.app/char-counter',
    languages: { 'ko-KR': 'https://keyword-mixer.vercel.app/char-counter', 'en-US': 'https://keyword-mixer.vercel.app/char-counter' },
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: '글자수 세기',
  url: 'https://keyword-mixer.vercel.app/char-counter',
  description: '한글·영어 글자수와 바이트를 실시간으로 계산. SNS 글자수 제한 확인.',
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
      <CharCounter />
    </>
  )
}
