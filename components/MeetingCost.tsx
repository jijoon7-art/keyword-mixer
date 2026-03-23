
'use client'
import { useState, useEffect } from 'react'
import { useLang } from './LangContext'
import ToolFooter from './ToolFooter'
const T = { ko:{ title:'회의비용 계산기', desc:'실시간으로 올라가는 회의 비용 시각화. 참석자 시급으로 회의의 실제 비용 계산.' }, en:{ title:'Meeting Cost Calculator', desc:'Visualize real-time meeting costs. Calculate actual cost from attendee hourly rates.' } }
function comma(n:number){return Math.round(n).toLocaleString('ko-KR')}
export default function MeetingCost() {
  const { lang } = useLang(); const tx = T[lang]
  const [running,setRunning]=useState(false); const [seconds,setSeconds]=useState(0)
  const [people,setPeople]=useState(5); const [hourlyRate,setHourlyRate]=useState(30000)
  useEffect(()=>{ if(!running)return; const id=setInterval(()=>setSeconds(s=>s+1),1000); return()=>clearInterval(id) },[running])
  const totalPerSec=(people*hourlyRate)/3600; const currentCost=Math.round(totalPerSec*seconds); const perMin=Math.round(totalPerSec*60)
  const fmt=(s:number)=>`${String(Math.floor(s/3600)).padStart(2,'0')}:${String(Math.floor((s%3600)/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`
  const PRESETS=lang==='ko'?[['스탠드업 15분',900],['주간회의 1시간',3600],['전략회의 2시간',7200],['연간계획 4시간',14400]]:[['Standup 15m',900],['Weekly 1h',3600],['Strategy 2h',7200],['Annual 4h',14400]]
  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-mono mb-4"><span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />Live Tool</div>
        <h1 className="text-4xl font-extrabold text-white mb-3">{tx.title}</h1>
        <p className="text-slate-300 text-base max-w-xl mx-auto">{tx.desc}</p>
      </div>
      <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-5 mb-5">
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">{lang==='ko'?'참석 인원':'Attendees'}</label>
            <div className="flex items-center gap-2">
              <button onClick={()=>setPeople(p=>Math.max(1,p-1))} className="w-8 h-8 rounded-lg border border-surface-border text-slate-300 hover:text-brand-400 transition-all">-</button>
              <span className="flex-1 text-center text-2xl font-bold text-slate-200 font-mono">{people}</span>
              <button onClick={()=>setPeople(p=>p+1)} className="w-8 h-8 rounded-lg border border-surface-border text-slate-300 hover:text-brand-400 transition-all">+</button>
            </div>
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">{lang==='ko'?'평균 시급 (원)':'Avg Hourly Rate'}</label>
            <input type="number" value={hourlyRate} step={5000} onChange={e=>setHourlyRate(+e.target.value)} className="w-full bg-[#0f1117] border border-surface-border rounded-lg px-3 py-2 text-slate-200 text-sm font-mono focus:outline-none focus:border-brand-500/50 transition-all" />
            <div className="flex gap-1 mt-1">{[15000,20000,30000,50000].map(v=><button key={v} onClick={()=>setHourlyRate(v)} className={`flex-1 py-0.5 rounded text-xs border transition-all ${hourlyRate===v?'bg-brand-500 border-brand-500 text-white':'border-surface-border text-slate-600 bg-[#0f1117]'}`}>{v/10000}만</button>)}</div>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5 mb-4">{PRESETS.map(([l,s])=><button key={s as number} onClick={()=>{setSeconds(s as number);setRunning(false)}} className="text-xs px-2.5 py-1.5 rounded-lg border border-surface-border text-slate-300 hover:border-brand-500/40 bg-[#0f1117] transition-all">{l}</button>)}</div>
        <div className="flex gap-2">
          <button onClick={()=>setRunning(!running)} className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${running?'bg-red-500 hover:bg-red-400 text-white':'bg-brand-500 hover:bg-brand-400 text-white'}`}>{running?(lang==='ko'?'⏸ 일시정지':'⏸ Pause'):(lang==='ko'?'▶ 시작':'▶ Start')}</button>
          <button onClick={()=>{setSeconds(0);setRunning(false)}} className="px-4 py-3 rounded-xl border border-surface-border text-slate-300 hover:border-brand-500/40 transition-all text-sm">{lang==='ko'?'초기화':'Reset'}</button>
        </div>
      </div>
      <div className={`rounded-xl border p-6 text-center mb-4 transition-all ${running?'border-red-500/40 bg-red-500/10':'border-surface-border bg-[#1a1d27]'}`}>
        <p className="text-xs text-slate-400 mb-1">{lang==='ko'?'현재까지 회의 비용':'Current Meeting Cost'}</p>
        <p className={`text-5xl font-extrabold font-mono ${running?'text-red-400':'text-brand-400'}`}>₩{comma(currentCost)}</p>
        <p className="text-2xl font-mono text-slate-400 mt-2">{fmt(seconds)}</p>
        <p className="text-xs text-slate-500 mt-2">{lang==='ko'?`분당 ₩${comma(perMin)} · 인당 ₩${comma(Math.round(currentCost/people))}`:`₩${comma(perMin)}/min · ₩${comma(Math.round(currentCost/people))}/person`}</p>
      </div>
      <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4">
        <p className="text-xs text-slate-400 font-medium mb-2">{lang==='ko'?'📊 회의 시간별 비용':'📊 Cost by Duration'}</p>
        <div className="grid grid-cols-4 gap-2">{[[30,'30분'],[60,'1시간'],[120,'2시간'],[240,'4시간']].map(([s,l])=><div key={s as number} className="rounded-lg border border-surface-border bg-[#0f1117] p-2 text-center"><p className="text-xs text-slate-500 mb-0.5">{lang==='ko'?l as string:`${(s as number)/60}h`}</p><p className="text-sm font-bold text-brand-400 font-mono">₩{comma(Math.round(totalPerSec*(s as number)))}</p></div>)}</div>
      </div>
      <ToolFooter toolName={lang==='ko'?'회의비용 계산기':'Meeting Cost Calculator'} toolUrl="https://keyword-mixer.vercel.app/meeting-cost" description={tx.desc}
        howToUse={lang==='ko'?[{step:'참석 인원 설정',desc:'회의 참석 인원 수를 설정하세요.'},{step:'시급 설정',desc:'참석자 평균 시급을 입력하세요.'},{step:'타이머 시작',desc:'회의 시작 시 타이머를 시작하세요.'},{step:'비용 인식',desc:'회의 비용을 체감하고 효율적인 회의 문화를 만드세요.'}]:[{step:'Set attendees',desc:'Enter number of meeting participants.'},{step:'Set hourly rate',desc:'Input average hourly rate.'},{step:'Start timer',desc:'Start when meeting begins.'},{step:'Cost awareness',desc:'Realize meeting costs to build efficient culture.'}]}
        whyUse={lang==='ko'?[{title:'실시간 비용 시각화',desc:'시간이 흐를수록 비용이 올라가는 것을 실시간으로 확인합니다.'},{title:'불필요 회의 줄이기',desc:'회의 비용 인식으로 꼭 필요한 회의만 하는 문화를 만듭니다.'},{title:'프리셋 시간',desc:'스탠드업, 주간회의 등 일반 회의 시간을 빠르게 설정합니다.'},{title:'인당 비용',desc:'1인당 부담 비용을 함께 표시합니다.'}]:[{title:'Real-time tracking',desc:'Watch costs rise in real-time.'},{title:'Reduce meetings',desc:'Cost awareness builds efficient meeting culture.'},{title:'Duration presets',desc:'Quick preset for standup, weekly meetings.'},{title:'Per-person cost',desc:'Shows cost per attendee.'}]}
        faqs={lang==='ko'?[{q:'시급 30,000원 기준은?',a:'연봉 약 6천만원 수준의 시급입니다.'},{q:'회의 비용 줄이는 방법?',a:'회의 시간 단축, 필수 인원만 참석, 명확한 안건 사전 공유.'},{q:'스탠드업 미팅이란?',a:'매일 15분 이내 팀 현황 공유 짧은 회의.'},{q:'왜 회의비용이 중요한가?',a:'10명×1시간×3만원/h = 30만원. 연간 수십 회면 수백만원 비용.'}]:[{q:'₩30,000/hr baseline?',a:'Roughly ₩60M annual salary equivalent.'},{q:'Reduce meeting costs?',a:'Shorter meetings, fewer attendees, pre-shared agenda.'},{q:'Standup meeting?',a:'Brief daily sync under 15 min, common in Agile.'},{q:'Why does it matter?',a:'10 people × 1hr × ₩30K = ₩300K. Dozens/year = millions.'}]}
        keywords="회의비용 계산기 · 회의 비용 · 회의 타이머 · 효율적인 회의 · meeting cost calculator · meeting cost tracker · real-time meeting cost" />
    </div>
  )
}
