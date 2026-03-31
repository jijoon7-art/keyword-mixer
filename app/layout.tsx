import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import LayoutShell from '@/components/LayoutShell'
import { LangProvider } from '@/components/LangContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://keyword-mixer.vercel.app'),
  title: {
    default: '무료 계산기 모음 132개 — 세금·건강·금융·생활 | Keyword Mixer',
    template: '%s | Keyword Mixer 무료 계산기',
  },
  description: '무료 온라인 계산기 132개 모음. 퇴직금·BMI·부가세·주택담보대출·연말정산·학점·바이오리듬·MBTI 궁합 등 생활·금융·건강·개발자 도구. 회원가입 없이 무료로 즉시 사용.',
  keywords: [
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
    siteName: 'Keyword Mixer — 무료 계산기 모음',
    title: '무료 계산기 132개 모음 — 퇴직금·BMI·부가세·담보대출 | Keyword Mixer',
    description: '무료 온라인 계산기 132개. 세금·건강·금융·생활 도구를 회원가입 없이 즉시 사용. 한영 이중 지원.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Keyword Mixer 무료 계산기 132개 모음',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '무료 계산기 132개 — 세금·건강·금융 | Keyword Mixer',
    description: '퇴직금·BMI·부가세·주택담보대출 등 132개 무료 계산기. 즉시 사용 가능.',
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
        {/* JSON-LD 구조화 데이터 - 웹사이트 전체 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Keyword Mixer — 무료 계산기 모음',
              url: 'https://keyword-mixer.vercel.app',
              description: '무료 온라인 계산기 132개 모음. 세금·건강·금융·생활·개발자 도구.',
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
