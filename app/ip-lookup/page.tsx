import type { Metadata } from 'next'
import IpLookup from '@/components/IpLookup'
export const metadata: Metadata = {
  title: 'IP 주소 조회 — 내 IP 확인 · IP 위치 조회 | IP Lookup',
  description: '무료 IP 주소 조회. 내 IP 주소, 위치, ISP 즉시 확인. 특정 IP 정보 조회 가능. Free IP address lookup - check your IP location, ISP, and timezone instantly.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/ip-lookup' },
}
export default function Page() { return <IpLookup /> }
