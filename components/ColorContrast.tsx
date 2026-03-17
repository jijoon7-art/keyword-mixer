'use client'
import { useState } from 'react'
import { Copy, CheckCheck } from 'lucide-react'
import { useLang } from './LangContext'
import ToolFooter from './ToolFooter'

const T = {
  ko: { title: '색상 대비 검사기', desc: '텍스트와 배경 색상의 대비율을 WCAG 기준으로 검사. 접근성 등급(AA/AAA) 자동 판정.' },
  en: { title: 'Color Contrast Checker', desc: 'Check text/background contrast ratio against WCAG standards. Auto-grade for AA/AAA accessibility.' }
}

function hexToRgb(hex: string): [number,number,number]|null {
  const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return r ? [parseInt(r[1],16),parseInt(r[2],16),parseInt(r[3],16)] : null
}

function getLuminance(r: number, g: number, b: number): number {
  const [rs,gs,bs] = [r,g,b].map(v => { const s = v/255; return s <= 0.03928 ? s/12.92 : Math.pow((s+0.055)/1.055, 2.4) })
  return 0.2126*rs + 0.7152*gs + 0.0722*bs
}

function getContrastRatio(hex1: string, hex2: string): number {
  const c1 = hexToRgb(hex1), c2 = hexToRgb(hex2)
  if (!c1 || !c2) return 0
  const l1 = getLuminance(...c1), l2 = getLuminance(...c2)
  const lighter = Math.max(l1,l2), darker = Math.min(l1,l2)
  return (lighter+0.05) / (darker+0.05)
}

const PRESETS = [
  { name: 'Black/White', fg: '#000000', bg: '#FFFFFF' },
  { name: 'Brand/Dark', fg: '#22c55e', bg: '#1a1d27' },
  { name: 'Navy/White', fg: '#FFFFFF', bg: '#1e3a5f' },
  { name: 'Red/White', fg: '#dc2626', bg: '#FFFFFF' },
  { name: 'Gray text', fg: '#6b7280', bg: '#FFFFFF' },
  { name: 'Yellow/Black', fg: '#000000', bg: '#fbbf24' },
]

