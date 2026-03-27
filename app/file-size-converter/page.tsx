import type { Metadata } from 'next'
import FileSizeConverter from '@/components/FileSizeConverter'
export const metadata: Metadata = {
  title: '파일 크기 단위 변환기 — KB MB GB TB 변환 | File Size',
  description: '무료 파일 크기 변환기. Byte·KB·MB·GB·TB·PB 즉시 변환, 전송 시간 계산. Free file size unit converter.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/file-size-converter' },
}
export default function Page() { return <FileSizeConverter /> }
