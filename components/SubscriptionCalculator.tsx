'use client'
import { useState } from 'react'
import { Copy, CheckCheck } from 'lucide-react'
import { useLang } from './LangContext'
import ToolFooter from './ToolFooter'

const T = {
  ko: { title: '청약 가점 계산기', desc: '아파트 청약 가점을 자동 계산. 무주택기간·부양가족·청약통장 가입기간 점수 산정.' },
  en: { title: 'Housing Subscription Score Calculator', desc: 'Calculate Korean apartment subscription points. Housing period, dependents, and account duration scoring.' }
}

export default function SubscriptionCalculator() {
  const { lang } = useLang()
  const tx = T[lang]
  const [noHousingYears, setNoHousingYears] = useState(5)
  const [dependents, setDependents] = useState(3)
  const [accountYears, setAccountYears] = useState(5)
  const [copied, setCopied] = useState(false)

  // 무주택기간 점수 (최대 32점)
  const housingScore = (() => {
    if (noHousingYears < 1) return 2
    if (noHousingYears < 2) return 4
    if (noHousingYears < 3) return 6
    if (noHousingYears < 4) return 8
    if (noHousingYears < 5) return 10
    if (noHousingYears < 6) return 12
    if (noHousingYears < 7) return 14
    if (noHousingYears < 8) return 16
    if (noHousingYears < 9) return 18
    if (noHousingYears < 10) return 20
    if (noHousingYears < 11) return 22
    if (noHousingYears < 12) return 24
    if (noHousingYears < 13) return 26
    if (noHousingYears < 14) return 28
    if (noHousingYears < 15) return 30
    return 32
  })()

  // 부양가족수 점수 (최대 35점)
  const depScore = Math.min(35, dependents * 5)

  // 청약통장 가입기간 점수 (최대 17점)
  const accountScore = (() => {
    if (accountYears < 1) return 1
    if (accountYears < 2) return 2
    if (accountYears < 3) return 3
    if (accountYears < 4) return 4
    if (accountYears < 5) return 5
    if (accountYears < 6) return 6
    if (accountYears < 7) return 7
    if (accountYears < 8) return 8
    if (accountYears < 9) return 9
    if (accountYears < 10) return 10
    if (accountYears < 11) return 11
    if (accountYears < 12) return 12
    if (accountYears < 13) return 13
    if (accountYears < 14) return 14
    if (accountYears < 15) return 15
    if (accountYears < 16) return 16
    return 17
  })()

  const total = housingScore + depScore + accountScore
  const maxScore = 84
  const pct = Math.round((total / maxScore) * 100)

  const copy = async () => {
    await navigator.clipboard.writeText(`청약 가점: ${total}점 (무주택 ${housingScore}+부양가족 ${depScore}+통장 ${accountScore})`)
    setCopied(true); setTimeout(() => setCopied(false), 1500)
  }

  const gradeInfo = total >= 70 ? { label: lang === 'ko' ? '최우수' : 'Excellent', color: 'text-brand-400' }
    : total >= 55 ? { label: lang === 'ko' ? '우수' : 'Good', color: 'text-blue-400' }
    : total >= 40 ? { label: lang === 'ko' ? '보통' : 'Average', color: 'text-yellow-400' }
    : { label: lang === 'ko' ? '낮음' : 'Low', color: 'text-red-400' }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-mono mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />Free Tool
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-3">{tx.title}</h1>
        <p className="text-slate-300 text-base max-w-xl mx-auto">{tx.desc}</p>
      </div>

      <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-5 mb-5">
        {[
          { label: lang === 'ko' ? '무주택 기간 (년)' : 'No-housing Period (yrs)', val: noHousingYears, set: setNoHousingYears, max: 15, score: housingScore, maxScore: 32 },
          { label: lang === 'ko' ? '부양가족 수 (본인 제외)' : 'Dependents (excl. self)', val: dependents, set: setDependents, max: 6, score: depScore, maxScore: 35 },
          { label: lang === 'ko' ? '청약통장 가입기간 (년)' : 'Account Duration (yrs)', val: accountYears, set: setAccountYears, max: 15, score: accountScore, maxScore: 17 },
        ].map(f => (
          <div key={f.label} className="mb-5">
            <div className="flex justify-between mb-1">
              <label className="text-sm text-slate-200">{f.label}</label>
              <span className="text-sm font-bold text-brand-400 font-mono">{f.score}점 / {f.maxScore}점</span>
            </div>
            <input type="range" min={0} max={f.max} step={1} value={f.val} onChange={e => f.set(+e.target.value)} className="w-full accent-green-500 mb-1" />
            <div className="flex justify-between text-xs text-slate-600">
              <span>0</span><span className="text-brand-400 font-mono">{f.val}{lang === 'ko' ? (f.label.includes('수') ? '명' : '년') : (f.label.includes('Dep') ? ' persons' : ' years')}</span><span>{f.max}{lang === 'ko' ? (f.label.includes('수') ? '명' : '년') : (f.label.includes('Dep') ? 'p' : 'yr')}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-brand-500/30 bg-brand-500/10 p-5 mb-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs text-slate-400 mb-1">{lang === 'ko' ? '총 청약 가점' : 'Total Score'}</p>
            <p className="text-5xl font-extrabold text-brand-400 font-mono">{total}<span className="text-xl text-slate-400">/{maxScore}</span></p>
            <p className={`text-sm font-bold mt-1 ${gradeInfo.color}`}>{gradeInfo.label}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400 mb-2">{lang === 'ko' ? '세부 점수' : 'Breakdown'}</p>
            {[
              [lang === 'ko' ? '무주택기간' : 'Housing', housingScore, 32],
              [lang === 'ko' ? '부양가족' : 'Dependents', depScore, 35],
              [lang === 'ko' ? '청약통장' : 'Account', accountScore, 17],
            ].map(([l, s, m]) => (
              <p key={l as string} className="text-xs text-slate-300">{l}: <span className="text-brand-400 font-mono">{s}</span>/{m}</p>
            ))}
          </div>
        </div>
        <div className="h-2.5 bg-surface-border rounded-full overflow-hidden">
          <div className="h-full bg-brand-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
        </div>
        <p className="text-xs text-slate-500 mt-1.5 text-right">{pct}%</p>
        <button onClick={copy} className={`mt-3 text-xs px-3 py-1.5 rounded-lg border flex items-center gap-1 transition-all ${copied ? 'bg-brand-500/20 border-brand-500/40 text-brand-400' : 'border-surface-border text-slate-300 hover:border-brand-500/40'}`}>
          {copied ? <CheckCheck size={12}/> : <Copy size={12}/>} {lang === 'ko' ? '결과 복사' : 'Copy Result'}
        </button>
      </div>

      <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4 text-xs text-slate-400">
        <p className="font-medium text-slate-200 mb-2">{lang === 'ko' ? '청약 가점제 안내' : 'About Subscription Score System'}</p>
        <p>{lang === 'ko' ? '청약 가점제는 무주택기간(최대 32점), 부양가족수(최대 35점), 청약통장 가입기간(최대 17점)으로 구성되며 총점 84점입니다. 국민주택 및 85㎡ 이하 민간분양 아파트에 적용됩니다.' : 'The subscription score system comprises housing period (max 32), dependents (max 35), and account duration (max 17) for a total of 84 points. Applied to public housing and private apartments under 85㎡.'}</p>
      </div>

      <ToolFooter
        toolName={lang === 'ko' ? '청약 가점 계산기' : 'Housing Subscription Score'}
        toolUrl="https://keyword-mixer.vercel.app/subscription-calculator"
        description={tx.desc}
        howToUse={lang === 'ko' ? [
          { step: '무주택 기간 설정', desc: '무주택자로 지낸 기간을 슬라이더로 설정하세요.' },
          { step: '부양가족 수 설정', desc: '배우자·자녀·부모 등 부양가족 수를 입력하세요 (본인 제외).' },
          { step: '청약통장 기간 설정', desc: '청약통장 가입 후 경과 연수를 입력하세요.' },
          { step: '가점 확인', desc: '총 청약 가점과 세부 점수가 즉시 계산됩니다.' },
        ] : [
          { step: 'Set housing period', desc: 'Slide to set years without owning a home.' },
          { step: 'Set dependents', desc: 'Enter number of dependents (spouse, children, parents). Exclude yourself.' },
          { step: 'Set account duration', desc: 'Enter years since opening subscription account.' },
          { step: 'View score', desc: 'Total and breakdown scores are calculated instantly.' },
        ]}
        whyUse={lang === 'ko' ? [
          { title: '실시간 가점 계산', desc: '슬라이더를 움직이는 즉시 청약 가점이 업데이트됩니다.' },
          { title: '세부 점수 표시', desc: '3가지 항목별 점수와 총점을 한눈에 확인합니다.' },
          { title: '등급 안내', desc: '가점 수준에 따라 최우수/우수/보통/낮음으로 안내합니다.' },
          { title: '결과 복사', desc: '청약 가점 결과를 텍스트로 복사해 보관할 수 있습니다.' },
        ] : [
          { title: 'Real-time score calculation', desc: 'Scores update instantly as you move the sliders.' },
          { title: 'Itemized scores', desc: 'See all three category scores and total at a glance.' },
          { title: 'Grade guidance', desc: 'Rates your score as Excellent, Good, Average, or Low.' },
          { title: 'Copy results', desc: 'Copy score results as text for your records.' },
        ]}
        faqs={lang === 'ko' ? [
          { q: '청약 가점제와 추첨제의 차이는?', a: '가점제는 무주택기간 등 기준으로 높은 점수 순으로 당첨자를 선정합니다. 추첨제는 무작위 추첨으로 당첨자를 뽑습니다. 전용 85㎡ 이하는 가점제 40%, 추첨제 60%로 배분됩니다.' },
          { q: '부양가족에 누가 포함되나요?', a: '청약 신청자와 같은 주민등록에 등재된 직계존속(부모, 조부모), 직계비속(자녀, 손자녀), 배우자가 포함됩니다.' },
          { q: '무주택기간은 어떻게 계산하나요?', a: '청약 신청자와 배우자가 주택을 소유하지 않은 기간을 합산합니다. 과거에 주택을 소유했다가 팔았다면 처분 시점부터 계산합니다.' },
          { q: '청약통장 가입기간은?', a: '청약저축, 주택청약종합저축 등 청약통장의 가입일로부터 청약 신청일까지의 기간입니다.' },
        ] : [
          { q: 'Score-based vs lottery system?', a: 'Score system selects by points. Lottery system is random. For apartments under 85㎡, 40% score-based and 60% lottery.' },
          { q: 'Who counts as a dependent?', a: 'Direct ancestors (parents, grandparents), descendants (children, grandchildren), and spouse registered at the same address.' },
          { q: 'How is housing period calculated?', a: 'Combined period when both applicant and spouse have not owned housing. Calculated from date of disposal if previously owned.' },
          { q: 'What counts for account duration?', a: 'Period from account opening date to subscription application date for housing subscription savings accounts.' },
        ]}
        keywords="청약 가점 계산기 · 청약 가점 · 아파트 청약 · 청약 점수 계산 · 무주택기간 점수 · 부양가족 청약 · housing subscription Korea · apartment subscription score · 청약 당첨 가점 · 청약 통장"
      />
    </div>
  )
}
