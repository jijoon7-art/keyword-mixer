import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://keywordmixer.app'),
  title: {
    default: 'Keyword Mixer — 키워드 조합기 | SEO 키워드 생성 도구',
    template: '%s | Keyword Mixer',
  },
  description:
    '키워드 조합기 무료 SEO 도구. 여러 키워드 그룹을 자동 조합하고 중복 제거 후 Excel·CSV·텍스트로 다운로드. Free keyword combiner & mixer tool for SEO, Google Ads, Naver, Coupang, and more.',
  keywords: [
    '키워드 조합기', '키워드 믹서', '키워드 생성기', 'SEO 키워드', '네이버 키워드',
    '키워드 조합 도구', '쇼핑 키워드', '롱테일 키워드', '키워드 순열',
    'keyword combiner', 'keyword mixer', 'keyword generator', 'SEO tool',
    'long tail keywords', 'keyword permutation', 'Google Ads keywords',
    'keyword tool free', 'bulk keyword generator',
  ],
  authors: [{ name: 'Keyword Mixer' }],
  creator: 'Keyword Mixer',
  openGraph: {
    title: 'Keyword Mixer — 키워드 조합기 | Free SEO Keyword Tool',
    description: '키워드 그룹을 자동 조합 → 중복 제거 → Excel/CSV 다운로드. 네이버·구글·쿠팡 SEO 최적화.',
    url: 'https://keywordmixer.app',
    siteName: 'Keyword Mixer',
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Keyword Mixer — 키워드 조합기 Free SEO Tool',
    description: '키워드 조합기 | Free keyword combiner & mixer for SEO',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-snippet': -1 },
  },
  alternates: {
    canonical: 'https://keywordmixer.app',
    languages: {
      'ko-KR': 'https://keywordmixer.app',
      'en-US': 'https://keywordmixer.app/en',
    },
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Keyword Mixer',
  url: 'https://keywordmixer.app',
  description: '키워드 조합기 — 무료 SEO 키워드 생성 도구',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'KRW' },
  inLanguage: ['ko', 'en'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <meta name="naver-site-verification" content="YOUR_NAVER_CODE" />
        <meta name="google-site-verification" content="YOUR_GOOGLE_CODE" />
        {/* Google AdSense — replace ca-pub-XXXXXXXXXXXXXXXX */}
        {/* <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX" crossOrigin="anonymous" /> */}
      </head>
      <body className="mesh-bg noise min-h-screen">
        {children}
      </body>
    </html>
  )
}
