import type { Metadata } from 'next'
import JsonToTypescript from '@/components/JsonToTypescript'
export const metadata: Metadata = {
  title: 'JSON → TypeScript 변환기 — 인터페이스 자동 생성 | JSON to TypeScript',
  description: '무료 JSON to TypeScript 변환기. JSON 데이터를 TypeScript 인터페이스로 즉시 변환. Free JSON to TypeScript interface generator.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/json-to-typescript' },
}
export default function Page() { return <JsonToTypescript /> }