export default function ColorContrast() {
  const { lang } = useLang()
  const tx = T[lang]
  const [fg, setFg] = useState('#000000')
  const [bg, setBg] = useState('#FFFFFF')
  const [copied, setCopied] = useState<string|null>(null)

  const ratio = getContrastRatio(fg, bg)
  const ratioStr = ratio.toFixed(2)

  const grades = {
    normalAA: ratio >= 4.5,
    normalAAA: ratio >= 7,
    largeAA: ratio >= 3,
    largeAAA: ratio >= 4.5,
  }

  const overallGrade = grades.normalAAA ? 'AAA' : grades.normalAA ? 'AA' : grades.largeAA ? lang==='ko'?'AA (큰글자만)':'AA (Large only)' : 'FAIL'
  const gradeColor = grades.normalAAA ? 'text-brand-400' : grades.normalAA ? 'text-blue-400' : grades.largeAA ? 'text-yellow-400' : 'text-red-400'

  const copy = async (text: string, key: string) => { await navigator.clipboard.writeText(text); setCopied(key); setTimeout(() => setCopied(null), 1500) }

  const GradeTag = ({ pass, label }: { pass: boolean; label: string }) => (
    <div className={`flex items-center justify-between p-2.5 rounded-lg border ${pass?'border-brand-500/30 bg-brand-500/10':'border-red-500/30 bg-red-500/10'}`}>
      <span className="text-xs text-slate-300">{label}</span>
      <span className={`text-xs font-bold px-2 py-0.5 rounded ${pass?'text-brand-400':'text-red-400'}`}>{pass?'✓ PASS':'✗ FAIL'}</span>
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-mono mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />Free Accessibility Tool
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-3">{tx.title}</h1>
        <p className="text-slate-300 text-base max-w-xl mx-auto">{tx.desc}</p>
      </div>

      {/* 색상 선택 */}
      <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-5 mb-5">
        <div className="grid grid-cols-2 gap-4 mb-4">
          {[{label:lang==='ko'?'텍스트 색상':'Text Color',val:fg,set:setFg,key:'fg'},{label:lang==='ko'?'배경 색상':'Background Color',val:bg,set:setBg,key:'bg'}].map(f => (
            <div key={f.key}>
              <label className="text-xs text-slate-400 mb-1.5 block font-medium">{f.label}</label>
              <div className="flex gap-2">
                <input type="color" value={f.val} onChange={e => f.set(e.target.value)} className="w-10 h-10 rounded border border-surface-border cursor-pointer bg-transparent flex-shrink-0" />
                <input type="text" value={f.val} onChange={e => { if(/^#[0-9a-f]{0,6}$/i.test(e.target.value)) f.set(e.target.value) }}
                  className="flex-1 bg-[#0f1117] border border-surface-border rounded-lg px-3 py-2 text-sm text-slate-200 font-mono focus:outline-none focus:border-brand-500/50 transition-all" />
                <button onClick={() => copy(f.val, f.key)} className={`p-2 rounded-lg border transition-all ${copied===f.key?'bg-brand-500/20 border-brand-500/40 text-brand-400':'border-surface-border text-slate-500 hover:text-brand-400 hover:border-brand-500/40'}`}>
                  {copied===f.key?<CheckCheck size={13}/>:<Copy size={13}/>}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* 프리셋 */}
        <div className="flex flex-wrap gap-1.5">
          {PRESETS.map(p => (
            <button key={p.name} onClick={() => { setFg(p.fg); setBg(p.bg) }}
              className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border border-surface-border text-slate-300 hover:border-brand-500/40 hover:text-brand-300 bg-[#0f1117] transition-all">
              <span className="w-3 h-3 rounded-sm border border-slate-600" style={{backgroundColor:p.fg}} />
              <span className="w-3 h-3 rounded-sm border border-slate-600" style={{backgroundColor:p.bg}} />
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* 미리보기 */}
      <div className="rounded-xl border border-surface-border overflow-hidden mb-5" style={{backgroundColor:bg}}>
        <div className="p-6">
          <p className="text-3xl font-bold mb-2" style={{color:fg}}>Aa {lang==='ko'?'가나다':'Sample Text'}</p>
          <p className="text-base" style={{color:fg}}>{lang==='ko'?'본문 텍스트 미리보기입니다. 이 색상 조합이 충분한 대비를 제공하는지 확인하세요.':'Body text preview. Check if this color combination provides sufficient contrast.'}</p>
          <p className="text-sm mt-2" style={{color:fg}}>{lang==='ko'?'작은 텍스트도 잘 보이나요?':'Is small text also readable?'}</p>
        </div>
      </div>

      {/* 대비율 및 등급 */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-5">
          <p className="text-xs text-slate-400 mb-3 font-medium">{lang==='ko'?'대비율':'Contrast Ratio'}</p>
          <div className="text-center mb-4">
            <p className={`text-5xl font-extrabold font-mono ${gradeColor}`}>{ratioStr}</p>
            <p className="text-slate-400 text-sm">:1</p>
            <p className={`text-2xl font-bold mt-2 ${gradeColor}`}>{overallGrade}</p>
          </div>
          <div className="h-2 bg-surface-border rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all ${grades.normalAAA?'bg-brand-500':grades.normalAA?'bg-blue-500':grades.largeAA?'bg-yellow-500':'bg-red-500'}`}
              style={{width:`${Math.min(100, (ratio/21)*100)}%`}} />
          </div>
          <div className="flex justify-between text-xs text-slate-600 mt-1">
            <span>1:1</span><span>4.5 AA</span><span>7 AAA</span><span>21:1</span>
          </div>
        </div>

        <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-5">
          <p className="text-xs text-slate-400 mb-3 font-medium">WCAG {lang==='ko'?'접근성 기준':'Accessibility Standards'}</p>
          <div className="flex flex-col gap-2">
            <GradeTag pass={grades.normalAA} label={lang==='ko'?'일반 텍스트 AA (4.5:1 이상)':'Normal Text AA (≥4.5:1)'} />
            <GradeTag pass={grades.normalAAA} label={lang==='ko'?'일반 텍스트 AAA (7:1 이상)':'Normal Text AAA (≥7:1)'} />
            <GradeTag pass={grades.largeAA} label={lang==='ko'?'큰 텍스트 AA (3:1 이상)':'Large Text AA (≥3:1)'} />
            <GradeTag pass={grades.largeAAA} label={lang==='ko'?'큰 텍스트 AAA (4.5:1 이상)':'Large Text AAA (≥4.5:1)'} />
          </div>
        </div>
      </div>

      <ToolFooter
        toolName={lang==='ko'?'색상 대비 검사기':'Color Contrast Checker'}
        toolUrl="https://keyword-mixer.vercel.app/color-contrast"
        description={tx.desc}
        howToUse={lang==='ko'?[
          {step:'색상 선택', desc:'텍스트 색상과 배경 색상을 컬러 피커나 HEX 코드로 입력하세요.'},
          {step:'미리보기 확인', desc:'실제 텍스트가 어떻게 보이는지 미리보기로 확인하세요.'},
          {step:'대비율 확인', desc:'WCAG 기준 AA/AAA 등급 달성 여부를 확인하세요.'},
          {step:'색상 개선', desc:'FAIL이면 색상을 조절해 최소 AA 등급을 달성하세요.'},
        ]:[
          {step:'Choose colors', desc:'Select text and background colors using color picker or HEX input.'},
          {step:'Check preview', desc:'See how text actually looks with the selected color combination.'},
          {step:'View contrast ratio', desc:'Check if WCAG AA/AAA grade requirements are met.'},
          {step:'Adjust if needed', desc:'If FAIL, adjust colors to achieve at least AA grade.'},
        ]}
        whyUse={lang==='ko'?[
          {title:'WCAG 접근성 기준', desc:'웹 콘텐츠 접근성 지침(WCAG) AA/AAA 등급을 자동으로 판정합니다.'},
          {title:'실시간 미리보기', desc:'실제 텍스트가 어떻게 보이는지 바로 확인할 수 있습니다.'},
          {title:'법적 준수', desc:'공공기관 웹사이트는 WCAG AA 등급 준수가 의무화되어 있습니다.'},
          {title:'디자이너 필수 도구', desc:'UI 디자인 시 색상 접근성을 쉽게 검증할 수 있습니다.'},
        ]:[
          {title:'WCAG standards', desc:'Automatically grades against Web Content Accessibility Guidelines AA/AAA.'},
          {title:'Live preview', desc:'See exactly how text looks with the selected color combination.'},
          {title:'Legal compliance', desc:'Many jurisdictions require WCAG AA compliance for public websites.'},
          {title:'Designer essential', desc:'Easily verify color accessibility during UI design.'},
        ]}
        faqs={lang==='ko'?[
          {q:'WCAG란?', a:'Web Content Accessibility Guidelines. W3C에서 제정한 웹 콘텐츠 접근성 국제 표준입니다. 장애가 있는 사용자도 웹을 이용할 수 있도록 하는 지침입니다.'},
          {q:'AA와 AAA 차이는?', a:'AA는 최소 권장 기준(일반 텍스트 4.5:1, 큰 텍스트 3:1), AAA는 향상된 기준(일반 텍스트 7:1)입니다. 대부분의 사이트는 AA를 목표로 합니다.'},
          {q:'큰 텍스트 기준은?', a:'18pt(24px) 이상 또는 14pt(18.67px) 이상의 굵은 텍스트가 큰 텍스트로 분류됩니다.'},
          {q:'색맹 사용자를 위한 팁은?', a:'명도 대비만으로 충분한 구분이 되도록 설계하세요. 색상만으로 중요 정보를 전달하지 말고 아이콘이나 텍스트를 함께 사용하세요.'},
        ]:[
          {q:'What is WCAG?', a:'Web Content Accessibility Guidelines by W3C. International standards ensuring web content is accessible to people with disabilities.'},
          {q:'What is the difference between AA and AAA?', a:'AA is minimum recommended (4.5:1 normal, 3:1 large text). AAA is enhanced (7:1 normal). Most sites target AA compliance.'},
          {q:'What counts as large text?', a:'Text 18pt (24px) or larger, or bold text 14pt (18.67px) or larger is classified as large text.'},
          {q:'Tips for color blind users?', a:'Ensure sufficient contrast with lightness alone. Never rely on color only to convey important information — use icons or labels too.'},
        ]}
        keywords="색상 대비 검사기 · WCAG 접근성 · 명도 대비 · 색상 접근성 · AA AAA 등급 · color contrast checker · WCAG contrast · accessibility checker · contrast ratio · web accessibility · color accessibility tool"
      />
    </div>
  )
}
