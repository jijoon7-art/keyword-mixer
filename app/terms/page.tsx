import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '이용약관 | Keyword Mixer',
  description: 'Keyword Mixer 서비스 이용약관입니다. 서비스 이용 조건, 저작권, 면책 조항을 확인하세요.',
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://keyword-mixer.vercel.app/terms' },
}

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-extrabold text-white mb-2">이용약관</h1>
      <p className="text-slate-400 text-sm mb-8">Terms of Service · 시행일: 2024년 1월 1일</p>

      <div className="space-y-8 text-slate-300 leading-relaxed">

        <section>
          <h2 className="text-xl font-bold text-white mb-3 pb-2 border-b border-surface-border">제1조 (목적)</h2>
          <p className="text-sm">
            본 약관은 Keyword Mixer(이하 "서비스", URL: https://keyword-mixer.vercel.app)가 제공하는
            무료 온라인 도구 서비스의 이용 조건 및 절차에 관한 사항을 규정함을 목적으로 합니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3 pb-2 border-b border-surface-border">제2조 (서비스 내용)</h2>
          <div className="rounded-lg border border-surface-border bg-[#1a1d27] p-4">
            <p className="text-sm mb-3">본 서비스는 다음과 같은 무료 온라인 도구를 제공합니다:</p>
            <ul className="list-disc list-inside space-y-1 text-sm text-slate-400">
              <li>세금·금융 계산기 (퇴직금, 부가세, 연말정산, 주택담보대출 등)</li>
              <li>건강 계산기 (BMI, 칼로리, 혈중알코올농도 등)</li>
              <li>생활 유틸리티 (환율, 단위변환, 날짜계산 등)</li>
              <li>텍스트·개발자 도구 (정규식, JSON 포매터, 해시태그 생성기 등)</li>
              <li>재미/운세 도구 (MBTI 궁합, 바이오리듬, 띠 계산기 등)</li>
            </ul>
            <p className="text-xs text-slate-500 mt-3">총 130개 이상의 무료 도구를 회원가입 없이 즉시 사용할 수 있습니다.</p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3 pb-2 border-b border-surface-border">제3조 (이용 조건)</h2>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li>본 서비스는 회원가입 없이 무료로 이용할 수 있습니다.</li>
            <li>이용자는 본 약관에 동의함으로써 서비스를 이용할 수 있습니다.</li>
            <li>서비스에 접속함으로써 본 약관에 동의한 것으로 간주합니다.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3 pb-2 border-b border-surface-border">제4조 (금지 행위)</h2>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li>서비스를 무단으로 복제, 배포, 상업적으로 이용하는 행위</li>
            <li>서비스의 정상적인 운영을 방해하는 행위 (DDoS, 크롤링 봇 등)</li>
            <li>서비스를 이용하여 타인에게 해를 끼치는 행위</li>
            <li>허위 정보를 생성하거나 유포하는 행위</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3 pb-2 border-b border-surface-border">제5조 (계산 결과의 정확성)</h2>
          <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-4">
            <p className="text-yellow-300 font-semibold text-sm mb-2">⚠️ 중요 고지</p>
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li>본 서비스의 계산 결과는 <strong>참고용</strong>이며, 법적·의료적·금융적 조언을 구성하지 않습니다.</li>
              <li>퇴직금, 세금, 보험료 등 중요한 계산은 반드시 관련 기관이나 전문가에게 확인하세요.</li>
              <li>BMI, 혈중알코올농도 등 건강 관련 수치는 의사에게 상담하시기 바랍니다.</li>
              <li>환율 정보는 실시간 데이터가 아닌 참고용 추정치입니다.</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3 pb-2 border-b border-surface-border">제6조 (저작권)</h2>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li>서비스의 디자인, 코드, 콘텐츠의 저작권은 Keyword Mixer에 있습니다.</li>
            <li>이용자가 생성한 결과물(계산 결과, 생성된 텍스트 등)은 이용자에게 귀속됩니다.</li>
            <li>서비스를 통해 생성한 결과물은 개인적·상업적 목적으로 자유롭게 사용할 수 있습니다.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3 pb-2 border-b border-surface-border">제7조 (광고)</h2>
          <p className="text-sm">
            본 서비스는 Google AdSense를 통해 광고를 게재할 수 있습니다.
            광고는 Google의 정책에 따라 표시되며, 서비스 운영 비용 충당에 사용됩니다.
            맞춤형 광고를 원하지 않는 경우 <a href="https://adssettings.google.com" className="text-brand-400">Google 광고 설정</a>에서 변경할 수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3 pb-2 border-b border-surface-border">제8조 (면책 조항)</h2>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li>서비스 중단, 오류로 인한 손해에 대해 운영자는 책임지지 않습니다.</li>
            <li>이용자가 서비스를 통해 얻은 정보의 활용으로 발생한 결과에 대한 책임은 이용자에게 있습니다.</li>
            <li>천재지변, 서버 장애 등 불가항력으로 인한 서비스 중단은 면책됩니다.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3 pb-2 border-b border-surface-border">제9조 (약관 변경)</h2>
          <p className="text-sm">
            운영자는 필요한 경우 약관을 변경할 수 있으며, 변경된 약관은 본 페이지에 게시됩니다.
            이용자는 정기적으로 약관을 확인할 의무가 있으며, 변경 후 서비스 이용은 변경된 약관에 동의한 것으로 간주합니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3 pb-2 border-b border-surface-border">제10조 (준거법 및 관할)</h2>
          <p className="text-sm">
            본 약관은 대한민국 법률에 따라 해석되며, 서비스 이용과 관련된 분쟁은 대한민국 법원을 관할 법원으로 합니다.
          </p>
        </section>

        <div className="border-t border-surface-border pt-4 text-xs text-slate-500">
          시행일: 2024년 1월 1일 · Keyword Mixer (keyword-mixer.vercel.app)
        </div>
      </div>
    </div>
  )
}
