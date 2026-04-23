import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'MBTI 궁합 완벽 가이드 2025 — 16가지 유형별 황금 궁합·최악 궁합 | Keyword Mixer',
  description: 'MBTI 16가지 유형별 궁합 완벽 가이드. INFP·ENFJ·INTJ 등 황금 궁합과 최악 궁합. MBTI 궁합이 잘 맞는 이유와 다른 유형과 잘 지내는 방법.',
  keywords: 'MBTI 궁합, MBTI 황금 궁합, MBTI 최악 궁합, INFP 궁합, ENFJ 궁합, INTJ 궁합, MBTI 유형별 궁합, 16가지 MBTI 궁합',
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://keyword-mixer.vercel.app/guide/mbti-guide' },
  openGraph: {
    title: 'MBTI 궁합 완벽 가이드 2025 — 황금 궁합·최악 궁합',
    description: '16가지 MBTI 유형별 황금 궁합과 관계 특성 완벽 정리',
    url: 'https://keyword-mixer.vercel.app/guide/mbti-guide',
    type: 'article',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'MBTI 궁합 완벽 가이드 2025',
  description: '16가지 MBTI 유형별 황금 궁합과 최악 궁합 정리.',
  url: 'https://keyword-mixer.vercel.app/guide/mbti-guide',
  author: { '@type': 'Organization', name: 'Keyword Mixer' },
  publisher: { '@type': 'Organization', name: 'Keyword Mixer' },
  dateModified: '2025-04-23',
  inLanguage: 'ko',
}

const MBTI_COMPAT = [
  { type: 'INFP', golden: 'ENFJ', good: ['INTJ', 'INFJ', 'ENTP'], desc: '이상주의자. 깊은 감정과 가치관을 중시합니다.' },
  { type: 'INFJ', golden: 'ENFP', good: ['INTJ', 'INFP', 'ENTJ'], desc: '옹호자. 통찰력과 헌신으로 타인을 돕습니다.' },
  { type: 'ENFP', golden: 'INFJ', good: ['INTJ', 'INFP', 'ENTP'], desc: '운동가. 열정적이고 창의적인 자유로운 영혼.' },
  { type: 'ENFJ', golden: 'INFP', good: ['INFJ', 'ISFJ', 'ENTJ'], desc: '선도자. 카리스마 있고 타인을 이끄는 능력.' },
  { type: 'INTJ', golden: 'ENFP', good: ['INFJ', 'INTP', 'ENTJ'], desc: '전략가. 독립적이고 분석적인 마스터마인드.' },
  { type: 'INTP', golden: 'ENTJ', good: ['INTJ', 'ENTP', 'INFJ'], desc: '논리술사. 논리와 이론을 사랑하는 사상가.' },
  { type: 'ENTJ', golden: 'INTP', good: ['INTJ', 'INFJ', 'ENFJ'], desc: '통솔자. 대담하고 전략적인 리더십.' },
  { type: 'ENTP', golden: 'INFJ', good: ['INTJ', 'INTP', 'ENFP'], desc: '토론자. 영리하고 호기심 많은 혁신가.' },
  { type: 'ISFJ', golden: 'ESFP', good: ['ISTJ', 'ISFP', 'ESFJ'], desc: '수호자. 헌신적이고 따뜻한 보호자.' },
  { type: 'ISTJ', golden: 'ESFP', good: ['ISFJ', 'ESTJ', 'ISTP'], desc: '현실주의자. 사실에 근거한 신뢰할 수 있는 유형.' },
  { type: 'ESFJ', golden: 'ISFP', good: ['ISFJ', 'ESFP', 'ESTJ'], desc: '집정관. 사교적이고 배려심 깊은 유형.' },
  { type: 'ESTJ', golden: 'ISFP', good: ['ISTJ', 'ESFJ', 'ESTP'], desc: '경영자. 질서와 규칙을 중시하는 관리자.' },
  { type: 'ISFP', golden: 'ESFJ', good: ['ISFJ', 'ISTP', 'ESTJ'], desc: '탐험가. 유연하고 매력적인 예술가.' },
  { type: 'ISTP', golden: 'ESFJ', good: ['ISFP', 'ESTP', 'ISTJ'], desc: '장인. 대담하고 실용적인 탐구자.' },
  { type: 'ESFP', golden: 'ISTJ', good: ['ISFJ', 'ESFJ', 'ESTP'], desc: '연예인. 자발적이고 활기찬 엔터테이너.' },
  { type: 'ESTP', golden: 'ISFJ', good: ['ISTP', 'ESFP', 'ESTJ'], desc: '사업가. 활동적이고 영리한 지각왕.' },
]

