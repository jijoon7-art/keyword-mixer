import type { Metadata } from 'next'
import EmojiSearch from '@/components/EmojiSearch'
export const metadata: Metadata = {
  title: '이모지 검색기 — 무료 이모티콘 찾기 · 한국어 이모지 복사',
  description: '무료 이모지 검색기. 한국어·영어로 이모지를 검색하고 클릭 한 번으로 복사. 최근 사용, 카테고리별 이모지 모음.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/emoji-search' },
}
export default function Page() { return <EmojiSearch /> }
