import type { Metadata } from 'next'
import BinaryText from '@/components/BinaryText'
export const metadata: Metadata = {
  title: '이진수 텍스트 변환기 — 텍스트 이진수 변환 | Binary Converter',
  description: '무료 이진수 텍스트 변환기. 텍스트↔이진수 양방향 변환. ASCII 기반. Free binary to text converter with ASCII encoding.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/binary-text' },
}
export default function Page() { return <BinaryText /> }
