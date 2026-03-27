
'use client'
import { useState, useEffect } from 'react'
import { Copy, CheckCheck } from 'lucide-react'
import { useLang } from './LangContext'
import ToolFooter from './ToolFooter'

const T = {
  ko: { title: '국제 미팅 시간 조율기', desc: '여러 나라 참석자가 있는 화상 미팅 최적 시간을 찾아주는 도구. 각 도시의 업무시간 겹치는 구간을 시각화.' },
  en: { title: 'International Meeting Time Finder', desc: 'Find the best time for video meetings across multiple time zones. Visualize overlapping business hours.' }
}

const CITIES = [
  { ko:'서울', en:'Seoul', tz:'Asia/Seoul', offset:9 },
  { ko:'도쿄', en:'Tokyo', tz:'Asia/Tokyo', offset:9 },
  { ko:'베이징', en:'Beijing', tz:'Asia/Shanghai', offset:8 },
  { ko:'싱가포르', en:'Singapore', tz:'Asia/Singapore', offset:8 },
  { ko:'뭄바이', en:'Mumbai', tz:'Asia/Kolkata', offset:5.5 },
  { ko:'두바이', en:'Dubai', tz:'Asia/Dubai', offset:4 },
  { ko:'모스크바', en:'Moscow', tz:'Europe/Moscow', offset:3 },
  { ko:'파리', en:'Paris', tz:'Europe/Paris', offset:1 },
  { ko:'런던', en:'London', tz:'Europe/London', offset:0 },
  { ko:'뉴욕', en:'New York', tz:'America/New_York', offset:-5 },
  { ko:'시카고', en:'Chicago', tz:'America/Chicago', offset:-6 },
  { ko:'로스앤젤레스', en:'Los Angeles', tz:'America/Los_Angeles', offset:-8 },
  { ko:'시드니', en:'Sydney', tz:'Australia/Sydney', offset:10 },
]

function getLocalHour(utcHour: number, offset: number): number {
  return ((utcHour + offset) % 24 + 24) % 24
}

function isBusinessHour(localHour: number): boolean {
  return localHour >= 9 && localHour < 18
}

