import type { Metadata } from 'next'
import YoutubeTags from '@/components/YoutubeTags'

export const metadata: Metadata = {
  title: '유튜브 태그 생성기 — 무료 YouTube SEO 태그 추출 · 해시태그 자동 생성 | Keyword Mixer',
  description: '무료 유튜브 태그 생성기. 영상 제목으로 SEO 최적화된 YouTube 태그를 자동 생성. 인기 채널 태그 분석, 조회수 올리는 유튜브 키워드 추천. 유튜버 필수 도구.',
  keywords: '유튜브 태그 생성기, 유튜브 SEO, YouTube 태그 추출, 유튜브 키워드, 유튜브 태그 추천, YouTube tag generator, YouTube SEO tool',
  openGraph: {
    title: '유튜브 태그 생성기 — 무료 YouTube SEO 태그 추출 · 해시태그 자동 생성 | Keyword Mixer',
    description: '무료 유튜브 태그 생성기. 영상 제목으로 SEO 최적화된 YouTube 태그를 자동 생성. 인기 채널 태그 분석, 조회수 올리는 유튜브 키워드 추천. 유튜버 필수 도구.',
    url: 'https://keyword-mixer.vercel.app/youtube-tags',
    siteName: 'Keyword Mixer — 무료 계산기·도구 모음',
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '유튜브 태그 생성기 — 무료 YouTube SEO 태그 추출 · 해시태그 자동 생성 | Keyword Mixer',
    description: '무료 유튜브 태그 생성기. 영상 제목으로 SEO 최적화된 YouTube 태그를 자동 생성. 인기 채널 태그 분석, 조회수 올리는 유튜브 키워드 추천. 유튜버 필수 도구.',
  },
  alternates: {
    canonical: 'https://keyword-mixer.vercel.app/youtube-tags',
    languages: { 'ko-KR': 'https://keyword-mixer.vercel.app/youtube-tags', 'en-US': 'https://keyword-mixer.vercel.app/youtube-tags' },
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: '유튜브 태그 생성기',
  url: 'https://keyword-mixer.vercel.app/youtube-tags',
  description: 'YouTube 영상 SEO 최적화 태그 자동 생성. 조회수 올리는 키워드 추천.',
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
      <YoutubeTags />
    </>
  )
}
