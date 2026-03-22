'use client'
import { useState } from 'react'
import { Copy, CheckCheck } from 'lucide-react'
import { useLang } from './LangContext'
import ToolFooter from './ToolFooter'

const T = {
  ko: { title: '통계 계산기', desc: '평균·중앙값·최빈값·표준편차·분산을 즉시 계산. 성적 분포, 데이터 분석에 활용.' },
  en: { title: 'Statistics Calculator', desc: 'Calculate mean, median, mode, standard deviation, and variance instantly. Great for grade analysis and data analytics.' }
}

function calcStats(nums: number[]) {
  if (!nums.length) return null
  const n = nums.length
  const sorted = [...nums].sort((a, b) => a - b)
  const mean = nums.reduce((a, b) => a + b, 0) / n
  const median = n % 2 === 0 ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2 : sorted[Math.floor(n / 2)]
  const freq: Record<number, number> = {}
  nums.forEach(v => { freq[v] = (freq[v] ?? 0) + 1 })
  const maxFreq = Math.max(...Object.values(freq))
  const mode = maxFreq > 1 ? Object.keys(freq).filter(k => freq[Number(k)] === maxFreq).map(Number) : []
  const variance = nums.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / n
  const stdDev = Math.sqrt(variance)
  const sampleVariance = n > 1 ? nums.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / (n - 1) : 0
  const sampleStdDev = Math.sqrt(sampleVariance)
  const sum = nums.reduce((a, b) => a + b, 0)
  const min = sorted[0], max = sorted[n - 1]
  const range = max - min
  const q1 = sorted[Math.floor(n / 4)]
  const q3 = sorted[Math.floor(3 * n / 4)]
  const iqr = q3 - q1
  const cv = (stdDev / mean * 100)
  return { n, sum, mean, median, mode, variance, stdDev, sampleVariance, sampleStdDev, min, max, range, q1, q3, iqr, cv, sorted }
}

