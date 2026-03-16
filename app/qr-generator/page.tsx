import type { Metadata } from 'next'
import QRGenerator from '@/components/QRGenerator'
export const metadata: Metadata = {
  title: 'QR코드 생성기 — 무료 QR코드 만들기 · URL/WiFi/전화 QR',
  description: '무료 QR코드 생성기. URL·텍스트·이메일·전화·WiFi QR코드를 즉시 생성. 색상 커스텀, 고해상도 PNG 다운로드. 로그인 없이 무료 사용.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/qr-generator' },
}
export default function Page() { return <QRGenerator /> }
