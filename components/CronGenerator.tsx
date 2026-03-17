'use client'
import { useState, useMemo } from 'react'
import { Copy, CheckCheck } from 'lucide-react'
import { useLang } from './LangContext'
import ToolFooter from './ToolFooter'

const T = {
  ko: { title: 'Cron 표현식 생성기', desc: 'Cron 표현식을 쉽게 생성하고 의미를 한국어로 설명. 자동화 스케줄 설정에 필수.' },
  en: { title: 'Cron Expression Generator', desc: 'Build and understand Cron expressions easily. Essential for scheduling automated tasks.' }
}

const PRESETS = [
  { label: lang => lang==='ko'?'매분':'Every minute', cron: '* * * * *' },
  { label: lang => lang==='ko'?'매시 정각':'Every hour', cron: '0 * * * *' },
  { label: lang => lang==='ko'?'매일 자정':'Daily midnight', cron: '0 0 * * *' },
  { label: lang => lang==='ko'?'매일 오전 9시':'Daily 9AM', cron: '0 9 * * *' },
  { label: lang => lang==='ko'?'매주 월요일':'Weekly Monday', cron: '0 9 * * 1' },
  { label: lang => lang==='ko'?'매월 1일':'Monthly 1st', cron: '0 0 1 * *' },
  { label: lang => lang==='ko'?'평일 오전 9시':'Weekdays 9AM', cron: '0 9 * * 1-5' },
  { label: lang => lang==='ko'?'매시간 15분':'Every hour :15', cron: '15 * * * *' },
  { label: lang => lang==='ko'?'6시간마다':'Every 6 hours', cron: '0 */6 * * *' },
  { label: lang => lang==='ko'?'매년 1월 1일':'Yearly Jan 1', cron: '0 0 1 1 *' },
]

function parseCron(expr: string, lang: 'ko'|'en'): string {
  const parts = expr.trim().split(/\s+/)
  if (parts.length !== 5) return lang==='ko'?'잘못된 Cron 형식 (5개 필드 필요)':'Invalid Cron (5 fields required)'
  const [min, hour, dom, month, dow] = parts
  const months = lang==='ko'?['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월']:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  const days = lang==='ko'?['일요일','월요일','화요일','수요일','목요일','금요일','토요일']:['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']

  const descMin = min==='*'?(lang==='ko'?'매분':'every minute'):min.startsWith('*/')?(lang==='ko'?`${min.slice(2)}분마다`:`every ${min.slice(2)} minutes`):`${min}분`
  const descHour = hour==='*'?(lang==='ko'?'매시간':'every hour'):hour.startsWith('*/')?(lang==='ko'?`${hour.slice(2)}시간마다`:`every ${hour.slice(2)} hours`):`${hour}시`
  const descDom = dom==='*'?(lang==='ko'?'매일':'every day'):dom.startsWith('*/')?(lang==='ko'?`${dom.slice(2)}일마다`:`every ${dom.slice(2)} days`):`${dom}일`
  const descMonth = month==='*'?(lang==='ko'?'매월':'every month'):months[parseInt(month)-1]||month
  const descDow = dow==='*'?(lang==='ko'?'요일 무관':'any day'):dow==='1-5'?(lang==='ko'?'평일(월-금)':'weekdays (Mon-Fri)'):days[parseInt(dow)]||dow

  if (min==='*'&&hour==='*') return lang==='ko'?`${descMonth} ${descDom} (${descDow}) ${descMin} 실행`:`Run ${descMin} on ${descDom} of ${descMonth} (${descDow})`
  return lang==='ko'?`${descMonth} ${descDom} (${descDow}) ${descHour} ${descMin}에 실행`:`Run at ${descHour}:${descMin} on ${descDom} of ${descMonth} (${descDow})`
}

