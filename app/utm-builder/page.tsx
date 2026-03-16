import type { Metadata } from 'next'
import UtmBuilder from '@/components/UtmBuilder'

export const metadata: Metadata = {
  title: 'UTM Builder — 무료 UTM 링크 생성기 · 마케팅 URL 빌더',
  description: '무료 UTM Builder. UTM 파라미터(source, medium, campaign, term, content) 링크 자동 생성. 구글 애널리틱스 캠페인 추적용 URL 생성기.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/utm-builder' },
}

export default function UtmBuilderPage() {
  return <UtmBuilder />
}
