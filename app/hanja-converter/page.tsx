import type { Metadata } from 'next'
import HanjaConverter from '@/components/HanjaConverter'
export const metadata: Metadata = {
  title: '한자 변환기 — 이름 한자·사자성어 | Hanja Converter',
  description: '무료 한자 변환기. 이름 한자 뜻 조회, 사자성어 검색. Free Korean Hanja converter with name lookup.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/hanja-converter' },
}
export default function Page() { return <HanjaConverter /> }