export default function MbtiGuide() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
        <Link href="/" className="hover:text-brand-400 transition-all">홈</Link>
        <span>›</span>
        <Link href="/guide" className="hover:text-brand-400 transition-all">가이드</Link>
        <span>›</span>
        <span className="text-slate-400">MBTI 궁합 가이드</span>
      </div>

      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs mb-4">
          🎯 성격 유형 가이드 · 2025년
        </div>
        <h1 className="text-3xl font-extrabold text-white mb-4">
          MBTI 궁합 완벽 가이드 — 16가지 유형별 황금 궁합
        </h1>
        <p className="text-slate-300 leading-relaxed">
          MBTI 16가지 유형별 황금 궁합과 관계 특성을 정리했습니다.
          단, MBTI는 참고용이며 실제 관계는 개인의 노력과 이해가 더 중요합니다.
        </p>
      </div>

      <div className="rounded-xl border border-brand-500/30 bg-brand-500/10 p-4 mb-8 flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-brand-300 mb-1">🔢 MBTI 궁합 바로 계산하기</p>
          <p className="text-xs text-slate-400">두 유형 선택 → 궁합 점수·관계 특성 즉시 분석</p>
        </div>
        <Link href="/mbti-compatibility"
          className="px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-400 text-white text-xs font-bold transition-all flex-shrink-0">
          궁합 계산기 →
        </Link>
      </div>

      <div className="space-y-10 text-slate-300">

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">1. MBTI 4가지 축 이해하기</h2>
          <div className="grid grid-cols-2 gap-3 mb-4">
            {[
              { axis: 'E / I', left: 'E 외향형', right: 'I 내향형', desc: '에너지의 방향 — 외부 자극 vs 내면 세계' },
              { axis: 'S / N', left: 'S 감각형', right: 'N 직관형', desc: '정보 수집 — 현실·구체적 vs 가능성·상상' },
              { axis: 'T / F', left: 'T 사고형', right: 'F 감정형', desc: '의사결정 — 논리·분석 vs 가치·감정' },
              { axis: 'J / P', left: 'J 판단형', right: 'P 인식형', desc: '생활양식 — 계획·체계적 vs 유연·즉흥적' },
            ].map(item => (
              <div key={item.axis} className="rounded-xl border border-surface-border bg-[#1a1d27] p-3">
                <p className="text-brand-400 font-bold font-mono text-lg mb-1">{item.axis}</p>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-blue-400 font-bold">{item.left}</span>
                  <span className="text-slate-500">vs</span>
                  <span className="text-purple-400 font-bold">{item.right}</span>
                </div>
                <p className="text-xs text-slate-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">2. 16가지 유형별 황금 궁합표</h2>
          <p className="text-sm text-slate-400 mb-4">황금 궁합은 서로 다른 면을 보완하면서도 핵심 가치관이 비슷한 유형입니다.</p>
          <div className="rounded-xl border border-surface-border bg-[#1a1d27] overflow-hidden mb-4">
            <div className="grid grid-cols-12 bg-[#0f1117] px-4 py-2.5 text-xs text-slate-500 font-medium">
              <span className="col-span-2">유형</span>
              <span className="col-span-3">황금 궁합</span>
              <span className="col-span-4">잘 맞는 유형</span>
              <span className="col-span-3">유형 특징</span>
            </div>
            {MBTI_COMPAT.map((row, i) => (
              <div key={row.type} className={`grid grid-cols-12 px-4 py-2.5 border-t border-surface-border text-xs ${i % 2 === 0 ? '' : 'bg-[#0f1117]/30'}`}>
                <span className="col-span-2 font-bold text-brand-400 font-mono">{row.type}</span>
                <span className="col-span-3 font-bold text-yellow-400 font-mono">{row.golden} ⭐</span>
                <span className="col-span-4 text-slate-400">{row.good.join(', ')}</span>
                <span className="col-span-3 text-slate-500 text-xs">{row.desc.slice(0, 15)}...</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">3. 유형 그룹별 궁합 특성</h2>
          <div className="space-y-4">
            {[
              {
                group: 'NF 유형 (INFP, INFJ, ENFP, ENFJ)',
                icon: '💚',
                title: '이상주의자 그룹',
                compat: 'NF끼리 또는 NT 유형과 깊은 감정적 연결',
                desc: '가치관과 의미를 중시합니다. 감정적 공감이 높아 서로를 잘 이해합니다. NT 유형과는 지적 자극을 주고받으며 성장합니다.',
                color: 'border-green-500/30 bg-green-500/5',
              },
              {
                group: 'NT 유형 (INTJ, INTP, ENTJ, ENTP)',
                icon: '💙',
                title: '분석가 그룹',
                compat: 'NT끼리 또는 NF 유형과 지적 자극',
                desc: '논리와 능력을 중시합니다. 서로의 지적 토론을 즐기지만 감정 표현이 부족할 수 있습니다. NF 유형과는 감정적 균형을 맞출 수 있습니다.',
                color: 'border-blue-500/30 bg-blue-500/5',
              },
              {
                group: 'SJ 유형 (ISTJ, ISFJ, ESTJ, ESFJ)',
                icon: '🧡',
                title: '관리자 그룹',
                compat: 'SJ끼리 또는 SP 유형과 안정적 관계',
                desc: '안정과 책임을 중시합니다. 서로에 대한 헌신과 신뢰가 높습니다. SP 유형과는 현실 감각을 공유하며 실용적 관계를 형성합니다.',
                color: 'border-orange-500/30 bg-orange-500/5',
              },
              {
                group: 'SP 유형 (ISTP, ISFP, ESTP, ESFP)',
                icon: '💛',
                title: '탐험가 그룹',
                compat: 'SP끼리 또는 SJ 유형과 현실적 관계',
                desc: '자유와 즐거움을 중시합니다. 계획보다 즉흥을 좋아해 SJ 유형과 갈등이 생길 수 있지만 서로의 다름을 인정하면 보완 관계가 됩니다.',
                color: 'border-yellow-500/30 bg-yellow-500/5',
              },
            ].map(item => (
              <div key={item.group} className={`rounded-xl border p-4 ${item.color}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{item.icon}</span>
                  <div>
                    <p className="text-sm font-bold text-slate-200">{item.group}</p>
                    <p className="text-xs text-slate-400">{item.title} · {item.compat}</p>
                  </div>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">4. MBTI 궁합이 안 맞아도 잘 지내는 방법</h2>
          <div className="space-y-3">
            {[
              { tip: '상대의 에너지 방향 이해하기', desc: 'E(외향형)는 대화로 에너지를 얻고, I(내향형)는 혼자 시간으로 충전합니다. I가 조용히 있는 건 당신을 거부하는 게 아닙니다.' },
              { tip: 'T와 F의 갈등 줄이기', desc: 'T는 문제 해결을 원하고 F는 공감을 먼저 원합니다. F에게는 "그랬구나" 공감 먼저, T에게는 감정보다 논리로 접근하세요.' },
              { tip: 'J와 P의 일상 조율', desc: 'J는 계획을 세우고 P는 즉흥을 선호합니다. 중요한 일정은 미리 잡되, 소소한 결정은 P에게 맡기는 역할 분담이 효과적입니다.' },
              { tip: 'MBTI는 참고용', desc: 'MBTI는 성격의 일면만 보여줍니다. 개인의 성장 환경, 가치관, 노력이 훨씬 중요합니다. 상대를 유형으로만 판단하지 마세요.' },
            ].map((item, i) => (
              <div key={i} className="rounded-xl border border-surface-border bg-[#1a1d27] p-4">
                <p className="text-sm font-bold text-brand-300 mb-1">✓ {item.tip}</p>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">5. 자주 묻는 질문</h2>
          <div className="space-y-3">
            {[
              { q: 'MBTI 궁합이 안 맞으면 헤어져야 하나요?', a: '아닙니다. MBTI 궁합은 재미있는 참고 자료이지 절대적 기준이 아닙니다. 실제 연구에서도 MBTI 유형이 관계 만족도를 크게 좌우하지 않는다는 결과가 많습니다.' },
              { q: 'MBTI는 변하나요?', a: '네. 성격은 나이·경험·환경에 따라 변할 수 있습니다. 같은 사람이 검사 시기에 따라 다른 결과가 나오기도 합니다. MBTI는 고정된 정체성이 아닙니다.' },
              { q: 'T와 F는 왜 많이 싸우나요?', a: 'T는 논리적 사실을, F는 감정적 공감을 우선시하기 때문입니다. 서로의 소통 방식 차이를 이해하고 "너는 어떻게 느끼니?"(T→F)와 "객관적으로 봤을 때"(F→T) 접근법을 바꾸면 갈등이 줄어듭니다.' },
              { q: '친구와 연인의 궁합이 다른가요?', a: '일반적으로 친구 관계는 비슷한 유형끼리, 연인 관계는 상호 보완적 유형과 잘 맞는 경향이 있습니다. 하지만 개인차가 매우 크므로 참고만 하세요.' },
            ].map((faq, i) => (
              <div key={i} className="rounded-xl border border-surface-border bg-[#1a1d27] p-4">
                <p className="text-sm font-bold text-slate-200 mb-2">Q. {faq.q}</p>
                <p className="text-sm text-slate-400 leading-relaxed">A. {faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="rounded-xl border border-brand-500/30 bg-brand-500/10 p-6 text-center">
          <p className="text-lg font-bold text-white mb-2">MBTI 궁합 계산해보기</p>
          <p className="text-sm text-slate-400 mb-4">두 유형 선택으로 궁합 점수와 관계 특성 즉시 확인</p>
          <Link href="/mbti-compatibility"
            className="inline-block px-8 py-3 rounded-xl bg-brand-500 hover:bg-brand-400 text-white font-bold transition-all">
            MBTI 궁합 계산기 열기 →
          </Link>
        </div>

        <div className="border-t border-surface-border pt-4 text-xs text-slate-600">
          본 가이드의 MBTI 궁합 정보는 일반적인 경향을 참고용으로 정리한 것입니다.
          실제 관계는 개인의 노력과 이해가 MBTI보다 훨씬 중요합니다.
        </div>
      </div>
    </div>
  )
}