export default function TimezoneMeeting() {
  const { lang } = useLang()
  const tx = T[lang]
  const [selected, setSelected] = useState([0, 9, 11]) // 서울, 뉴욕, LA
  const [baseDate, setBaseDate] = useState(() => new Date().toISOString().slice(0,10))
  const [copied, setCopied] = useState<string|null>(null)
  const copy = async (t: string, k: string) => { await navigator.clipboard.writeText(t); setCopied(k); setTimeout(() => setCopied(null), 1500) }

  const toggleCity = (idx: number) => {
    setSelected(p => p.includes(idx) ? (p.length > 1 ? p.filter(i => i !== idx) : p) : [...p, idx])
  }

  const selectedCities = selected.map(i => CITIES[i])

  // 최적 미팅 시간 찾기 (UTC 기준)
  const bestSlots: number[] = []
  for (let utcHour = 0; utcHour < 24; utcHour++) {
    const allBusiness = selectedCities.every(city => isBusinessHour(getLocalHour(utcHour, city.offset)))
    if (allBusiness) bestSlots.push(utcHour)
  }

  const goodSlots: number[] = []
  for (let utcHour = 0; utcHour < 24; utcHour++) {
    const count = selectedCities.filter(city => isBusinessHour(getLocalHour(utcHour, city.offset))).length
    if (count >= selected.length - 1 && count > 0) goodSlots.push(utcHour)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-mono mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />Free Tool
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-3">{tx.title}</h1>
        <p className="text-slate-300 text-base max-w-xl mx-auto">{tx.desc}</p>
      </div>

      <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4 mb-5">
        <p className="text-xs text-slate-400 mb-2 font-medium">{lang==='ko'?'참가 도시 선택 (최대 6개)':'Select Cities (up to 6)'}</p>
        <div className="flex flex-wrap gap-1.5">
          {CITIES.map((city, idx) => (
            <button key={idx} onClick={() => toggleCity(idx)}
              className={`text-xs px-2.5 py-1.5 rounded-lg border transition-all ${selected.includes(idx)?'bg-brand-500 border-brand-500 text-white font-bold':'border-surface-border text-slate-300 bg-[#0f1117] hover:border-brand-500/40'}`}>
              {lang==='ko'?city.ko:city.en}
            </button>
          ))}
        </div>
      </div>

      {/* 최적 시간 표시 */}
      {bestSlots.length > 0 ? (
        <div className="rounded-xl border border-brand-500/30 bg-brand-500/10 p-4 mb-5">
          <p className="text-sm font-bold text-brand-400 mb-2">✅ {lang==='ko'?'모두 업무시간인 UTC 시간대:':'All-business-hours UTC slots:'}</p>
          <div className="flex flex-wrap gap-2">
            {bestSlots.map(utcH => (
              <div key={utcH} className="rounded-lg border border-brand-500/40 bg-brand-500/20 px-3 py-2">
                <p className="text-xs text-slate-400 mb-1">UTC {utcH}:00</p>
                <div className="flex flex-col gap-0.5">
                  {selectedCities.map(city => (
                    <span key={city.en} className="text-xs text-brand-300">
                      {lang==='ko'?city.ko:city.en}: {String(getLocalHour(utcH, city.offset)).padStart(2,'0')}:00
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-4 mb-5">
          <p className="text-sm text-yellow-400">⚠️ {lang==='ko'?'모든 도시가 동시에 업무시간인 구간이 없습니다. 아래 부분 겹침 시간대를 참고하세요.':'No hours where all cities are in business hours. See partial overlap below.'}</p>
        </div>
      )}

      {/* 24시간 시각화 */}
      <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4 overflow-x-auto">
        <p className="text-xs text-slate-400 font-medium mb-3">{lang==='ko'?'업무시간 겹침 시각화 (UTC 기준)':'Business Hours Overlap (UTC)'}</p>
        <div className="min-w-[600px]">
          {/* 시간 헤더 */}
          <div className="flex mb-2">
            <div className="w-28 flex-shrink-0" />
            <div className="flex-1 flex">
              {[0,4,8,12,16,20].map(h => (
                <div key={h} className="flex-1 text-xs text-slate-500 text-center">{h}:00</div>
              ))}
            </div>
          </div>
          {selectedCities.map(city => (
            <div key={city.en} className="flex items-center mb-1.5">
              <div className="w-28 flex-shrink-0 text-xs text-slate-300 font-medium">{lang==='ko'?city.ko:city.en}</div>
              <div className="flex-1 flex h-6 rounded overflow-hidden border border-surface-border">
                {Array.from({length:24},(_,h) => {
                  const localH = getLocalHour(h, city.offset)
                  const isBiz = isBusinessHour(localH)
                  const isBest = bestSlots.includes(h)
                  return (
                    <div key={h} title={`UTC ${h}:00 = 현지 ${localH}:00`}
                      className={`flex-1 ${isBest && isBiz?'bg-brand-500':isBiz?'bg-brand-500/30':'bg-[#0f1117]'} border-r border-surface-border/30 last:border-0`} />
                  )
                })}
              </div>
            </div>
          ))}
          <div className="flex mt-3 gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-1"><div className="w-3 h-3 bg-brand-500" /><span>{lang==='ko'?'최적 겹침':'Best overlap'}</span></div>
            <div className="flex items-center gap-1"><div className="w-3 h-3 bg-brand-500/30" /><span>{lang==='ko'?'업무시간':'Business hrs'}</span></div>
          </div>
        </div>
      </div>

      <ToolFooter
        toolName={lang==='ko'?'국제 미팅 시간 조율기':'Meeting Time Finder'}
        toolUrl="https://keyword-mixer.vercel.app/timezone-meeting"
        description={tx.desc}
        howToUse={lang==='ko'?[{step:'도시 선택',desc:'미팅에 참여하는 도시들을 선택하세요.'},{step:'겹침 확인',desc:'모든 도시가 업무시간인 구간이 초록색으로 표시됩니다.'},{step:'최적 시간 확인',desc:'상단에 모든 도시가 업무시간인 UTC 시간대가 표시됩니다.'},{step:'미팅 일정 조율',desc:'각 도시별 현지 시간을 확인하고 미팅을 예약하세요.'}]:[{step:'Select cities',desc:'Select cities participating in the meeting.'},{step:'View overlap',desc:'Green bars show times when all cities are in business hours.'},{step:'Check best time',desc:'Optimal UTC time slots shown at the top.'},{step:'Schedule meeting',desc:'See local times for each city and book the meeting.'}]}
        whyUse={lang==='ko'?[{title:'시각적 겹침 표시',desc:'24시간 막대 차트로 업무시간 겹침을 직관적으로 파악합니다.'},{title:'최적 시간 자동 계산',desc:'모든 도시가 업무시간(9~18시)인 UTC 구간을 자동으로 찾습니다.'},{title:'13개 도시 지원',desc:'서울, 뉴욕, 런던 등 13개 주요 도시를 지원합니다.'},{title:'도시별 현지 시간',desc:'UTC 기준 최적 시간을 각 도시의 현지 시간으로 변환해 표시합니다.'}]:[{title:'Visual overlap display',desc:'24-hour bar chart for intuitive business hours overlap.'},{title:'Auto optimal time',desc:'Automatically finds UTC slots where all cities are in business hours.'},{title:'13 cities supported',desc:'Covers Seoul, New York, London, and 10 more major cities.'},{title:'Local time conversion',desc:'Converts optimal UTC time to each city local time.'}]}
        faqs={lang==='ko'?[{q:'UTC(협정세계시)란?',a:'국제 표준 시간으로 모든 시간대의 기준입니다. 한국은 UTC+9, 미국 동부는 UTC-5(서머타임 시 -4)입니다.'},{q:'서머타임은 반영되나요?',a:'현재 버전은 고정 오프셋을 사용해 서머타임이 완전히 반영되지 않을 수 있습니다. 실제 미팅 전 각자 현지 시간을 재확인하세요.'},{q:'업무시간 기준이 왜 9~18시인가요?',a:'일반적인 글로벌 비즈니스 업무 시간 기준입니다. 실제 회사마다 다를 수 있으니 참고용으로 사용하세요.'},{q:'겹치는 시간이 없으면?',a:'시차가 큰 국가들 간에는 동시에 업무시간인 구간이 없을 수 있습니다. 이 경우 한쪽이 이른 아침이나 저녁 시간을 사용해야 합니다.'}]:[{q:'What is UTC?',a:'Universal Time Coordinated - the international time standard. Korea is UTC+9, US Eastern is UTC-5 (UTC-4 in summer).'},{q:'Is daylight saving time included?',a:'Current version uses fixed offsets. DST may not be fully reflected. Verify local times before scheduling.'},{q:'Why 9-18 business hours?',a:'Standard global business hours. Actual hours vary by company - use as reference only.'},{q:'No overlapping hours?',a:'Countries with large time differences may have no simultaneous business hours. One side will need early morning or evening availability.'}]}
        keywords="국제 미팅 시간 · 시차 계산기 · 세계 시간대 미팅 · 화상회의 시간 조율 · timezone meeting · meeting time finder · international meeting scheduler · time zone overlap"
      />
    </div>
  )
}
