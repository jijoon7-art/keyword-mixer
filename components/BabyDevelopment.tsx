'use client'
import { useState } from 'react'
import { useLang } from './LangContext'
import ToolFooter from './ToolFooter'

const T = {
  ko: { title: '태아 발달 주수 계산기', desc: '마지막 생리일로 임신 주수, 예정일, 태아 발달 단계를 확인. 주차별 태아 크기와 발달 정보 제공.' },
  en: { title: 'Baby Development / Pregnancy Calculator', desc: 'Calculate pregnancy week, due date, and fetal development from last menstrual period.' }
}

const WEEKS_DATA = [
  { week: 4, size_ko: '양귀비씨 (약 1mm)', size_en: 'Poppy seed (~1mm)', dev_ko: '수정란이 자궁에 착상. 심장, 뇌, 척추 형성 시작', dev_en: 'Implantation complete. Heart, brain, spine begin forming' },
  { week: 8, size_ko: '콩 (약 1.6cm)', size_en: 'Bean (~1.6cm)', dev_ko: '모든 주요 장기 형성 시작. 손발 생김. 심장 박동 시작', dev_en: 'All major organs beginning to form. Limb buds appear. Heartbeat starts' },
  { week: 12, size_ko: '자두 (약 5.4cm)', size_en: 'Plum (~5.4cm)', dev_ko: '손가락·발가락 형성. 신장이 소변 생성. 성별 구분 가능', dev_en: 'Fingers and toes formed. Kidneys produce urine. Gender identifiable' },
  { week: 16, size_ko: '아보카도 (약 11.6cm)', size_en: 'Avocado (~11.6cm)', dev_ko: '청각 발달. 얼굴 특징 형성. 엄마가 태동 느낄 수 있음', dev_en: 'Hearing develops. Facial features form. Mother may feel first movements' },
  { week: 20, size_ko: '바나나 (약 16.4cm)', size_en: 'Banana (~16.4cm)', dev_ko: '정기 초음파 시기. 태동 활발. 피부 발달', dev_en: 'Mid-pregnancy ultrasound. Active movements. Skin development' },
  { week: 24, size_ko: '옥수수 (약 30cm)', size_en: 'Corn (~30cm)', dev_ko: '폐 발달. 눈꺼풀 열림. 지문 형성', dev_en: 'Lungs developing. Eyelids open. Fingerprints forming' },
  { week: 28, size_ko: '가지 (약 37cm)', size_en: 'Eggplant (~37cm)', dev_ko: '뇌 급격히 발달. 지방 축적 시작. REM 수면 가능', dev_en: 'Rapid brain development. Fat accumulation begins. REM sleep possible' },
  { week: 32, size_ko: '스쿼시 (약 42cm)', size_en: 'Squash (~42cm)', dev_ko: '폐 거의 완성. 뼈 강화. 체중 빠르게 증가', dev_en: 'Lungs nearly complete. Bones hardening. Rapid weight gain' },
  { week: 36, size_ko: '로메인 상추 (약 47cm)', size_en: 'Romaine lettuce (~47cm)', dev_ko: '거의 완전히 발달. 두뇌 성장 계속. 출산 준비', dev_en: 'Nearly fully developed. Brain continues growing. Birth preparation' },
  { week: 40, size_ko: '수박 (약 51cm)', size_en: 'Watermelon (~51cm)', dev_ko: '출산 예정. 평균 체중 3.2~3.6kg', dev_en: 'Full term. Average weight 3.2-3.6kg' },
]

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr); d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

