import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Keyword Mixer 소개 — 130개+ 무료 온라인 계산기·도구 | About',
  description: 'Keyword Mixer는 퇴직금·BMI·부가세·환율·학점 등 130개 이상의 무료 온라인 계산기와 도구를 제공합니다. 회원가입 없이 즉시 사용 가능.',
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://keyword-mixer.vercel.app/about' },
}

const TOOL_CATEGORIES = [
  {
    icon: '💰',
    name: '세금·금융 계산기',
    count: 25,
    examples: ['퇴직금 계산기', '부가세 계산기', '연말정산 환급액', '주택담보대출', '전세자금대출', '최저임금 계산기'],
  },
  {
    icon: '🏥',
    name: '건강·다이어트',
    count: 18,
    examples: ['BMI 계산기', '혈중알코올농도', '칼로리 계산기', '수면 계산기', '단백질 섭취량', '체지방률'],
  },
  {
    icon: '📝',
    name: '텍스트·마케팅 도구',
    count: 20,
    examples: ['글자수 세기', 'UTM 빌더', '해시태그 생성기', '유튜브 태그', '텍스트 비교기', '스팸 체크'],
  },
  {
    icon: '💻',
    name: '개발자 도구',
    count: 20,
    examples: ['JSON 포매터', '정규식 테스터', '진법 변환기', '색상 코드 변환', 'JWT 디코더', 'URL 인코더'],
  },
  {
    icon: '🏠',
    name: '생활·유틸리티',
    count: 25,
    examples: ['환율 계산기', '단위 변환기', '날짜 계산기', '타이머·스톱워치', '파일 크기 변환', '세계 시간대'],
  },
  {
    icon: '🎯',
    name: '재미·운세',
    count: 12,
    examples: ['MBTI 궁합', '바이오리듬', '띠 계산기', '궁합 계산기', '행운 번호', '점심 메뉴 추천'],
  },
]

const STATS = [
  { num: '130+', label: '무료 도구' },
  { num: '0원', label: '비용' },
  { num: '0초', label: '회원가입' },
  { num: '2개', label: '지원 언어 (KO/EN)' },
]

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* 헤더 */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-mono mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400" />About Keyword Mixer
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-4">
          무료 계산기·도구 130개+<br />
          <span className="text-brand-400">회원가입 없이 즉시 사용</span>
        </h1>
        <p className="text-slate-300 text-lg max-w-2xl mx-auto leading-relaxed">
          Keyword Mixer는 생활·금융·건강·개발 분야의 130개 이상 무료 온라인 도구를 제공하는 서비스입니다.
          복잡한 계산을 빠르고 정확하게 도와드립니다.
        </p>
      </div>

      {/* 통계 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {STATS.map(s => (
          <div key={s.label} className="rounded-xl border border-surface-border bg-[#1a1d27] p-4 text-center">
            <p className="text-3xl font-extrabold text-brand-400 mb-1">{s.num}</p>
            <p className="text-xs text-slate-400">{s.label}</p>
          </div>
        ))}
      </div>

      {/* 도구 카테고리 */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6">제공하는 도구</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {TOOL_CATEGORIES.map(cat => (
            <div key={cat.name} className="rounded-xl border border-surface-border bg-[#1a1d27] p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">{cat.icon}</span>
                <div>
                  <p className="text-sm font-bold text-slate-200">{cat.name}</p>
                  <p className="text-xs text-slate-500">{cat.count}개 도구</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {cat.examples.map(ex => (
                  <span key={ex} className="text-xs px-2 py-0.5 rounded border border-surface-border bg-[#0f1117] text-slate-400">{ex}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 특징 */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6">Keyword Mixer의 특징</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { icon: '🔒', title: '개인정보 보호', desc: '입력한 데이터는 서버로 전송되지 않습니다. 모든 계산은 브라우저에서만 처리됩니다.' },
            { icon: '🌐', title: '한국어·영어 지원', desc: '모든 도구가 한국어와 영어를 지원합니다. 브라우저 언어 설정에 따라 자동으로 전환됩니다.' },
            { icon: '📱', title: '모바일 최적화', desc: '스마트폰, 태블릿, PC 어느 기기에서나 편리하게 사용할 수 있습니다.' },
            { icon: '⚡', title: '빠른 로딩', desc: '복잡한 설치 없이 브라우저에서 즉시 사용 가능합니다. 회원가입도 필요 없습니다.' },
            { icon: '📋', title: '복사 기능', desc: '계산 결과를 원클릭으로 복사할 수 있습니다. 문서 작업에 즉시 활용하세요.' },
            { icon: '💡', title: '상세 가이드', desc: '각 도구마다 사용법, FAQ, 관련 정보를 상세히 제공합니다.' },
          ].map(f => (
            <div key={f.title} className="rounded-xl border border-surface-border bg-[#1a1d27] p-4">
              <p className="text-2xl mb-2">{f.icon}</p>
              <p className="text-sm font-bold text-slate-200 mb-1">{f.title}</p>
              <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 인기 도구 */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-4">인기 도구 바로가기</h2>
        <div className="flex flex-wrap gap-2">
          {[
            ['퇴직금 계산기', '/severance-pay'],
            ['BMI 계산기', '/bmi-calculator-pro'],
            ['부가세 계산기', '/vat-calculator'],
            ['연말정산 계산기', '/tax-refund'],
            ['주택담보대출', '/mortgage-calculator'],
            ['최저임금 계산기', '/minimum-wage'],
            ['환율 계산기', '/exchange-rate'],
            ['학점(GPA) 계산기', '/gpa-calculator'],
            ['포모도로 타이머', '/pomodoro-pro'],
            ['MBTI 궁합', '/mbti-compatibility'],
            ['도장 만들기', '/stamp-maker'],
            ['공학용 계산기', '/scientific-calculator'],
          ].map(([label, href]) => (
            <Link key={href} href={href}
              className="text-sm px-3 py-1.5 rounded-lg border border-surface-border bg-[#1a1d27] text-slate-300 hover:border-brand-500/40 hover:text-brand-300 transition-all">
              {label}
            </Link>
          ))}
        </div>
      </div>

      {/* 법적 링크 */}
      <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-5">
        <h3 className="text-sm font-bold text-slate-200 mb-3">법적 정보</h3>
        <div className="flex flex-wrap gap-4 text-sm">
          <Link href="/privacy" className="text-brand-400 hover:text-brand-300 transition-all">개인정보처리방침</Link>
          <Link href="/terms" className="text-brand-400 hover:text-brand-300 transition-all">이용약관</Link>
          <Link href="/contact" className="text-brand-400 hover:text-brand-300 transition-all">문의하기</Link>
        </div>
        <p className="text-xs text-slate-500 mt-3">
          © 2024 Keyword Mixer. 본 서비스는 개인 프로젝트로 운영됩니다.
        </p>
      </div>
    </div>
  )
}
