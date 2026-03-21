import type { Metadata } from 'next'
import HashGenerator from '@/components/HashGenerator'
export const metadata: Metadata = {
  title: 'Hash 생성기 — MD5·SHA-1·SHA-256·SHA-512 | Hash Generator',
  description: '무료 Hash 생성기. MD5, SHA-1, SHA-256, SHA-512 해시값 즉시 생성. Free online MD5 SHA hash generator.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/hash-generator' },
}
export default function Page() { return <HashGenerator /> }
