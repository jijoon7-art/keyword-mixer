'use client'

import { useState, useEffect, useRef } from 'react'
import ToolFooter from './ToolFooter'
import { Download, Copy, CheckCheck } from 'lucide-react'

const QR_TYPES = [
  { key: 'url', label: 'URL', placeholder: 'https://example.com' },
  { key: 'text', label: '텍스트', placeholder: '원하는 텍스트를 입력하세요' },
  { key: 'email', label: '이메일', placeholder: 'example@email.com' },
  { key: 'phone', label: '전화번호', placeholder: '010-1234-5678' },
  { key: 'sms', label: 'SMS', placeholder: '010-1234-5678' },
  { key: 'wifi', label: 'WiFi', placeholder: 'SSID:MyWifi,PWD:password123' },
]

const SIZES = [128, 256, 512, 1024]
const COLORS = ['#000000', '#1a1d27', '#16213e', '#0f3460', '#533483', '#e94560', '#ff6b6b', '#22c55e', '#3b82f6']

export default function QRGenerator() {
  const [type, setType] = useState('url')
  const [value, setValue] = useState('')
  const [size, setSize] = useState(256)
  const [fgColor, setFgColor] = useState('#000000')
  const [bgColor, setBgColor] = useState('#ffffff')
  const [qrUrl, setQrUrl] = useState('')
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')

  const getQrData = () => {
    if (!value.trim()) return ''
    switch (type) {
      case 'email': return `mailto:${value}`
      case 'phone': return `tel:${value}`
      case 'sms': return `sms:${value}`
      case 'wifi': {
        const parts = value.split(',')
        const ssid = parts[0]?.replace('SSID:', '') ?? ''
        const pwd = parts[1]?.replace('PWD:', '') ?? ''
        return `WIFI:T:WPA;S:${ssid};P:${pwd};;`
      }
      default: return value
    }
  }

  const generate = () => {
    const data = getQrData()
    if (!data) { setError('내용을 입력해주세요'); return }
    setError('')
    const fg = fgColor.replace('#', '')
    const bg = bgColor.replace('#', '')
    const url = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(data)}&color=${fg}&bgcolor=${bg}&qzone=1&format=png`
    setQrUrl(url)
  }

  const download = async () => {
    if (!qrUrl) return
    const res = await fetch(qrUrl)
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `qrcode_${Date.now()}.png`
    a.click(); URL.revokeObjectURL(url)
  }

  const copyUrl = async () => {
    await navigator.clipboard.writeText(qrUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-mono mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
          Free Tool
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-3 tracking-tight">QR코드 생성기</h1>
        <p className="text-slate-300 text-base max-w-lg mx-auto">
          URL·텍스트·이메일·전화·WiFi QR코드 무료 생성. 색상 커스텀, 고해상도 PNG 다운로드.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Settings */}
        <div className="flex flex-col gap-4">
          {/* Type */}
          <div className="rounded-xl border border-surface-border bg-surface-card p-5">
            <p className="text-xs text-slate-400 mb-3 font-medium">QR코드 유형</p>
            <div className="flex flex-wrap gap-1.5">
              {QR_TYPES.map(t => (
                <button
                  key={t.key}
                  onClick={() => { setType(t.key); setValue('') }}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${type === t.key ? 'bg-brand-500 border-brand-500 text-white font-bold' : 'border-surface-border text-slate-300 hover:border-brand-500/40 hover:text-brand-300 bg-surface-DEFAULT'}`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="rounded-xl border border-surface-border bg-surface-card p-5">
            <label className="text-xs text-slate-400 mb-2 block font-medium">내용 입력</label>
            <textarea
              value={value}
              onChange={e => setValue(e.target.value)}
              placeholder={QR_TYPES.find(t => t.key === type)?.placeholder ?? ''}
              rows={4}
              className="w-full bg-surface-DEFAULT border border-surface-border rounded-lg px-3 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-brand-500/50 transition-all resize-none"
            />
            {type === 'wifi' && (
              <p className="text-xs text-slate-500 mt-1">형식: SSID:네트워크이름,PWD:비밀번호</p>
            )}
          </div>

          {/* Customize */}
          <div className="rounded-xl border border-surface-border bg-surface-card p-5">
            <p className="text-xs text-slate-400 mb-3 font-medium">커스터마이징</p>

            {/* Size */}
            <div className="mb-3">
              <p className="text-xs text-slate-500 mb-1.5">크기 (px)</p>
              <div className="flex gap-1.5">
                {SIZES.map(s => (
                  <button key={s} onClick={() => setSize(s)} className={`flex-1 py-1.5 rounded-lg border text-xs font-mono transition-all ${size === s ? 'bg-brand-500 border-brand-500 text-white font-bold' : 'border-surface-border text-slate-300 hover:border-brand-500/40 bg-surface-DEFAULT'}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-slate-500 mb-1.5">QR 색상</p>
                <div className="flex flex-wrap gap-1.5">
                  {COLORS.map(c => (
                    <button key={c} onClick={() => setFgColor(c)} className={`w-6 h-6 rounded border-2 transition-all ${fgColor === c ? 'border-brand-400 scale-110' : 'border-transparent'}`} style={{ backgroundColor: c }} />
                  ))}
                  <input type="color" value={fgColor} onChange={e => setFgColor(e.target.value)} className="w-6 h-6 rounded border border-surface-border cursor-pointer bg-transparent" />
                </div>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1.5">배경 색상</p>
                <div className="flex flex-wrap gap-1.5">
                  {['#ffffff', '#f8f9fa', '#f0fdf4', '#eff6ff', '#fefce8', '#000000'].map(c => (
                    <button key={c} onClick={() => setBgColor(c)} className={`w-6 h-6 rounded border-2 transition-all ${bgColor === c ? 'border-brand-400 scale-110' : 'border-surface-border'}`} style={{ backgroundColor: c }} />
                  ))}
                  <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} className="w-6 h-6 rounded border border-surface-border cursor-pointer bg-transparent" />
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={generate}
            disabled={!value.trim()}
            className="w-full py-3 rounded-xl bg-brand-500 hover:bg-brand-400 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm transition-all shadow-[0_4px_15px_rgba(34,197,94,0.3)]"
          >
            QR코드 생성하기
          </button>
          {error && <p className="text-xs text-red-400">{error}</p>}
        </div>

        {/* Preview */}
        <div className="rounded-xl border border-surface-border bg-surface-card p-5 flex flex-col items-center gap-4">
          <p className="text-sm font-medium text-slate-200 self-start">미리보기</p>

          {qrUrl ? (
            <>
              <div className="p-4 rounded-xl" style={{ backgroundColor: bgColor }}>
                <img src={qrUrl} alt="QR Code" className="w-48 h-48 object-contain" />
              </div>
              <p className="text-xs text-slate-400 text-center">{size}×{size}px · PNG</p>
              <div className="flex gap-2 w-full">
                <button
                  onClick={download}
                  className="flex-1 py-2.5 rounded-lg bg-brand-500 hover:bg-brand-400 text-white font-bold text-sm transition-all flex items-center justify-center gap-2"
                >
                  <Download size={14} /> PNG 다운로드
                </button>
                <button
                  onClick={copyUrl}
                  className={`px-4 py-2.5 rounded-lg border text-sm transition-all flex items-center gap-1.5 ${copied ? 'bg-brand-500/20 border-brand-500/40 text-brand-400' : 'border-surface-border text-slate-300 hover:border-brand-500/40 hover:text-brand-300'}`}
                >
                  {copied ? <CheckCheck size={14} /> : <Copy size={14} />}
                  URL
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center w-full min-h-[280px] rounded-xl border-2 border-dashed border-surface-border">
              <p className="text-slate-600 text-sm">QR코드가 여기에 표시됩니다</p>
            </div>
          )}
        </div>
      </div>

      <ToolFooter
        toolName="QR코드 생성기"
        toolUrl="https://keyword-mixer.vercel.app/qr-generator"
        description="URL·텍스트·이메일·전화·WiFi QR코드 무료 생성. 색상 커스텀, 고해상도 PNG 다운로드."
        howToUse={[
          { step: 'QR코드 유형 선택', desc: 'URL, 텍스트, 이메일, 전화번호, SMS, WiFi 중 원하는 유형을 선택하세요.' },
          { step: '내용 입력', desc: 'QR코드에 담을 내용을 입력하세요. WiFi는 SSID와 비밀번호를 입력합니다.' },
          { step: '커스터마이징', desc: 'QR코드 크기(128~1024px)와 색상을 원하는 대로 설정하세요.' },
          { step: 'PNG 다운로드', desc: '생성 버튼을 눌러 미리보기를 확인하고 고해상도 PNG로 다운로드하세요.' },
        ]}
        whyUse={[
          { title: '완전 무료', desc: '로그인 없이 무제한으로 QR코드를 생성할 수 있습니다.' },
          { title: '다양한 유형 지원', desc: 'URL뿐 아니라 WiFi, 전화번호, SMS 등 5가지 유형을 지원합니다.' },
          { title: '고해상도 출력', desc: '최대 1024px 고해상도로 인쇄물에도 선명하게 사용할 수 있습니다.' },
          { title: '색상 커스텀', desc: 'QR코드와 배경 색상을 자유롭게 설정해 브랜드에 맞게 활용하세요.' },
        ]}
        faqs={[
          { q: 'QR코드는 얼마나 오래 사용할 수 있나요?', a: '생성된 QR코드는 영구적으로 사용 가능합니다. URL QR코드의 경우 해당 URL이 유효한 한 계속 작동합니다.' },
          { q: 'WiFi QR코드는 어떻게 만드나요?', a: 'WiFi 유형 선택 후 SSID:네트워크이름,PWD:비밀번호 형식으로 입력하세요. 스마트폰으로 스캔하면 자동으로 WiFi에 연결됩니다.' },
          { q: '생성된 QR코드를 상업적으로 사용해도 되나요?', a: '네, 상업적 목적으로도 자유롭게 사용하실 수 있습니다.' },
          { q: 'QR코드 인식이 안 될 때는?', a: '배경과 QR코드 색상 대비를 높이거나, 크기를 256px 이상으로 설정해보세요.' },
        ]}
        keywords="QR코드 생성기 · QR코드 만들기 · 무료 QR코드 · URL QR코드 · WiFi QR코드 · QR code generator · free QR code maker · QR code creator · custom QR code · QR code download · 온라인 QR코드 생성 · QR code generator free · make QR code online"
      />
    </div>
  )
}
