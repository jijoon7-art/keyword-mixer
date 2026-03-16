import type { Metadata } from 'next'
import CssGradient from '@/components/CssGradient'
export const metadata: Metadata = {
  title: 'CSS 그라디언트 생성기 — 무료 gradient maker',
  description: '무료 CSS 그라디언트 생성기. Linear·Radial·Conic 그라디언트 즉시 생성. CSS·Tailwind 코드 복사, 프리셋 10종 제공.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/css-gradient' },
}
export default function Page() { return <CssGradient /> }
