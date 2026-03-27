import type { Metadata } from 'next'
import SeverancePay from '@/components/SeverancePay'
export const metadata: Metadata = {
  title: '퇴직금 계산기 — 법정 퇴직금 퇴직소득세 IRP | Severance Pay',
  description: '무료 퇴직금 계산기. 근속연수·평균임금으로 법정 퇴직금·퇴직소득세·IRP 절세 혜택 계산. Free severance pay calculator.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/severance-pay' },
}
export default function Page() { return <SeverancePay /> }
