import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://keywordmixer.app'),
  title: {
    default: '키워드 조합기 — 무료 키워드 생성기 · SEO키워드 자동 조합 도구 | Keyword Mixer',
    template: '%s | 키워드 조합기 · Keyword Mixer',
  },
  description:
    '무료 키워드 조합기 · 키워드 생성기. SEO키워드를 그룹별로 자동 조합하고 중복 제거 후 Excel·CSV·텍스트로 다운로드. Free keyword combiner, mixer & generator tool for SEO, Google Ads, PPC, long-tail keywords and keyword permutations.',
  keywords: [
    // 한국어 — 실검 기반 1~3순위
    '키워드 조합기', 'SEO키워드', '키워드 생성기',
    '키워드 믹서', '키워드 조합 도구', '키워드 자동 조합',
    '네이버 키워드 조합기', '쇼핑 키워드 조합기',
    '롱테일 키워드 생성기', 'SEO 키워드 도구 무료',
    '스마트스토어 키워드 조합', '쿠팡 키워드 조합',
    '블로그 키워드 조합기', '유튜브 태그 생성기',
    // 영어 — 경쟁사 분석 기반 고검색량
    'keyword combiner', 'keyword mixer', 'keyword generator',
    'free keyword combiner', 'keyword combination tool',
    'keyword permutation tool', 'bulk keyword generator',
    'long tail keyword generator', 'SEO keyword tool',
    'keyword merge tool', 'keyword concatenator',
    'Google Ads keyword tool', 'PPC keyword generator',
    'keyword list generator', 'combine keywords',
    'keyword mixing tool', 'free keyword tool',
    'keyword combiner free', 'merge keywords',
  ],
  authors: [{ name: 'Keyword Mixer' }],
  creator: 'Keyword Mixer',
  openGraph: {
    title: '키워드 조합기 — 무료 키워드 생성기 · SEO키워드 자동 조합 | Keyword Mixer',
    description: '무료 키워드 조합기 · 키워드 생성기. SEO키워드 자동 조합 → 엑셀·CSV 다운로드. Free keyword combiner & mixer for SEO, Google Ads, PPC.',
    url: 'https://keywordmixer.app',
    siteName: 'Keyword Mixer',
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '키워드 조합기 — Free Keyword Combiner & Mixer Tool',
    description: '무료 키워드 조합기 · Free keyword combiner, mixer & generator for SEO and Google Ads',
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
  alternateName: ['키워드 조합기', '키워드 믹서', 'Keyword Combiner'],
  url: 'https://keywordmixer.app',
  description: '무료 키워드 조합기 · Free keyword combiner, mixer and generator tool for SEO',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'KRW' },
  inLanguage: ['ko', 'en'],
  featureList: [
    '키워드 자동 조합',
    'Excel/CSV/TXT 다운로드',
    '중복 제거',
    '대소문자 변환',
    'Keyword combination',
    'Bulk keyword generation',
    'Long-tail keyword generation',
  ],
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
