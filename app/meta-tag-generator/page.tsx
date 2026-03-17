import type { Metadata } from 'next'
import MetaTagGenerator from '@/components/MetaTagGenerator'
export const metadata: Metadata = {
  title: 'SEO 메타태그 생성기 — Open Graph · Twitter Card',
  description: '무료 SEO 메타태그 생성기. HTML 메타태그·OG·Twitter Card 즉시 생성. Free SEO meta tag generator.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/meta-tag-generator' },
}
export default function Page() { return <MetaTagGenerator /> }
