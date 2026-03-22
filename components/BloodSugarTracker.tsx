'use client'
import { useState } from 'react'
import { Copy, CheckCheck, Plus, Trash2 } from 'lucide-react'
import { useLang } from './LangContext'
import ToolFooter from './ToolFooter'

const T = {
  ko: { title: '혈당 기록/분석기', desc: '혈당 수치를 기록하고 평균과 트렌드를 분석. 공복혈당·식후혈당 기준으로 당뇨 위험도 판정.' },
  en: { title: 'Blood Sugar Tracker', desc: 'Record and analyze blood glucose levels. Diabetes risk assessment based on fasting and post-meal standards.' }
}

interface BSRecord { value: number; timing: string; date: string; note: string }

function getBSCategory(val: number, timing: string, lang: string): { label: string; color: string; bg: string } {
  if (timing === 'fasting') {
    if (val < 70) return { label: lang === 'ko' ? '저혈당' : 'Hypoglycemia', color: 'text-blue-400', bg: 'border-blue-500/30 bg-blue-500/10' }
    if (val < 100) return { label: lang === 'ko' ? '정상' : 'Normal', color: 'text-brand-400', bg: 'border-brand-500/30 bg-brand-500/10' }
    if (val < 126) return { label: lang === 'ko' ? '당뇨 전단계' : 'Pre-diabetes', color: 'text-yellow-400', bg: 'border-yellow-500/30 bg-yellow-500/10' }
    return { label: lang === 'ko' ? '당뇨 의심' : 'Diabetes Risk', color: 'text-red-400', bg: 'border-red-500/30 bg-red-500/10' }
  } else {
    if (val < 140) return { label: lang === 'ko' ? '정상' : 'Normal', color: 'text-brand-400', bg: 'border-brand-500/30 bg-brand-500/10' }
    if (val < 200) return { label: lang === 'ko' ? '주의' : 'Caution', color: 'text-yellow-400', bg: 'border-yellow-500/30 bg-yellow-500/10' }
    return { label: lang === 'ko' ? '당뇨 의심' : 'Diabetes Risk', color: 'text-red-400', bg: 'border-red-500/30 bg-red-500/10' }
  }
}

