'use client'

import { useState, useEffect } from 'react'
import { Copy, CheckCheck, RefreshCw } from 'lucide-react'
import ToolFooter from './ToolFooter'

const ZODIACS = ['쥐','소','호랑이','토끼','용','뱀','말','양','원숭이','닭','개','돼지']
const ZODIAC_EN = ['Rat','Ox','Tiger','Rabbit','Dragon','Snake','Horse','Goat','Monkey','Rooster','Dog','Pig']
const BLOOD_TYPES = ['A','B','AB','O']
const MBTI = ['INTJ','INTP','ENTJ','ENTP','INFJ','INFP','ENFJ','ENFP','ISTJ','ISFJ','ESTJ','ESFJ','ISTP','ISFP','ESTP','ESFP']

function getKoreanAge(birthYear: number): number {
  return new Date().getFullYear() - birthYear + 1
}

function getWesternAge(birth: Date): { years: number; months: number; days: number } {
  const now = new Date()
  let years = now.getFullYear() - birth.getFullYear()
  let months = now.getMonth() - birth.getMonth()
  let days = now.getDate() - birth.getDate()
  if (days < 0) { months--; days += new Date(now.getFullYear(), now.getMonth(), 0).getDate() }
  if (months < 0) { years--; months += 12 }
  return { years, months, days }
}

function getZodiac(year: number) {
  const idx = (year - 4) % 12
  return { ko: ZODIACS[idx < 0 ? idx + 12 : idx], en: ZODIAC_EN[idx < 0 ? idx + 12 : idx] }
}

function getSeason(month: number): string {
  if (month >= 3 && month <= 5) return '🌸 봄'
  if (month >= 6 && month <= 8) return '☀️ 여름'
  if (month >= 9 && month <= 11) return '🍂 가을'
  return '❄️ 겨울'
}

function getDayOfWeek(date: Date): string {
  return ['일요일','월요일','화요일','수요일','목요일','금요일','토요일'][date.getDay()]
}

function getLunarAge(birth: Date): string {
  // 간단한 음력 나이 계산 (만 나이 + 1 또는 +2)
  const now = new Date()
  const age = now.getFullYear() - birth.getFullYear()
  return `약 ${age}~${age+1}세`
}

