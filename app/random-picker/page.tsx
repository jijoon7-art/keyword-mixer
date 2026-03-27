import type { Metadata } from 'next'
import RandomPicker from '@/components/RandomPicker'
export const metadata: Metadata = {
  title: '랜덤 선택기 뽑기 도구 — 무작위 추첨 점심 메뉴 | Random Picker',
  description: '무료 랜덤 선택기. 점심 메뉴·당첨자 추첨·팀 배정에 활용. Free random picker and lucky draw tool.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/random-picker' },
}
export default function Page() { return <RandomPicker /> }
