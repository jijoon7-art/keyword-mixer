import type { Metadata } from 'next'
import ImageEditor from '@/components/ImageEditor'
export const metadata: Metadata = {
  title: '이미지 편집기 — 무료 리사이즈·변환·회전·필터·워터마크',
  description: '무료 이미지 편집기. 리사이즈·JPG PNG WebP 변환·회전·뒤집기·밝기대비 필터·워터마크 추가. 브라우저에서 처리하여 개인정보 보호. 로그인 없이 무료.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/image-editor' },
}
export default function Page() { return <ImageEditor /> }
