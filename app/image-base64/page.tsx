import type { Metadata } from 'next'
import ImageBase64 from '@/components/ImageBase64'
export const metadata: Metadata = {
  title: '이미지 Base64 변환기 — 이미지 인코딩/디코딩 | Image Base64',
  description: '무료 이미지 Base64 변환기. 이미지를 Base64로 인코딩, Base64를 이미지로 디코딩. Free image to Base64 converter.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/image-base64' },
}
export default function Page() { return <ImageBase64 /> }
