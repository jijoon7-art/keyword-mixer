'use client'
import { useState } from 'react'
import { Copy, CheckCheck, RefreshCw } from 'lucide-react'
import { useLang } from './LangContext'
import ToolFooter from './ToolFooter'

const T = {
  ko: { title: '주민등록번호 생성기', desc: '테스트용 가상 주민등록번호 생성. 실제 개인정보가 아닌 형식만 맞는 테스트 데이터입니다.' },
  en: { title: 'Korean ID Number Generator', desc: 'Generate test Korean RRN (주민등록번호). For testing only - not real personal data.' }
}

function generateKoreanId(birthYear: number, birthMonth: number, birthDay: number, gender: number): string {
  const yy = String(birthYear % 100).padStart(2, '0')
  const mm = String(birthMonth).padStart(2, '0')
  const dd = String(birthDay).padStart(2, '0')
  const front = `${yy}${mm}${dd}`

  // 성별 코드: 1900년대 남=1, 여=2 / 2000년대 남=3, 여=4
  const genderCode = birthYear >= 2000 ? gender + 2 : gender
  const region = Math.floor(Math.random() * 8) + 1
  const serial = String(Math.floor(Math.random() * 1000)).padStart(3, '0')
  const partial = `${front}-${genderCode}${String(region).padStart(2,'0')}${serial}`

  // 검증 숫자 계산
  const digits = (front + genderCode + String(region).padStart(2,'0') + serial).split('').map(Number)
  const weights = [2,3,4,5,6,7,8,9,2,3,4,5]
  const sum = digits.reduce((acc, d, i) => acc + d * weights[i], 0)
  const check = (11 - (sum % 11)) % 10
  return `${front}-${genderCode}${String(region).padStart(2,'0')}${serial}${check}`
}