export default function AgeCalculator() {
  const [birthdate, setBirthdate] = useState('1990-01-01')
  const [copied, setCopied] = useState(false)
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const birth = new Date(birthdate)
  const isValid = !isNaN(birth.getTime()) && birth < now

  const age = isValid ? getWesternAge(birth) : null
  const koreanAge = isValid ? getKoreanAge(birth.getFullYear()) : null
  const zodiac = isValid ? getZodiac(birth.getFullYear()) : null

  const totalDays = isValid ? Math.floor((now.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24)) : 0
  const totalHours = isValid ? Math.floor((now.getTime() - birth.getTime()) / (1000 * 60 * 60)) : 0
  const totalMinutes = isValid ? Math.floor((now.getTime() - birth.getTime()) / (1000 * 60)) : 0
  const totalSeconds = isValid ? Math.floor((now.getTime() - birth.getTime()) / 1000) : 0

  // 다음 생일
  const nextBirthday = isValid ? (() => {
    const next = new Date(now.getFullYear(), birth.getMonth(), birth.getDate())
    if (next <= now) next.setFullYear(now.getFullYear() + 1)
    const diff = Math.ceil((next.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    return { date: next, dday: diff }
  })() : null

  // 100일, 1000일 등 기념일
  const milestones = isValid ? [100, 200, 500, 1000, 2000, 5000, 10000].map(d => {
    const date = new Date(birth.getTime() + d * 24 * 60 * 60 * 1000)
    const diff = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    return { days: d, date, diff, passed: diff <= 0 }
  }) : []

  const copyResult = async () => {
    if (!age) return
    const text = `생년월일: ${birthdate}\n만 나이: ${age.years}세 ${age.months}개월 ${age.days}일\n한국 나이: ${koreanAge}세\n태어난 날: ${getDayOfWeek(birth)}\n띠: ${zodiac?.ko} (${zodiac?.en})\n태어난지: ${totalDays.toLocaleString()}일`
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-mono mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
          Free Tool
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-3 tracking-tight">나이 계산기</h1>
        <p className="text-slate-300 text-base max-w-lg mx-auto">
          만 나이·한국 나이·태어난 날수 계산. 띠·다음 생일·기념일까지 한번에!
        </p>
      </div>

      {/* 생년월일 입력 */}
      <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-5 mb-5">
        <label className="text-sm font-medium text-slate-200 block mb-3">생년월일 입력</label>
        <div className="flex gap-3 items-center">
          <input
            type="date"
            value={birthdate}
            onChange={e => setBirthdate(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
            className="flex-1 bg-[#0f1117] border border-surface-border rounded-xl px-4 py-3 text-slate-200 text-lg font-mono focus:outline-none focus:border-brand-500/50 transition-all"
          />
          <button onClick={() => setBirthdate(new Date().toISOString().split('T')[0])}
            className="px-3 py-3 rounded-xl border border-surface-border text-slate-400 hover:text-brand-400 hover:border-brand-500/40 transition-all">
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {isValid && age && (
        <>
          {/* 메인 나이 결과 */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="rounded-xl border border-brand-500/30 bg-brand-500/10 p-5 text-center">
              <p className="text-xs text-slate-400 mb-1">만 나이</p>
              <p className="text-4xl font-extrabold text-brand-400 font-mono">{age.years}</p>
              <p className="text-sm text-slate-400 mt-1">{age.months}개월 {age.days}일</p>
            </div>
            <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-5 text-center">
              <p className="text-xs text-slate-400 mb-1">한국 나이</p>
              <p className="text-4xl font-extrabold text-slate-200 font-mono">{koreanAge}</p>
              <p className="text-sm text-slate-500 mt-1">세는 나이</p>
            </div>
          </div>

          {/* 상세 정보 */}
          <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-5 mb-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { label: '태어난 요일', value: getDayOfWeek(birth) },
                { label: '계절', value: getSeason(birth.getMonth() + 1) },
                { label: '띠', value: `${zodiac?.ko} (${zodiac?.en})` },
                { label: '태어난지', value: `${totalDays.toLocaleString()}일` },
                { label: '총 시간', value: `${totalHours.toLocaleString()}시간` },
                { label: '총 초', value: `${totalSeconds.toLocaleString()}초` },
              ].map(item => (
                <div key={item.label} className="rounded-lg bg-[#0f1117] border border-surface-border p-3">
                  <p className="text-xs text-slate-500 mb-1">{item.label}</p>
                  <p className="text-sm font-semibold text-slate-200">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 다음 생일 */}
          {nextBirthday && (
            <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4 mb-4">
              <p className="text-xs text-slate-400 mb-3 font-medium">🎂 다음 생일</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-200 text-sm">{nextBirthday.date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{age.years + 1}번째 생일</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-brand-400 font-mono">D-{nextBirthday.dday}</p>
                  <p className="text-xs text-slate-500">{nextBirthday.dday}일 남음</p>
                </div>
              </div>
            </div>
          )}

          {/* 기념일 */}
          <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4 mb-4">
            <p className="text-xs text-slate-400 mb-3 font-medium">🎊 태어난 날 기념일</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {milestones.map(m => (
                <div key={m.days} className={`rounded-lg p-2.5 border text-center ${m.passed ? 'border-surface-border bg-[#0f1117] opacity-50' : 'border-brand-500/20 bg-brand-500/5'}`}>
                  <p className={`text-xs font-bold ${m.passed ? 'text-slate-500' : 'text-brand-400'}`}>{m.days.toLocaleString()}일</p>
                  <p className="text-xs text-slate-400 mt-0.5">{m.date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}</p>
                  {!m.passed && <p className="text-xs text-brand-300 mt-0.5">D-{m.diff}</p>}
                  {m.passed && <p className="text-xs text-slate-600 mt-0.5">지남</p>}
                </div>
              ))}
            </div>
          </div>

          {/* 복사 */}
          <button onClick={copyResult}
            className={`w-full py-2.5 rounded-xl border text-sm transition-all flex items-center justify-center gap-2 ${copied ? 'bg-brand-500/20 border-brand-500/40 text-brand-400' : 'border-surface-border text-slate-300 hover:border-brand-500/40 hover:text-brand-300 bg-[#1a1d27]'}`}>
            {copied ? <CheckCheck size={14} /> : <Copy size={14} />}
            {copied ? '복사됨!' : '결과 복사'}
          </button>
        </>
      )}

      <ToolFooter
        toolName="나이 계산기"
        toolUrl="https://keyword-mixer.vercel.app/age-calculator"
        description="만 나이·한국 나이·태어난 날수 즉시 계산. 띠·다음 생일 D-day·기념일까지 한번에."
        howToUse={[
          { step: '생년월일 입력', desc: '날짜 입력창에 생년월일을 입력하거나 선택하세요.' },
          { step: '만 나이 확인', desc: '만 나이와 한국 나이를 동시에 확인할 수 있습니다.' },
          { step: '추가 정보 확인', desc: '태어난 요일, 띠, 총 일수/시간/초 등 다양한 정보를 확인하세요.' },
          { step: '결과 복사', desc: '결과 복사 버튼으로 모든 정보를 클립보드에 복사하세요.' },
        ]}
        whyUse={[
          { title: '만 나이 법 시행', desc: '2023년부터 공식 만 나이를 사용합니다. 정확한 만 나이를 즉시 계산하세요.' },
          { title: '한국 나이 동시 확인', desc: '관습적으로 사용하는 한국 나이와 만 나이를 한번에 비교할 수 있습니다.' },
          { title: '생일 D-day', desc: '다음 생일까지 몇 일 남았는지 실시간으로 확인할 수 있습니다.' },
          { title: '기념일 안내', desc: '100일, 1000일 등 태어난 날 기준 기념일을 자동으로 계산해드립니다.' },
        ]}
        faqs={[
          { q: '만 나이와 한국 나이 차이가 뭔가요?', a: '만 나이는 생일이 지난 후 1살이 증가하는 국제 표준 나이입니다. 한국 나이(세는 나이)는 태어난 해를 1살로 시작해 매년 1월 1일에 1살씩 추가됩니다.' },
          { q: '2023년 만 나이 통일법이란?', a: '2023년 6월부터 법적·사회적으로 만 나이를 공식 나이로 사용하게 되었습니다. 의료·행정 서류에서는 만 나이를 사용하세요.' },
          { q: '띠는 어떻게 계산되나요?', a: '띠는 태어난 해의 12간지로 결정됩니다. 단, 음력 설(구정) 이전 출생자는 전년도 띠로 계산되는 경우도 있습니다.' },
          { q: '태어난 날수는 어떻게 계산되나요?', a: '오늘 날짜에서 생년월일을 빼서 총 경과일수를 계산합니다. 윤년도 자동으로 반영됩니다.' },
        ]}
        keywords="나이 계산기 · 만 나이 계산기 · 한국 나이 계산 · 내 나이 계산 · 생일 계산기 · 띠 계산기 · 태어난 날수 · 만나이 통일 · age calculator · birthday calculator · how old am I · Korean age calculator"
      />
    </div>
  )
}
