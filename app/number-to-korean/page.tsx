import type { Metadata } from 'next'
import NumberToKorean from '@/components/NumberToKorean'
export const metadata: Metadata = {
  title: '숫자 한글 변환기 — 금액 한글 표기 · 일억 원 변환 | Number to Korean',
  description: '무료 숫자 한글 변환기. 금액을 한글로 즉시 변환. 계약서·수표·세금계산서용 정식 표기 생성. Free number to Korean text converter.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/number-to-korean' },
}
export default function Page() { return <NumberToKorean /> }
