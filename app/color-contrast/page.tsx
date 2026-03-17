import type { Metadata } from 'next'
import ColorContrast from '@/components/ColorContrast'
export const metadata: Metadata = {
  title: '색상 대비 검사기 — WCAG 접근성 | Color Contrast Checker',
  description: '무료 색상 대비 검사기. WCAG AA/AAA 기준 자동 판정. Free WCAG color contrast accessibility checker.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/color-contrast' },
}
export default function Page() { return <ColorContrast /> }
