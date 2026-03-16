import type { Metadata } from 'next'
import PdfTools from '@/components/PdfTools'
export const metadata: Metadata = {
  title: 'PDF 도구 — 무료 PDF 합치기·분리·페이지 삭제',
  description: '무료 PDF 도구. PDF 합치기·분리·페이지 삭제를 브라우저에서 처리. 파일이 서버에 업로드되지 않아 보안 안전. 로그인 없이 무료 사용.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/pdf-tools' },
}
export default function Page() { return <PdfTools /> }
