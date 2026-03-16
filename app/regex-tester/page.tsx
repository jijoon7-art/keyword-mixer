import type { Metadata } from 'next'
import RegexTester from '@/components/RegexTester'
export const metadata: Metadata = {
  title: '정규식 테스터 — 무료 정규표현식 검사기 · Regex Tester',
  description: '무료 정규식 테스터. 정규표현식을 실시간으로 테스트. 매칭 하이라이트, 치환, 그룹 캡처, 이메일·전화번호·URL 예제 모음.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/regex-tester' },
}
export default function Page() { return <RegexTester /> }
