'use client'
import { useState, useEffect } from 'react'
import { Copy, CheckCheck, Plus, X } from 'lucide-react'
import { useLang } from './LangContext'
import ToolFooter from './ToolFooter'

const T = {
  ko: { title: '세계 시계', desc: '전 세계 주요 도시의 현재 시각을 한눈에 확인. 시간대 비교, 미팅 시간 조율에 최적.' },
  en: { title: 'World Clock', desc: 'Check current time in major cities worldwide at a glance. Perfect for comparing time zones and scheduling meetings.' }
}

const ALL_ZONES = [
  { city: '서울', cityEn: 'Seoul', tz: 'Asia/Seoul', flag: '🇰🇷', country: '한국', countryEn: 'Korea' },
  { city: '도쿄', cityEn: 'Tokyo', tz: 'Asia/Tokyo', flag: '🇯🇵', country: '일본', countryEn: 'Japan' },
  { city: '베이징', cityEn: 'Beijing', tz: 'Asia/Shanghai', flag: '🇨🇳', country: '중국', countryEn: 'China' },
  { city: '싱가포르', cityEn: 'Singapore', tz: 'Asia/Singapore', flag: '🇸🇬', country: '싱가포르', countryEn: 'Singapore' },
  { city: '방콕', cityEn: 'Bangkok', tz: 'Asia/Bangkok', flag: '🇹🇭', country: '태국', countryEn: 'Thailand' },
  { city: '두바이', cityEn: 'Dubai', tz: 'Asia/Dubai', flag: '🇦🇪', country: '아랍에미리트', countryEn: 'UAE' },
  { city: '모스크바', cityEn: 'Moscow', tz: 'Europe/Moscow', flag: '🇷🇺', country: '러시아', countryEn: 'Russia' },
  { city: '파리', cityEn: 'Paris', tz: 'Europe/Paris', flag: '🇫🇷', country: '프랑스', countryEn: 'France' },
  { city: '런던', cityEn: 'London', tz: 'Europe/London', flag: '🇬🇧', country: '영국', countryEn: 'UK' },
  { city: '뉴욕', cityEn: 'New York', tz: 'America/New_York', flag: '🇺🇸', country: '미국 동부', countryEn: 'US East' },
  { city: '시카고', cityEn: 'Chicago', tz: 'America/Chicago', flag: '🇺🇸', country: '미국 중부', countryEn: 'US Central' },
  { city: '로스앤젤레스', cityEn: 'Los Angeles', tz: 'America/Los_Angeles', flag: '🇺🇸', country: '미국 서부', countryEn: 'US West' },
  { city: '시드니', cityEn: 'Sydney', tz: 'Australia/Sydney', flag: '🇦🇺', country: '호주', countryEn: 'Australia' },
  { city: '오클랜드', cityEn: 'Auckland', tz: 'Pacific/Auckland', flag: '🇳🇿', country: '뉴질랜드', countryEn: 'New Zealand' },
  { city: '상파울루', cityEn: 'São Paulo', tz: 'America/Sao_Paulo', flag: '🇧🇷', country: '브라질', countryEn: 'Brazil' },
  { city: '카이로', cityEn: 'Cairo', tz: 'Africa/Cairo', flag: '🇪🇬', country: '이집트', countryEn: 'Egypt' },
  { city: '뭄바이', cityEn: 'Mumbai', tz: 'Asia/Kolkata', flag: '🇮🇳', country: '인도', countryEn: 'India' },
  { city: '이스탄불', cityEn: 'Istanbul', tz: 'Europe/Istanbul', flag: '🇹🇷', country: '튀르키예', countryEn: 'Turkey' },
]

const DEFAULT_ZONES = ['Asia/Seoul', 'America/New_York', 'Europe/London', 'Asia/Tokyo', 'America/Los_Angeles']

function getTime(tz: string): { time: string; date: string; h: number; isDay: boolean } {
  try {
    const now = new Date()
    const opts: Intl.DateTimeFormatOptions = { timeZone: tz, hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }
    const dateOpts: Intl.DateTimeFormatOptions = { timeZone: tz, month: 'short', day: 'numeric', weekday: 'short' }
    const time = now.toLocaleTimeString('en-US', opts)
    const date = now.toLocaleDateString('en-US', dateOpts)
    const h = parseInt(time.split(':')[0])
    return { time, date, h, isDay: h >= 6 && h < 20 }
  } catch { return { time: '--:--:--', date: '---', h: 12, isDay: true } }
}

function getOffset(tz: string): string {
  try {
    const now = new Date()
    const utcMs = now.getTime()
    const localMs = new Date(now.toLocaleString('en-US', { timeZone: tz })).getTime()
    const diff = Math.round((localMs - new Date(now.toLocaleString('en-US', { timeZone: 'UTC' })).getTime()) / 36000) / 100
    return `UTC${diff >= 0 ? '+' : ''}${diff}`
  } catch { return 'UTC' }
}

