import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import LayoutShell from '@/components/LayoutShell'
import { LangProvider } from '@/components/LangContext'
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://keyword-mixer.vercel.app'),
  title: {
    default: '무료 계산기 모음 132개 및 오늘 뭐 먹지 음식 월드컵 | Keyword Mixer',
    template: '%s | Keyword Mixer 무료 계산기 & 메뉴 추천',
  },
  description: '무료 온라인 계산기 132개 모음(퇴직금·BMI·부가세)과 오늘 뭐 먹지 고민을 1초 만에 해결해 줄 AI 음식 이상형 월드컵 메뉴 추천 도구를 회원가입 없이 즉시 이용하세요.',
  keywords: [
    '오늘 뭐 먹지', '음식월드컵', '점심월드컵', '점심추천', '점심메뉴추천', 'AI음식추천', '음식추천', // ← 유입용 핵심 키워드 전면 배치
    '무료 계산기', '온라인 계산기', '퇴직금 계산기', 'BMI 계산기', '부가세 계산기',
    '주택담보대출 계산기', '연말정산 계산기', '학점 계산기', '최저임금 계산기',
    '전세자금대출 계산기', '출산지원금', '바이오리듬', 'MBTI 궁합', '수익률 계산기',
    '도장 만들기', '포모도로 타이머', '공학용 계산기', 'free calculator Korea',
  ],
  authors: [{ name: 'Keyword Mixer', url: 'https://keyword-mixer.vercel.app' }],
  creator: 'Keyword Mixer',
  publisher: 'Keyword Mixer',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    alternateLocale: 'en_US',
    url: 'https://keyword-mixer.vercel.app',
    siteName: 'Keyword Mixer — 무료 계산기 및 메뉴 추천',
    title: '무료 계산기 132개 모음 & 오늘 뭐 먹지 음식 월드컵 | Keyword Mixer',
    description: '세금·건강·금융 계산기부터 AI가 추천해주는 음식 월드컵까지, 다양한 생활 편의 도구를 제공합니다.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Keyword Mixer 무료 계산기 및 음식 월드컵',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '무료 계산기 132개 & 음식 이상형 월드컵 | Keyword Mixer',
    description: '퇴직금 계산부터 오늘 저녁 메뉴 추천까지 한 번에 해결하는 무료 툴 모음집.',
    images: ['/og-image.png'],
  },
  verification: {
    google: 'google-site-verification-placeholder',
    other: {
      'naver-site-verification': 'naver-verification-placeholder',
    },
  },
  alternates: {
    canonical: 'https://keyword-mixer.vercel.app',
    languages: {
      'ko-KR': 'https://keyword-mixer.vercel.app',
      'en-US': 'https://keyword-mixer.vercel.app',
    },
  },
  category: 'tools',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3578085366553592"
        crossOrigin="anonymous"></script>
        {/* JSON-LD 구조화 데이터 - 웹사이트 전체 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Keyword Mixer — 무료 계산기 및 음식 월드컵',
              url: 'https://keyword-mixer.vercel.app',
              description: '무료 온라인 계산기 132개 모음 및 AI 음식 추천 월드컵 도구.',
              inLanguage: ['ko', 'en'],
              potentialAction: {
                '@type': 'SearchAction',
                target: {
                  '@type': 'EntryPoint',
                  urlTemplate: 'https://keyword-mixer.vercel.app/?q={search_term_string}',
                },
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
        {/* JSON-LD - 조직 정보 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Keyword Mixer',
              url: 'https://keyword-mixer.vercel.app',
              logo: 'https://keyword-mixer.vercel.app/logo.png',
              sameAs: [],
            }),
          }}
        />
        {/* 네이버 웹마스터 */}
        <meta name="naver-site-verification" content="naver-verification-placeholder" />
        {/* 빠른 링크 힌트 */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <meta name="theme-color" content="#0f1117" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className={`${inter.className} bg-[#0f1117] text-slate-200 min-h-screen`}>
        <LangProvider>
          <LayoutShell>
            {children}
          </LayoutShell>
        </LangProvider>
      </body>
    </html>
  )
}