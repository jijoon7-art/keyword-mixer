import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '문의하기 | Keyword Mixer',
  description: 'Keyword Mixer 서비스에 대한 문의, 버그 신고, 기능 제안을 보내주세요.',
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://keyword-mixer.vercel.app/contact' },
}

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-extrabold text-white mb-2">문의하기</h1>
      <p className="text-slate-400 text-sm mb-8">Contact · 버그 신고, 기능 제안, 기타 문의</p>

      <div className="space-y-4 mb-8">
        {[
          {
            icon: '🐛',
            title: '버그 신고',
            desc: '계산 오류, 화면 깨짐, 기능 오작동 등을 발견하셨나요?',
            link: 'https://github.com/jijoon7-art/keyword-mixer/issues',
            linkText: 'GitHub Issues에 신고하기',
          },
          {
            icon: '💡',
            title: '기능 제안',
            desc: '새로운 계산기나 도구를 추가했으면 하시나요?',
            link: 'https://github.com/jijoon7-art/keyword-mixer/issues',
            linkText: 'GitHub에 제안하기',
          },
          {
            icon: '📧',
            title: '기타 문의',
            desc: '저작권, 광고, 파트너십 등 기타 문의사항',
            link: 'https://github.com/jijoon7-art',
            linkText: 'GitHub 프로필 방문',
          },
        ].map(item => (
          <div key={item.title} className="rounded-xl border border-surface-border bg-[#1a1d27] p-5">
            <div className="flex items-start gap-3">
              <span className="text-2xl flex-shrink-0">{item.icon}</span>
              <div>
                <p className="text-sm font-bold text-slate-200 mb-1">{item.title}</p>
                <p className="text-xs text-slate-400 mb-2">{item.desc}</p>
                <a href={item.link} target="_blank" rel="noopener noreferrer"
                  className="text-xs text-brand-400 hover:text-brand-300 transition-all">
                  {item.linkText} →
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-5">
        <h3 className="text-sm font-bold text-slate-200 mb-2">자주 묻는 질문</h3>
        <div className="space-y-3">
          {[
            { q: '계산 결과가 실제와 다릅니다.', a: '본 서비스의 계산 결과는 참고용입니다. 중요한 계산은 관련 기관에 확인하세요.' },
            { q: '새로운 계산기를 추가해 주세요.', a: 'GitHub Issues에 제안해 주시면 검토 후 추가하겠습니다.' },
            { q: '광고를 제거할 수 있나요?', a: '현재는 광고 제거 옵션을 제공하지 않습니다. 브라우저 광고 차단 확장 프로그램을 사용하실 수 있습니다.' },
          ].map(faq => (
            <div key={faq.q} className="border-b border-surface-border pb-3 last:border-0 last:pb-0">
              <p className="text-xs font-semibold text-slate-300 mb-1">Q. {faq.q}</p>
              <p className="text-xs text-slate-500">A. {faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 text-center">
        <Link href="/" className="text-sm text-brand-400 hover:text-brand-300 transition-all">← 홈으로 돌아가기</Link>
      </div>
    </div>
  )
}