export default function BabyDevelopment() {
  const { lang } = useLang()
  const tx = T[lang]
  const [lmp, setLmp] = useState(() => { const d = new Date(); d.setDate(d.getDate() - 70); return d.toISOString().slice(0,10) })
  const [mode, setMode] = useState<'lmp'|'due'>('lmp')
  const [dueDate, setDueDate] = useState('')

  const today = new Date(); today.setHours(0,0,0,0)
  const lmpDate = new Date(lmp)
  const gestDays = Math.floor((today.getTime() - lmpDate.getTime()) / (1000*60*60*24))
  const week = Math.floor(gestDays / 7)
  const day = gestDays % 7
  const dueStr = addDays(lmp, 280)
  const daysLeft = Math.ceil((new Date(dueStr).getTime() - today.getTime()) / (1000*60*60*24))

  const weekData = WEEKS_DATA.reduce((prev, curr) => week >= curr.week ? curr : prev, WEEKS_DATA[0])

  const trimester = week < 13 ? (lang === 'ko' ? '임신 1기 (1~12주)' : '1st Trimester (1-12w)')
    : week < 27 ? (lang === 'ko' ? '임신 2기 (13~26주)' : '2nd Trimester (13-26w)')
    : (lang === 'ko' ? '임신 3기 (27~40주)' : '3rd Trimester (27-40w)')

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-mono mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />Free Tool
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-3">{tx.title}</h1>
        <p className="text-slate-300 text-base max-w-xl mx-auto">{tx.desc}</p>
      </div>

      <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-5 mb-5">
        <div className="flex rounded-xl border border-surface-border overflow-hidden mb-4">
          {[[' lmp', lang === 'ko' ? '마지막 생리일로 계산' : 'From Last Period'], [' due', lang === 'ko' ? '출산 예정일로 계산' : 'From Due Date']].map(([v, l]) => (
            <button key={v.trim()} onClick={() => setMode(v.trim() as 'lmp'|'due')}
              className={`flex-1 py-2.5 text-xs font-medium transition-all ${mode === v.trim() ? 'bg-brand-500 text-white font-bold' : 'bg-[#0f1117] text-slate-300'}`}>{l}</button>
          ))}
        </div>
        <label className="text-xs text-slate-400 mb-1.5 block">{mode === 'lmp' ? (lang === 'ko' ? '마지막 생리 시작일' : 'Last Menstrual Period') : (lang === 'ko' ? '출산 예정일' : 'Expected Due Date')}</label>
        <input type="date" value={mode === 'lmp' ? lmp : dueDate}
          onChange={e => mode === 'lmp' ? setLmp(e.target.value) : setDueDate(e.target.value)}
          className="w-full bg-[#0f1117] border border-surface-border rounded-xl px-4 py-3 text-slate-200 text-lg font-mono focus:outline-none focus:border-brand-500/50 transition-all" />
      </div>

      {week > 0 && week <= 42 && (
        <>
          <div className="grid grid-cols-3 gap-3 mb-5">
            <div className="rounded-xl border border-brand-500/30 bg-brand-500/10 p-4 text-center col-span-1">
              <p className="text-xs text-slate-400 mb-1">{lang === 'ko' ? '현재 임신 주수' : 'Current Week'}</p>
              <p className="text-4xl font-extrabold text-brand-400 font-mono">{week}</p>
              <p className="text-xs text-brand-300 mt-0.5">{lang === 'ko' ? `주 ${day}일` : `w ${day}d`}</p>
            </div>
            <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4 col-span-2">
              <p className="text-xs text-slate-400 mb-1">{lang === 'ko' ? '출산 예정일' : 'Due Date'}</p>
              <p className="text-base font-bold text-slate-200">{dueStr}</p>
              <p className="text-xs text-slate-500 mt-1">{daysLeft > 0 ? (lang === 'ko' ? `D-${daysLeft} · ${trimester}` : `D-${daysLeft} · ${trimester}`) : (lang === 'ko' ? '출산 예정일 지남' : 'Past due date')}</p>
            </div>
          </div>

          <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-5 mb-4">
            <p className="text-xs text-slate-400 mb-1">{lang === 'ko' ? '태아 크기 (약)' : 'Fetal Size (approx.)'}</p>
            <p className="text-xl font-bold text-slate-200 mb-3">{lang === 'ko' ? weekData.size_ko : weekData.size_en}</p>
            <p className="text-xs text-slate-400 mb-1">{lang === 'ko' ? '이번 주 발달' : 'This Week\'s Development'}</p>
            <p className="text-sm text-slate-300 leading-relaxed">{lang === 'ko' ? weekData.dev_ko : weekData.dev_en}</p>
          </div>

          {/* 진행 바 */}
          <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4">
            <div className="flex justify-between text-xs text-slate-400 mb-2">
              <span>{lang === 'ko' ? '임신 진행' : 'Progress'}</span>
              <span>{Math.min(100, Math.round((week / 40) * 100))}%</span>
            </div>
            <div className="h-3 bg-surface-border rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-brand-500 to-blue-500 rounded-full transition-all" style={{ width: `${Math.min(100, (week / 40) * 100)}%` }} />
            </div>
            <div className="flex justify-between text-xs text-slate-600 mt-1">
              <span>{lang === 'ko' ? '1주' : '1w'}</span>
              <span>{lang === 'ko' ? '13주 (2기)' : '13w (T2)'}</span>
              <span>{lang === 'ko' ? '27주 (3기)' : '27w (T3)'}</span>
              <span>{lang === 'ko' ? '40주' : '40w'}</span>
            </div>
          </div>
        </>
      )}

      <ToolFooter
        toolName={lang === 'ko' ? '태아 발달 주수 계산기' : 'Baby Development Calculator'}
        toolUrl="https://keyword-mixer.vercel.app/baby-development"
        description={tx.desc}
        howToUse={lang === 'ko' ? [
          { step: '날짜 입력', desc: '마지막 생리 시작일 또는 출산 예정일을 입력하세요.' },
          { step: '임신 주수 확인', desc: '현재 임신 주수와 일수가 자동으로 계산됩니다.' },
          { step: '태아 발달 확인', desc: '현재 주수에 해당하는 태아 크기와 발달 정보를 확인하세요.' },
          { step: '진행률 확인', desc: '임신 40주 기준 현재 진행률을 시각적으로 확인할 수 있습니다.' },
        ] : [
          { step: 'Enter date', desc: 'Input last menstrual period start date or expected due date.' },
          { step: 'View pregnancy week', desc: 'Current week and day of pregnancy are auto-calculated.' },
          { step: 'View fetal development', desc: 'See fetal size and development info for current week.' },
          { step: 'Check progress', desc: 'Visual progress bar showing journey to 40 weeks.' },
        ]}
        whyUse={lang === 'ko' ? [
          { title: '태아 발달 정보', desc: '4주~40주까지 주수별 태아 크기와 발달 단계를 제공합니다.' },
          { title: '출산 예정일 계산', desc: '마지막 생리일 기준 280일 후를 예정일로 자동 계산합니다.' },
          { title: '임신 단계 구분', desc: '임신 1기(1~12주), 2기(13~26주), 3기(27~40주)를 명확히 구분합니다.' },
          { title: 'D-day 카운터', desc: '출산 예정일까지 남은 날수를 D-day 형식으로 표시합니다.' },
        ] : [
          { title: 'Fetal development info', desc: 'Week-by-week fetal size and development from week 4 to 40.' },
          { title: 'Due date calculation', desc: 'Auto-calculates due date as 280 days from last menstrual period.' },
          { title: 'Trimester classification', desc: 'Clear distinction between 1st, 2nd, and 3rd trimesters.' },
          { title: 'D-day counter', desc: 'Shows days until due date in D-day format.' },
        ]}
        faqs={lang === 'ko' ? [
          { q: '임신 주수는 어떻게 계산하나요?', a: '마지막 생리 시작일(LMP)부터 세는 것이 표준입니다. 실제 수정은 약 2주 후이지만, 의학적으로는 LMP를 기준으로 합니다.' },
          { q: '출산 예정일은 정확한가요?', a: '나겔레 법칙에 따라 LMP + 280일을 예정일로 계산합니다. 실제 출산은 예정일 전후 2주 내가 정상 범위입니다.' },
          { q: '임신 1기, 2기, 3기란?', a: '1기는 1~12주(유산 위험이 높은 시기), 2기는 13~26주(안정기), 3기는 27~40주(출산 준비)입니다.' },
          { q: '초음파 주수와 다를 수 있나요?', a: '네, 초음파 주수는 태아 크기 기반으로 LMP 기준 주수와 1~2주 차이가 날 수 있습니다. 담당의 기준을 따르세요.' },
        ] : [
          { q: 'How is pregnancy week calculated?', a: 'Counted from Last Menstrual Period (LMP). Actual conception is ~2 weeks later, but medical standard uses LMP.' },
          { q: 'Is the due date accurate?', a: 'Calculated as LMP + 280 days using Naegele\'s rule. Normal delivery is within 2 weeks of due date.' },
          { q: 'What are the trimesters?', a: '1st: weeks 1-12 (higher miscarriage risk), 2nd: 13-26 (stable period), 3rd: 27-40 (birth preparation).' },
          { q: 'Can ultrasound week differ?', a: 'Yes, ultrasound dates based on fetal size may differ by 1-2 weeks from LMP dates. Follow your doctor\'s guidance.' },
        ]}
        keywords="태아 발달 주수 · 임신 주수 계산기 · 출산 예정일 계산 · 임신 주차별 태아 크기 · 임신 몇 주 · 태아 발달 · pregnancy week calculator · fetal development · due date calculator · baby size by week · 임신 계산기"
      />
    </div>
  )
}
