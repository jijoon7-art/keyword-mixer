'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import { Copy, CheckCheck, Download, RefreshCw } from 'lucide-react'
import { useLang } from './LangContext'
import ToolFooter from './ToolFooter'

const T = {
  ko: {
    title: '도장 만들기 (온라인 무료)',
    desc: '이름·한자·한글로 도장(인감)을 무료로 즉시 만들기. 원형·사각·타원 도장 PNG 다운로드.',
    name: '도장에 새길 이름/텍스트',
    style: '도장 스타일',
    shape: '모양',
    color: '도장 색상',
    font: '폰트',
    size: '크기',
    border: '테두리 두께',
    padding: '여백',
    download: 'PNG 다운로드',
    copy: '이미지 복사',
    reset: '초기화',
    preview: '미리보기',
    samples: '샘플 사용',
  },
  en: {
    title: 'Korean Stamp Maker (Free Online)',
    desc: 'Create Korean personal stamps (도장/인감) instantly for free. Download circle, square, oval stamps as PNG.',
    name: 'Name / Text for Stamp',
    style: 'Stamp Style',
    shape: 'Shape',
    color: 'Stamp Color',
    font: 'Font',
    size: 'Size',
    border: 'Border Width',
    padding: 'Padding',
    download: 'Download PNG',
    copy: 'Copy Image',
    reset: 'Reset',
    preview: 'Preview',
    samples: 'Use Sample',
  }
}

const STAMP_COLORS = [
  { name: '빨강 (인주)', nameEn: 'Red (Ink)', value: '#CC0000' },
  { name: '진빨강', nameEn: 'Dark Red', value: '#8B0000' },
  { name: '검정', nameEn: 'Black', value: '#1a1a1a' },
  { name: '파랑', nameEn: 'Blue', value: '#003399' },
  { name: '초록', nameEn: 'Green', value: '#006600' },
  { name: '보라', nameEn: 'Purple', value: '#660099' },
]

const SHAPES = [
  { id: 'circle', ko: '원형', en: 'Circle' },
  { id: 'square', ko: '사각형', en: 'Square' },
  { id: 'rounded', ko: '둥근 사각형', en: 'Rounded Square' },
  { id: 'oval', ko: '타원형', en: 'Oval' },
]

const FONTS = [
  { id: 'serif', ko: '명조체', en: 'Serif' },
  { id: 'gothic', ko: '고딕체', en: 'Gothic' },
  { id: 'brush', ko: '붓글씨체', en: 'Brush' },
]

// 저작권 없는 한국 위인 샘플
const SAMPLES = [
  { text: '이순신', desc: '조선 무신 (1545~1598)', descEn: 'Admiral Yi Sun-sin (1545~1598)' },
  { text: '세종대왕', desc: '조선 제4대 왕', descEn: 'King Sejong the Great' },
  { text: '장영실', desc: '조선 과학자', descEn: 'Jang Yeong-sil, Scientist' },
  { text: '신사임당', desc: '조선 예술가', descEn: 'Shin Saimdang, Artist' },
  { text: '유관순', desc: '독립운동가', descEn: 'Yu Gwan-sun, Independence Activist' },
  { text: '홍길동', desc: '샘플 이름', descEn: 'Sample Name' },
  { text: '김철수', desc: '샘플 이름', descEn: 'Sample Name' },
  { text: '이영희', desc: '샘플 이름', descEn: 'Sample Name' },
]

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, lineHeight: number): string[] {
  // 한글은 글자 단위로 줄바꿈
  if (/[\uAC00-\uD7A3]/.test(text)) {
    const lines: string[] = []
    let line = ''
    for (const char of text) {
      const test = line + char
      if (ctx.measureText(test).width > maxWidth && line.length > 0) {
        lines.push(line)
        line = char
      } else {
        line = test
      }
    }
    if (line) lines.push(line)
    return lines
  }
  // 영문
  const words = text.split(' ')
  const lines: string[] = []
  let line = ''
  for (const word of words) {
    const test = line ? `${line} ${word}` : word
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line)
      line = word
    } else {
      line = test
    }
  }
  if (line) lines.push(line)
  return lines
}