export default function WorldClock() {
  const { lang } = useLang()
  const tx = T[lang]
  const [selected, setSelected] = useState<string[]>(DEFAULT_ZONES)
  const [now, setNow] = useState(new Date())
  const [copied, setCopied] = useState<string | null>(null)
  const [adding, setAdding] = useState(false)
  const copy = async (text: string, key: string) => { await navigator.clipboard.writeText(text); setCopied(key); setTimeout(() => setCopied(null), 1500) }

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const zones = selected.map(tz => {
    const zone = ALL_ZONES.find(z => z.tz === tz)!
    const { time, date, isDay } = getTime(tz)
    const offset = getOffset(tz)
    return { ...zone, time, date, isDay, offset }
  })

  const available = ALL_ZONES.filter(z => !selected.includes(z.tz))

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-mono mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />Live Tool
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-3">{tx.title}</h1>
        <p className="text-slate-300 text-base max-w-xl mx-auto">{tx.desc}</p>
      </div>

      {/* 시계 카드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-5">
        {zones.map(z => (
          <div key={z.tz} className={`rounded-xl border p-4 relative group transition-all ${z.isDay ? 'border-yellow-500/20 bg-yellow-500/5' : 'border-blue-500/20 bg-blue-500/5'}`}>
            <button onClick={() => setSelected(s => s.filter(x => x !== z.tz))}
              className="absolute top-2 right-2 p-1 rounded text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all">
              <X size={12} />
            </button>
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-lg">{z.flag}</p>
                <p className="text-sm font-bold text-slate-200">{lang === 'ko' ? z.city : z.cityEn}</p>
                <p className="text-xs text-slate-500">{lang === 'ko' ? z.country : z.countryEn} · {z.offset}</p>
              </div>
              <div className="text-right">
                <span className="text-xs">{z.isDay ? '☀️' : '🌙'}</span>
                <button onClick={() => copy(`${lang === 'ko' ? z.city : z.cityEn}: ${z.time}`, z.tz)}
                  className={`ml-1 p-1 rounded border transition-all ${copied === z.tz ? 'text-brand-400 border-brand-500/40' : 'border-surface-border text-slate-600 hover:text-brand-400'}`}>
                  {copied === z.tz ? <CheckCheck size={11} /> : <Copy size={11} />}
                </button>
              </div>
            </div>
            <p className="text-2xl font-extrabold font-mono text-slate-200 tracking-wide">{z.time}</p>
            <p className="text-xs text-slate-500 mt-0.5">{z.date}</p>
          </div>
        ))}

        {/* 추가 버튼 */}
        {selected.length < 12 && (
          <button onClick={() => setAdding(!adding)}
            className="rounded-xl border border-dashed border-surface-border hover:border-brand-500/40 p-4 flex items-center justify-center gap-2 text-slate-500 hover:text-brand-400 transition-all">
            <Plus size={16} /> {lang === 'ko' ? '도시 추가' : 'Add City'}
          </button>
        )}
      </div>

      {/* 도시 선택 */}
      {adding && (
        <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4 mb-5">
          <p className="text-xs text-slate-400 mb-3 font-medium">{lang === 'ko' ? '추가할 도시 선택' : 'Select cities to add'}</p>
          <div className="flex flex-wrap gap-1.5">
            {available.map(z => (
              <button key={z.tz} onClick={() => { setSelected(s => [...s, z.tz]); if (selected.length >= 11) setAdding(false) }}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-surface-border text-slate-300 hover:border-brand-500/40 hover:text-brand-300 bg-[#0f1117] transition-all">
                {z.flag} {lang === 'ko' ? z.city : z.cityEn}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 시간대 비교 바 */}
      <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4">
        <p className="text-xs text-slate-400 mb-3 font-medium">{lang === 'ko' ? '업무 시간대 비교 (09:00~18:00)' : 'Business Hours Comparison (09:00~18:00)'}</p>
        <div className="flex flex-col gap-2">
          {zones.map(z => {
            const { h } = getTime(z.tz)
            const inBusiness = h >= 9 && h < 18
            const pct = (h / 24) * 100
            return (
              <div key={z.tz} className="flex items-center gap-3">
                <span className="text-xs text-slate-400 w-20 flex-shrink-0 truncate">{lang === 'ko' ? z.city : z.cityEn}</span>
                <div className="flex-1 h-5 bg-[#0f1117] rounded-full overflow-hidden relative border border-surface-border">
                  <div className="absolute inset-0 flex">
                    <div className="bg-brand-500/10 border-r border-brand-500/20" style={{ width: '37.5%' }} />
                    <div className="bg-brand-500/30 border-r border-brand-500/40" style={{ width: '37.5%' }} />
                    <div className="bg-brand-500/10" style={{ width: '25%' }} />
                  </div>
                  <div className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full border-2 border-white shadow-lg transition-all"
                    style={{ left: `calc(${pct}% - 5px)`, backgroundColor: inBusiness ? '#22c55e' : '#64748b' }} />
                </div>
                <span className={`text-xs font-mono w-16 text-right ${inBusiness ? 'text-brand-400 font-bold' : 'text-slate-500'}`}>{z.time.slice(0, 5)}</span>
              </div>
            )
          })}
        </div>
        <div className="flex justify-between text-xs text-slate-600 mt-1 px-[80px]">
          <span>00:00</span><span>09:00</span><span>18:00</span><span>24:00</span>
        </div>
      </div>

      <ToolFooter
        toolName={lang === 'ko' ? '세계 시계' : 'World Clock'}
        toolUrl="https://keyword-mixer.vercel.app/world-clock"
        description={tx.desc}
        howToUse={lang === 'ko' ? [
          { step: '도시 카드 확인', desc: '기본으로 5개 주요 도시의 현재 시각이 표시됩니다.' },
          { step: '도시 추가', desc: '"도시 추가" 버튼을 클릭해 최대 12개 도시를 추가하세요.' },
          { step: '업무시간 비교', desc: '하단 바 차트에서 어느 도시가 업무 시간인지 확인하세요.' },
          { step: '시각 복사', desc: '각 카드의 복사 버튼으로 현재 시각을 복사하세요.' },
        ] : [
          { step: 'View city cards', desc: '5 major cities are shown by default with live time.' },
          { step: 'Add cities', desc: 'Click "Add City" to add up to 12 cities.' },
          { step: 'Compare business hours', desc: 'Use the bar chart to see which cities are in business hours.' },
          { step: 'Copy time', desc: 'Use copy buttons on each card to copy current time.' },
        ]}
        whyUse={lang === 'ko' ? [
          { title: '실시간 업데이트', desc: '1초마다 자동으로 갱신되어 정확한 현재 시각을 표시합니다.' },
          { title: '업무시간 시각화', desc: '어느 도시가 지금 업무 시간인지 한눈에 파악할 수 있습니다.' },
          { title: '도시 추가/제거', desc: '최대 12개 도시를 자유롭게 추가하고 제거할 수 있습니다.' },
          { title: '낮/밤 구분', desc: '☀️/🌙 아이콘으로 각 도시의 낮/밤을 직관적으로 확인합니다.' },
        ] : [
          { title: 'Real-time updates', desc: 'Auto-refreshes every second for accurate current time.' },
          { title: 'Business hours visualization', desc: 'See at a glance which cities are currently in business hours.' },
          { title: 'Add/remove cities', desc: 'Freely add up to 12 cities and remove any at any time.' },
          { title: 'Day/night indicator', desc: '☀️/🌙 icons for intuitive day/night status per city.' },
        ]}
        faqs={lang === 'ko' ? [
          { q: 'UTC란?', a: '협정 세계시(Universal Time Coordinated)로 국제 표준 시간입니다. 한국은 UTC+9, 미국 동부는 UTC-5(서머타임 시 -4)입니다.' },
          { q: '서머타임이란?', a: '일부 국가에서 봄~가을에 시계를 1시간 앞당기는 제도입니다. 미국은 3월~11월, 유럽은 3월~10월에 적용됩니다.' },
          { q: '한국은 왜 UTC+9인가요?', a: '경도 135°에 위치한 일본 표준시를 따르기 때문입니다. 서울의 실제 경도(127°)에 해당하는 UTC+8.5가 아닌 편의상 +9를 사용합니다.' },
          { q: '국제 화상회의 시간 조율은?', a: '이 페이지의 업무시간 비교 바를 참고하세요. 모든 참여자가 업무 시간(09~18시)인 구간을 찾아 회의 시간을 설정하세요.' },
        ] : [
          { q: 'What is UTC?', a: 'Universal Time Coordinated - the international time standard. Korea is UTC+9, US Eastern is UTC-5 (UTC-4 in summer).' },
          { q: 'What is Daylight Saving Time?', a: 'Some countries advance clocks 1 hour in spring to extend evening daylight. US: March-November, Europe: March-October.' },
          { q: 'Why is Korea UTC+9?', a: 'Korea follows Japanese Standard Time (135°E). Actual Seoul longitude (127°E) would be UTC+8.5, but +9 is used for convenience.' },
          { q: 'How to schedule international meetings?', a: 'Use the business hours bar at the bottom. Find a time slot where all participants show green (09:00-18:00).' },
        ]}
        keywords="세계 시계 · 세계 시간 · 국가별 현재 시각 · 타임존 · 시차 확인 · world clock · current time world · international time zones · live world clock · timezone comparison · UTC time"
      />
    </div>
  )
}
