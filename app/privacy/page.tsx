import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '개인정보처리방침 | Keyword Mixer',
  description: 'Keyword Mixer의 개인정보처리방침입니다. 수집하는 정보, 이용 목적, 보관 기간을 안내합니다.',
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://keyword-mixer.vercel.app/privacy' },
}

export default function PrivacyPage() {
  const today = new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-extrabold text-white mb-2">개인정보처리방침</h1>
      <p className="text-slate-400 text-sm mb-8">Privacy Policy · 시행일: 2024년 1월 1일 · 최종 수정: 2025년 4월</p>

      <div className="prose prose-invert max-w-none">
        <div className="space-y-8 text-slate-300 leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-white mb-3 pb-2 border-b border-surface-border">1. 총칙</h2>
            <p>
              Keyword Mixer(이하 "본 서비스", 운영 URL: https://keyword-mixer.vercel.app)는 이용자의 개인정보를 소중히 여기며,
              개인정보 보호법 및 관련 법령을 준수합니다. 본 방침은 본 서비스가 어떤 정보를 수집하고,
              어떻게 사용하며, 이용자의 권리가 무엇인지를 설명합니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3 pb-2 border-b border-surface-border">2. 수집하는 정보</h2>
            <div className="space-y-3">
              <div className="rounded-lg border border-surface-border bg-[#1a1d27] p-4">
                <h3 className="text-brand-400 font-semibold mb-2">📌 자동 수집 정보</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>방문 페이지 URL, 체류 시간 (Google Analytics)</li>
                  <li>브라우저 종류, 운영체제, 화면 해상도</li>
                  <li>접속 국가 및 대략적인 지역 정보</li>
                  <li>광고 클릭 및 노출 데이터 (Google AdSense)</li>
                </ul>
              </div>
              <div className="rounded-lg border border-surface-border bg-[#1a1d27] p-4">
                <h3 className="text-brand-400 font-semibold mb-2">🚫 수집하지 않는 정보</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>이름, 이메일, 전화번호 등 개인 식별 정보</li>
                  <li>계산기에 입력한 수치 데이터 (모두 브라우저에서만 처리)</li>
                  <li>회원 정보 (본 서비스는 회원가입이 없습니다)</li>
                  <li>결제 정보</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3 pb-2 border-b border-surface-border">3. 정보 이용 목적</h2>
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li>서비스 이용 현황 파악 및 개선</li>
              <li>인기 도구 및 검색 트렌드 분석</li>
              <li>서비스 오류 탐지 및 보안 강화</li>
              <li>맞춤형 광고 제공 (Google AdSense)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3 pb-2 border-b border-surface-border">4. 쿠키(Cookie) 사용</h2>
            <p className="mb-3">
              본 서비스는 다음 목적으로 쿠키를 사용합니다:
            </p>
            <div className="rounded-lg border border-surface-border bg-[#1a1d27] p-4 space-y-3">
              <div>
                <p className="text-sm font-semibold text-slate-200">Google Analytics 쿠키</p>
                <p className="text-xs text-slate-500">방문자 통계 수집. 익명 처리된 집계 데이터만 사용.</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-200">Google AdSense 쿠키</p>
                <p className="text-xs text-slate-500">맞춤형 광고 제공. 이용자는 Google 개인정보설정에서 관리 가능.</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-200">기능 쿠키</p>
                <p className="text-xs text-slate-500">언어 설정(한국어/영어) 저장.</p>
              </div>
            </div>
            <p className="text-sm mt-3 text-slate-400">
              브라우저 설정에서 쿠키를 비활성화할 수 있으나, 일부 기능이 제한될 수 있습니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3 pb-2 border-b border-surface-border">5. 제3자 서비스</h2>
            <div className="space-y-3">
              {[
                {
                  name: 'Google Analytics',
                  desc: '웹사이트 트래픽 분석 도구. 익명화된 사용 데이터를 수집합니다.',
                  link: 'https://policies.google.com/privacy',
                },
                {
                  name: 'Google AdSense',
                  desc: '광고 수익화 플랫폼. 관심 기반 광고를 표시할 수 있습니다.',
                  link: 'https://policies.google.com/technologies/ads',
                },
                {
                  name: 'Vercel',
                  desc: '웹사이트 호스팅 플랫폼. 서버 로그를 일정 기간 보관합니다.',
                  link: 'https://vercel.com/legal/privacy-policy',
                },
              ].map(s => (
                <div key={s.name} className="rounded-lg border border-surface-border bg-[#1a1d27] p-4">
                  <p className="text-sm font-semibold text-slate-200 mb-1">{s.name}</p>
                  <p className="text-xs text-slate-400 mb-1">{s.desc}</p>
                  <a href={s.link} target="_blank" rel="noopener noreferrer"
                    className="text-xs text-brand-400 hover:text-brand-300 transition-all">
                    개인정보처리방침 보기 →
                  </a>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3 pb-2 border-b border-surface-border">6. 데이터 보관 기간</h2>
            <p className="text-sm">
              Google Analytics 데이터: 수집 후 26개월 보관 (기본 설정)<br />
              서버 로그: Vercel 정책에 따라 자동 삭제<br />
              쿠키: 브라우저 세션 종료 또는 설정된 만료일까지
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3 pb-2 border-b border-surface-border">7. 이용자 권리</h2>
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li>개인정보 수집·이용에 대한 동의 철회 (쿠키 비활성화)</li>
              <li>Google 광고 개인화 설정: <a href="https://adssettings.google.com" className="text-brand-400">adssettings.google.com</a></li>
              <li>Google Analytics 거부: 브라우저 확장 프로그램 설치 가능</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3 pb-2 border-b border-surface-border">8. 어린이 개인정보 보호</h2>
            <p className="text-sm">
              본 서비스는 만 14세 미만 어린이를 대상으로 개인정보를 수집하지 않습니다.
              어린이가 개인정보를 제공한 사실을 알게 된 경우 즉시 삭제합니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3 pb-2 border-b border-surface-border">9. 방침 변경</h2>
            <p className="text-sm">
              본 개인정보처리방침은 법령 변경 또는 서비스 변경에 따라 수정될 수 있으며,
              변경 시 본 페이지를 통해 고지합니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3 pb-2 border-b border-surface-border">10. 문의</h2>
            <div className="rounded-lg border border-surface-border bg-[#1a1d27] p-4">
              <p className="text-sm">개인정보 관련 문의사항이 있으시면 아래로 연락해 주세요.</p>
              <p className="text-sm mt-2">
                <span className="text-slate-400">서비스명:</span> <span className="text-slate-200">Keyword Mixer</span><br />
                <span className="text-slate-400">웹사이트:</span> <a href="https://keyword-mixer.vercel.app" className="text-brand-400">keyword-mixer.vercel.app</a><br />
                <span className="text-slate-400">운영자 GitHub:</span> <a href="https://github.com/jijoon7-art" className="text-brand-400">github.com/jijoon7-art</a>
              </p>
            </div>
          </section>

          <div className="border-t border-surface-border pt-4 text-xs text-slate-500">
            시행일: 2024년 1월 1일 · 최종 수정일: 2025년 4월 · 본 방침은 한국어를 원문으로 합니다.
          </div>
        </div>
      </div>
    </div>
  )
}
