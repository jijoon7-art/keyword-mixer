import type { Metadata } from 'next'
import HashtagGenerator from '@/components/HashtagGenerator'

export const metadata: Metadata = {
  title: '해시태그 생성기 — 무료 인스타그램 · 유튜브 해시태그',
  description: '무료 해시태그 생성기. 키워드 입력으로 인스타그램·유튜브·트위터·틱톡 최적화 해시태그 자동 생성. 인기 해시태그 추천.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/hashtag-generator' },
}

export default function HashtagGeneratorPage() {
  return <HashtagGenerator />
}
