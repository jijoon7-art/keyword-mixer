'use client'
import { useState } from 'react'
import { Copy, CheckCheck, Plus, Trash2 } from 'lucide-react'
import { useLang } from './LangContext'
import ToolFooter from './ToolFooter'

const T = {
  ko: { title: '혈압 기록/분석기', desc: '혈압을 기록하고 평균·트렌드를 분석. WHO 기준으로 혈압 상태를 즉시 판정.' },
  en: { title: 'Blood Pressure Tracker', desc: 'Track blood pressure records and analyze averages and trends. WHO-standard blood pressure classification.' }
}

interface BPRecord { systolic: number; diastolic: number; pulse: number; date: string; note: string }

function getBPCategory(sys: number, dia: number, lang: string): { label: string; color: string; desc: string; bg: string } {
  if (sys < 120 && dia < 80) return { label: lang === 'ko' ? '정상' : 'Normal', color: 'text-brand-400', desc: lang === 'ko' ? '이상적인 혈압입니다' : 'Ideal blood pressure', bg: 'bg-brand-500/10 border-brand-500/30' }
  if (sys < 130 && dia < 80) return { label: lang === 'ko' ? '주의 혈압' : 'Elevated', color: 'text-yellow-400', desc: lang === 'ko' ? '정상보다 약간 높음' : 'Slightly above normal', bg: 'bg-yellow-500/10 border-yellow-500/30' }
  if (sys < 140 || dia < 90) return { label: lang === 'ko' ? '고혈압 1단계' : 'High BP Stage 1', color: 'text-orange-400', desc: lang === 'ko' ? '생활습관 개선 필요' : 'Lifestyle changes needed', bg: 'bg-orange-500/10 border-orange-500/30' }
  if (sys < 180 || dia < 120) return { label: lang === 'ko' ? '고혈압 2단계' : 'High BP Stage 2', color: 'text-red-400', desc: lang === 'ko' ? '의사 상담 필요' : 'Medical consultation needed', bg: 'bg-red-500/10 border-red-500/30' }
  return { label: lang === 'ko' ? '고혈압 위기' : 'Hypertensive Crisis', color: 'text-red-600', desc: lang === 'ko' ? '즉시 의료 처치 필요' : 'Immediate medical attention', bg: 'bg-red-600/10 border-red-600/30' }
}

