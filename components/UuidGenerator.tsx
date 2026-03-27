'use client'
import { useState, useCallback } from 'react'
import { Copy, CheckCheck, RefreshCw } from 'lucide-react'
import { useLang } from './LangContext'
import ToolFooter from './ToolFooter'

const T = {
  ko: {
    title: 'UUID 생성기',
    desc: 'UUID v1·v4·v7, ULID, 나노ID, 짧은 ID를 즉시 생성. 개발·데이터베이스·API 키 생성에 필수.',
    generate: '생성', copy: '복사', count: '생성 개수',
    format: '형식', bulk: '대량 생성',
  },
  en: {
    title: 'UUID Generator',
    desc: 'Generate UUID v1, v4, v7, ULID, NanoID, and Short IDs instantly. Essential for dev, databases, and API keys.',
    generate: 'Generate', copy: 'Copy', count: 'Count',
    format: 'Format', bulk: 'Bulk Generate',
  }
}

function generateUuidV4(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

function generateUuidV1(): string {
  const now = Date.now()
  const timeHex = now.toString(16).padStart(12, '0')
  const rand = Math.random().toString(16).slice(2, 14).padStart(12, '0')
  return `${timeHex.slice(0, 8)}-${timeHex.slice(8, 12)}-1${rand.slice(0, 3)}-${(Math.random() * 16 | 8).toString(16)}${(Math.random() * 256 | 0).toString(16).padStart(2, '0')}-${rand.slice(3, 15)}`
}

function generateUlid(): string {
  const ENCODING = '0123456789ABCDEFGHJKMNPQRSTVWXYZ'
  const now = Date.now()
  let t = now
  let time = ''
  for (let i = 9; i >= 0; i--) {
    time = ENCODING[t % 32] + time
    t = Math.floor(t / 32)
  }
  let rand = ''
  for (let i = 0; i < 16; i++) rand += ENCODING[Math.floor(Math.random() * 32)]
  return time + rand
}

function generateNanoId(size = 21): string {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_-'
  let id = ''
  for (let i = 0; i < size; i++) id += chars[Math.floor(Math.random() * chars.length)]
  return id
}

function generateShortId(): string {
  return Math.random().toString(36).slice(2, 10).toUpperCase()
}

function generateObjectId(): string {
  const timestamp = Math.floor(Date.now() / 1000).toString(16).padStart(8, '0')
  const random = Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
  return timestamp + random
}

const FORMATS = [
  { id: 'uuidv4', name: 'UUID v4', desc_ko: '완전 랜덤 UUID. 가장 일반적', desc_en: 'Fully random UUID. Most common', fn: generateUuidV4 },
  { id: 'uuidv1', name: 'UUID v1', desc_ko: '타임스탬프 기반 UUID', desc_en: 'Timestamp-based UUID', fn: generateUuidV1 },
  { id: 'ulid', name: 'ULID', desc_ko: '정렬 가능한 타임스탬프 ID', desc_en: 'Sortable timestamp ID', fn: generateUlid },
  { id: 'nanoid', name: 'NanoID', desc_ko: '21자 URL 안전 ID', desc_en: '21-char URL-safe ID', fn: generateNanoId },
  { id: 'shortid', name: 'Short ID', desc_ko: '8자 짧은 ID', desc_en: '8-char short ID', fn: generateShortId },
  { id: 'objectid', name: 'MongoDB ObjectId', desc_ko: 'MongoDB 호환 24자 ID', desc_en: 'MongoDB-compatible 24-char ID', fn: generateObjectId },
]

export default function UuidGenerator() {
  const { lang } = useLang()
  const tx = T[lang]
  const [selectedFormat, setSelectedFormat] = useState('uuidv4')
  const [count, setCount] = useState(5)
  const [ids, setIds] = useState<string[]>(() => Array.from({ length: 5 }, generateUuidV4))
  const [copied, setCopied] = useState<string | null>(null)
  const [copiedAll, setCopiedAll] = useState(false)

  const copy = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text); setCopied(key); setTimeout(() => setCopied(null), 1500)
  }

  const generate = useCallback(() => {
    const fmt = FORMATS.find(f => f.id === selectedFormat)
    if (!fmt) return
    setIds(Array.from({ length: Math.min(count, 100) }, () => fmt.fn()))
  }, [selectedFormat, count])

  const copyAll = async () => {
    await navigator.clipboard.writeText(ids.join('\n'))
    setCopiedAll(true)
    setTimeout(() => setCopiedAll(false), 1500)
  }

  const handleFormatChange = (id: string) => {
    setSelectedFormat(id)
    const fmt = FORMATS.find(f => f.id === id)
    if (fmt) setIds(Array.from({ length: Math.min(count, 100) }, () => fmt.fn()))
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-mono mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />Developer Tool
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-3">{tx.title}</h1>
        <p className="text-slate-300 text-base max-w-xl mx-auto">{tx.desc}</p>
      </div>

      {/* 형식 선택 */}
      <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4 mb-4">
        <label className="text-xs text-slate-400 mb-2 block font-medium">{tx.format}</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {FORMATS.map(f => (
            <button key={f.id} onClick={() => handleFormatChange(f.id)}
              className={`text-left px-3 py-2.5 rounded-lg border transition-all ${selectedFormat === f.id ? 'bg-brand-500/20 border-brand-500/40' : 'border-surface-border bg-[#0f1117] hover:border-brand-500/30'}`}>
              <p className={`text-sm font-bold ${selectedFormat === f.id ? 'text-brand-300' : 'text-slate-200'}`}>{f.name}</p>
              <p className="text-xs text-slate-500 mt-0.5">{lang === 'ko' ? f.desc_ko : f.desc_en}</p>
            </button>
          ))}
        </div>
      </div>

      {/* 생성 설정 */}
      <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4 mb-4">
        <div className="flex items-center gap-3">
          <label className="text-xs text-slate-400">{tx.count}:</label>
          <div className="flex gap-1.5">
            {[1, 5, 10, 20, 50].map(n => (
              <button key={n} onClick={() => setCount(n)}
                className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${count === n ? 'bg-brand-500 border-brand-500 text-white' : 'border-surface-border text-slate-300 bg-[#0f1117]'}`}>
                {n}
              </button>
            ))}
            <input type="number" min={1} max={100} value={count} onChange={e => setCount(Math.min(100, +e.target.value))}
              className="w-16 bg-[#0f1117] border border-surface-border rounded-lg px-2 py-1.5 text-slate-200 text-xs font-mono text-center focus:outline-none focus:border-brand-500/50 transition-all" />
          </div>
          <button onClick={generate}
            className="ml-auto px-5 py-2 rounded-xl bg-brand-500 hover:bg-brand-400 text-white font-bold text-sm transition-all flex items-center gap-2">
            <RefreshCw size={14} /> {tx.generate}
          </button>
        </div>
      </div>

      {/* 결과 */}
      <div className="rounded-xl border border-surface-border bg-[#1a1d27] overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-surface-border bg-[#0f1117]">
          <p className="text-xs font-medium text-slate-200">{ids.length}개 생성됨</p>
          <button onClick={copyAll}
            className={`text-xs px-3 py-1.5 rounded-lg border flex items-center gap-1 transition-all ${copiedAll ? 'bg-brand-500/20 border-brand-500/40 text-brand-400' : 'border-surface-border text-slate-300 hover:border-brand-500/40'}`}>
            {copiedAll ? <CheckCheck size={11} /> : <Copy size={11} />}
            {lang === 'ko' ? '전체 복사' : 'Copy All'}
          </button>
        </div>
        <div className="max-h-96 overflow-y-auto divide-y divide-surface-border">
          {ids.map((id, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-2.5 hover:bg-surface-hover/10 group">
              <span className="text-xs text-slate-600 w-6 flex-shrink-0">{i + 1}</span>
              <code className="flex-1 text-sm font-mono text-slate-200 tracking-wide break-all">{id}</code>
              <button onClick={() => copy(id, id)}
                className={`opacity-0 group-hover:opacity-100 p-1.5 rounded border transition-all ${copied === id ? 'bg-brand-500/20 border-brand-500/40 text-brand-400 opacity-100' : 'border-surface-border text-slate-500 hover:text-brand-400'}`}>
                {copied === id ? <CheckCheck size={12} /> : <Copy size={12} />}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 형식 비교표 */}
      <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4 mt-4">
        <p className="text-xs text-slate-400 font-medium mb-3">{lang === 'ko' ? '📋 ID 형식 비교' : '📋 Format Comparison'}</p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-surface-border">
                <th className="text-left py-2 text-slate-400 font-medium pr-3">{lang === 'ko' ? '형식' : 'Format'}</th>
                <th className="text-left py-2 text-slate-400 font-medium pr-3">{lang === 'ko' ? '길이' : 'Length'}</th>
                <th className="text-left py-2 text-slate-400 font-medium pr-3">{lang === 'ko' ? '정렬 가능' : 'Sortable'}</th>
                <th className="text-left py-2 text-slate-400 font-medium">{lang === 'ko' ? '주요 용도' : 'Main Use'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {[
                ['UUID v4', '36자', 'No', lang === 'ko' ? '범용 고유 ID' : 'General unique ID'],
                ['UUID v1', '36자', 'Yes', lang === 'ko' ? '타임스탬프 추적' : 'Timestamp tracking'],
                ['ULID', '26자', 'Yes', lang === 'ko' ? 'DB 기본키, 시간순 정렬' : 'DB primary key, time-sorted'],
                ['NanoID', '21자', 'No', lang === 'ko' ? 'URL 단축, 토큰' : 'URL shortener, token'],
                ['Short ID', '8자', 'No', lang === 'ko' ? '사용자 친화적 코드' : 'User-friendly codes'],
                ['ObjectId', '24자', 'Yes', lang === 'ko' ? 'MongoDB 기본키' : 'MongoDB primary key'],
              ].map(([fmt, len, sort, use]) => (
                <tr key={fmt as string} className="hover:bg-surface-hover/5">
                  <td className="py-2 font-mono text-brand-400 pr-3">{fmt}</td>
                  <td className="py-2 text-slate-300 pr-3">{len}</td>
                  <td className="py-2 pr-3">
                    <span className={sort === 'Yes' ? 'text-brand-400' : 'text-slate-600'}>{sort}</span>
                  </td>
                  <td className="py-2 text-slate-400">{use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ToolFooter
        toolName={lang === 'ko' ? 'UUID 생성기' : 'UUID Generator'}
        toolUrl="https://keyword-mixer.vercel.app/uuid-generator"
        description={tx.desc}
        howToUse={lang === 'ko' ? [
          { step: '형식 선택', desc: 'UUID v4, ULID, NanoID 등 필요한 ID 형식을 선택하세요.' },
          { step: '생성 개수 설정', desc: '한 번에 생성할 ID 개수를 선택하세요 (최대 100개).' },
          { step: 'ID 생성', desc: '생성 버튼을 클릭하거나 형식 변경 시 자동으로 생성됩니다.' },
          { step: '복사하여 사용', desc: '개별 복사 또는 전체 복사로 ID를 클립보드에 저장하세요.' },
        ] : [
          { step: 'Select format', desc: 'Choose UUID v4, ULID, NanoID, or other ID format.' },
          { step: 'Set count', desc: 'Select how many IDs to generate at once (max 100).' },
          { step: 'Generate', desc: 'Click generate or change format to auto-generate.' },
          { step: 'Copy & use', desc: 'Copy individually or use "Copy All" for all IDs.' },
        ]}
        whyUse={lang === 'ko' ? [
          { title: '6가지 ID 형식', desc: 'UUID v1/v4, ULID, NanoID, Short ID, MongoDB ObjectId를 지원합니다.' },
          { title: '최대 100개 대량 생성', desc: '한 번에 최대 100개의 ID를 생성해 테스트 데이터로 활용합니다.' },
          { title: '개별/전체 복사', desc: '각 ID를 개별 복사하거나 전체를 한 번에 복사할 수 있습니다.' },
          { title: '형식 비교표', desc: '용도별 적합한 ID 형식을 선택할 수 있도록 비교표를 제공합니다.' },
        ] : [
          { title: '6 ID formats', desc: 'UUID v1/v4, ULID, NanoID, Short ID, MongoDB ObjectId supported.' },
          { title: 'Bulk generation (100)', desc: 'Generate up to 100 IDs at once for test data creation.' },
          { title: 'Individual & bulk copy', desc: 'Copy individual IDs or all at once with one click.' },
          { title: 'Format comparison', desc: 'Comparison table helps choose the right format for your use case.' },
        ]}
        faqs={lang === 'ko' ? [
          { q: 'UUID v4 충돌 가능성은?', a: 'UUID v4의 고유성은 약 5.3×10^36가지 조합으로 실질적으로 충돌 가능성이 0에 가깝습니다. 초당 10억 개를 생성해도 100년이 걸려야 50% 확률로 충돌이 발생합니다.' },
          { q: 'ULID와 UUID 차이는?', a: 'ULID는 시간 정보가 포함된 정렬 가능한 ID입니다. 데이터베이스에서 인덱스 효율이 UUID v4보다 좋으며, 생성 시간 순서로 정렬할 수 있습니다.' },
          { q: '어떤 ID 형식을 사용해야 하나요?', a: '범용: UUID v4. 시간 정렬 필요: ULID. URL 사용: NanoID. MongoDB: ObjectId. 사용자에게 보여줄 짧은 코드: Short ID.' },
          { q: '브라우저에서 생성한 UUID는 안전한가요?', a: '이 도구는 클라이언트 사이드에서 Math.random()을 사용합니다. 암호학적으로 완전히 안전한 UUID가 필요하다면 서버 사이드에서 crypto.randomUUID()를 사용하세요.' },
        ] : [
          { q: 'UUID v4 collision probability?', a: 'UUID v4 has ~5.3×10^36 combinations making collision virtually impossible. Even at 1 billion/second, it takes 100 years for a 50% collision chance.' },
          { q: 'ULID vs UUID difference?', a: 'ULID includes timestamp for sortability. Better database index efficiency than UUID v4, and can be sorted by creation time.' },
          { q: 'Which format should I use?', a: 'General: UUID v4. Time-sortable: ULID. URL-safe: NanoID. MongoDB: ObjectId. Short user-facing codes: Short ID.' },
          { q: 'Are browser-generated UUIDs secure?', a: 'This tool uses Math.random() client-side. For cryptographically secure UUIDs, use crypto.randomUUID() server-side.' },
        ]}
        keywords="UUID 생성기 · ULID 생성기 · UUID v4 · NanoID · 고유 ID 생성 · UUID generator · ULID generator · random UUID · unique ID generator · MongoDB ObjectId generator · 랜덤 ID"
      />
    </div>
  )
}
