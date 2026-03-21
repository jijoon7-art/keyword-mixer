import type { Metadata } from 'next'
import NicknameGenerator from '@/components/NicknameGenerator'
export const metadata: Metadata = {
  title: '랜덤 닉네임 생성기 — 게임·SNS 아이디 추천 | Nickname Generator',
  description: '무료 랜덤 닉네임 생성기. 게임·SNS·커뮤니티용 닉네임 즉시 생성. 한글·영문·귀여운·멋있는 스타일. Free random nickname generator.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/nickname-generator' },
}
export default function Page() { return <NicknameGenerator /> }
