import type { Metadata } from 'next'
import QRGenerator from '@/components/QRGenerator'
export const metadata: Metadata = {
  title: 'QR코드 생성기 — 무료 QR코드 만들기 | Free QR Code Generator',
  description: '무료 QR코드 생성기. Free QR code generator online - create QR codes for URL, WiFi, email, phone. Custom colors, high resolution PNG download.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/qr-generator' },
}
export default function Page() { return <QRGenerator /> }
