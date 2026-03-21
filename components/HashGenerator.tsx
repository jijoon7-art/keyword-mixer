'use client'

import { useState, useEffect } from 'react'
import { Copy, CheckCheck, Upload } from 'lucide-react'
import { useLang } from './LangContext'
import ToolFooter from './ToolFooter'

const T = {
  ko: {
    title: 'Hash 생성기',
    desc: 'MD5, SHA-1, SHA-256, SHA-512 해시를 즉시 생성. 텍스트·파일 해시 지원. 데이터 무결성 검증에 활용.',
    textTab: '텍스트 해시',
    fileTab: '파일 해시',
    input: '텍스트 입력',
    placeholder: '해시를 생성할 텍스트를 입력하세요',
    copy: '복사',
    copied: '복사됨',
    uppercase: '대문자',
    lowercase: '소문자',
    computing: '계산 중...',
    dragFile: '파일을 드래그하거나 클릭하여 선택',
    fileHint: '모든 파일 형식 지원 · 브라우저에서 처리하여 파일이 서버에 업로드되지 않음',
  },
  en: {
    title: 'Hash Generator',
    desc: 'Generate MD5, SHA-1, SHA-256, SHA-512 hashes instantly. Supports text and file hashing.',
    textTab: 'Text Hash',
    fileTab: 'File Hash',
    input: 'Input Text',
    placeholder: 'Enter text to generate hash',
    copy: 'Copy',
    copied: 'Copied!',
    uppercase: 'UPPER',
    lowercase: 'lower',
    computing: 'Computing...',
    dragFile: 'Drag a file here or click to select',
    fileHint: 'All file types supported · Processed in browser, file is not uploaded',
  }
}

async function sha(algorithm: string, data: ArrayBuffer): Promise<string> {
  const hashBuffer = await crypto.subtle.digest(algorithm, data)
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('')
}

