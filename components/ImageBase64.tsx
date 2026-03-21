'use client'

import { useState, useRef } from 'react'
import { Copy, CheckCheck, Upload, Download } from 'lucide-react'
import { useLang } from './LangContext'
import ToolFooter from './ToolFooter'

const T = {
  ko: { title: '이미지 Base64 변환기', desc: '이미지를 Base64 문자열로, Base64를 이미지로 즉시 변환. HTML img 태그, CSS background-image 형식 지원.', imgTab: '이미지→Base64', b64Tab: 'Base64→이미지', drop: '이미지를 드래그하거나 클릭하여 선택', copy: '복사', copied: '복사됨', download: '이미지 저장', cssFormat: 'CSS 형식', htmlFormat: 'HTML img 태그', dataUri: 'Data URI만' },
  en: { title: 'Image Base64 Converter', desc: 'Convert images to Base64 strings and Base64 to images instantly. Supports HTML img and CSS background formats.', imgTab: 'Image→Base64', b64Tab: 'Base64→Image', drop: 'Drag image here or click to select', copy: 'Copy', copied: 'Copied!', download: 'Save Image', cssFormat: 'CSS Format', htmlFormat: 'HTML img tag', dataUri: 'Data URI only' }
}

export default function ImageBase64() {
  const { lang } = useLang()
  const tx = T[lang]
  const [tab, setTab] = useState<'img'|'b64'>('img')
  const [base64, setBase64] = useState('')
  const [imgSrc, setImgSrc] = useState('')
  const [fileName, setFileName] = useState('')
  const [fileType, setFileType] = useState('image/png')
  const [format, setFormat] = useState<'dataUri'|'html'|'css'>('dataUri')
  const [b64Input, setB64Input] = useState('')
  const [copied, setCopied] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const processFile = (file: File) => {
    setFileName(file.name); setFileType(file.type)
    const reader = new FileReader()
    reader.onload = e => { const result = e.target?.result as string; setImgSrc(result); setBase64(result) }
    reader.readAsDataURL(file)
  }

  const copy = async () => { await navigator.clipboard.writeText(getFormatted()); setCopied(true); setTimeout(() => setCopied(false), 1500) }

  const getFormatted = () => {
    if (format === 'html') return `<img src="${base64}" alt="${fileName}" />`
    if (format === 'css') return `background-image: url("${base64}");`
    return base64
  }

  const downloadFromB64 = () => {
    const src = b64Input.startsWith('data:') ? b64Input : `data:image/png;base64,${b64Input}`
    const a = document.createElement('a'); a.href = src; a.download = 'decoded_image.png'; a.click()
  }

  const b64Preview = b64Input.startsWith('data:') ? b64Input : b64Input ? `data:image/png;base64,${b64Input}` : ''

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-mono mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />Free Tool
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-3">{tx.title}</h1>
        <p className="text-slate-300 text-base max-w-xl mx-auto">{tx.desc}</p>
      </div>

      <div className="flex rounded-xl border border-surface-border overflow-hidden mb-5">
        {[['img', tx.imgTab], ['b64', tx.b64Tab]].map(([k, l]) => (
          <button key={k} onClick={() => setTab(k as any)}
            className={`flex-1 py-2.5 text-sm font-medium transition-all ${tab === k ? 'bg-brand-500 text-white font-bold' : 'bg-[#1a1d27] text-slate-300 hover:text-white'}`}>{l}</button>
        ))}
      </div>

      {tab === 'img' ? (
        <div className="flex flex-col gap-4">
          <label className="cursor-pointer" onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f?.type.startsWith('image/')) processFile(f) }}>
            <div className="rounded-xl border-2 border-dashed border-surface-border hover:border-brand-500/40 hover:bg-brand-500/5 p-8 text-center transition-all">
              {imgSrc ? <img src={imgSrc} alt="preview" className="max-h-40 mx-auto rounded-lg mb-2" /> : <Upload size={24} className="mx-auto text-slate-500 mb-2" />}
              <p className="text-slate-300 text-sm font-medium">{fileName || tx.drop}</p>
            </div>
            <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) processFile(f) }} />
          </label>

          {base64 && (
            <>
              <div className="flex gap-2">
                {['dataUri', 'html', 'css'].map(f => (
                  <button key={f} onClick={() => setFormat(f as any)}
                    className={`flex-1 text-xs py-2 rounded-lg border transition-all ${format === f ? 'bg-brand-500 border-brand-500 text-white font-bold' : 'border-surface-border text-slate-300 bg-[#0f1117]'}`}>
                    {f === 'dataUri' ? tx.dataUri : f === 'html' ? tx.htmlFormat : tx.cssFormat}
                  </button>
                ))}
              </div>
              <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-slate-400 font-medium">{lang === 'ko' ? '결과' : 'Result'} ({(base64.length / 1024).toFixed(1)} KB)</p>
                  <button onClick={copy} className={`text-xs px-3 py-1.5 rounded-lg border flex items-center gap-1 transition-all ${copied ? 'bg-brand-500/20 border-brand-500/40 text-brand-400' : 'border-surface-border text-slate-300 hover:border-brand-500/40'}`}>
                    {copied ? <CheckCheck size={12} /> : <Copy size={12} />} {copied ? tx.copied : tx.copy}
                  </button>
                </div>
                <textarea readOnly value={getFormatted()} rows={4}
                  className="w-full bg-[#0f1117] border border-surface-border rounded-lg px-3 py-2 text-xs text-slate-300 font-mono resize-none focus:outline-none" />
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4">
            <label className="text-xs text-slate-400 mb-2 block">{lang === 'ko' ? 'Base64 문자열 입력' : 'Enter Base64 String'}</label>
            <textarea value={b64Input} onChange={e => setB64Input(e.target.value)}
              placeholder={lang === 'ko' ? 'data:image/png;base64,... 또는 Base64 문자열만 입력' : 'data:image/png;base64,... or just the Base64 string'}
              rows={6} className="w-full bg-[#0f1117] border border-surface-border rounded-lg px-3 py-2 text-xs text-slate-200 font-mono resize-none focus:outline-none focus:border-brand-500/50 transition-all" />
          </div>
          {b64Preview && (
            <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4 text-center">
              <img src={b64Preview} alt="decoded" className="max-h-48 mx-auto rounded-lg mb-3" onError={() => {}} />
              <button onClick={downloadFromB64} className="text-sm px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-400 text-white font-bold transition-all flex items-center gap-2 mx-auto">
                <Download size={14} /> {tx.download}
              </button>
            </div>
          )}
        </div>
      )}

      <ToolFooter
        toolName={lang === 'ko' ? '이미지 Base64 변환기' : 'Image Base64 Converter'}
        toolUrl="https://keyword-mixer.vercel.app/image-base64"
        description={tx.desc}
        howToUse={lang === 'ko' ? [
          { step: '변환 방향 선택', desc: '이미지→Base64 또는 Base64→이미지 탭을 선택하세요.' },
          { step: '파일 업로드', desc: '이미지를 드래그하거나 클릭해서 업로드하세요. JPG, PNG, WebP, GIF 지원.' },
          { step: '출력 형식 선택', desc: 'Data URI, HTML img 태그, CSS background-image 형식 중 선택하세요.' },
          { step: '복사하여 사용', desc: '복사 버튼으로 원하는 형식의 코드를 클립보드에 복사하세요.' },
        ] : [
          { step: 'Select direction', desc: 'Choose Image→Base64 or Base64→Image tab.' },
          { step: 'Upload file', desc: 'Drag an image or click to upload. Supports JPG, PNG, WebP, GIF.' },
          { step: 'Choose format', desc: 'Select Data URI, HTML img tag, or CSS background-image format.' },
          { step: 'Copy result', desc: 'Use copy button to save the formatted code to clipboard.' },
        ]}
        whyUse={lang === 'ko' ? [
          { title: '서버 없이 이미지 임베딩', desc: 'Base64로 변환하면 HTML/CSS에 이미지를 직접 임베딩할 수 있습니다.' },
          { title: '3가지 출력 형식', desc: 'Data URI, HTML img 태그, CSS background-image를 즉시 생성합니다.' },
          { title: '양방향 변환', desc: '이미지→Base64뿐만 아니라 Base64→이미지 복원도 지원합니다.' },
          { title: '브라우저에서 처리', desc: '파일이 서버에 업로드되지 않아 개인정보가 보호됩니다.' },
        ] : [
          { title: 'Embed images without server', desc: 'Base64 encoding lets you embed images directly in HTML/CSS.' },
          { title: '3 output formats', desc: 'Instantly generates Data URI, HTML img tag, and CSS background-image.' },
          { title: 'Bidirectional conversion', desc: 'Converts both Image→Base64 and Base64→Image.' },
          { title: 'Browser processing', desc: 'Files are not uploaded to servers, protecting your privacy.' },
        ]}
        faqs={lang === 'ko' ? [
          { q: 'Base64로 인코딩하면 파일 크기가 커지나요?', a: '네. Base64는 원본 대비 약 33% 크기가 증가합니다. 작은 아이콘이나 인라인 이미지에 적합하고, 큰 이미지는 별도 파일로 서빙하는 것을 권장합니다.' },
          { q: '어떤 이미지 형식을 지원하나요?', a: 'JPG, PNG, GIF, WebP, SVG 등 브라우저가 지원하는 모든 이미지 형식을 지원합니다.' },
          { q: 'HTML에서 Base64 이미지를 사용하는 방법은?', a: '<img src="data:image/png;base64,..." /> 형식으로 사용합니다. 이 도구의 HTML img 태그 형식을 그대로 복사해서 사용하세요.' },
          { q: '보안상 위험은 없나요?', a: 'Base64는 암호화가 아닙니다. 이미지 내용이 그대로 노출되므로 민감한 이미지는 주의하세요.' },
        ] : [
          { q: 'Does Base64 increase file size?', a: 'Yes, by about 33%. Best for small icons and inline images. Large images should be served as separate files.' },
          { q: 'What image formats are supported?', a: 'JPG, PNG, GIF, WebP, SVG — all formats supported by the browser.' },
          { q: 'How to use Base64 images in HTML?', a: 'Use <img src="data:image/png;base64,..." /> format. Copy the HTML img tag output directly from this tool.' },
          { q: 'Are there security concerns?', a: 'Base64 is not encryption. Image content is exposed in plain text, so be careful with sensitive images.' },
        ]}
        keywords="이미지 Base64 변환 · Base64 인코딩 · 이미지 인코딩 · Data URI · HTML 이미지 임베딩 · image to Base64 · Base64 image converter · image encoder · data URI generator · inline image · free Base64 tool"
      />
    </div>
  )
}
