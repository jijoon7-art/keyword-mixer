import type { Metadata } from 'next'
import YoutubeTagGenerator from '@/components/YoutubeTagGenerator'

export const metadata: Metadata = {
  title: '유튜브 태그 생성기 — 무료 YouTube 태그 추출 · SEO 태그',
  description: '무료 유튜브 태그 생성기. 제목·키워드 입력으로 SEO 최적화 태그 자동 생성. 유튜브 알고리즘 최적화 태그 추천.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/youtube-tags' },
}

export default function YoutubeTagsPage() {
  return <YoutubeTagGenerator />
}