export default function BloodPressureTracker() {
  const { lang } = useLang()
  const tx = T[lang]
  const [records, setRecords] = useState<BPRecord[]>([
    { systolic: 118, diastolic: 76, pulse: 72, date: new Date().toISOString().split('T')[0], note: '' }
  ])
  const [form, setForm] = useState({ systolic: 120, diastolic: 80, pulse: 72, date: new Date().toISOString().split('T')[0], note: '' })
  const [copied, setCopied] = useState(false)

  const add = () => {
    setRecords(prev => [{ ...form }, ...prev])
    setForm(p => ({ ...p, note: '' }))
  }

  const remove = (i: number) => setRecords(prev => prev.filter((_, j) => j !== i))

  const avg = records.length ? {
    sys: Math.round(records.reduce((s, r) => s + r.systolic, 0) / records.length),
    dia: Math.round(records.reduce((s, r) => s + r.diastolic, 0) / records.length),
    pulse: Math.round(records.reduce((s, r) => s + r.pulse, 0) / records.length),
  } : null

  const avgCat = avg ? getBPCategory(avg.sys, avg.dia, lang) : null
  const currentCat = getBPCategory(form.systolic, form.diastolic, lang)

  const copyAll = async () => {
    const text = records.map(r => `${r.date}\t${r.systolic}/${r.diastolic}\t${r.pulse}\t${r.note}`).join('\n')
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

      <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-5 mb-5">
        <p className="text-xs text-slate-400 mb-3 font-medium">{lang === 'ko' ? '혈압 입력' : 'Enter Blood Pressure'}</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
          {[
            { label: lang === 'ko' ? '수축기 (mmHg)' : 'Systolic', key: 'systolic', val: form.systolic },
            { label: lang === 'ko' ? '이완기 (mmHg)' : 'Diastolic', key: 'diastolic', val: form.diastolic },
            { label: lang === 'ko' ? '맥박 (bpm)' : 'Pulse (bpm)', key: 'pulse', val: form.pulse },
          ].map(f => (
            <div key={f.key}>
              <label className="text-xs text-slate-500 mb-1 block">{f.label}</label>
              <input type="number" value={f.val} onChange={e => setForm(p => ({ ...p, [f.key]: +e.target.value }))}
                className="w-full bg-[#0f1117] border border-surface-border rounded-lg px-3 py-2 text-slate-200 text-lg font-mono text-center focus:outline-none focus:border-brand-500/50 transition-all" />
            </div>
          ))}
          <div>
            <label className="text-xs text-slate-500 mb-1 block">{lang === 'ko' ? '날짜' : 'Date'}</label>
            <input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
              className="w-full bg-[#0f1117] border border-surface-border rounded-lg px-2 py-2 text-slate-200 text-xs focus:outline-none focus:border-brand-500/50 transition-all" />
          </div>
        </div>

        {/* 실시간 판정 */}
        <div className={`rounded-lg border p-3 mb-3 flex items-center justify-between ${currentCat.bg}`}>
          <div>
            <p className={`text-sm font-bold ${currentCat.color}`}>{form.systolic}/{form.diastolic} mmHg — {currentCat.label}</p>
            <p className="text-xs text-slate-400">{currentCat.desc}</p>
          </div>
          <p className="text-xs text-slate-400">{form.pulse} bpm</p>
        </div>

        <div className="flex gap-2">
          <input value={form.note} onChange={e => setForm(p => ({ ...p, note: e.target.value }))}
            placeholder={lang === 'ko' ? '메모 (선택)...' : 'Note (optional)...'}
            className="flex-1 bg-[#0f1117] border border-surface-border rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-brand-500/50 transition-all" />
          <button onClick={add} className="px-5 py-2 rounded-lg bg-brand-500 hover:bg-brand-400 text-white font-bold text-sm transition-all flex items-center gap-1.5">
            <Plus size={14} /> {lang === 'ko' ? '기록' : 'Add'}
          </button>
        </div>
      </div>

      {/* 평균 */}
      {avg && avgCat && (
        <div className={`rounded-xl border p-4 mb-5 ${avgCat.bg}`}>
          <p className="text-xs text-slate-400 mb-1">{lang === 'ko' ? `평균 혈압 (${records.length}회 기록)` : `Average BP (${records.length} records)`}</p>
          <p className={`text-2xl font-bold font-mono ${avgCat.color}`}>{avg.sys}/{avg.dia} mmHg</p>
          <p className={`text-sm font-semibold ${avgCat.color}`}>{avgCat.label} — {avgCat.desc}</p>
        </div>
      )}

      {/* 기록 목록 */}
      <div className="rounded-xl border border-surface-border bg-[#1a1d27] overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-surface-border">
          <p className="text-sm font-semibold text-slate-200">{lang === 'ko' ? '기록 목록' : 'Records'} ({records.length})</p>
          <button onClick={copyAll} className={`text-xs px-3 py-1.5 rounded-lg border flex items-center gap-1 transition-all ${copied ? 'bg-brand-500/20 border-brand-500/40 text-brand-400' : 'border-surface-border text-slate-300 hover:border-brand-500/40'}`}>
            {copied ? <CheckCheck size={12} /> : <Copy size={12} />} {lang === 'ko' ? '전체 복사' : 'Copy All'}
          </button>
        </div>
        <div className="divide-y divide-surface-border max-h-80 overflow-y-auto">
          {records.map((r, i) => {
            const cat = getBPCategory(r.systolic, r.diastolic, lang)
            return (
              <div key={i} className="flex items-center gap-3 px-4 py-3 hover:bg-surface-hover/10 transition-all">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`text-sm font-bold font-mono ${cat.color}`}>{r.systolic}/{r.diastolic}</span>
                    <span className="text-xs text-slate-500">{r.pulse}bpm</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded ${cat.bg} ${cat.color}`}>{cat.label}</span>
                  </div>
                  <p className="text-xs text-slate-500">{r.date} {r.note && `· ${r.note}`}</p>
                </div>
                <button onClick={() => remove(i)} className="p-1.5 rounded border border-surface-border text-slate-600 hover:text-red-400 hover:border-red-500/40 transition-all">
                  <Trash2 size={12} />
                </button>
              </div>
            )
          })}
        </div>
      </div>

      <p className="text-xs text-slate-600 mt-3 text-center">
        {lang === 'ko' ? '* 이 도구는 참고용입니다. 고혈압 진단 및 치료는 반드시 의사와 상담하세요.' : '* For reference only. Always consult a doctor for hypertension diagnosis and treatment.'}
      </p>

      <ToolFooter
        toolName={lang === 'ko' ? '혈압 기록/분석기' : 'Blood Pressure Tracker'}
        toolUrl="https://keyword-mixer.vercel.app/blood-pressure-tracker"
        description={tx.desc}
        howToUse={lang === 'ko' ? [
          { step: '혈압 입력', desc: '수축기·이완기 혈압과 맥박을 입력하세요.' },
          { step: '날짜와 메모', desc: '측정일과 메모를 입력하면 기록 관리에 유용합니다.' },
          { step: '판정 확인', desc: 'WHO 기준으로 혈압 상태가 즉시 표시됩니다.' },
          { step: '기록 관리', desc: '여러 번 측정한 기록을 저장하고 평균을 확인하세요.' },
        ] : [
          { step: 'Enter blood pressure', desc: 'Input systolic, diastolic, and pulse values.' },
          { step: 'Date and note', desc: 'Add measurement date and optional note for tracking.' },
          { step: 'Check classification', desc: 'Instant WHO-standard blood pressure classification.' },
          { step: 'Manage records', desc: 'Save multiple measurements and view averages.' },
        ]}
        whyUse={lang === 'ko' ? [
          { title: 'WHO 기준 즉시 판정', desc: '입력 즉시 정상·주의·고혈압 1/2단계·위기 단계로 분류합니다.' },
          { title: '평균 혈압 계산', desc: '여러 번 측정한 기록의 평균을 자동으로 계산합니다.' },
          { title: '일별 기록 관리', desc: '날짜별 혈압 기록을 저장하고 관리할 수 있습니다.' },
          { title: '전체 기록 내보내기', desc: '모든 기록을 탭 구분 형식으로 복사해 엑셀에 붙여넣을 수 있습니다.' },
        ] : [
          { title: 'Instant WHO classification', desc: 'Immediately classifies into normal, elevated, Stage 1/2, or crisis.' },
          { title: 'Average BP calculation', desc: 'Automatically calculates average from multiple measurements.' },
          { title: 'Daily record management', desc: 'Store and manage blood pressure records by date.' },
          { title: 'Export all records', desc: 'Copy all records as tab-delimited text for Excel.' },
        ]}
        faqs={lang === 'ko' ? [
          { q: '정상 혈압 기준은?', a: 'WHO 기준 수축기 120mmHg 미만, 이완기 80mmHg 미만이 정상입니다. 한국 기준도 동일합니다.' },
          { q: '혈압은 언제 측정하는 게 좋나요?', a: '아침 기상 후 1시간 이내(화장실 다녀온 후, 식전, 약 복용 전), 저녁 취침 전 측정이 권장됩니다.' },
          { q: '백의 고혈압이란?', a: '병원에서만 혈압이 높게 나오는 현상입니다. 가정 혈압이 더 정확하므로 이 도구처럼 집에서 측정하는 것을 권장합니다.' },
          { q: '혈압과 맥압이란?', a: '맥압은 수축기-이완기 혈압의 차이입니다. 정상은 40mmHg 전후이며, 60 이상이면 동맥경화 위험이 높습니다.' },
        ] : [
          { q: 'What is normal blood pressure?', a: 'Per WHO: systolic below 120mmHg and diastolic below 80mmHg is normal.' },
          { q: 'When should I measure blood pressure?', a: 'Recommended: within 1 hour of waking (after restroom, before eating, before medication) and before bedtime.' },
          { q: 'What is white coat hypertension?', a: 'Higher BP readings only in clinical settings. Home monitoring (like this tool) is more accurate.' },
          { q: 'What is pulse pressure?', a: 'Difference between systolic and diastolic. Normal is around 40mmHg. Above 60 may indicate arteriosclerosis risk.' },
        ]}
        keywords="혈압 기록 · 혈압 계산기 · 혈압 체크 · 고혈압 기준 · 혈압 정상 범위 · 혈압 측정 · blood pressure tracker · blood pressure checker · hypertension · normal blood pressure · BP monitor · 가정 혈압"
      />
    </div>
  )
}
