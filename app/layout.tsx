import type { Metadata } from 'next'
import './globals.css'
import LayoutShell from '@/components/LayoutShell'
import { LangProvider } from '@/components/LangContext'

export const metadata: Metadata = {
  metadataBase: new URL('https://keyword-mixer.vercel.app'),
  title: {
    default: '키워드 조합기 — 무료 키워드 생성기 · SEO키워드 자동 조합 도구 | Keyword Mixer',
    template: '%s | 키워드 조합기 · Keyword Mixer',
  },
  description:
    '무료 키워드 조합기 · 키워드 생성기. SEO키워드를 그룹별로 자동 조합하고 중복 제거 후 Excel·CSV·텍스트로 다운로드. 글자수 세기, 유튜브 태그 생성기, UTM Builder, 해시태그 생성기 등 무료 SEO 도구 모음.',
  keywords: [
    '키워드 조합기', 'SEO키워드', '키워드 생성기',
    '키워드 믹서', '키워드 조합 도구', '키워드 자동 조합',
    '네이버 키워드 조합기', '쇼핑 키워드 조합기',
    '롱테일 키워드 생성기', 'SEO 키워드 도구 무료',
    '스마트스토어 키워드 조합', '쿠팡 키워드 조합',
    '블로그 키워드 조합기', '유튜브 태그 생성기',
    '글자수 세기', '해시태그 생성기', 'UTM 빌더',
    'keyword combiner', 'keyword mixer', 'keyword generator',
    'free keyword combiner', 'keyword combination tool',
    'keyword permutation tool', 'bulk keyword generator',
    'long tail keyword generator', 'SEO keyword tool',
    'keyword merge tool', 'keyword concatenator',
    'Google Ads keyword tool', 'PPC keyword generator',
    'keyword list generator', 'combine keywords',
    'youtube tag generator', 'hashtag generator', 'UTM builder',
  ],
  authors: [{ name: 'Keyword Mixer' }],
  creator: 'Keyword Mixer',
  openGraph: {
    title: '키워드 조합기 — 무료 SEO 도구 모음 | Keyword Mixer',
    description: '키워드 조합기·글자수 세기·유튜브 태그·UTM Builder·해시태그 생성기. 무료 SEO 도구 모음.',
    url: 'https://keyword-mixer.vercel.app',
    siteName: 'Keyword Mixer',
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '키워드 조합기 — Free Keyword Combiner & SEO Tool',
    description: '무료 키워드 조합기 · Free keyword combiner & SEO tools',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-snippet': -1 },
  },
  alternates: {
    canonical: 'https://keyword-mixer.vercel.app',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Keyword Mixer',
  alternateName: ['키워드 조합기', '키워드 믹서', 'Keyword Combiner'],
  url: 'https://keyword-mixer.vercel.app',
  description: '무료 키워드 조합기 · Free keyword combiner and SEO tools',
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
        {/* Google Analytics GA4 */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-1R84NXCBFE" />
        <script dangerouslySetInnerHTML={{ __html: `window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag("js", new Date());gtag("config", "G-1R84NXCBFE");`}} />
      </head>
      <body className="mesh-bg noise min-h-screen"><LangProvider>
        <LayoutShell>{children}</LayoutShell>
      </LangProvider></body>
    </html>
  )
}
