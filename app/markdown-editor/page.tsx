import type { Metadata } from 'next'
import MarkdownEditor from '@/components/MarkdownEditor'
export const metadata: Metadata = {
  title: '마크다운 에디터 — 무료 온라인 Markdown 편집기/미리보기',
  description: '무료 마크다운 에디터. 실시간 미리보기, 분할 화면, .md/.html 파일 다운로드. GitHub README, 블로그, 문서 작성에 최적화된 온라인 Markdown 편집기.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/markdown-editor' },
}
export default function Page() { return <MarkdownEditor /> }