export default function BloodSugarTracker() {
  const { lang } = useLang()
  const tx = T[lang]
  const [records, setRecords] = useState<BSRecord[]>([
    { value: 95, timing: 'fasting', date: new Date().toISOString().slice(0,10), note: '' }
  ])
  const [form, setForm] = useState({ value: 95, timing: 'fasting', date: new Date().toISOString().slice(0,10), note: '' })
  const [copied, setCopied] = useState(false)

  const TIMINGS = [
    ['fasting', lang === 'ko' ? '공복' : 'Fasting'],
    ['before_meal', lang === 'ko' ? '식전' : 'Before Meal'],
    ['after_meal', lang === 'ko' ? '식후 2시간' : '2hr Post-meal'],
    ['bedtime', lang === 'ko' ? '취침 전' : 'Bedtime'],
  ]

  const add = () => { setRecords(p => [{ ...form }, ...p]) }
  const remove = (i: number) => setRecords(p => p.filter((_, j) => j !== i))

  const avgVal = records.length ? Math.round(records.reduce((s, r) => s + r.value, 0) / records.length) : 0
  const cat = records.length ? getBSCategory(avgVal, 'fasting', lang) : null

  const copyAll = async () => {
    const text = records.map(r => `${r.date}\t${r.value}mg/dL\t${r.timing}\t${r.note}`).join('\n')
    await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-mono mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />Free Health Tool
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-3">{tx.title}</h1>
        <p className="text-slate-300 text-base max-w-xl mx-auto">{tx.desc}</p>
      </div>

      <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4 mb-5">
        <p className="text-xs text-slate-400 font-medium mb-3">{lang === 'ko' ? '혈당 입력' : 'Enter Blood Sugar'}</p>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="text-xs text-slate-500 mb-1 block">{lang === 'ko' ? '혈당 (mg/dL)' : 'Blood Sugar (mg/dL)'}</label>
            <input type="number" value={form.value} onChange={e => setForm(p => ({...p, value: +e.target.value}))}
              className="w-full bg-[#0f1117] border border-surface-border rounded-lg px-3 py-2.5 text-slate-200 text-xl font-mono text-center focus:outline-none focus:border-brand-500/50 transition-all" />
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">{lang === 'ko' ? '날짜' : 'Date'}</label>
            <input type="date" value={form.date} onChange={e => setForm(p => ({...p, date: e.target.value}))}
              className="w-full bg-[#0f1117] border border-surface-border rounded-lg px-3 py-2 text-slate-200 text-sm focus:outline-none focus:border-brand-500/50 transition-all" />
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {TIMINGS.map(([v, l]) => (
            <button key={v} onClick={() => setForm(p => ({...p, timing: v}))}
              className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${form.timing === v ? 'bg-brand-500 border-brand-500 text-white font-bold' : 'border-surface-border text-slate-300 bg-[#0f1117]'}`}>{l}</button>
          ))}
        </div>
        {form.value && (
          <div className={`rounded-lg border p-3 mb-3 ${getBSCategory(form.value, form.timing, lang).bg}`}>
            <p className={`text-sm font-bold ${getBSCategory(form.value, form.timing, lang).color}`}>
              {form.value} mg/dL — {getBSCategory(form.value, form.timing, lang).label}
            </p>
          </div>
        )}
        <div className="flex gap-2">
          <input value={form.note} onChange={e => setForm(p => ({...p, note: e.target.value}))} placeholder={lang === 'ko' ? '메모...' : 'Note...'}
            className="flex-1 bg-[#0f1117] border border-surface-border rounded-lg px-3 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-brand-500/50 transition-all" />
          <button onClick={add} className="px-5 py-2 rounded-lg bg-brand-500 hover:bg-brand-400 text-white font-bold text-sm transition-all flex items-center gap-1.5">
            <Plus size={14}/> {lang === 'ko' ? '기록' : 'Add'}
          </button>
        </div>
      </div>

      {avgVal > 0 && cat && (
        <div className={`rounded-xl border p-4 mb-5 flex items-center justify-between ${cat.bg}`}>
          <div>
            <p className="text-xs text-slate-400">{lang === 'ko' ? `평균 혈당 (${records.length}회)` : `Avg (${records.length} records)`}</p>
            <p className={`text-2xl font-bold font-mono ${cat.color}`}>{avgVal} mg/dL</p>
            <p className={`text-sm font-semibold ${cat.color}`}>{cat.label}</p>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-surface-border bg-[#1a1d27] overflow-hidden mb-4">
        <div className="flex items-center justify-between px-4 py-3 border-b border-surface-border">
          <p className="text-sm font-semibold text-slate-200">{lang === 'ko' ? '기록 목록' : 'Records'} ({records.length})</p>
          <button onClick={copyAll} className={`text-xs px-3 py-1.5 rounded-lg border flex items-center gap-1 transition-all ${copied ? 'bg-brand-500/20 border-brand-500/40 text-brand-400' : 'border-surface-border text-slate-300 hover:border-brand-500/40'}`}>
            {copied ? <CheckCheck size={12}/> : <Copy size={12}/>} {lang === 'ko' ? '전체 복사' : 'Copy All'}
          </button>
        </div>
        <div className="divide-y divide-surface-border max-h-72 overflow-y-auto">
          {records.map((r, i) => {
            const c = getBSCategory(r.value, r.timing, lang)
            return (
              <div key={i} className="flex items-center gap-3 px-4 py-3 hover:bg-surface-hover/10">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-bold font-mono ${c.color}`}>{r.value} mg/dL</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded border ${c.bg} ${c.color}`}>{c.label}</span>
                  </div>
                  <p className="text-xs text-slate-500">{r.date} · {TIMINGS.find(([v]) => v === r.timing)?.[1]} {r.note && `· ${r.note}`}</p>
                </div>
                <button onClick={() => remove(i)} className="p-1.5 rounded border border-surface-border text-slate-600 hover:text-red-400 transition-all">
                  <Trash2 size={12}/>
                </button>
              </div>
            )
          })}
        </div>
      </div>

      <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4 text-xs">
        <p className="font-medium text-slate-200 mb-2">{lang === 'ko' ? '📊 혈당 기준표' : '📊 Blood Sugar Reference'}</p>
        <div className="grid grid-cols-2 gap-2">
          {[
            [lang === 'ko' ? '공복 정상' : 'Fasting Normal', '<100 mg/dL', 'text-brand-400'],
            [lang === 'ko' ? '공복 당뇨 전단계' : 'Fasting Pre-DM', '100~125 mg/dL', 'text-yellow-400'],
            [lang === 'ko' ? '식후 2시간 정상' : 'Post-meal Normal', '<140 mg/dL', 'text-brand-400'],
            [lang === 'ko' ? '식후 2시간 주의' : 'Post-meal Caution', '140~199 mg/dL', 'text-yellow-400'],
          ].map(([l, v, c]) => (
            <div key={l as string} className="rounded border border-surface-border bg-[#0f1117] p-2">
              <p className="text-slate-400">{l}</p>
              <p className={`font-mono font-bold ${c}`}>{v}</p>
            </div>
          ))}
        </div>
      </div>

      <ToolFooter
        toolName={lang === 'ko' ? '혈당 기록/분석기' : 'Blood Sugar Tracker'}
        toolUrl="https://keyword-mixer.vercel.app/blood-sugar-tracker"
        description={tx.desc}
        howToUse={lang === 'ko' ? [
          { step: '혈당 입력', desc: '혈당 수치와 측정 시점(공복/식전/식후)을 입력하세요.' },
          { step: '판정 확인', desc: '입력 즉시 정상/주의/당뇨 위험 여부를 확인할 수 있습니다.' },
          { step: '기록 관리', desc: '날짜와 메모를 함께 기록해 혈당 변화를 관리하세요.' },
          { step: '평균 분석', desc: '여러 기록의 평균 혈당을 자동으로 계산합니다.' },
        ] : [
          { step: 'Enter blood sugar', desc: 'Input value and measurement timing (fasting/meal/post-meal).' },
          { step: 'View assessment', desc: 'Instant classification as normal, caution, or diabetes risk.' },
          { step: 'Manage records', desc: 'Track changes with date and note entries.' },
          { step: 'View average', desc: 'Automatic average calculation from all records.' },
        ]}
        whyUse={lang === 'ko' ? [
          { title: 'WHO/ADA 기준 판정', desc: '공복·식후 혈당을 WHO/ADA 기준으로 즉시 분류합니다.' },
          { title: '4가지 측정 시점', desc: '공복·식전·식후·취침 전 4가지 시점을 지원합니다.' },
          { title: '평균 혈당 계산', desc: '여러 번의 기록을 평균내어 전반적인 혈당 관리 상태를 파악합니다.' },
          { title: '엑셀 내보내기', desc: '전체 기록을 탭 구분 형식으로 복사해 엑셀에서 활용하세요.' },
        ] : [
          { title: 'WHO/ADA standards', desc: 'Instant classification using WHO/ADA blood glucose standards.' },
          { title: '4 timing types', desc: 'Fasting, pre-meal, post-meal, and bedtime measurement support.' },
          { title: 'Average calculation', desc: 'Auto-calculates average from all records for trend analysis.' },
          { title: 'Export to Excel', desc: 'Copy all records as tab-delimited format for spreadsheet use.' },
        ]}
        faqs={lang === 'ko' ? [
          { q: '정상 공복혈당은?', a: '공복 8시간 후 측정 시 70~99 mg/dL가 정상입니다. 100~125는 당뇨 전단계, 126 이상이면 당뇨로 진단됩니다.' },
          { q: '혈당은 언제 측정하는 게 좋나요?', a: '공복혈당은 아침 식사 전, 식후혈당은 식사 시작 후 2시간에 측정합니다. 증상이 있을 때도 즉시 측정하세요.' },
          { q: '당화혈색소(HbA1c)란?', a: '최근 2~3개월간의 평균 혈당을 반영하는 수치입니다. 정상 5.7% 미만, 당뇨 전단계 5.7~6.4%, 당뇨 6.5% 이상입니다.' },
          { q: '이 도구로 당뇨를 진단할 수 있나요?', a: '아니요. 이 도구는 참고용이며 의학적 진단 도구가 아닙니다. 혈당 이상 시 반드시 의사와 상담하세요.' },
        ] : [
          { q: 'What is normal fasting blood sugar?', a: '70-99 mg/dL after 8 hours fasting. 100-125 is pre-diabetes, 126+ indicates diabetes.' },
          { q: 'When should I measure?', a: 'Fasting glucose: before breakfast. Post-meal: 2 hours after starting to eat. Also measure when symptomatic.' },
          { q: 'What is HbA1c?', a: 'Reflects average blood sugar over 2-3 months. Normal <5.7%, pre-diabetes 5.7-6.4%, diabetes ≥6.5%.' },
          { q: 'Can this tool diagnose diabetes?', a: 'No. This is for reference only. Consult a doctor if you have abnormal readings.' },
        ]}
        keywords="혈당 기록 · 혈당 계산기 · 공복혈당 · 식후혈당 · 당뇨 기준 · 혈당 체크 · blood sugar tracker · glucose monitor · blood glucose calculator · diabetes checker · fasting blood sugar normal"
      />
    </div>
  )
}
