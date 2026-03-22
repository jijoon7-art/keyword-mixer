import type { Metadata } from 'next'
import CharacterCounterPro from '@/components/CharacterCounterPro'
export const metadata: Metadata = {
  title: '글자수 세기 Pro — SNS 한도·단어수·읽기시간 | Character Counter',
  description: '무료 글자수 세기 Pro. 트위터·인스타그램 글자수 한도 체크, 읽기 시간 계산. Free character counter with SNS limits and reading time.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/character-counter-pro' },
}
export default function Page() { return <CharacterCounterPro /> }
