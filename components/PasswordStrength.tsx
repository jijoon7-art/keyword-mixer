
'use client'
import { useState, useMemo } from 'react'
import { Eye, EyeOff, RefreshCw, Copy, CheckCheck } from 'lucide-react'
import { useLang } from './LangContext'
import ToolFooter from './ToolFooter'

const T = {
  ko: { title: '비밀번호 강도 검사기', desc: '비밀번호 강도를 실시간 분석. 크래킹 예상 시간, 보안 취약점, 강력한 비밀번호 생성기 포함.' },
  en: { title: 'Password Strength Checker', desc: 'Analyze password strength in real-time. Estimated crack time, security weaknesses, and strong password generator.' }
}

function checkStrength(pw: string, lang: string): { score: number; time: string; issues: string[]; color: string; label: string } {
  if (!pw) return { score: 0, time: '—', issues: [], color: 'text-slate-600', label: '—' }

  let score = 0
  const issues: string[] = []

  if (pw.length >= 8) score += 1; else issues.push(lang==='ko'?'8자 이상 필요':'Need 8+ characters')
  if (pw.length >= 12) score += 1
  if (pw.length >= 16) score += 1
  if (/[A-Z]/.test(pw)) score += 1; else issues.push(lang==='ko'?'대문자 포함 권장':'Add uppercase letters')
  if (/[a-z]/.test(pw)) score += 1; else issues.push(lang==='ko'?'소문자 포함 권장':'Add lowercase letters')
  if (/[0-9]/.test(pw)) score += 1; else issues.push(lang==='ko'?'숫자 포함 권장':'Add numbers')
  if (/[!@#$%^&*()_+\-=\[\]{};':",.<>?/\|`~]/.test(pw)) score += 2; else issues.push(lang==='ko'?'특수문자 포함 권장':'Add special characters')
  if (/(.){2,}/.test(pw)) { score -= 1; issues.push(lang==='ko'?'같은 문자 3번 이상 반복':'Avoid repeating same character 3+ times') }
  if (/^(123|abc|qwe|password|pass|1234|admin)/i.test(pw)) { score -= 2; issues.push(lang==='ko'?'일반적인 패턴 사용됨':'Common pattern detected') }

  score = Math.max(0, Math.min(8, score))

  const TIMES = ['즉시','수초','수분','수시간','수일','수주','수개월','수년','수백년+']
  const TIMES_EN = ['Instant','Seconds','Minutes','Hours','Days','Weeks','Months','Years','Centuries+']
  const LABELS = ['매우 약함','약함','보통','보통','강함','강함','매우 강함','매우 강함','매우 강함']
  const LABELS_EN = ['Very Weak','Weak','Fair','Fair','Strong','Strong','Very Strong','Very Strong','Very Strong']
  const COLORS = ['text-red-500','text-red-400','text-orange-400','text-yellow-400','text-yellow-300','text-brand-500','text-brand-400','text-brand-400','text-brand-300']

  return {
    score,
    time: lang==='ko'?TIMES[score]:TIMES_EN[score],
    issues,
    color: COLORS[score],
    label: lang==='ko'?LABELS[score]:LABELS_EN[score],
  }
}

function generatePassword(len: number, opts: {upper: boolean; lower: boolean; num: boolean; sym: boolean}): string {
  const chars = [
    opts.upper ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' : '',
    opts.lower ? 'abcdefghijklmnopqrstuvwxyz' : '',
    opts.num ? '0123456789' : '',
    opts.sym ? '!@#$%^&*()-_=+[]{}|;:,.<>?' : '',
  ].join('')
  if (!chars) return ''
  return Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

export default function PasswordStrength() {
  const { lang } = useLang()
  const tx = T[lang]
  const [pw, setPw] = useState('')
  const [show, setShow] = useState(false)
  const [genLen, setGenLen] = useState(16)
  const [opts, setOpts] = useState({ upper: true, lower: true, num: true, sym: true })
  const [generated, setGenerated] = useState('')
  const [copied, setCopied] = useState<string|null>(null)
  const copy = async (t: string, k: string) => { await navigator.clipboard.writeText(t); setCopied(k); setTimeout(() => setCopied(null), 1500) }

  const result = useMemo(() => checkStrength(pw, lang), [pw, lang])

  const gen = () => setGenerated(generatePassword(genLen, opts))

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-mono mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />Free Security Tool
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-3">{tx.title}</h1>
        <p className="text-slate-300 text-base max-w-xl mx-auto">{tx.desc}</p>
      </div>
      <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-5 mb-5">
        <label className="text-xs text-slate-400 mb-1.5 block font-medium">{lang==='ko'?'비밀번호 입력 (저장되지 않습니다)':'Enter Password (not saved or sent)'}</label>
        <div className="relative">
          <input type={show?'text':'password'} value={pw} onChange={e => setPw(e.target.value)} placeholder={lang==='ko'?'비밀번호를 입력하세요...':'Enter your password...'}
            className="w-full bg-[#0f1117] border border-surface-border rounded-xl px-4 py-3 text-slate-200 text-lg pr-12 focus:outline-none focus:border-brand-500/50 transition-all" />
          <button onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-all">
            {show ? <EyeOff size={18}/> : <Eye size={18}/>}
          </button>
        </div>
        <p className="text-xs text-slate-600 mt-1.5">{lang==='ko'?'※ 입력한 비밀번호는 서버로 전송되지 않습니다. 모든 분석은 브라우저에서만 처리됩니다.':'※ Password is never sent to any server. All analysis runs locally in your browser.'}</p>
      </div>
      {pw && (
        <div className="flex flex-col gap-3 mb-5">
          <div className={`rounded-xl border p-4 ${result.score>=6?'border-brand-500/30 bg-brand-500/10':result.score>=4?'border-yellow-500/30 bg-yellow-500/10':result.score>=2?'border-orange-500/30 bg-orange-500/10':'border-red-500/30 bg-red-500/10'}`}>
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="text-xs text-slate-400">{lang==='ko'?'보안 강도':'Security Strength'}</p>
                <p className={`text-2xl font-extrabold ${result.color}`}>{result.label}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400">{lang==='ko'?'크래킹 예상 시간':'Est. Crack Time'}</p>
                <p className={`text-xl font-bold ${result.color}`}>{result.time}</p>
              </div>
            </div>
            <div className="h-3 bg-surface-border rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all ${['bg-red-500','bg-red-400','bg-orange-500','bg-orange-400','bg-yellow-500','bg-yellow-400','bg-brand-500','bg-brand-400','bg-brand-300'][result.score]}`}
                style={{width:`${(result.score/8)*100}%`}} />
            </div>
            <div className="flex justify-between text-xs text-slate-600 mt-1">
              <span>{lang==='ko'?'약함':'Weak'}</span><span>{lang==='ko'?'강함':'Strong'}</span>
            </div>
          </div>
          <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4">
            <p className="text-xs text-slate-400 mb-2 font-medium">{lang==='ko'?'비밀번호 분석':'Password Analysis'}</p>
            <div className="grid grid-cols-2 gap-2">{[
              [lang==='ko'?'길이':'Length', `${pw.length}${lang==='ko'?'자':'chars'}`, pw.length >= 12],
              [lang==='ko'?'대문자':'Uppercase', /[A-Z]/.test(pw), /[A-Z]/.test(pw)],
              [lang==='ko'?'소문자':'Lowercase', /[a-z]/.test(pw), /[a-z]/.test(pw)],
              [lang==='ko'?'숫자':'Numbers', /[0-9]/.test(pw), /[0-9]/.test(pw)],
              [lang==='ko'?'특수문자':'Special chars', /[^a-zA-Z0-9]/.test(pw), /[^a-zA-Z0-9]/.test(pw)],
              [lang==='ko'?'연속 반복 없음':'No repetition', !/(.){2,}/.test(pw), !/(.){2,}/.test(pw)],
            ].map(([l,v,ok]) => (
              <div key={l as string} className={`flex justify-between px-2 py-1.5 rounded border text-xs ${ok?'border-brand-500/30 bg-brand-500/10':'border-surface-border bg-[#0f1117]'}`}>
                <span className="text-slate-400">{l as string}</span>
                <span className={ok?'text-brand-400 font-bold':'text-slate-600'}>{typeof v==='boolean'?(v?'✓':'✗'):v as string}</span>
              </div>
            ))}</div>
            {result.issues.length > 0 && (
              <div className="mt-2">{result.issues.map(issue => <p key={issue} className="text-xs text-yellow-400 flex items-center gap-1">⚠ {issue}</p>)}</div>
            )}
          </div>
        </div>
      )}
      <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4">
        <p className="text-xs text-slate-400 mb-3 font-medium">{lang==='ko'?'🔐 강력한 비밀번호 생성기':'🔐 Strong Password Generator'}</p>
        <div className="flex items-center gap-3 mb-3">
          <label className="text-xs text-slate-400 w-20">{lang==='ko'?`길이: ${genLen}자`:`Length: ${genLen}`}</label>
          <input type="range" min={8} max={64} value={genLen} onChange={e => setGenLen(+e.target.value)} className="flex-1 accent-green-500" />
        </div>
        <div className="flex flex-wrap gap-2 mb-3">{[
          ['upper', lang==='ko'?'대문자 (A-Z)':'Uppercase'],
          ['lower', lang==='ko'?'소문자 (a-z)':'Lowercase'],
          ['num', lang==='ko'?'숫자 (0-9)':'Numbers'],
          ['sym', lang==='ko'?'특수문자':'Symbols'],
        ].map(([k,l]) => (
          <label key={k} className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border cursor-pointer text-xs transition-all ${opts[k as keyof typeof opts]?'border-brand-500/40 bg-brand-500/10 text-brand-300':'border-surface-border bg-[#0f1117] text-slate-400'}`}>
            <input type="checkbox" checked={opts[k as keyof typeof opts]} onChange={() => setOpts(p => ({...p, [k]: !p[k as keyof typeof opts]}))} className="accent-green-500" />{l}
          </label>
        ))}</div>
        <button onClick={gen} className="w-full py-2 rounded-xl bg-brand-500 hover:bg-brand-400 text-white font-bold text-sm transition-all flex items-center justify-center gap-1.5 mb-2">
          <RefreshCw size={13}/> {lang==='ko'?'생성하기':'Generate'}
        </button>
        {generated && (
          <div className="flex items-center gap-2 p-3 rounded-lg border border-surface-border bg-[#0f1117]">
            <code className="flex-1 text-sm text-brand-300 font-mono break-all">{generated}</code>
            <button onClick={() => copy(generated,'gen')} className={`p-1.5 rounded border transition-all flex-shrink-0 ${copied==='gen'?'bg-brand-500/20 border-brand-500/40 text-brand-400':'border-surface-border text-slate-500 hover:text-brand-400'}`}>
              {copied==='gen'?<CheckCheck size={13}/>:<Copy size={13}/>}
            </button>
          </div>
        )}
      </div>
      <ToolFooter
        toolName={lang==='ko'?'비밀번호 강도 검사기':'Password Strength Checker'}
        toolUrl="https://keyword-mixer.vercel.app/password-strength"
        description={tx.desc}
        howToUse={lang==='ko'?[{step:'비밀번호 입력',desc:'검사할 비밀번호를 입력하세요. 서버로 전송되지 않습니다.'},{step:'강도 확인',desc:'실시간으로 강도 점수와 크래킹 예상 시간이 표시됩니다.'},{step:'취약점 확인',desc:'보안을 높이기 위한 개선 사항을 확인하세요.'},{step:'강력한 비밀번호 생성',desc:'생성기로 안전한 비밀번호를 자동으로 만들 수 있습니다.'}]:[{step:'Enter password',desc:'Type password to check. Never sent to any server.'},{step:'View strength',desc:'Real-time strength score and estimated crack time.'},{step:'Check weaknesses',desc:'See specific improvements to increase security.'},{step:'Generate strong password',desc:'Use generator to automatically create a secure password.'}]}
        whyUse={lang==='ko'?[{title:'100% 로컬 처리',desc:'입력한 비밀번호는 절대 서버로 전송되지 않습니다. 모든 분석이 브라우저에서만 이루어집니다.'},{title:'크래킹 시간 표시',desc:'비밀번호가 얼마나 오래 버틸 수 있는지 예상 시간을 알려줍니다.'},{title:'구체적인 개선 방안',desc:'어떤 부분이 약한지 구체적으로 알려주고 개선 방법을 제안합니다.'},{title:'안전한 비밀번호 생성',desc:'길이, 대소문자, 숫자, 특수문자를 설정해 강력한 비밀번호를 생성합니다.'}]:[{title:'100% local processing',desc:'Password never sent to server. All analysis done in your browser only.'},{title:'Crack time estimate',desc:'Shows how long the password would resist a brute-force attack.'},{title:'Specific improvements',desc:'Identifies exact weaknesses and suggests concrete improvements.'},{title:'Secure password generator',desc:'Generate strong passwords with customizable length and character types.'}]}
        faqs={lang==='ko'?[{q:'비밀번호가 서버로 전송되나요?',a:'아니요. 이 도구의 모든 분석은 브라우저(클라이언트)에서만 처리됩니다. 서버로 어떠한 데이터도 전송되지 않습니다.'},{q:'강력한 비밀번호란?',a:'12자 이상, 대소문자, 숫자, 특수문자를 모두 포함한 비밀번호입니다. 사전에 없는 단어 조합을 사용하고 반복 문자를 피하세요.'},{q:'비밀번호를 얼마나 자주 바꿔야 하나요?',a:'유출이 의심되거나 중요한 서비스에서는 3~6개월마다 변경을 권장합니다. 단, 강력한 비밀번호라면 주기적 변경보다 유출 감시가 더 중요합니다.'},{q:'패스프레이즈(긴 문장)가 비밀번호보다 나은가요?',a:'네. "올바른말배터리스테이플"처럼 4개 이상의 무작위 단어를 조합하면 기억하기 쉽고 매우 강력합니다.'}]:[{q:'Is password sent to server?',a:'No. All analysis runs entirely in your browser. No data is sent to any server.'},{q:'What makes a strong password?',a:'12+ characters with uppercase, lowercase, numbers, and special characters. Use uncommon combinations and avoid repeated characters.'},{q:'How often to change passwords?',a:'Change every 3-6 months if compromised or for important services. Strong passwords with breach monitoring are more important than regular changes.'},{q:'Are passphrases better?',a:'Yes. Combining 4+ random words like "correct-horse-battery-staple" creates memorable and very strong passwords.'}]}
        keywords="비밀번호 강도 검사 · 비밀번호 안전도 · 패스워드 강도 · 비밀번호 생성기 · 안전한 비밀번호 · password strength checker · password security · password generator · strong password"
      />
    </div>
  )
}
