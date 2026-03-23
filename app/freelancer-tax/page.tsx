import type { Metadata } from 'next'
import FreelancerTax from '@/components/FreelancerTax'
export const metadata: Metadata = {
  title: '프리랜서 세금 계산기 — 사업소득세 종합소득세 | Freelancer Tax',
  description: '무료 프리랜서 세금 계산기. 종합소득세·건강보험·부가세 계산. Free freelancer and sole proprietor tax calculator.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/freelancer-tax' },
}
export default function Page() { return <FreelancerTax /> }
