
'use client'
import { useState, useEffect } from 'react'
import { useLang } from './LangContext'
import ToolFooter from './ToolFooter'
const T = {
  ko: { title: '바이오리듬 계산기', desc: '생년월일로 오늘의 신체·감성·지성 바이오리듬 계산. 최적 활동 날짜를 예측하세요.' },
  en: { title: 'Biorhythm Calculator', desc: 'Calculate today physical, emotional, and intellectual biorhythm from birth date. Predict optimal activity dates.' }
}
function calcRhythm(born: string, today: Date, cycle: number): number {
  const b = new Date(born)
  const days = Math.floor((today.getTime() - b.getTime()) / 86400000)
  return Math.sin((2 * Math.PI * days) / cycle)
}
function pct(v: number) { return Math.round((v + 1) / 2 * 100) }
function fmt(v: number) { return (v >= 0 ? '+' : '') + (v * 100).toFixed(1) + '%' }
export default function Biorhythm() {
  const { lang } = useLang(); const tx = T[lang]
  const [birthDate, setBirthDate] = useState('1995-03-15')
  const [today] = useState(new Date())
  const phys = calcRhythm(birthDate, today, 23)
  const emot = calcRhythm(birthDate, today, 28)
  const intel = calcRhythm(birthDate, today, 33)
  const intuit = calcRhythm(birthDate, today, 38)
  const cycles = [
    { label: lang==='ko'?'신체 (23일)':'Physical (23d)', val: phys, color: 'bg-red-500', text: 'text-red-400', cycle: 23 },
    { label: lang==='ko'?'감성 (28일)':'Emotional (28d)', val: emot, color: 'bg-blue-500', text: 'text-blue-400', cycle: 28 },
    { label: lang==='ko'?'지성 (33일)':'Intellectual (33d)', val: intel, color: 'bg-brand-500', text: 'text-brand-400', cycle: 33 },
    { label: lang==='ko'?'직관 (38일)':'Intuitive (38d)', val: intuit, color: 'bg-purple-500', text: 'text-purple-400', cycle: 38 },
  ]
  const overallScore = Math.round((pct(phys) + pct(emot) + pct(intel)) / 3)
  const todayStr = today.toLocaleDateString(lang==='ko'?'ko-KR':'en-US', {year:'numeric',month:'long',day:'numeric'})
  // 7일 미니 차트
  const days7 = Array.from({length:7},(_,i)=>{
    const d = new Date(today); d.setDate(d.getDate()-3+i)
    return { label: d.getDate(), phys: pct(calcRhythm(birthDate, d, 23)), emot: pct(calcRhythm(birthDate, d, 28)), intel: pct(calcRhythm(birthDate, d, 33)), isToday: i===3 }
  })
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-mono mb-4"><span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse"/>Free Tool ✨</div>
        <h1 className="text-4xl font-extrabold text-white mb-3">{tx.title}</h1>
        <p className="text-slate-300 text-base max-w-xl mx-auto">{tx.desc}</p>
      </div>
      <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-5 mb-5">
        <label className="text-xs text-slate-400 mb-1.5 block">{lang==='ko'?'생년월일':'Date of Birth'}</label>
        <input type="date" value={birthDate} onChange={e=>setBirthDate(e.target.value)} className="w-full bg-[#0f1117] border border-surface-border rounded-xl px-4 py-3 text-slate-200 text-lg font-mono focus:outline-none focus:border-brand-500/50 transition-all" />
        <p className="text-xs text-slate-500 mt-1.5">{lang==='ko'?`오늘: ${todayStr}`:`Today: ${todayStr}`}</p>
      </div>
      <div className="rounded-xl border border-brand-500/30 bg-brand-500/10 p-4 mb-4 text-center">
        <p className="text-xs text-slate-400 mb-1">{lang==='ko'?'오늘의 전체 바이오리듬':'Today Overall Biorhythm'}</p>
        <p className="text-5xl font-extrabold text-brand-400 font-mono">{overallScore}%</p>
        <p className="text-sm text-slate-400 mt-1">{overallScore >= 75 ? (lang==='ko'?'🌟 최고의 날!':'🌟 Peak day!') : overallScore >= 50 ? (lang==='ko'?'✅ 좋은 날':'✅ Good day') : (lang==='ko'?'😌 휴식이 필요한 날':'😌 Rest day')}</p>
      </div>
      <div className="flex flex-col gap-3 mb-5">
        {cycles.map(c=>(
          <div key={c.label} className="rounded-xl border border-surface-border bg-[#1a1d27] p-3">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-slate-300 font-medium">{c.label}</span>
              <span className={`text-sm font-bold font-mono ${c.text}`}>{fmt(c.val)} ({pct(c.val)}%)</span>
            </div>
            <div className="h-3 bg-surface-border rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${c.color}/70 transition-all`} style={{width:`${pct(c.val)}%`}} />
            </div>
            <p className="text-xs text-slate-600 mt-1">{pct(c.val)>=70?(lang==='ko'?'고조기 - 최적의 활동 시기':'Peak - optimal activity') : pct(c.val)>=40?(lang==='ko'?'중간기':'Neutral') : (lang==='ko'?'저조기 - 무리하지 마세요':'Low - take it easy')}</p>
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4">
        <p className="text-xs text-slate-400 font-medium mb-3">{lang==='ko'?'📅 7일 미니 차트':'📅 7-Day Chart'}</p>
        <div className="flex justify-between gap-1">
          {days7.map((d,i)=>(
            <div key={i} className={`flex-1 text-center rounded-lg border p-2 ${d.isToday?'border-brand-500/40 bg-brand-500/10':'border-surface-border bg-[#0f1117]'}`}>
              <p className={`text-xs font-bold mb-2 ${d.isToday?'text-brand-400':'text-slate-400'}`}>{d.label}</p>
              <div className="flex flex-col gap-0.5">
                {[['bg-red-500/70',d.phys],['bg-blue-500/70',d.emot],['bg-brand-500/70',d.intel]].map(([c,v],j)=>(
                  <div key={j} className="h-1.5 bg-surface-border rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${c}`} style={{width:`${v}%`}}/>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-3 mt-2 text-xs text-slate-500 justify-center">
          <span>🔴 {lang==='ko'?'신체':'Physical'}</span>
          <span>🔵 {lang==='ko'?'감성':'Emotional'}</span>
          <span>🟢 {lang==='ko'?'지성':'Intellectual'}</span>
        </div>
      </div>
      <ToolFooter toolName={lang==='ko'?'바이오리듬 계산기':'Biorhythm Calculator'} toolUrl="https://keyword-mixer.vercel.app/biorhythm" description={tx.desc}
        howToUse={lang==='ko'?[{step:'생년월일 입력',desc:'생년월일을 입력하세요.'},{step:'오늘의 리듬 확인',desc:'신체·감성·지성·직관 4가지 바이오리듬을 확인하세요.'},{step:'7일 차트 확인',desc:'전후 3일을 포함한 7일간의 변화를 확인하세요.'},{step:'활동 계획',desc:'리듬이 높은 날에 중요한 활동을 계획하세요.'}]:[{step:'Enter birth date',desc:'Input your date of birth.'},{step:'View today biorhythm',desc:'Check physical, emotional, intellectual, and intuitive cycles.'},{step:'7-day chart',desc:'See biorhythm changes for 7 days including 3 before/after.'},{step:'Plan activities',desc:'Schedule important activities on high-rhythm days.'}]}
        whyUse={lang==='ko'?[{title:'4가지 사이클 계산',desc:'신체(23일)·감성(28일)·지성(33일)·직관(38일) 사이클을 계산합니다.'},{title:'전체 점수 제공',desc:'오늘의 종합 바이오리듬 점수를 퍼센트로 표시합니다.'},{title:'7일 미니 차트',desc:'주변 7일간의 바이오리듬 변화를 시각적으로 확인합니다.'},{title:'활동 가이드',desc:'고조기·중간기·저조기별 활동 지침을 제공합니다.'}]:[{title:'4 cycle calculation',desc:'Physical(23d), emotional(28d), intellectual(33d), intuitive(38d).'},{title:'Overall score',desc:'Today overall biorhythm shown as percentage.'},{title:'7-day mini chart',desc:'Visual biorhythm changes for surrounding 7 days.'},{title:'Activity guide',desc:'Activity guidance for peak, neutral, and low phases.'}]}
        faqs={lang==='ko'?[{q:'바이오리듬이란?',a:'1800년대 후반 빌헬름 플리스가 제안한 이론으로, 신체(23일)·감성(28일)·지성(33일) 사이클이 인간 활동에 영향을 준다는 개념입니다.'},{q:'바이오리듬이 과학적인가요?',a:'바이오리듬은 과학적으로 검증된 이론이 아닙니다. 재미있는 자기 관찰 도구로 활용하세요.'},{q:'위기일(critical day)이란?',a:'각 사이클이 0을 교차하는 날입니다. 사이클이 전환되는 날로 특히 주의가 필요하다고 봅니다.'},{q:'여러 사이클이 고조일 때?',a:'여러 사이클이 동시에 고조기이면 최상의 컨디션이라고 봅니다. 중요한 발표, 경기, 시험 등을 이날 배치하면 좋습니다.'}]:[{q:'What is biorhythm?',a:'Theory proposed by Wilhelm Fliess in the late 1800s. Physical(23d), emotional(28d), and intellectual(33d) cycles supposedly influence human activity.'},{q:'Is biorhythm scientific?',a:'Biorhythm is not scientifically validated. Use it as a fun self-observation tool.'},{q:'What is a critical day?',a:'Days when a cycle crosses zero (transitions from positive to negative or vice versa). Said to require extra caution.'},{q:'When multiple cycles peak together?',a:'When multiple cycles are in high phase simultaneously, it is considered optimal condition. Good for important presentations, competitions, or exams.'}]}
        keywords="바이오리듬 · 바이오리듬 계산기 · 오늘의 바이오리듬 · 신체 감성 지성 · biorhythm calculator · daily biorhythm · physical emotional intellectual cycle"
      />
    </div>
  )
}
