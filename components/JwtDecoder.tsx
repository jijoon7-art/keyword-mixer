'use client'
import { useState } from 'react'
import { Copy, CheckCheck } from 'lucide-react'
import { useLang } from './LangContext'
import ToolFooter from './ToolFooter'

const T = {
  ko: { title: 'JWT 디코더', desc: 'JSON Web Token을 즉시 디코딩. 헤더·페이로드·만료시간 분석, 서명 검증 안내.' },
  en: { title: 'JWT Decoder', desc: 'Decode JSON Web Tokens instantly. Analyze header, payload, expiry, and signature verification guide.' }
}

function b64Decode(str: string): string {
  try {
    return decodeURIComponent(atob(str.replace(/-/g, '+').replace(/_/g, '/')).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''))
  } catch { return '' }
}

const SAMPLE = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjk5OTk5OTk5OTl9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'

export default function JwtDecoder() {
  const { lang } = useLang()
  const tx = T[lang]
  const [token, setToken] = useState('')
  const [copied, setCopied] = useState<string|null>(null)

  const copy = async (text: string, key: string) => { await navigator.clipboard.writeText(text); setCopied(key); setTimeout(() => setCopied(null), 1500) }

  const decoded = (() => {
    if (!token.trim()) return null
    const parts = token.trim().split('.')
    if (parts.length !== 3) return { error: lang==='ko'?'유효하지 않은 JWT 형식입니다. JWT는 3개의 점(.)으로 구분됩니다.':'Invalid JWT format. JWT must have 3 parts separated by dots.' }
    try {
      const header = JSON.parse(b64Decode(parts[0]))
      const payload = JSON.parse(b64Decode(parts[1]))
      const signature = parts[2]
      const now = Math.floor(Date.now() / 1000)
      const exp = payload.exp ? new Date(payload.exp * 1000) : null
      const iat = payload.iat ? new Date(payload.iat * 1000) : null
      const isExpired = payload.exp ? payload.exp < now : false
      return { header, payload, signature, exp, iat, isExpired }
    } catch { return { error: lang==='ko'?'토큰 디코딩에 실패했습니다.':'Failed to decode token.' } }
  })()

  const JsonDisplay = ({ data, keyName }: { data: object; keyName: string }) => (
    <div className="rounded-xl border border-surface-border bg-[#1a1d27] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-surface-border bg-[#0f1117]">
        <span className="text-sm font-semibold text-slate-200">{keyName}</span>
        <button onClick={() => copy(JSON.stringify(data, null, 2), keyName)} className={`text-xs px-2.5 py-1 rounded border flex items-center gap-1 transition-all ${copied===keyName?'bg-brand-500/20 border-brand-500/40 text-brand-400':'border-surface-border text-slate-400 hover:text-brand-400 hover:border-brand-500/40'}`}>
          {copied===keyName?<CheckCheck size={11}/>:<Copy size={11}/>} {lang==='ko'?'복사':'Copy'}
        </button>
      </div>
      <pre className="px-4 py-3 text-xs text-brand-300 font-mono overflow-auto max-h-48 leading-relaxed">{JSON.stringify(data, null, 2)}</pre>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-mono mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />Free Developer Tool
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-3">{tx.title}</h1>
        <p className="text-slate-300 text-base max-w-xl mx-auto">{tx.desc}</p>
      </div>

      <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4 mb-5">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs text-slate-400 font-medium">{lang==='ko'?'JWT 토큰 입력':'Enter JWT Token'}</label>
          <button onClick={() => setToken(SAMPLE)} className="text-xs text-slate-500 hover:text-brand-400 transition-all">{lang==='ko'?'샘플 토큰':'Sample Token'}</button>
        </div>
        <textarea value={token} onChange={e => setToken(e.target.value)}
          placeholder={lang==='ko'?'JWT 토큰을 붙여넣으세요 (eyJhbGci...)':'Paste your JWT token here (eyJhbGci...)'}
          rows={4} className="w-full bg-[#0f1117] border border-surface-border rounded-lg px-3 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-brand-500/50 transition-all resize-none font-mono" />
      </div>

      {decoded && 'error' in decoded && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 mb-5">
          <p className="text-red-400 text-sm">{decoded.error}</p>
        </div>
      )}

      {decoded && !('error' in decoded) && (
        <div className="flex flex-col gap-4">
          {/* 토큰 상태 */}
          <div className={`rounded-xl border p-4 flex items-center justify-between ${decoded.isExpired ? 'border-red-500/30 bg-red-500/10' : 'border-brand-500/30 bg-brand-500/10'}`}>
            <div>
              <p className={`text-sm font-bold ${decoded.isExpired ? 'text-red-400' : 'text-brand-400'}`}>
                {decoded.isExpired ? (lang==='ko'?'⚠️ 만료된 토큰':'⚠️ Expired Token') : (lang==='ko'?'✅ 유효한 토큰':'✅ Valid Token')}
              </p>
              {decoded.exp && <p className="text-xs text-slate-400 mt-0.5">{lang==='ko'?'만료':'Expires'}: {decoded.exp.toLocaleString('ko-KR')}</p>}
              {decoded.iat && <p className="text-xs text-slate-400">{lang==='ko'?'발급':'Issued'}: {decoded.iat.toLocaleString('ko-KR')}</p>}
            </div>
            <div className="text-right text-xs text-slate-400">
              <p>alg: <span className="text-brand-400 font-mono">{decoded.header.alg}</span></p>
              <p>typ: <span className="text-brand-400 font-mono">{decoded.header.typ}</span></p>
            </div>
          </div>

          <JsonDisplay data={decoded.header} keyName={lang==='ko'?'헤더 (Header)':'Header'} />
          <JsonDisplay data={decoded.payload} keyName={lang==='ko'?'페이로드 (Payload)':'Payload'} />

          <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4">
            <p className="text-sm font-semibold text-slate-200 mb-2">{lang==='ko'?'서명 (Signature)':'Signature'}</p>
            <p className="text-xs font-mono text-slate-400 break-all">{decoded.signature}</p>
            <p className="text-xs text-yellow-400 mt-2">⚠️ {lang==='ko'?'서명 검증은 서버에서 Secret Key를 사용해 수행해야 합니다. 이 도구는 디코딩만 지원합니다.':'Signature verification requires a Secret Key on the server. This tool only decodes the token.'}</p>
          </div>
        </div>
      )}

      <ToolFooter
        toolName={lang==='ko'?'JWT 디코더':'JWT Decoder'}
        toolUrl="https://keyword-mixer.vercel.app/jwt-decoder"
        description={tx.desc}
        howToUse={lang==='ko'?[
          {step:'JWT 붙여넣기', desc:'JWT 토큰을 입력창에 붙여넣으세요. 샘플 버튼으로 예시를 확인할 수 있습니다.'},
          {step:'디코딩 결과 확인', desc:'헤더, 페이로드가 자동으로 파싱되어 JSON 형태로 표시됩니다.'},
          {step:'만료 상태 확인', desc:'토큰 상단에 유효/만료 상태와 발급/만료 시간이 표시됩니다.'},
          {step:'내용 복사', desc:'헤더/페이로드 복사 버튼으로 JSON 내용을 복사할 수 있습니다.'},
        ]:[
          {step:'Paste JWT token', desc:'Paste your JWT token into the input box. Use Sample Token for a demo.'},
          {step:'View decoded result', desc:'Header and payload are automatically parsed and displayed as JSON.'},
          {step:'Check expiry status', desc:'Token validity, issued time, and expiry time are shown at the top.'},
          {step:'Copy content', desc:'Use copy buttons to copy header or payload JSON content.'},
        ]}
        whyUse={lang==='ko'?[
          {title:'즉시 디코딩', desc:'JWT를 붙여넣으면 헤더·페이로드를 즉시 읽기 쉬운 JSON으로 변환합니다.'},
          {title:'만료 시간 표시', desc:'토큰의 exp 값을 사람이 읽을 수 있는 날짜/시간으로 변환합니다.'},
          {title:'보안 경고', desc:'서명 검증은 서버에서만 가능함을 명확히 안내합니다.'},
          {title:'개발 디버깅', desc:'API 개발 시 JWT 내용 확인과 문제 디버깅에 유용합니다.'},
        ]:[
          {title:'Instant decoding', desc:'Paste JWT to instantly convert header and payload to readable JSON.'},
          {title:'Expiry time display', desc:'Converts exp value to human-readable date/time format.'},
          {title:'Security warning', desc:'Clearly indicates that signature verification requires server-side validation.'},
          {title:'Development debugging', desc:'Useful for inspecting JWT content during API development.'},
        ]}
        faqs={lang==='ko'?[
          {q:'JWT란 무엇인가요?', a:'JSON Web Token의 약자로, 서버와 클라이언트 간 정보를 안전하게 전달하기 위한 토큰 형식입니다. 헤더.페이로드.서명의 3부분으로 구성됩니다.'},
          {q:'JWT는 안전한가요?', a:'JWT 자체는 암호화가 아닌 서명입니다. 페이로드는 Base64로 인코딩되어 누구나 디코딩할 수 있으므로 민감한 정보를 포함하면 안 됩니다.'},
          {q:'이 도구에서 토큰이 저장되나요?', a:'아니요. 모든 처리는 브라우저에서 이루어지며 서버에 토큰이 전송되지 않습니다.'},
          {q:'만료된 JWT는 어떻게 갱신하나요?', a:'Refresh Token을 사용해 새 Access Token을 발급받아야 합니다. 이는 서버 측 구현이 필요합니다.'},
        ]:[
          {q:'What is a JWT?', a:'JSON Web Token: a compact format for securely transmitting information between parties. Consists of header.payload.signature.'},
          {q:'Is JWT secure?', a:'JWT is signed, not encrypted. The payload is Base64 encoded and readable by anyone. Never include sensitive data in the payload.'},
          {q:'Is my token stored here?', a:'No. All processing happens in your browser. No token data is transmitted to any server.'},
          {q:'How do I refresh an expired JWT?', a:'Use a Refresh Token to obtain a new Access Token. This requires server-side implementation.'},
        ]}
        keywords="JWT 디코더 · JWT 파싱 · JSON Web Token · JWT 분석 · JWT 만료 확인 · JWT decoder · JWT parser · JSON Web Token decoder · JWT debugger · JWT online decoder · free JWT tool"
      />
    </div>
  )
}
