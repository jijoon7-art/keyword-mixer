import type { Metadata } from 'next'
import ImageCompressor from '@/components/ImageCompressor'
export const metadata: Metadata = {
  title: '이미지 압축기 — 무료 사진 용량 줄이기 · JPG PNG 압축',
  description: '무료 이미지 압축기. JPG·PNG·WebP 이미지 용량을 즉시 압축. 여러 장 동시 압축, 품질 조절, 브라우저에서 처리하여 개인정보 보호.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/image-compressor' },
}
export default function Page() { return <ImageCompressor /> }