export default function IdGenerator() {
  const { lang } = useLang()
  const tx = T[lang]
  const [gender, setGender] = useState<1|2>(1)
  const [birthYear, setBirthYear] = useState(1990)
  const [birthMonth, setBirthMonth] = useState(1)
  const [birthDay, setBirthDay] = useState(1)
  const [count, setCount] = useState(5)
  const [results, setResults] = useState<string[]>([])
  const [copied, setCopied] = useState<string|null>(null)

  const generate = () => {
    const ids = Array.from({ length: count }, () => generateKoreanId(birthYear, birthMonth, birthDay, gender))
    setResults(ids)
  }

  const copy = async (text: string, key: string) => { await navigator.clipboard.writeText(text); setCopied(key); setTimeout(() => setCopied(null), 1500) }
  const copyAll = () => copy(results.join('\n'), 'all')

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-mono mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />Test Data Tool
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-3">{tx.title}</h1>
        <p className="text-slate-300 text-base max-w-xl mx-auto">{tx.desc}</p>
      </div>

      {/* 경고 */}
      <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-4 mb-5">
        <p className="text-yellow-400 text-sm font-medium">⚠️ {lang==='ko'?'테스트 전용':'For Testing Only'}</p>
        <p className="text-yellow-300/70 text-xs mt-1">{lang==='ko'?'이 도구로 생성된 번호는 형식만 맞는 가상 데이터입니다. 실제 개인정보가 아니며 공식 문서에 사용할 수 없습니다. 개발·테스트 목적으로만 사용하세요.':'Numbers generated here are fake test data with valid format only. Not real personal information. Use for development/testing purposes only.'}</p>
      </div>

      <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-5 mb-5">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-xs text-slate-400 mb-2 block font-medium">{lang==='ko'?'성별':'Gender'}</label>
            <div className="flex gap-2">
              {[[1, lang==='ko'?'남성':'Male'], [2, lang==='ko'?'여성':'Female']].map(([v, l]) => (
                <button key={v} onClick={() => setGender(v as 1|2)}
                  className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-all ${gender===v?'bg-brand-500 border-brand-500 text-white font-bold':'border-surface-border text-slate-300 bg-[#0f1117]'}`}>{l}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-2 block font-medium">{lang==='ko'?'생성 수':'Count'}</label>
            <div className="flex gap-1.5">
              {[1,3,5,10].map(n => (
                <button key={n} onClick={() => setCount(n)}
                  className={`flex-1 py-2 rounded-lg border text-sm font-mono transition-all ${count===n?'bg-brand-500 border-brand-500 text-white font-bold':'border-surface-border text-slate-300 bg-[#0f1117]'}`}>{n}</button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-4">
          {[[lang==='ko'?'출생연도':'Birth Year', birthYear, setBirthYear, 1930, 2010], [lang==='ko'?'월':'Month', birthMonth, setBirthMonth, 1, 12], [lang==='ko'?'일':'Day', birthDay, setBirthDay, 1, 31]].map(([label, val, set, min, max]) => (
            <div key={label as string}>
              <label className="text-xs text-slate-400 mb-1.5 block font-medium">{label as string}</label>
              <input type="number" min={min as number} max={max as number} value={val as number} onChange={e => (set as Function)(parseInt(e.target.value))}
                className="w-full bg-[#0f1117] border border-surface-border rounded-lg px-3 py-2 text-sm text-slate-200 font-mono focus:outline-none focus:border-brand-500/50 transition-all" />
            </div>
          ))}
        </div>

        <button onClick={generate} className="w-full py-3 rounded-xl bg-brand-500 hover:bg-brand-400 text-white font-bold text-sm transition-all flex items-center justify-center gap-2">
          <RefreshCw size={15} /> {lang==='ko'?'번호 생성':'Generate'}
        </button>
      </div>

      {results.length > 0 && (
        <div className="rounded-xl border border-surface-border bg-[#1a1d27] overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-surface-border">
            <span className="text-sm font-medium text-slate-200">{lang==='ko'?`${results.length}개 생성됨`:`${results.length} Generated`}</span>
            <button onClick={copyAll} className={`text-xs px-3 py-1.5 rounded-lg border flex items-center gap-1 transition-all ${copied==='all'?'bg-brand-500/20 border-brand-500/40 text-brand-400':'border-surface-border text-slate-300 hover:border-brand-500/40'}`}>
              {copied==='all'?<CheckCheck size={12}/>:<Copy size={12}/>} {lang==='ko'?'전체 복사':'Copy All'}
            </button>
          </div>
          {results.map((id, i) => (
            <div key={i} className="flex items-center justify-between px-4 py-3 border-b border-surface-border last:border-0 hover:bg-surface-hover/10 transition-all">
              <span className="font-mono text-slate-200 text-sm">{id}</span>
              <button onClick={() => copy(id, id)} className={`p-1.5 rounded border transition-all ${copied===id?'bg-brand-500/20 border-brand-500/40 text-brand-400':'border-surface-border text-slate-500 hover:text-brand-400 hover:border-brand-500/40'}`}>
                {copied===id?<CheckCheck size={13}/>:<Copy size={13}/>}
              </button>
            </div>
          ))}
        </div>
      )}

      <ToolFooter
        toolName={lang==='ko'?'주민등록번호 생성기':'Korean ID Generator'}
        toolUrl="https://keyword-mixer.vercel.app/id-generator"
        description={tx.desc}
        howToUse={lang==='ko'?[
          {step:'성별과 생년월일 설정', desc:'테스트에 사용할 가상 인물의 성별과 생년월일을 선택하세요.'},
          {step:'생성 수 선택', desc:'한번에 1~10개의 번호를 생성할 수 있습니다.'},
          {step:'번호 생성', desc:'생성 버튼을 클릭하면 형식에 맞는 가상 번호가 생성됩니다.'},
          {step:'복사하여 사용', desc:'개별 복사 또는 전체 복사 버튼으로 테스트 데이터를 사용하세요.'},
        ]:[
          {step:'Set gender and birthdate', desc:'Select gender and birthdate for the test data.'},
          {step:'Choose count', desc:'Generate 1-10 IDs at once.'},
          {step:'Generate', desc:'Click Generate to create format-valid fake IDs.'},
          {step:'Copy to use', desc:'Copy individual or all IDs for your test data.'},
        ]}
        whyUse={lang==='ko'?[
          {title:'개발 테스트 용도', desc:'회원가입, 폼 검증 등을 테스트할 때 형식에 맞는 가상 데이터가 필요합니다.'},
          {title:'검증 알고리즘 포함', desc:'실제 주민등록번호 검증 공식을 적용해 형식적으로 유효한 번호를 생성합니다.'},
          {title:'배치 생성', desc:'최대 10개를 한번에 생성해 대량 테스트 데이터를 빠르게 준비할 수 있습니다.'},
          {title:'완전 가상 데이터', desc:'실제 인물의 개인정보와 무관한 완전히 가상의 데이터입니다.'},
        ]:[
          {title:'Development testing', desc:'Needed for testing registration forms, validation logic, and ID format checks.'},
          {title:'Validation algorithm', desc:'Uses real Korean ID verification formula for format-valid fake numbers.'},
          {title:'Batch generation', desc:'Generate up to 10 at once for bulk test data preparation.'},
          {title:'Completely fake', desc:'Completely fictional data unrelated to any real person.'},
        ]}
        faqs={lang==='ko'?[
          {q:'생성된 번호는 실제 사람 것인가요?', a:'아니요. 형식만 맞는 가상 데이터입니다. 실제 주민등록번호와 우연히 일치할 확률이 극히 낮으며, 실제 개인을 특정할 수 없습니다.'},
          {q:'어떤 용도로 사용해야 하나요?', a:'소프트웨어 개발 테스트, 주민번호 유효성 검사 로직 테스트, UI 폼 테스트 등 개발 목적으로만 사용해야 합니다.'},
          {q:'실제 문서에 사용할 수 있나요?', a:'절대 안 됩니다. 법적으로 타인의 주민등록번호를 도용하거나 허위 번호를 공식 문서에 기재하는 것은 불법입니다.'},
          {q:'주민등록번호 유효성 검사는 어떻게 하나요?', a:'앞 12자리에 [2,3,4,5,6,7,8,9,2,3,4,5] 가중치를 곱해 합산 후 11로 나눈 나머지를 이용해 마지막 자리를 검증합니다.'},
        ]:[
          {q:'Are generated numbers real?', a:'No. They are fake data with valid format only. The chance of matching a real ID is extremely low.'},
          {q:'What should I use this for?', a:'Software development testing, ID validation logic testing, and UI form testing only.'},
          {q:'Can I use this on official documents?', a:'Absolutely not. Using fake or stolen ID numbers on official documents is illegal.'},
          {q:'How does Korean ID validation work?', a:'Multiply first 12 digits by weights [2,3,4,5,6,7,8,9,2,3,4,5], sum them, divide by 11, and use the remainder to verify the last digit.'},
        ]}
        keywords="주민등록번호 생성기 · 가상 주민번호 · 테스트 주민번호 · 주민등록번호 테스트 · Korean ID generator · fake Korean ID · test data generator · 주민번호 생성 · resident registration number test"
      />
    </div>
  )
}