// Simple MD5 implementation
function md5(input: string): string {
  function safeAdd(x: number, y: number) {
    const lsw = (x & 0xffff) + (y & 0xffff)
    const msw = (x >> 16) + (y >> 16) + (lsw >> 16)
    return (msw << 16) | (lsw & 0xffff)
  }
  function bitRotateLeft(num: number, cnt: number) { return (num << cnt) | (num >>> (32 - cnt)) }
  function md5cmn(q: number, a: number, b: number, x: number, s: number, t: number) {
    return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b)
  }
  function md5ff(a: number, b: number, c: number, d: number, x: number, s: number, t: number) { return md5cmn((b & c) | (~b & d), a, b, x, s, t) }
  function md5gg(a: number, b: number, c: number, d: number, x: number, s: number, t: number) { return md5cmn((b & d) | (c & ~d), a, b, x, s, t) }
  function md5hh(a: number, b: number, c: number, d: number, x: number, s: number, t: number) { return md5cmn(b ^ c ^ d, a, b, x, s, t) }
  function md5ii(a: number, b: number, c: number, d: number, x: number, s: number, t: number) { return md5cmn(c ^ (b | ~d), a, b, x, s, t) }

  const utf8 = unescape(encodeURIComponent(input))
  const bytes = new Array(utf8.length)
  for (let i = 0; i < utf8.length; i++) bytes[i] = utf8.charCodeAt(i)

  bytes.push(0x80)
  while (bytes.length % 64 !== 56) bytes.push(0)
  const bitlen = (input.length * 8)
  bytes.push(bitlen & 0xff, (bitlen >> 8) & 0xff, (bitlen >> 16) & 0xff, (bitlen >> 24) & 0xff, 0, 0, 0, 0)

  let [a, b, c, d] = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476]

  for (let i = 0; i < bytes.length; i += 64) {
    const M: number[] = []
    for (let j = 0; j < 16; j++) M[j] = bytes[i + j * 4] | (bytes[i + j * 4 + 1] << 8) | (bytes[i + j * 4 + 2] << 16) | (bytes[i + j * 4 + 3] << 24)
    let [aa, bb, cc, dd] = [a, b, c, d]
    a = md5ff(a,b,c,d,M[0],7,-680876936); d = md5ff(d,a,b,c,M[1],12,-389564586); c = md5ff(c,d,a,b,M[2],17,606105819); b = md5ff(b,c,d,a,M[3],22,-1044525330)
    a = md5ff(a,b,c,d,M[4],7,-176418897); d = md5ff(d,a,b,c,M[5],12,1200080426); c = md5ff(c,d,a,b,M[6],17,-1473231341); b = md5ff(b,c,d,a,M[7],22,-45705983)
    a = md5ff(a,b,c,d,M[8],7,1770035416); d = md5ff(d,a,b,c,M[9],12,-1958414417); c = md5ff(c,d,a,b,M[10],17,-42063); b = md5ff(b,c,d,a,M[11],22,-1990404162)
    a = md5ff(a,b,c,d,M[12],7,1804603682); d = md5ff(d,a,b,c,M[13],12,-40341101); c = md5ff(c,d,a,b,M[14],17,-1502002290); b = md5ff(b,c,d,a,M[15],22,1236535329)
    a = md5gg(a,b,c,d,M[1],5,-165796510); d = md5gg(d,a,b,c,M[6],9,-1069501632); c = md5gg(c,d,a,b,M[11],14,643717713); b = md5gg(b,c,d,a,M[0],20,-373897302)
    a = md5gg(a,b,c,d,M[5],5,-701558691); d = md5gg(d,a,b,c,M[10],9,38016083); c = md5gg(c,d,a,b,M[15],14,-660478335); b = md5gg(b,c,d,a,M[4],20,-405537848)
    a = md5gg(a,b,c,d,M[9],5,568446438); d = md5gg(d,a,b,c,M[14],9,-1019803690); c = md5gg(c,d,a,b,M[3],14,-187363961); b = md5gg(b,c,d,a,M[8],20,1163531501)
    a = md5gg(a,b,c,d,M[13],5,-1444681467); d = md5gg(d,a,b,c,M[2],9,-51403784); c = md5gg(c,d,a,b,M[7],14,1735328473); b = md5gg(b,c,d,a,M[12],20,-1926607734)
    a = md5hh(a,b,c,d,M[5],4,-378558); d = md5hh(d,a,b,c,M[8],11,-2022574463); c = md5hh(c,d,a,b,M[11],16,1839030562); b = md5hh(b,c,d,a,M[14],23,-35309556)
    a = md5hh(a,b,c,d,M[1],4,-1530992060); d = md5hh(d,a,b,c,M[4],11,1272893353); c = md5hh(c,d,a,b,M[7],16,-155497632); b = md5hh(b,c,d,a,M[10],23,-1094730640)
    a = md5hh(a,b,c,d,M[13],4,681279174); d = md5hh(d,a,b,c,M[0],11,-358537222); c = md5hh(c,d,a,b,M[3],16,-722521979); b = md5hh(b,c,d,a,M[6],23,76029189)
    a = md5hh(a,b,c,d,M[9],4,-640364487); d = md5hh(d,a,b,c,M[12],11,-421815835); c = md5hh(c,d,a,b,M[15],16,530742520); b = md5hh(b,c,d,a,M[2],23,-995338651)
    a = md5ii(a,b,c,d,M[0],6,-198630844); d = md5ii(d,a,b,c,M[7],10,1126891415); c = md5ii(c,d,a,b,M[14],15,-1416354905); b = md5ii(b,c,d,a,M[5],21,-57434055)
    a = md5ii(a,b,c,d,M[12],6,1700485571); d = md5ii(d,a,b,c,M[3],10,-1894986606); c = md5ii(c,d,a,b,M[10],15,-1051523); b = md5ii(b,c,d,a,M[1],21,-2054922799)
    a = md5ii(a,b,c,d,M[8],6,1873313359); d = md5ii(d,a,b,c,M[15],10,-30611744); c = md5ii(c,d,a,b,M[6],15,-1560198380); b = md5ii(b,c,d,a,M[13],21,1309151649)
    a = md5ii(a,b,c,d,M[4],6,-145523070); d = md5ii(d,a,b,c,M[11],10,-1120210379); c = md5ii(c,d,a,b,M[2],15,718787259); b = md5ii(b,c,d,a,M[9],21,-343485551)
    a = safeAdd(a, aa); b = safeAdd(b, bb); c = safeAdd(c, cc); d = safeAdd(d, dd)
  }
  return [a,b,c,d].map(n => [(n & 0xff).toString(16).padStart(2,'0'), ((n >> 8) & 0xff).toString(16).padStart(2,'0'), ((n >> 16) & 0xff).toString(16).padStart(2,'0'), ((n >> 24) & 0xff).toString(16).padStart(2,'0')].join('')).join('')
}

