import type { Metadata } from 'next'
import UuidGenerator from '@/components/UuidGenerator'
export const metadata: Metadata = {
  title: 'UUID 생성기 — UUID v4 ULID NanoID 랜덤 ID | UUID Generator',
  description: '무료 UUID 생성기. UUID v4·ULID·NanoID·MongoDB ObjectId 즉시 생성. Free UUID generator for developers.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/uuid-generator' },
}
export default function Page() { return <UuidGenerator /> }