export default function CronGenerator() {
  const { lang } = useLang()
  const tx = T[lang]
  const [cron, setCron] = useState('0 9 * * 1-5')
  const [copied, setCopied] = useState(false)

  const description = useMemo(() => parseCron(cron, lang as 'ko'|'en'), [cron, lang])
  const copy = async () => { await navigator.clipboard.writeText(cron); setCopied(true); setTimeout(() => setCopied(false), 1500) }

  const parts = cron.trim().split(/\s+/)
  const FIELDS = lang==='ko'?['분 (0-59)','시 (0-23)','일 (1-31)','월 (1-12)','요일 (0-7)']:['Min (0-59)','Hour (0-23)','Day (1-31)','Month (1-12)','Weekday (0-7)']

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-mono mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />Free Developer Tool
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-3">{tx.title}</h1>
        <p className="text-slate-300 text-base max-w-xl mx-auto">{tx.desc}</p>
      </div>

      {/* 입력 */}
      <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-5 mb-5">
        <div className="flex gap-2 mb-4">
          <input value={cron} onChange={e => setCron(e.target.value)}
            placeholder="* * * * *"
            className="flex-1 bg-[#0f1117] border border-surface-border rounded-lg px-3 py-2.5 text-slate-200 text-lg font-mono focus:outline-none focus:border-brand-500/50 transition-all" />
          <button onClick={copy} className={`px-4 py-2.5 rounded-lg border flex items-center gap-1.5 text-sm transition-all ${copied?'bg-brand-500/20 border-brand-500/40 text-brand-400':'border-surface-border text-slate-300 hover:border-brand-500/40'}`}>
            {copied?<CheckCheck size={14}/>:<Copy size={14}/>} {lang==='ko'?'복사':'Copy'}
          </button>
        </div>

        {/* 필드 레이블 */}
        <div className="grid grid-cols-5 gap-1.5 mb-3">
          {FIELDS.map((f, i) => (
            <div key={f} className="text-center">
              <div className="rounded-lg border border-brand-500/30 bg-brand-500/10 px-2 py-1.5 mb-1">
                <p className="text-sm font-mono font-bold text-brand-400">{parts[i] ?? '*'}</p>
              </div>
              <p className="text-xs text-slate-500">{f}</p>
            </div>
          ))}
        </div>

        {/* 설명 */}
        <div className="rounded-lg border border-surface-border bg-[#0f1117] px-4 py-3">
          <p className="text-xs text-slate-500 mb-0.5">{lang==='ko'?'의미:':'Means:'}</p>
          <p className="text-sm text-slate-200 font-medium">{description}</p>
        </div>
      </div>

      {/* 프리셋 */}
      <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4 mb-5">
        <p className="text-xs text-slate-400 mb-3 font-medium">{lang==='ko'?'자주 쓰는 패턴':'Common Patterns'}</p>
        <div className="grid grid-cols-2 gap-2">
          {PRESETS.map(p => (
            <button key={p.cron} onClick={() => setCron(p.cron)}
              className={`flex items-center justify-between px-3 py-2 rounded-lg border text-xs transition-all text-left ${cron===p.cron?'bg-brand-500/15 border-brand-500/30 text-brand-400':'border-surface-border text-slate-300 hover:border-brand-500/40 hover:text-brand-300 bg-[#0f1117]'}`}>
              <span>{p.label(lang as 'ko'|'en')}</span>
              <span className="font-mono text-slate-500">{p.cron}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 문법 가이드 */}
      <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4">
        <p className="text-xs text-slate-400 mb-3 font-medium">{lang==='ko'?'Cron 문법 가이드':'Cron Syntax Guide'}</p>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {[['*', lang==='ko'?'모든 값':'All values'], ['*/n', lang==='ko'?'n마다':'Every n'], ['n', lang==='ko'?'특정 값':'Specific value'], ['n-m', lang==='ko'?'범위':'Range'], ['n,m', lang==='ko'?'목록':'List'], ['0-7', lang==='ko'?'0=일요일, 7=일요일':'0=Sun, 7=Sun']].map(([sym, desc]) => (
            <div key={sym} className="flex items-center gap-2 p-2 rounded-lg bg-[#0f1117] border border-surface-border">
              <code className="text-brand-400 font-mono font-bold w-12">{sym}</code>
              <span className="text-slate-400">{desc}</span>
            </div>
          ))}
        </div>
      </div>

      <ToolFooter
        toolName={lang==='ko'?'Cron 표현식 생성기':'Cron Expression Generator'}
        toolUrl="https://keyword-mixer.vercel.app/cron-generator"
        description={tx.desc}
        howToUse={lang==='ko'?[
          {step:'프리셋 선택 또는 직접 입력', desc:'자주 쓰는 패턴 버튼을 클릭하거나 Cron 표현식을 직접 입력하세요.'},
          {step:'의미 확인', desc:'입력한 표현식이 언제 실행되는지 한국어로 즉시 확인할 수 있습니다.'},
          {step:'5개 필드 확인', desc:'분·시·일·월·요일 5개 필드가 각각 무엇을 의미하는지 확인하세요.'},
          {step:'복사하여 사용', desc:'복사 버튼으로 표현식을 서버 설정 파일에 붙여넣으세요.'},
        ]:[
          {step:'Select preset or type directly', desc:'Click a common pattern or type your own Cron expression.'},
          {step:'Understand the meaning', desc:'Instantly see when the expression will execute in plain language.'},
          {step:'Check 5 fields', desc:'Understand what each of the 5 fields (min, hour, day, month, weekday) means.'},
          {step:'Copy and use', desc:'Copy the expression and paste it into your server configuration.'},
        ]}
        whyUse={lang==='ko'?[
          {title:'한국어 설명', desc:'복잡한 Cron 표현식을 이해하기 쉬운 한국어로 즉시 번역합니다.'},
          {title:'10가지 프리셋', desc:'자주 사용되는 일정을 클릭 한 번으로 바로 사용할 수 있습니다.'},
          {title:'문법 가이드', desc:'Cron 특수 문자와 사용법을 한눈에 확인할 수 있습니다.'},
          {title:'개발자 시간 절약', desc:'Cron 문법을 외우지 않아도 쉽게 스케줄을 설정할 수 있습니다.'},
        ]:[
          {title:'Plain language explanation', desc:'Instantly translates complex Cron expressions into readable language.'},
          {title:'10 presets', desc:'One-click access to commonly used scheduling patterns.'},
          {title:'Syntax guide', desc:'Quick reference for all Cron special characters.'},
          {title:'Save developer time', desc:'Set up schedules easily without memorizing Cron syntax.'},
        ]}
        faqs={lang==='ko'?[
          {q:'Cron이란?', a:'유닉스 계열 운영체제에서 주기적으로 명령을 실행하는 스케줄러입니다. 분·시·일·월·요일 5개 필드로 실행 시간을 지정합니다.'},
          {q:'0 9 * * 1-5는 무슨 의미인가요?', a:'평일(월~금) 오전 9시 0분에 실행된다는 의미입니다. 많은 회사에서 업무 알림, 백업, 리포트 생성에 사용합니다.'},
          {q:'Cron은 어디서 사용하나요?', a:'리눅스 crontab, GitHub Actions, AWS Lambda, Node.js의 node-cron, Spring Scheduler 등 다양한 환경에서 사용됩니다.'},
          {q:'타임존은 어떻게 설정하나요?', a:'기본 Cron은 서버 타임존을 따릅니다. 특정 타임존을 사용하려면 CRON_TZ=Asia/Seoul 환경변수를 설정하거나 서비스별 타임존 설정을 사용하세요.'},
        ]:[
          {q:'What is Cron?', a:'A Unix-based time scheduler that runs commands at specified intervals. Uses 5 fields: minute, hour, day, month, weekday.'},
          {q:'What does "0 9 * * 1-5" mean?', a:'Run at 9:00 AM every weekday (Monday-Friday). Common for business notifications, backups, and reports.'},
          {q:'Where is Cron used?', a:'Linux crontab, GitHub Actions, AWS Lambda, Node.js (node-cron), Spring Scheduler, and many other environments.'},
          {q:'How do I set timezone for Cron?', a:'Standard Cron follows server timezone. Use CRON_TZ=America/New_York env variable or service-specific timezone settings.'},
        ]}
        keywords="Cron 표현식 · Cron 생성기 · Cron 스케줄러 · crontab · cron expression generator · cron scheduler · cron syntax · cron job · schedule automation · linux cron · cron parser"
      />
    </div>
  )
}
