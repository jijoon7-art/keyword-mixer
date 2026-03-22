import type { Metadata } from 'next'
import InternetSpeedConverter from '@/components/InternetSpeedConverter'
export const metadata: Metadata = {
  title: '인터넷 속도 단위 변환기 — Mbps MB/s 변환 | Speed Converter',
  description: '무료 인터넷 속도 단위 변환기. Mbps·Gbps·MB/s·GB/s 즉시 변환. 다운로드 시간 계산. Free internet speed unit converter with download time.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/internet-speed-converter' },
}
export default function Page() { return <InternetSpeedConverter /> }