export default function StatisticsCalculator() {
  const { lang } = useLang()
  const tx = T[lang]
  const [input, setInput] = useState('85, 92, 78, 95, 88, 76, 91, 83, 89, 94')
  const [separator, setSeparator] = useState('comma')
  const [copied, setCopied] = useState<string | null>(null)

  const copy = async (text: string, key: string) => { await navigator.clipboard.writeText(text); setCopied(key); setTimeout(() => setCopied(null), 1500) }

  const sep = separator === 'comma' ? ',' : separator === 'space' ? ' ' : '\n'
  const nums = input.split(sep).map(s => parseFloat(s.trim())).filter(n => !isNaN(n))
  const s = calcStats(nums)

  const fmt = (n: number) => Number.isInteger(n) ? n.toString() : n.toFixed(4)

  const SAMPLES = [
    { label: lang === 'ko' ? '성적 샘플' : 'Grades sample', data: '85, 92, 78, 95, 88, 76, 91, 83, 89, 94' },
    { label: lang === 'ko' ? '판매량 샘플' : 'Sales sample', data: '120, 145, 98, 167, 134, 112, 189, 201, 156, 143' },
    { label: lang === 'ko' ? '주가 수익률' : 'Stock returns', data: '2.3, -1.5, 4.1, 0.8, -2.2, 3.5, 1.2, -0.9, 2.8, 1.7' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-mono mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />Free Tool
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-3">{tx.title}</h1>
        <p className="text-slate-300 text-base max-w-xl mx-auto">{tx.desc}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {/* 입력 */}
        <div className="flex flex-col gap-3">
          <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs text-slate-400 font-medium">{lang === 'ko' ? '데이터 입력' : 'Enter Data'}</label>
              <div className="flex gap-1.5">
                {[['comma', ','], ['space', '␣'], ['newline', '↵']].map(([v, l]) => (
                  <button key={v} onClick={() => setSeparator(v)}
                    className={`text-xs px-2 py-1 rounded border transition-all ${separator === v ? 'bg-brand-500 border-brand-500 text-white' : 'border-surface-border text-slate-400 bg-[#0f1117]'}`}>{l}</button>
                ))}
              </div>
            </div>
            <textarea value={input} onChange={e => setInput(e.target.value)}
              rows={8} placeholder={lang === 'ko' ? '숫자를 구분자로 입력하세요...' : 'Enter numbers with separator...'}
              className="w-full bg-[#0f1117] border border-surface-border rounded-lg px-3 py-2 text-sm text-slate-200 font-mono focus:outline-none focus:border-brand-500/50 transition-all resize-none" />
            <p className="text-xs text-slate-600 mt-1">{lang === 'ko' ? `${nums.length}개 데이터 인식됨` : `${nums.length} values detected`}</p>
          </div>
          <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-3">
            <p className="text-xs text-slate-400 mb-2 font-medium">{lang === 'ko' ? '샘플 데이터' : 'Sample Data'}</p>
            <div className="flex flex-col gap-1.5">
              {SAMPLES.map(s => (
                <button key={s.label} onClick={() => setInput(s.data)}
                  className="text-xs px-3 py-2 rounded-lg border border-surface-border text-slate-300 hover:border-brand-500/40 hover:text-brand-300 bg-[#0f1117] text-left transition-all">
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 결과 */}
        {s && (
          <div className="flex flex-col gap-2">
            {[
              { label: lang === 'ko' ? '데이터 개수 (n)' : 'Count (n)', val: s.n, key: 'n' },
              { label: lang === 'ko' ? '합계' : 'Sum', val: fmt(s.sum), key: 'sum' },
              { label: lang === 'ko' ? '평균 (Mean)' : 'Mean', val: fmt(s.mean), key: 'mean', highlight: true },
              { label: lang === 'ko' ? '중앙값 (Median)' : 'Median', val: fmt(s.median), key: 'med', highlight: true },
              { label: lang === 'ko' ? '최빈값 (Mode)' : 'Mode', val: s.mode.length ? s.mode.join(', ') : (lang === 'ko' ? '없음' : 'None'), key: 'mode' },
              { label: lang === 'ko' ? '최솟값' : 'Min', val: fmt(s.min), key: 'min' },
              { label: lang === 'ko' ? '최댓값' : 'Max', val: fmt(s.max), key: 'max' },
              { label: lang === 'ko' ? '범위 (Range)' : 'Range', val: fmt(s.range), key: 'range' },
              { label: lang === 'ko' ? '분산 (모)' : 'Variance (pop)', val: fmt(s.variance), key: 'var' },
              { label: lang === 'ko' ? '표준편차 (모)' : 'Std Dev (pop)', val: fmt(s.stdDev), key: 'std', highlight: true },
              { label: lang === 'ko' ? '표준편차 (표본)' : 'Std Dev (sample)', val: fmt(s.sampleStdDev), key: 'sstd' },
              { label: lang === 'ko' ? '1사분위수 (Q1)' : 'Q1', val: fmt(s.q1), key: 'q1' },
              { label: lang === 'ko' ? '3사분위수 (Q3)' : 'Q3', val: fmt(s.q3), key: 'q3' },
              { label: lang === 'ko' ? '사분위 범위 (IQR)' : 'IQR', val: fmt(s.iqr), key: 'iqr' },
              { label: lang === 'ko' ? '변동계수 (CV%)' : 'CV (%)', val: fmt(s.cv) + '%', key: 'cv' },
            ].map(r => (
              <div key={r.key} className={`flex items-center justify-between px-3 py-2 rounded-lg border ${(r as any).highlight ? 'border-brand-500/30 bg-brand-500/10' : 'border-surface-border bg-[#1a1d27]'}`}>
                <span className="text-xs text-slate-400">{r.label}</span>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-mono font-bold ${(r as any).highlight ? 'text-brand-400' : 'text-slate-200'}`}>{r.val}</span>
                  <button onClick={() => copy(String(r.val), r.key)} className={`p-1 rounded border transition-all ${copied === r.key ? 'text-brand-400 border-brand-500/40' : 'text-slate-600 border-surface-border hover:text-brand-400'}`}>
                    {copied === r.key ? <CheckCheck size={11} /> : <Copy size={11} />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ToolFooter
        toolName={lang === 'ko' ? '통계 계산기' : 'Statistics Calculator'}
        toolUrl="https://keyword-mixer.vercel.app/statistics-calculator"
        description={tx.desc}
        howToUse={lang === 'ko' ? [
          { step: '데이터 입력', desc: '숫자를 쉼표, 공백, 줄바꿈 중 하나로 구분해 입력하세요.' },
          { step: '구분자 선택', desc: '사용한 구분자(쉼표/공백/줄바꿈)를 버튼으로 선택하세요.' },
          { step: '결과 확인', desc: '평균·중앙값·표준편차 등 15가지 통계값이 즉시 계산됩니다.' },
          { step: '복사하여 활용', desc: '각 통계값 옆 복사 버튼으로 결과를 복사하세요.' },
        ] : [
          { step: 'Enter data', desc: 'Enter numbers separated by commas, spaces, or newlines.' },
          { step: 'Select separator', desc: 'Choose the separator you used (comma/space/newline).' },
          { step: 'View results', desc: '15 statistical values including mean, median, and std dev.' },
          { step: 'Copy values', desc: 'Use copy buttons next to each stat to save to clipboard.' },
        ]}
        whyUse={lang === 'ko' ? [
          { title: '15가지 통계값 동시 계산', desc: '평균·중앙값·최빈값·표준편차·사분위수 등을 한번에 계산합니다.' },
          { title: '표본/모집단 표준편차', desc: '표본 표준편차와 모 표준편차를 모두 제공합니다.' },
          { title: '다양한 구분자 지원', desc: '쉼표, 공백, 줄바꿈 구분자를 모두 지원합니다.' },
          { title: '교육/업무 활용', desc: '성적 분석, 판매 데이터 분석, 통계 과제에 바로 활용하세요.' },
        ] : [
          { title: '15 statistics at once', desc: 'Mean, median, mode, std dev, quartiles and more.' },
          { title: 'Sample & population std dev', desc: 'Both sample and population standard deviation provided.' },
          { title: 'Multiple separator support', desc: 'Supports comma, space, and newline delimiters.' },
          { title: 'Education & work use', desc: 'Perfect for grade analysis, sales data, and statistics assignments.' },
        ]}
        faqs={lang === 'ko' ? [
          { q: '평균과 중앙값의 차이는?', a: '평균은 모든 값의 합을 개수로 나눈 것, 중앙값은 정렬했을 때 가운데 값입니다. 극단값이 있으면 중앙값이 더 대표적입니다.' },
          { q: '표본 표준편차와 모 표준편차의 차이는?', a: '표본 표준편차는 n-1로 나누고, 모 표준편차는 n으로 나눕니다. 전체 데이터가 있으면 모 표준편차, 샘플이면 표본 표준편차를 사용합니다.' },
          { q: 'IQR(사분위 범위)은 무엇인가요?', a: 'Q3-Q1로 계산하며, 중간 50% 데이터의 범위입니다. 이상치 탐지에 많이 사용됩니다.' },
          { q: '변동계수(CV)란?', a: '표준편차를 평균으로 나눈 값(%)으로, 서로 다른 데이터 집합의 산포도를 비교할 때 유용합니다.' },
        ] : [
          { q: 'Difference between mean and median?', a: 'Mean is the sum divided by count. Median is the middle value when sorted. Median is more representative when outliers exist.' },
          { q: 'Sample vs population standard deviation?', a: 'Sample std dev divides by n-1; population by n. Use sample when you have a subset, population when you have all data.' },
          { q: 'What is IQR?', a: 'Q3-Q1: the range of the middle 50% of data. Commonly used for outlier detection.' },
          { q: 'What is CV (Coefficient of Variation)?', a: 'Standard deviation divided by mean (%). Useful for comparing spread across different datasets.' },
        ]}
        keywords="통계 계산기 · 평균 계산 · 중앙값 · 표준편차 계산기 · 분산 계산 · 최빈값 · 사분위수 · statistics calculator · mean median mode · standard deviation calculator · variance calculator · descriptive statistics"
      />
    </div>
  )
}
