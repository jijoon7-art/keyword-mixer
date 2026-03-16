'use client'

import ToolFooter from './ToolFooter'
import { useState, useCallback } from 'react'
import { Copy, CheckCheck, RotateCcw, RefreshCw, Shield } from 'lucide-react'

const CHARSETS = {
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lower: 'abcdefghijklmnopqrstuvwxyz',
  number: '0123456789',
  symbol: '!@#$%^&*()-_=+[]{}|;:,.<>?',
  ambiguous: 'Il1O0',
}

function getStrength(pw: string): { label: string; color: string; width: string } {
  let score = 0
  if (pw.length >= 8) score++
  if (pw.length >= 12) score++
  if (pw.length >= 16) score++
  if (/[A-Z]/.test(pw)) score++
  if (/[a-z]/.test(pw)) score++
  if (/[0-9]/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  if (score <= 2) return { label: '매우 약함', color: 'bg-red-500', width: 'w-1/5' }
  if (score <= 3) return { label: '약함', color: 'bg-orange-500', width: 'w-2/5' }
  if (score <= 4) return { label: '보통', color: 'bg-yellow-500', width: 'w-3/5' }
  if (score <= 5) return { label: '강함', color: 'bg-blue-500', width: 'w-4/5' }
  return { label: '매우 강함', color: 'bg-brand-500', width: 'w-full' }
}

export default function PasswordGenerator() {
  const [length, setLength] = useState(16)
  const [useUpper, setUseUpper] = useState(true)
  const [useLower, setUseLower] = useState(true)
  const [useNumber, setUseNumber] = useState(true)
  const [useSymbol, setUseSymbol] = useState(true)
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false)
  const [count, setCount] = useState(5)
  const [passwords, setPasswords] = useState<string[]>([])
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null)
  const [copiedAll, setCopiedAll] = useState(false)

  const generate = useCallback(() => {
    let charset = ''
    if (useUpper) charset += CHARSETS.upper
    if (useLower) charset += CHARSETS.lower
    if (useNumber) charset += CHARSETS.number
    if (useSymbol) charset += CHARSETS.symbol
    if (excludeAmbiguous) {
      charset = charset.split('').filter(c => !CHARSETS.ambiguous.includes(c)).join('')
    }
    if (!charset) return

    const arr = Array.from({ length: count }, () =>
      Array.from({ length }, () => charset[Math.floor(Math.random() * charset.length)]).join('')
    )
    setPasswords(arr)
  }, [length, useUpper, useLower, useNumber, useSymbol, excludeAmbiguous, count])

  const copy = async (pw: string, idx: number) => {
    await navigator.clipboard.writeText(pw)
    setCopiedIdx(idx)
    setTimeout(() => setCopiedIdx(null), 1500)
  }

  const copyAll = async () => {
    await navigator.clipboard.writeText(passwords.join('\n'))
    setCopiedAll(true)
    setTimeout(() => setCopiedAll(false), 1500)
  }

  const toggles = [
    { label: '대문자 (A-Z)', val: useUpper, set: setUseUpper },
    { label: '소문자 (a-z)', val: useLower, set: setUseLower },
    { label: '숫자 (0-9)', val: useNumber, set: setUseNumber },
    { label: '특수문자 (!@#)', val: useSymbol, set: setUseSymbol },
  ]

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Hero */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-mono mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
          Free Security Tool
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-3 tracking-tight">랜덤 비밀번호 생성기</h1>
        <p className="text-slate-300 text-base max-w-lg mx-auto">
          안전한 랜덤 비밀번호를 즉시 생성. 길이·문자 조합 맞춤 설정, 최대 10개 동시 생성.
        </p>
      </div>

      {/* Settings */}
      <div className="rounded-xl border border-surface-border bg-surface-card p-5 mb-6">
        <h2 className="text-sm font-semibold text-slate-200 mb-4">설정</h2>

        {/* Length */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm text-slate-300">비밀번호 길이</label>
            <span className="text-brand-400 font-mono font-bold text-lg">{length}</span>
          </div>
          <input
            type="range" min={4} max={64} value={length}
            onChange={e => setLength(+e.target.value)}
            className="w-full accent-green-500"
          />
          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>4</span><span>16</span><span>32</span><span>64</span>
          </div>
        </div>

        {/* Character sets */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {toggles.map(t => (
            <label key={t.label} className="flex items-center justify-between p-3 rounded-lg border border-surface-border bg-surface-DEFAULT cursor-pointer hover:border-brand-500/30 transition-all">
              <span className="text-sm text-slate-300">{t.label}</span>
              <div onClick={() => t.set(!t.val)} className={`w-10 h-5 rounded-full relative transition-all cursor-pointer ${t.val ? 'bg-brand-500' : 'bg-surface-border'}`}>
                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all shadow ${t.val ? 'left-5' : 'left-0.5'}`} />
              </div>
            </label>
          ))}
        </div>

        {/* Extra options */}
        <div className="flex flex-wrap gap-4 mb-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <div onClick={() => setExcludeAmbiguous(!excludeAmbiguous)} className={`w-10 h-5 rounded-full relative transition-all cursor-pointer ${excludeAmbiguous ? 'bg-brand-500' : 'bg-surface-border'}`}>
              <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all shadow ${excludeAmbiguous ? 'left-5' : 'left-0.5'}`} />
            </div>
            <span className="text-sm text-slate-300">헷갈리는 문자 제외 (I, l, 1, O, 0)</span>
          </label>
        </div>

        {/* Count */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-300">생성 개수</span>
          <div className="flex gap-1.5">
            {[1, 3, 5, 10].map(n => (
              <button key={n} onClick={() => setCount(n)}
                className={`w-10 h-8 rounded-lg border text-sm font-mono transition-all ${count === n ? 'bg-brand-500 border-brand-500 text-white font-bold' : 'border-surface-border text-slate-300 hover:border-brand-500/40 hover:text-brand-300'}`}>
                {n}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Generate button */}
      <button
        onClick={generate}
        className="w-full py-3 rounded-xl bg-brand-500 hover:bg-brand-400 text-white font-bold text-sm transition-all shadow-[0_4px_15px_rgba(34,197,94,0.3)] flex items-center justify-center gap-2 mb-6"
      >
        <RefreshCw size={16} />
        비밀번호 생성하기
      </button>

      {/* Results */}
      {passwords.length > 0 && (
        <div className="rounded-xl border border-surface-border bg-surface-card overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-surface-border bg-surface-hover/30">
            <span className="text-sm font-medium text-slate-200">생성된 비밀번호 {passwords.length}개</span>
            <button onClick={copyAll} className={`text-xs px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1 ${copiedAll ? 'bg-brand-500/20 border-brand-500/40 text-brand-400' : 'border-surface-border text-slate-300 hover:border-brand-500/40 hover:text-brand-300'}`}>
              {copiedAll ? <CheckCheck size={12} /> : <Copy size={12} />}
              {copiedAll ? '복사됨' : '전체 복사'}
            </button>
          </div>
          <div className="divide-y divide-surface-border">
            {passwords.map((pw, i) => {
              const str = getStrength(pw)
              return (
                <div key={i} className="flex items-center gap-3 px-4 py-3 hover:bg-surface-hover/30 transition-all group">
                  <Shield size={14} className={str.color.replace('bg-', 'text-')} />
                  <span className="flex-1 font-mono text-sm text-slate-200 select-all">{pw}</span>
                  <div className="flex items-center gap-2">
                    <div className="hidden sm:flex items-center gap-1.5">
                      <div className="w-16 h-1.5 bg-surface-border rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${str.color} ${str.width}`} />
                      </div>
                      <span className="text-xs text-slate-400 w-16">{str.label}</span>
                    </div>
                    <button onClick={() => copy(pw, i)} className={`text-xs px-2.5 py-1.5 rounded-lg border transition-all flex items-center gap-1 ${copiedIdx === i ? 'bg-brand-500/20 border-brand-500/40 text-brand-400' : 'border-surface-border text-slate-400 hover:border-brand-500/40 hover:text-brand-300'}`}>
                      {copiedIdx === i ? <CheckCheck size={12} /> : <Copy size={12} />}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* SEO */}
      <ToolFooter
        toolName="비밀번호 생성기"
        toolUrl="https://keyword-mixer.vercel.app/password-generator"
        description="안전한 랜덤 비밀번호 즉시 생성. 길이·문자 조합 맞춤 설정."
        howToUse={[
          { step: "길이 설정", desc: "슬라이더로 비밀번호 길이를 4~64자 사이에서 설정하세요." },
          { step: "문자 유형 선택", desc: "대문자, 소문자, 숫자, 특수문자를 조합해 보안 강도를 높이세요." },
          { step: "생성 버튼 클릭", desc: "비밀번호 생성 버튼을 눌러 랜덤 비밀번호를 받으세요." },
          { step: "복사 및 사용", desc: "복사 버튼으로 클립보드에 복사한 후 안전한 곳에 저장하세요." },
        ]}
        whyUse={[
          { title: "강력한 보안", desc: "예측 불가능한 랜덤 알고리즘으로 안전한 비밀번호를 생성합니다." },
          { title: "서버 전송 없음", desc: "브라우저에서만 처리되어 생성된 비밀번호가 서버에 전송되지 않습니다." },
          { title: "맞춤 설정", desc: "사이트별 비밀번호 정책에 맞게 문자 조합을 자유롭게 설정할 수 있습니다." },
          { title: "다중 생성", desc: "여러 개를 동시에 생성해 중요도에 따라 선택할 수 있습니다." },
        ]}
        faqs={[
          { q: "안전한 비밀번호 길이는?", a: "최소 12자 이상, 대소문자·숫자·특수문자를 모두 포함한 비밀번호를 권장합니다." },
          { q: "생성된 비밀번호는 저장되나요?", a: "아니요. 브라우저에서만 처리되며 서버에 저장되지 않습니다." },
          { q: "헷갈리는 문자 제외 기능은?", a: "I(아이), l(소문자L), 1(숫자), O(대문자오), 0(영)처럼 혼동되는 문자를 제외할 수 있습니다." },
          { q: "비밀번호를 어디에 저장하나요?", a: "1Password, Bitwarden, 삼성패스 등 비밀번호 관리자 앱을 사용하는 것을 권장합니다." },
        ]}
        keywords="비밀번호 생성기 · 랜덤 비밀번호 · 안전한 비밀번호 · 강력한 비밀번호 만들기 · 비밀번호 추천 · password generator · random password · strong password generator · secure password · free password tool"
      />
    </div>
  )
}