export default function StampMaker() {
  const { lang } = useLang()
  const tx = T[lang]
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [text, setText] = useState('홍길동')
  const [shape, setShape] = useState('circle')
  const [color, setColor] = useState('#CC0000')
  const [fontStyle, setFontStyle] = useState('serif')
  const [size, setSize] = useState(200)
  const [borderWidth, setBorderWidth] = useState(8)
  const [padding, setPadding] = useState(20)
  const [opacity, setOpacity] = useState(90)
  const [rotation, setRotation] = useState(0)
  const [showGrid, setShowGrid] = useState(false)
  const [copied, setCopied] = useState(false)

  const getFontFamily = () => {
    switch (fontStyle) {
      case 'serif': return '"Noto Serif KR", "Batang", Georgia, serif'
      case 'gothic': return '"Noto Sans KR", "Malgun Gothic", Arial, sans-serif'
      case 'brush': return '"Nanum Brush Script", "Gungsuh", cursive'
      default: return 'serif'
    }
  }

  const drawStamp = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const S = size
    canvas.width = S
    canvas.height = S

    ctx.clearRect(0, 0, S, S)

    // 회전 적용
    if (rotation !== 0) {
      ctx.save()
      ctx.translate(S / 2, S / 2)
      ctx.rotate((rotation * Math.PI) / 180)
      ctx.translate(-S / 2, -S / 2)
    }

    // 배경 투명 (인주 효과를 위해 약간 텍스처)
    ctx.globalAlpha = opacity / 100

    const bw = borderWidth
    const pad = padding

    // 도장 모양 그리기
    ctx.strokeStyle = color
    ctx.lineWidth = bw
    ctx.fillStyle = 'transparent'

    ctx.beginPath()
    if (shape === 'circle') {
      const cx = S / 2, cy = S / 2, r = S / 2 - bw / 2 - 2
      ctx.arc(cx, cy, r, 0, Math.PI * 2)
    } else if (shape === 'square') {
      ctx.rect(bw / 2 + 2, bw / 2 + 2, S - bw - 4, S - bw - 4)
    } else if (shape === 'rounded') {
      const r = (S - bw - 4) * 0.15
      const x = bw / 2 + 2, y = bw / 2 + 2
      const w = S - bw - 4, h = S - bw - 4
      ctx.moveTo(x + r, y)
      ctx.lineTo(x + w - r, y)
      ctx.quadraticCurveTo(x + w, y, x + w, y + r)
      ctx.lineTo(x + w, y + h - r)
      ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
      ctx.lineTo(x + r, y + h)
      ctx.quadraticCurveTo(x, y + h, x, y + h - r)
      ctx.lineTo(x, y + r)
      ctx.quadraticCurveTo(x, y, x + r, y)
      ctx.closePath()
    } else if (shape === 'oval') {
      ctx.ellipse(S / 2, S / 2, S / 2 - bw / 2 - 2, S / 3 - bw / 2 - 2, 0, 0, Math.PI * 2)
    }
    ctx.stroke()

    // 텍스트 영역 계산
    const innerSize = shape === 'oval'
      ? { w: S - bw * 2 - pad * 2 - 10, h: (S * 2 / 3) - bw * 2 - pad * 2 - 10 }
      : { w: shape === 'circle' ? (S - bw - pad * 2) * 0.707 : S - bw * 2 - pad * 2 - 10, h: shape === 'circle' ? (S - bw - pad * 2) * 0.707 : S - bw * 2 - pad * 2 - 10 }

    ctx.fillStyle = color
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    // 폰트 크기를 텍스트 길이에 맞게 조정
    const maxFontSize = innerSize.h * 0.85
    let fontSize = maxFontSize

    // 여러 줄 처리
    const testFontSize = Math.min(innerSize.w * 0.9, innerSize.h * 0.9)
    ctx.font = `bold ${testFontSize}px ${getFontFamily()}`
    const lines = wrapText(ctx, text, innerSize.w * 0.85, testFontSize * 1.2)

    if (lines.length > 1) {
      fontSize = Math.min(innerSize.h / (lines.length * 1.3), innerSize.w * 0.85)
    } else {
      // 한 줄인 경우 폭에 맞게 조정
      ctx.font = `bold ${fontSize}px ${getFontFamily()}`
      while (ctx.measureText(text).width > innerSize.w * 0.85 && fontSize > 12) {
        fontSize -= 2
        ctx.font = `bold ${fontSize}px ${getFontFamily()}`
      }
    }

    ctx.font = `bold ${fontSize}px ${getFontFamily()}`
    const lineHeight = fontSize * 1.25
    const centerY = shape === 'oval' ? S / 2 : S / 2

    if (lines.length === 1) {
      ctx.fillText(lines[0], S / 2, centerY)
    } else {
      const totalH = (lines.length - 1) * lineHeight
      lines.forEach((line, i) => {
        ctx.fillText(line, S / 2, centerY - totalH / 2 + i * lineHeight)
      })
    }

    // 인주 번짐 효과 (노이즈)
    const imageData = ctx.getImageData(0, 0, S, S)
    const data = imageData.data
    const rgb = hexToRgb(color)
    if (rgb) {
      for (let i = 0; i < data.length; i += 4) {
        if (data[i + 3] > 0) {
          // 약간의 불규칙성 추가 (인주 느낌)
          const noise = (Math.random() - 0.5) * 30
          data[i] = Math.max(0, Math.min(255, rgb.r + noise))
          data[i + 1] = Math.max(0, Math.min(255, rgb.g + noise))
          data[i + 2] = Math.max(0, Math.min(255, rgb.b + noise))
        }
      }
      ctx.putImageData(imageData, 0, 0)
    }

    if (rotation !== 0) ctx.restore()
  }, [text, shape, color, fontStyle, size, borderWidth, padding, opacity, rotation])

  function hexToRgb(hex: string) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
    } : null
  }

  useEffect(() => { drawStamp() }, [drawStamp])

  const downloadPng = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const link = document.createElement('a')
    link.download = `stamp_${text || 'stamp'}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  const copyImage = async () => {
    const canvas = canvasRef.current
    if (!canvas) return
    try {
      canvas.toBlob(async (blob) => {
        if (!blob) return
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      })
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-mono mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />Free Tool
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-3">{tx.title}</h1>
        <p className="text-slate-300 text-base max-w-xl mx-auto">{tx.desc}</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* 설정 패널 */}
        <div className="md:col-span-2 flex flex-col gap-4">

          {/* 텍스트 입력 */}
          <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4">
            <label className="text-xs text-slate-400 mb-2 block font-medium">{tx.name}</label>
            <input
              value={text}
              onChange={e => setText(e.target.value)}
              maxLength={10}
              placeholder={lang === 'ko' ? '홍길동 (최대 10자)' : 'Enter name (max 10 chars)'}
              className="w-full bg-[#0f1117] border border-surface-border rounded-xl px-4 py-3 text-slate-200 text-xl font-mono text-center focus:outline-none focus:border-brand-500/50 transition-all mb-3"
            />
            {/* 샘플 */}
            <div>
              <p className="text-xs text-slate-500 mb-1.5">{tx.samples}:</p>
              <div className="flex flex-wrap gap-1.5">
                {SAMPLES.map(s => (
                  <button key={s.text} onClick={() => setText(s.text)}
                    className="group text-xs px-2.5 py-1.5 rounded-lg border border-surface-border hover:border-brand-500/40 bg-[#0f1117] transition-all">
                    <span className="text-slate-200 font-bold">{s.text}</span>
                    <span className="text-slate-600 ml-1 group-hover:text-slate-400">{lang === 'ko' ? s.desc : s.descEn}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 모양 선택 */}
          <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4">
            <label className="text-xs text-slate-400 mb-2 block font-medium">{tx.shape}</label>
            <div className="grid grid-cols-4 gap-2">
              {SHAPES.map(s => (
                <button key={s.id} onClick={() => setShape(s.id)}
                  className={`py-2.5 rounded-lg border text-xs font-medium transition-all ${shape === s.id ? 'bg-brand-500 border-brand-500 text-white font-bold' : 'border-surface-border text-slate-300 bg-[#0f1117] hover:border-brand-500/40'}`}>
                  {lang === 'ko' ? s.ko : s.en}
                </button>
              ))}
            </div>
          </div>

          {/* 색상 선택 */}
          <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4">
            <label className="text-xs text-slate-400 mb-2 block font-medium">{tx.color}</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {STAMP_COLORS.map(c => (
                <button key={c.value} onClick={() => setColor(c.value)}
                  className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-xs transition-all ${color === c.value ? 'border-white/40 bg-white/10' : 'border-surface-border bg-[#0f1117]'}`}>
                  <div className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: c.value }} />
                  <span className="text-slate-300">{lang === 'ko' ? c.name : c.nameEn}</span>
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <label className="text-xs text-slate-500">{lang === 'ko' ? '직접 선택:' : 'Custom:'}</label>
              <input type="color" value={color} onChange={e => setColor(e.target.value)}
                className="w-10 h-8 rounded cursor-pointer bg-transparent border border-surface-border" />
              <span className="text-xs font-mono text-slate-400">{color}</span>
            </div>
          </div>

          {/* 폰트 */}
          <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4">
            <label className="text-xs text-slate-400 mb-2 block font-medium">{tx.font}</label>
            <div className="grid grid-cols-3 gap-2">
              {FONTS.map(f => (
                <button key={f.id} onClick={() => setFontStyle(f.id)}
                  className={`py-2 rounded-lg border text-xs font-medium transition-all ${fontStyle === f.id ? 'bg-brand-500 border-brand-500 text-white' : 'border-surface-border text-slate-300 bg-[#0f1117]'}`}>
                  {lang === 'ko' ? f.ko : f.en}
                </button>
              ))}
            </div>
          </div>

          {/* 세부 설정 */}
          <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4">
            <p className="text-xs text-slate-400 font-medium mb-3">{lang === 'ko' ? '세부 설정' : 'Fine-tuning'}</p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: lang === 'ko' ? `크기: ${size}px` : `Size: ${size}px`, val: size, set: setSize, min: 100, max: 400, step: 10 },
                { label: lang === 'ko' ? `테두리: ${borderWidth}px` : `Border: ${borderWidth}px`, val: borderWidth, set: setBorderWidth, min: 2, max: 20, step: 1 },
                { label: lang === 'ko' ? `여백: ${padding}px` : `Padding: ${padding}px`, val: padding, set: setPadding, min: 5, max: 50, step: 2 },
                { label: lang === 'ko' ? `불투명도: ${opacity}%` : `Opacity: ${opacity}%`, val: opacity, set: setOpacity, min: 30, max: 100, step: 5 },
                { label: lang === 'ko' ? `회전: ${rotation}°` : `Rotate: ${rotation}°`, val: rotation, set: setRotation, min: -45, max: 45, step: 1 },
              ].map(f => (
                <div key={f.label}>
                  <label className="text-xs text-slate-400 mb-1 block">{f.label}</label>
                  <input type="range" min={f.min} max={f.max} step={f.step} value={f.val} onChange={e => f.set(+e.target.value)}
                    className="w-full accent-red-500" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 미리보기 + 다운로드 */}
        <div className="flex flex-col gap-4">
          <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4 sticky top-4">
            <p className="text-xs text-slate-400 font-medium mb-3 text-center">{tx.preview}</p>

            {/* 캔버스 미리보기 */}
            <div className="flex items-center justify-center mb-4 min-h-[220px] bg-white rounded-xl p-4">
              <canvas ref={canvasRef} className="max-w-full max-h-[200px]" style={{ imageRendering: 'pixelated' }} />
            </div>

            <div className="flex flex-col gap-2">
              <button onClick={downloadPng}
                className="w-full py-3 rounded-xl bg-brand-500 hover:bg-brand-400 text-white font-bold text-sm transition-all flex items-center justify-center gap-2">
                <Download size={16} /> {tx.download}
              </button>
              <button onClick={copyImage}
                className={`w-full py-2.5 rounded-xl border text-sm font-bold transition-all flex items-center justify-center gap-2 ${copied ? 'bg-brand-500/20 border-brand-500/40 text-brand-400' : 'border-surface-border text-slate-300 hover:border-brand-500/40 bg-[#0f1117]'}`}>
                {copied ? <CheckCheck size={15} /> : <Copy size={15} />}
                {copied ? (lang === 'ko' ? '복사됨!' : 'Copied!') : tx.copy}
              </button>
              <button onClick={() => { setText('홍길동'); setShape('circle'); setColor('#CC0000'); setFontStyle('serif'); setSize(200); setBorderWidth(8); setPadding(20); setOpacity(90); setRotation(0) }}
                className="w-full py-2 rounded-xl border border-surface-border text-slate-400 hover:text-slate-200 text-xs transition-all flex items-center justify-center gap-1">
                <RefreshCw size={12} /> {tx.reset}
              </button>
            </div>

            {/* 사용 팁 */}
            <div className="mt-3 rounded-lg border border-surface-border bg-[#0f1117] p-3">
              <p className="text-xs text-slate-500 leading-relaxed">
                💡 {lang === 'ko'
                  ? '투명 배경 PNG로 다운로드됩니다. 문서, 이메일, SNS에 바로 사용하세요.'
                  : 'Downloads as transparent background PNG. Use directly in documents, emails, and social media.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 도장 종류 안내 */}
      <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-5 mt-6">
        <p className="text-sm font-semibold text-slate-200 mb-3">{lang === 'ko' ? '📌 도장의 종류와 용도' : '📌 Types of Korean Stamps'}</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { title: lang === 'ko' ? '인감도장' : 'Official Seal', desc: lang === 'ko' ? '주민센터 등록 필요. 부동산·대출 등 법적 효력' : 'Requires registration. Legal effect for real estate, loans' },
            { title: lang === 'ko' ? '막도장' : 'Personal Stamp', desc: lang === 'ko' ? '일상 서류용. 간단한 서명 대체' : 'Daily documents. Simple signature substitute' },
            { title: lang === 'ko' ? '법인 인감' : 'Corporate Seal', desc: lang === 'ko' ? '회사 공식 도장. 법인 계약서에 사용' : 'Company official seal. Used on corporate contracts' },
            { title: lang === 'ko' ? '전자 도장' : 'Digital Stamp', desc: lang === 'ko' ? 'PDF·이메일용 디지털 이미지 도장 (이 도구!)' : 'Digital image stamp for PDF and email (this tool!)' },
          ].map(t => (
            <div key={t.title} className="rounded-lg border border-surface-border bg-[#0f1117] p-3">
              <p className="text-xs font-bold text-slate-200 mb-1">{t.title}</p>
              <p className="text-xs text-slate-500">{t.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <ToolFooter
        toolName={lang === 'ko' ? '도장 만들기 (온라인 무료)' : 'Korean Stamp Maker (Free)'}
        toolUrl="https://keyword-mixer.vercel.app/stamp-maker"
        description={tx.desc}
        howToUse={lang === 'ko' ? [
          { step: '텍스트 입력', desc: '도장에 새길 이름이나 텍스트를 입력하세요. 한글, 영문, 한자 모두 지원합니다.' },
          { step: '모양 선택', desc: '원형, 사각형, 둥근 사각형, 타원형 중 원하는 모양을 선택하세요.' },
          { step: '색상과 폰트 설정', desc: '인주 색(빨강)이나 원하는 색상을 선택하고 폰트를 고르세요.' },
          { step: 'PNG 다운로드', desc: '투명 배경 PNG로 다운로드해 문서, 이메일, PDF에 바로 사용하세요.' },
        ] : [
          { step: 'Enter text', desc: 'Type the name or text to engrave. Supports Korean, English, and Chinese characters.' },
          { step: 'Select shape', desc: 'Choose circle, square, rounded square, or oval.' },
          { step: 'Set color and font', desc: 'Pick ink color (usually red) and font style.' },
          { step: 'Download PNG', desc: 'Download transparent PNG for immediate use in documents, emails, and PDFs.' },
        ]}
        whyUse={lang === 'ko' ? [
          { title: '완전 무료 · 설치 불필요', desc: '브라우저에서 바로 사용. 회원가입 없이 무제한 생성 가능합니다.' },
          { title: '투명 배경 PNG 출력', desc: 'PNG 투명 배경으로 저장되어 어떤 문서 배경에도 자연스럽게 삽입됩니다.' },
          { title: '한글 최적화', desc: '한글 이름에 맞는 폰트와 레이아웃으로 실제 도장과 유사한 결과물을 만듭니다.' },
          { title: '인주 번짐 효과', desc: '실제 인주를 찍은 것처럼 약간의 번짐 효과를 적용해 자연스러운 도장을 만듭니다.' },
          { title: '4가지 모양 지원', desc: '원형·사각·둥근사각·타원형으로 용도에 맞는 모양을 선택합니다.' },
          { title: '세부 조정 가능', desc: '크기, 테두리 두께, 여백, 투명도, 회전각도를 자유롭게 조정합니다.' },
        ] : [
          { title: 'Free · No installation', desc: 'Use directly in browser. Unlimited creation without sign-up.' },
          { title: 'Transparent PNG output', desc: 'PNG with transparent background fits naturally on any document.' },
          { title: 'Korean text optimized', desc: 'Fonts and layouts optimized for Korean names produce realistic results.' },
          { title: 'Ink bleed effect', desc: 'Subtle irregularity effect mimics real ink stamp impression.' },
          { title: '4 shapes supported', desc: 'Circle, square, rounded square, and oval for different use cases.' },
          { title: 'Fine-tune controls', desc: 'Freely adjust size, border, padding, opacity, and rotation.' },
        ]}
        faqs={lang === 'ko' ? [
          { q: '이 도장은 법적 효력이 있나요?', a: '아니요. 이 도구로 만든 도장은 디지털 이미지로, 법적 효력이 없습니다. 인감도장은 반드시 주민센터에 등록된 실물 도장을 사용해야 합니다.' },
          { q: '어디에 사용할 수 있나요?', a: '이메일 서명, PDF 문서, PPT 자료, SNS 게시물 등 비공식적인 용도에 활용할 수 있습니다. 법적 구속력이 필요한 문서에는 사용하지 마세요.' },
          { q: '한자 도장도 만들 수 있나요?', a: '네, 한자를 직접 입력하면 됩니다. 예: 洪吉童, 李舜臣, 世宗 등을 입력해보세요.' },
          { q: '도장 이미지를 Word나 PDF에 넣는 방법은?', a: 'PNG를 다운로드한 후, Word에서는 삽입 → 그림으로 추가하세요. PDF는 Adobe Acrobat이나 알PDF 등의 편집 기능을 이용하세요.' },
          { q: '실제 도장(각인)과 차이가 있나요?', a: '이 도구는 디지털 이미지 도장을 생성합니다. 실제 각인 도장은 도장 가게에서 제작해야 합니다. 인감도장은 법적 효력을 위해 실물이 반드시 필요합니다.' },
          { q: '도장 크기는 어떻게 정하나요?', a: '일반적인 인감 도장 크기는 직경 1~1.5cm입니다. 디지털 사용 시에는 200~300px 정도가 적당하며, 고화질 인쇄용은 400px 이상을 권장합니다.' },
        ] : [
          { q: 'Does this stamp have legal validity?', a: 'No. Stamps created with this tool are digital images with no legal effect. Official seals (인감) must be real stamps registered at a government office.' },
          { q: 'Where can I use it?', a: 'Email signatures, PDF documents, presentations, and social media posts. Do not use on documents requiring legal binding.' },
          { q: 'Can I make a Chinese character stamp?', a: 'Yes, simply type Chinese characters. Try: 洪吉童, 李舜臣, 世宗 etc.' },
          { q: 'How to insert into Word or PDF?', a: 'Download PNG, then in Word: Insert → Picture. For PDF, use Adobe Acrobat or similar PDF editor.' },
          { q: 'Difference from a real carved stamp?', a: 'This creates digital image stamps. Real carved stamps must be made at a stamp shop. Official seals require physical stamps for legal purposes.' },
          { q: 'What size should I use?', a: 'Standard 인감 stamps are 1-1.5cm diameter. For digital use, 200-300px works well. For high-quality printing, use 400px+.' },
        ]}
        keywords="도장 만들기 · 온라인 도장 만들기 · 무료 도장 생성기 · 인감도장 만들기 · 디지털 도장 · 도장 이미지 만들기 · stamp maker Korea · Korean stamp generator · online stamp maker · 한글 도장 · free stamp maker"
      />
    </div>
  )
}
