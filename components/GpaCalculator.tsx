'use client'
import { useState } from 'react'
import { Copy, CheckCheck, Plus, Trash2 } from 'lucide-react'
import { useLang } from './LangContext'
import ToolFooter from './ToolFooter'

const T = {
  ko: {
    title: '학점 계산기 (GPA)',
    desc: '대학교 성적 학점(GPA)을 자동 계산. 4.5점·4.3점·4.0점 만점 지원. 목표 학점 달성을 위한 시뮬레이션 제공.',
    subject: '과목명', grade: '성적', credits: '학점',
    addSubject: '과목 추가', gpa: '평균 학점 (GPA)',
    totalCredits: '총 이수학점', gradeScale: '성적 체계',
    simulate: '목표 GPA 시뮬레이터',
  },
  en: {
    title: 'GPA Calculator',
    desc: 'Automatically calculate university GPA. Supports 4.5, 4.3, and 4.0 scales. Includes target GPA simulator.',
    subject: 'Subject', grade: 'Grade', credits: 'Credits',
    addSubject: 'Add Subject', gpa: 'GPA',
    totalCredits: 'Total Credits', gradeScale: 'Grade Scale',
    simulate: 'Target GPA Simulator',
  }
}

const GRADE_SCALES = {
  '4.5': [
    { label: 'A+', value: 4.5 }, { label: 'A0', value: 4.0 },
    { label: 'B+', value: 3.5 }, { label: 'B0', value: 3.0 },
    { label: 'C+', value: 2.5 }, { label: 'C0', value: 2.0 },
    { label: 'D+', value: 1.5 }, { label: 'D0', value: 1.0 },
    { label: 'F', value: 0.0 },
  ],
  '4.3': [
    { label: 'A+', value: 4.3 }, { label: 'A', value: 4.0 },
    { label: 'A-', value: 3.7 }, { label: 'B+', value: 3.3 },
    { label: 'B', value: 3.0 }, { label: 'B-', value: 2.7 },
    { label: 'C+', value: 2.3 }, { label: 'C', value: 2.0 },
    { label: 'C-', value: 1.7 }, { label: 'D+', value: 1.3 },
    { label: 'D', value: 1.0 }, { label: 'F', value: 0.0 },
  ],
  '4.0': [
    { label: 'A', value: 4.0 }, { label: 'B', value: 3.0 },
    { label: 'C', value: 2.0 }, { label: 'D', value: 1.0 },
    { label: 'F', value: 0.0 },
  ],
}

interface Subject { id: number; name: string; grade: string; credits: number }

function getGpaColor(gpa: number, max: number): string {
  const ratio = gpa / max
  if (ratio >= 0.9) return 'text-brand-400'
  if (ratio >= 0.75) return 'text-blue-400'
  if (ratio >= 0.6) return 'text-yellow-400'
  return 'text-red-400'
}

function getGpaLabel(gpa: number, max: number, lang: string): string {
  const ratio = gpa / max
  if (ratio >= 0.9) return lang === 'ko' ? '최우수' : 'Excellent'
  if (ratio >= 0.75) return lang === 'ko' ? '우수' : 'Good'
  if (ratio >= 0.6) return lang === 'ko' ? '보통' : 'Average'
  return lang === 'ko' ? '노력 필요' : 'Needs Effort'
}