export default function HashGenerator() {
  const { lang } = useLang()
  const tx = T[lang]
  const [tab, setTab] = useState<'text' | 'file'>('text')
  const [input, setInput] = useState('')
  const [hashes, setHashes] = useState<Record<string, string>>({})
  const [upper, setUpper] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)
  const [fileName, setFileName] = useState('')
  const [computing, setComputing] = useState(false)

  const computeTextHashes = async (text: string) => {
    if (!text) { setHashes({}); return }
    const enc = new TextEncoder().encode(text)
    const [sha1, sha256, sha512] = await Promise.all([
      sha('SHA-1', enc.buffer as ArrayBuffer),
      sha('SHA-256', enc.buffer as ArrayBuffer),
      sha('SHA-512', enc.buffer as ArrayBuffer),
    ])
    setHashes({ md5: md5(text), sha1, sha256, sha512 })
  }

  useEffect(() => { computeTextHashes(input) }, [input])

  const computeFileHash = async (file: File) => {
    setComputing(true); setFileName(file.name)
    const buf = await file.arrayBuffer()
    const [sha1, sha256, sha512] = await Promise.all([
      sha('SHA-1', buf), sha('SHA-256', buf), sha('SHA-512', buf),
    ])
    const textDec = new TextDecoder('utf-8')
    try { const text = textDec.decode(buf.slice(0, 1024 * 1024)); setHashes({ md5: md5(text), sha1, sha256, sha512 }) }
    catch { setHashes({ md5: '-', sha1, sha256, sha512 }) }
    setComputing(false)
  }

  const copy = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text); setCopied(key); setTimeout(() => setCopied(null), 1500)
  }

  const fmt = (h: string) => h ? (upper ? h.toUpperCase() : h) : ''

  const ALGOS = [
    { key: 'md5', label: 'MD5', bits: 128, warn: lang === 'ko' ? '⚠️ 암호화 용도 비권장' : '⚠️ Not for crypto' },
    { key: 'sha1', label: 'SHA-1', bits: 160, warn: lang === 'ko' ? '⚠️ 구식 알고리즘' : '⚠️ Deprecated' },
    { key: 'sha256', label: 'SHA-256', bits: 256, warn: lang === 'ko' ? '✅ 현재 권장 표준' : '✅ Recommended' },
    { key: 'sha512', label: 'SHA-512', bits: 512, warn: lang === 'ko' ? '✅ 고강도 보안' : '✅ High security' },
  ]

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-mono mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />Free Tool
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-3">{tx.title}</h1>
        <p className="text-slate-300 text-base max-w-xl mx-auto">{tx.desc}</p>
      </div>

      <div className="flex rounded-xl border border-surface-border overflow-hidden mb-5">
        {[['text', tx.textTab], ['file', tx.fileTab]].map(([k, l]) => (
          <button key={k} onClick={() => setTab(k as any)}
            className={`flex-1 py-2.5 text-sm font-medium transition-all ${tab === k ? 'bg-brand-500 text-white font-bold' : 'bg-[#1a1d27] text-slate-300 hover:text-white'}`}>{l}</button>
        ))}
      </div>

      {tab === 'text' ? (
        <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4 mb-5">
          <textarea value={input} onChange={e => setInput(e.target.value)}
            placeholder={tx.placeholder} rows={4}
            className="w-full bg-[#0f1117] border border-surface-border rounded-lg px-3 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-brand-500/50 transition-all resize-none font-mono" />
          <p className="text-xs text-slate-500 mt-1">{input.length}{lang === 'ko' ? '자 · ' : ' chars · '}{new Blob([input]).size} bytes</p>
        </div>
      ) : (
        <label className="block cursor-pointer mb-5">
          <div onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) computeFileHash(f) }}
            className="rounded-xl border-2 border-dashed border-surface-border hover:border-brand-500/40 hover:bg-brand-500/5 p-8 text-center transition-all">
            <Upload size={24} className="mx-auto text-slate-500 mb-2" />
            <p className="text-slate-300 text-sm font-medium">{fileName || tx.dragFile}</p>
            <p className="text-slate-500 text-xs mt-1">{tx.fileHint}</p>
          </div>
          <input type="file" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) computeFileHash(f) }} />
        </label>
      )}

      {/* 대소문자 토글 */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs text-slate-400">{lang === 'ko' ? '표시 형식:' : 'Format:'}</span>
        <div className="flex rounded-lg border border-surface-border overflow-hidden">
          <button onClick={() => setUpper(false)} className={`px-3 py-1 text-xs font-mono transition-all ${!upper ? 'bg-brand-500 text-white font-bold' : 'bg-[#0f1117] text-slate-400'}`}>{tx.lowercase}</button>
          <button onClick={() => setUpper(true)} className={`px-3 py-1 text-xs font-mono transition-all ${upper ? 'bg-brand-500 text-white font-bold' : 'bg-[#0f1117] text-slate-400'}`}>{tx.uppercase}</button>
        </div>
      </div>

      {/* 해시 결과 */}
      {computing ? (
        <div className="text-center py-8 text-slate-400 text-sm">{tx.computing}</div>
      ) : (
        <div className="flex flex-col gap-3">
          {ALGOS.map(a => (
            <div key={a.key} className={`rounded-xl border p-4 ${a.key === 'sha256' || a.key === 'sha512' ? 'border-brand-500/20 bg-brand-500/5' : 'border-surface-border bg-[#1a1d27]'}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-200">{a.label}</span>
                  <span className="text-xs text-slate-600">{a.bits}-bit</span>
                  <span className="text-xs text-slate-500">{a.warn}</span>
                </div>
                <button onClick={() => copy(fmt(hashes[a.key] || ''), a.key)} disabled={!hashes[a.key]}
                  className={`p-1.5 rounded border transition-all ${copied === a.key ? 'bg-brand-500/20 border-brand-500/40 text-brand-400' : 'border-surface-border text-slate-500 hover:text-brand-400 hover:border-brand-500/40 disabled:opacity-30'}`}>
                  {copied === a.key ? <CheckCheck size={13} /> : <Copy size={13} />}
                </button>
              </div>
              <code className={`text-xs font-mono break-all leading-relaxed ${a.key === 'sha256' || a.key === 'sha512' ? 'text-brand-300' : 'text-slate-400'}`}>
                {hashes[a.key] ? fmt(hashes[a.key]) : (input || fileName ? '' : (lang === 'ko' ? '텍스트를 입력하세요' : 'Enter text above'))}
              </code>
            </div>
          ))}
        </div>
      )}

      <ToolFooter
        toolName={lang === 'ko' ? 'Hash 생성기' : 'Hash Generator'}
        toolUrl="https://keyword-mixer.vercel.app/hash-generator"
        description={tx.desc}
        howToUse={lang === 'ko' ? [
          { step: '텍스트 또는 파일 선택', desc: '텍스트 탭에서 텍스트를 입력하거나 파일 탭에서 파일을 선택하세요.' },
          { step: '즉시 해시 확인', desc: '입력과 동시에 MD5, SHA-1, SHA-256, SHA-512 해시가 자동 생성됩니다.' },
          { step: '형식 선택', desc: '대문자/소문자 토글로 원하는 형식을 선택하세요.' },
          { step: '복사하여 사용', desc: '각 해시 오른쪽 복사 버튼으로 원하는 알고리즘의 해시를 복사하세요.' },
        ] : [
          { step: 'Select text or file', desc: 'Enter text in the Text tab, or upload a file in the File tab.' },
          { step: 'Get instant hashes', desc: 'MD5, SHA-1, SHA-256, SHA-512 hashes generate automatically.' },
          { step: 'Choose format', desc: 'Toggle between uppercase and lowercase hash display.' },
          { step: 'Copy hash', desc: 'Use copy buttons to save any algorithm\'s hash to clipboard.' },
        ]}
        whyUse={lang === 'ko' ? [
          { title: '4가지 알고리즘 동시 생성', desc: 'MD5, SHA-1, SHA-256, SHA-512를 한번에 생성해 필요한 것을 선택하세요.' },
          { title: '파일 해시 지원', desc: '파일을 업로드하면 파일의 무결성을 검증하는 해시를 생성합니다.' },
          { title: '보안 등급 안내', desc: 'SHA-256/512가 현재 권장 표준임을 명확히 안내합니다.' },
          { title: '브라우저에서 처리', desc: '파일이 서버에 업로드되지 않아 개인정보가 보호됩니다.' },
        ] : [
          { title: '4 algorithms at once', desc: 'Generate MD5, SHA-1, SHA-256, SHA-512 simultaneously.' },
          { title: 'File hash support', desc: 'Upload files to verify integrity with cryptographic hashes.' },
          { title: 'Security ratings', desc: 'Clearly indicates which algorithms are recommended (SHA-256/512).' },
          { title: 'Browser processing', desc: 'Files are not uploaded to servers, protecting your privacy.' },
        ]}
        faqs={lang === 'ko' ? [
          { q: 'MD5와 SHA-256의 차이는?', a: 'MD5는 빠르지만 보안 취약점이 발견되어 암호화 용도로는 부적합합니다. SHA-256은 현재 표준이며 암호화·디지털 서명에 권장됩니다.' },
          { q: '해시는 어디에 사용하나요?', a: '파일 무결성 검증(다운로드 파일이 변조되지 않았는지), 비밀번호 저장, 디지털 서명, 블록체인 등에 사용됩니다.' },
          { q: '같은 입력은 항상 같은 해시를 생성하나요?', a: '네. 해시 함수는 결정론적입니다. 같은 입력은 항상 같은 해시를 출력합니다. 단 1글자만 달라져도 완전히 다른 해시가 생성됩니다.' },
          { q: '해시에서 원본 텍스트를 복원할 수 있나요?', a: '이론적으로 불가능합니다. 해시는 단방향 함수입니다. 단, 짧고 단순한 텍스트는 레인보우 테이블 공격으로 역추적될 수 있습니다.' },
        ] : [
          { q: 'What\'s the difference between MD5 and SHA-256?', a: 'MD5 is fast but has vulnerabilities — not suitable for cryptography. SHA-256 is the current standard, recommended for encryption and digital signatures.' },
          { q: 'What are hashes used for?', a: 'File integrity verification, password storage, digital signatures, blockchain, and data deduplication.' },
          { q: 'Does the same input always produce the same hash?', a: 'Yes. Hash functions are deterministic. Same input → same output. Even 1 character change produces a completely different hash.' },
          { q: 'Can the original text be recovered from a hash?', a: 'Theoretically impossible. Hashes are one-way functions. However, short simple texts can be reverse-looked up via rainbow tables.' },
        ]}
        keywords="Hash 생성기 · MD5 생성기 · SHA-256 생성기 · SHA-512 · 해시 함수 · 파일 해시 · 체크섬 · hash generator · MD5 hash · SHA-256 generator · SHA-512 hash · checksum generator · file hash · free hash tool"
      />
    </div>
  )
}