export default function GpaCalculator() {
  const { lang } = useLang()
  const tx = T[lang]
  const [scale, setScale] = useState<'4.5' | '4.3' | '4.0'>('4.5')
  const [subjects, setSubjects] = useState<Subject[]>([
    { id: 1, name: lang === 'ko' ? '전공필수1' : 'Major 1', grade: 'A+', credits: 3 },
    { id: 2, name: lang === 'ko' ? '전공선택1' : 'Elective 1', grade: 'B+', credits: 3 },
    { id: 3, name: lang === 'ko' ? '교양필수' : 'General Ed', grade: 'A0', credits: 2 },
    { id: 4, name: lang === 'ko' ? '전공필수2' : 'Major 2', grade: 'B0', credits: 3 },
  ])
  const [targetGpa, setTargetGpa] = useState(4.0)
  const [futureCredits, setFutureCredits] = useState(18)
  const [copied, setCopied] = useState<string | null>(null)

  const copy = async (t: string, k: string) => {
    await navigator.clipboard.writeText(t)
    setCopied(k)
    setTimeout(() => setCopied(null), 1500)
  }

  const grades = GRADE_SCALES[scale]
  const maxGpa = parseFloat(scale)

  const addSubject = () => setSubjects(p => [...p, {
    id: Date.now(),
    name: `${lang === 'ko' ? '과목' : 'Subject'} ${p.length + 1}`,
    grade: grades[0].label,
    credits: 3
  }])
  const removeSubject = (id: number) => setSubjects(p => p.filter(s => s.id !== id))
  const updateSubject = (id: number, k: keyof Subject, v: string | number) =>
    setSubjects(p => p.map(s => s.id === id ? { ...s, [k]: v } : s))

  // 현재 GPA 계산
  const validSubjects = subjects.filter(s => {
    const g = grades.find(g => g.label === s.grade)
    return g !== undefined
  })

  const totalPoints = validSubjects.reduce((sum, s) => {
    const g = grades.find(g => g.label === s.grade)
    return sum + (g ? g.value * s.credits : 0)
  }, 0)
  const totalCredits = validSubjects.reduce((sum, s) => sum + s.credits, 0)
  const currentGpa = totalCredits > 0 ? totalPoints / totalCredits : 0

  // 목표 GPA 시뮬레이션
  const neededPoints = targetGpa * (totalCredits + futureCredits) - totalPoints
  const neededGpa = futureCredits > 0 ? neededPoints / futureCredits : 0
  const isAchievable = neededGpa <= maxGpa && neededGpa >= 0

  // 학점 분포
  const gradeDistribution = grades.map(g => ({
    label: g.label,
    count: subjects.filter(s => s.grade === g.label).length,
    credits: subjects.filter(s => s.grade === g.label).reduce((sum, s) => sum + s.credits, 0),
  })).filter(g => g.count > 0)

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-mono mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />Free Tool
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-3">{tx.title}</h1>
        <p className="text-slate-300 text-base max-w-xl mx-auto">{tx.desc}</p>
      </div>

      {/* 성적 체계 선택 */}
      <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4 mb-5">
        <label className="text-xs text-slate-400 mb-2 block font-medium">{tx.gradeScale}</label>
        <div className="flex gap-2">
          {(['4.5', '4.3', '4.0'] as const).map(s => (
            <button key={s} onClick={() => setScale(s)}
              className={`flex-1 py-2.5 rounded-xl border text-sm font-bold transition-all ${scale === s ? 'bg-brand-500 border-brand-500 text-white' : 'border-surface-border text-slate-300 bg-[#0f1117]'}`}>
              {s}{lang === 'ko' ? '점 만점' : ' Scale'}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5 mt-3">
          {grades.map(g => (
            <span key={g.label} className="text-xs px-2 py-1 rounded border border-surface-border bg-[#0f1117] text-slate-400">
              {g.label} = {g.value}
            </span>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        {/* 과목 입력 */}
        <div className="md:col-span-2">
          <div className="rounded-xl border border-surface-border bg-[#1a1d27] overflow-hidden mb-4">
            <div className="grid grid-cols-12 gap-0 px-4 py-2 bg-[#0f1117] border-b border-surface-border text-xs text-slate-500 font-medium">
              <span className="col-span-5">{tx.subject}</span>
              <span className="col-span-3 text-center">{tx.grade}</span>
              <span className="col-span-2 text-center">{tx.credits}</span>
              <span className="col-span-2 text-center">GP</span>
            </div>
            {subjects.map(sub => {
              const g = grades.find(g => g.label === sub.grade)
              const gp = g ? (g.value * sub.credits).toFixed(1) : '—'
              return (
                <div key={sub.id} className="grid grid-cols-12 gap-0 px-3 py-2 border-b border-surface-border hover:bg-surface-hover/5 items-center">
                  <div className="col-span-5 pr-2">
                    <input value={sub.name} onChange={e => updateSubject(sub.id, 'name', e.target.value)}
                      className="w-full bg-transparent text-xs text-slate-200 focus:outline-none" />
                  </div>
                  <div className="col-span-3 px-1">
                    <select value={sub.grade} onChange={e => updateSubject(sub.id, 'grade', e.target.value)}
                      className="w-full bg-[#0f1117] border border-surface-border rounded px-1 py-1.5 text-slate-200 text-xs focus:outline-none focus:border-brand-500/50 transition-all">
                      {grades.map(g => <option key={g.label} value={g.label}>{g.label}</option>)}
                    </select>
                  </div>
                  <div className="col-span-2 px-1">
                    <input type="number" min={1} max={6} value={sub.credits} onChange={e => updateSubject(sub.id, 'credits', +e.target.value)}
                      className="w-full bg-[#0f1117] border border-surface-border rounded px-1 py-1.5 text-slate-200 text-xs font-mono text-center focus:outline-none focus:border-brand-500/50 transition-all" />
                  </div>
                  <div className="col-span-1 text-center text-xs font-mono text-brand-400">{gp}</div>
                  <div className="col-span-1 flex justify-center">
                    <button onClick={() => removeSubject(sub.id)} className="text-slate-600 hover:text-red-400 transition-all">
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              )
            })}
            <button onClick={addSubject} className="w-full py-2 text-xs text-brand-400 hover:text-brand-300 flex items-center justify-center gap-1 transition-all">
              <Plus size={12} /> {tx.addSubject}
            </button>
          </div>

          {/* 목표 GPA 시뮬레이터 */}
          <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4">
            <p className="text-xs text-slate-400 font-medium mb-3">🎯 {tx.simulate}</p>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">{lang === 'ko' ? '목표 GPA' : 'Target GPA'}</label>
                <input type="number" min={0} max={maxGpa} step={0.1} value={targetGpa} onChange={e => setTargetGpa(+e.target.value)}
                  className="w-full bg-[#0f1117] border border-surface-border rounded-lg px-3 py-2 text-slate-200 text-sm font-mono focus:outline-none focus:border-brand-500/50 transition-all" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">{lang === 'ko' ? '앞으로 이수할 학점' : 'Future Credits'}</label>
                <input type="number" min={1} max={200} value={futureCredits} onChange={e => setFutureCredits(+e.target.value)}
                  className="w-full bg-[#0f1117] border border-surface-border rounded-lg px-3 py-2 text-slate-200 text-sm font-mono focus:outline-none focus:border-brand-500/50 transition-all" />
              </div>
            </div>
            <div className={`rounded-lg border p-3 ${isAchievable ? 'border-brand-500/30 bg-brand-500/10' : 'border-red-500/30 bg-red-500/10'}`}>
              {isAchievable ? (
                <p className={`text-sm ${neededGpa <= currentGpa ? 'text-brand-400' : 'text-yellow-400'}`}>
                  {lang === 'ko'
                    ? `목표 달성을 위해 앞으로 평균 ${neededGpa.toFixed(2)} GPA 이상 필요`
                    : `Need avg GPA of ${neededGpa.toFixed(2)} in future ${futureCredits} credits`}
                </p>
              ) : (
                <p className="text-sm text-red-400">
                  {lang === 'ko' ? '현재 이수 학점으로는 목표 GPA 달성이 불가능합니다' : 'Target GPA is not achievable with current credits'}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* 결과 패널 */}
        <div className="flex flex-col gap-3">
          <div className={`rounded-xl border p-5 text-center`} style={{ borderColor: 'rgba(34,197,94,0.3)', background: 'rgba(34,197,94,0.05)' }}>
            <p className="text-xs text-slate-400 mb-1">{tx.gpa}</p>
            <p className={`text-5xl font-extrabold font-mono ${getGpaColor(currentGpa, maxGpa)}`}>
              {currentGpa.toFixed(2)}
            </p>
            <p className="text-xs text-slate-500 mt-1">/ {maxGpa}</p>
            <p className={`text-sm font-bold mt-1 ${getGpaColor(currentGpa, maxGpa)}`}>
              {getGpaLabel(currentGpa, maxGpa, lang)}
            </p>
            <button onClick={() => copy(currentGpa.toFixed(2), 'gpa')}
              className={`mt-3 p-2 rounded-lg border transition-all ${copied === 'gpa' ? 'bg-brand-500/20 border-brand-500/40 text-brand-400' : 'border-surface-border text-slate-500 hover:text-brand-400'}`}>
              {copied === 'gpa' ? <CheckCheck size={14} /> : <Copy size={14} />}
            </button>
          </div>

          <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4">
            <div className="flex justify-between text-xs py-1.5 border-b border-surface-border">
              <span className="text-slate-400">{tx.totalCredits}</span>
              <span className="text-slate-200 font-bold">{totalCredits}{lang === 'ko' ? '학점' : ' cr'}</span>
            </div>
            <div className="flex justify-between text-xs py-1.5 border-b border-surface-border">
              <span className="text-slate-400">{lang === 'ko' ? '과목 수' : 'Subjects'}</span>
              <span className="text-slate-200 font-bold">{subjects.length}{lang === 'ko' ? '개' : ''}</span>
            </div>
            <div className="flex justify-between text-xs py-1.5">
              <span className="text-slate-400">{lang === 'ko' ? '총 포인트' : 'Total Points'}</span>
              <span className="text-slate-200 font-bold">{totalPoints.toFixed(1)}</span>
            </div>
          </div>

          {/* 학점 분포 */}
          {gradeDistribution.length > 0 && (
            <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4">
              <p className="text-xs text-slate-400 font-medium mb-2">{lang === 'ko' ? '성적 분포' : 'Grade Distribution'}</p>
              {gradeDistribution.map(g => (
                <div key={g.label} className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs font-mono text-slate-300 w-6">{g.label}</span>
                  <div className="flex-1 h-2 bg-surface-border rounded-full overflow-hidden">
                    <div className="h-full bg-brand-500/60 rounded-full" style={{ width: `${(g.credits / totalCredits) * 100}%` }} />
                  </div>
                  <span className="text-xs text-slate-500">{g.credits}{lang === 'ko' ? '학점' : 'cr'}</span>
                </div>
              ))}
            </div>
          )}

          {/* 장학금 기준 */}
          <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4">
            <p className="text-xs text-slate-400 font-medium mb-2">{lang === 'ko' ? '📚 장학금 기준 (일반)' : '📚 Scholarship Criteria'}</p>
            {[
              { label: lang === 'ko' ? '최우등 장학' : 'Honor Scholarship', gpa: maxGpa * 0.95, color: 'text-brand-400' },
              { label: lang === 'ko' ? '성적 우수 장학' : 'Merit Scholarship', gpa: maxGpa * 0.84, color: 'text-blue-400' },
              { label: lang === 'ko' ? '성적 장학 기준' : 'GPA Threshold', gpa: maxGpa * 0.75, color: 'text-yellow-400' },
            ].map(s => (
              <div key={s.label} className="flex justify-between text-xs py-1 border-b border-surface-border last:border-0">
                <span className="text-slate-400">{s.label}</span>
                <span className={`font-mono font-bold ${currentGpa >= s.gpa ? s.color : 'text-slate-600'}`}>
                  {s.gpa.toFixed(2)}+ {currentGpa >= s.gpa ? '✓' : ''}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ToolFooter
        toolName={lang === 'ko' ? '학점 계산기 (GPA)' : 'GPA Calculator'}
        toolUrl="https://keyword-mixer.vercel.app/gpa-calculator"
        description={tx.desc}
        howToUse={lang === 'ko' ? [
          { step: '성적 체계 선택', desc: '본인 학교의 만점 기준(4.5/4.3/4.0)을 선택하세요.' },
          { step: '과목 입력', desc: '과목명, 성적, 학점을 입력하세요. + 버튼으로 과목을 추가합니다.' },
          { step: 'GPA 확인', desc: '입력 즉시 가중 평균 학점(GPA)이 계산됩니다.' },
          { step: '목표 시뮬레이션', desc: '목표 GPA와 앞으로 이수할 학점을 입력해 필요 성적을 확인하세요.' },
        ] : [
          { step: 'Select grade scale', desc: 'Choose your school\'s scale (4.5/4.3/4.0).' },
          { step: 'Enter subjects', desc: 'Input subject name, grade, and credits. Add more with + button.' },
          { step: 'View GPA', desc: 'Weighted GPA calculates instantly as you type.' },
          { step: 'Target simulation', desc: 'Enter target GPA and future credits to see required grade.' },
        ]}
        whyUse={lang === 'ko' ? [
          { title: '3가지 성적 체계', desc: '4.5점, 4.3점, 4.0점 만점 체계를 모두 지원합니다.' },
          { title: '목표 GPA 시뮬레이터', desc: '앞으로 이수할 학점에서 몇 점을 받아야 목표 달성인지 계산합니다.' },
          { title: '장학금 기준 비교', desc: '현재 GPA가 일반적인 장학금 기준에 해당하는지 확인합니다.' },
          { title: '성적 분포 시각화', desc: '이수한 과목의 성적 분포를 바 차트로 확인합니다.' },
        ] : [
          { title: '3 grade scales', desc: 'Supports 4.5, 4.3, and 4.0 GPA scales.' },
          { title: 'Target GPA simulator', desc: 'Calculates required grade in future courses to hit target GPA.' },
          { title: 'Scholarship benchmarks', desc: 'See if your GPA meets typical scholarship requirements.' },
          { title: 'Grade distribution chart', desc: 'Visual bar chart of your grade distribution.' },
        ]}
        faqs={lang === 'ko' ? [
          { q: 'GPA(학점)란?', a: 'Grade Point Average의 약자로 성적의 가중 평균입니다. 각 과목의 (학점 수 × 점수)를 합산한 후 총 학점 수로 나누어 계산합니다.' },
          { q: '4.5점과 4.3점 체계 차이는?', a: '4.5점 체계는 A+가 4.5점, A0이 4.0점입니다. 4.3점 체계는 A+가 4.3점으로 시작해 A-, B+ 등 세분화됩니다. 학교마다 다르므로 학생 포털에서 확인하세요.' },
          { q: '학점 계산에 F 과목은 포함되나요?', a: 'F 과목은 학점 포인트가 0이지만 이수 학점 수에는 포함됩니다. F 과목이 있으면 GPA를 크게 낮출 수 있습니다.' },
          { q: '졸업 최소 학점 기준은?', a: '대부분의 4년제 대학은 졸업 최소 학점 기준이 없거나 1.5~2.0 이상입니다. 장학금이나 대학원 진학은 보통 3.0 이상을 요구합니다.' },
        ] : [
          { q: 'What is GPA?', a: 'Grade Point Average. Calculated by summing (credits × grade points) for all courses then dividing by total credits.' },
          { q: '4.5 vs 4.3 scale difference?', a: '4.5 scale: A+=4.5, A=4.0. 4.3 scale: A+=4.3, A=4.0, A-=3.7 with finer gradations. Check your student portal for your school\'s scale.' },
          { q: 'Does F affect GPA?', a: 'F earns 0 grade points but counts toward total credits. F grades significantly lower your GPA.' },
          { q: 'Minimum GPA for graduation?', a: 'Most universities require 1.5-2.0+ for graduation. Scholarships and grad school typically require 3.0+.' },
        ]}
        keywords="학점 계산기 · GPA 계산기 · 대학 학점 · 성적 계산기 · 학점 평균 · 장학금 학점 기준 · GPA calculator · grade calculator · university GPA · cumulative GPA · 4.5 학점"
      />
    </div>
  )
}
