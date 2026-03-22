'use client'
import { useState, useCallback } from 'react'
import { Copy, CheckCheck, Volume2 } from 'lucide-react'
import { useLang } from './LangContext'
import ToolFooter from './ToolFooter'

const T = {
  ko: { title: '모스부호 변환기', desc: '한글·영문·숫자를 모스부호로 즉시 변환. 모스부호→텍스트 역변환, 소리 재생 지원.', textToMorse: '텍스트 → 모스부호', morseToText: '모스부호 → 텍스트', play: '소리 재생', copy: '복사', copied: '복사됨!' },
  en: { title: 'Morse Code Converter', desc: 'Convert text to Morse code instantly. Supports English, numbers, reverse decoding, and audio playback.', textToMorse: 'Text → Morse', morseToText: 'Morse → Text', play: 'Play Sound', copy: 'Copy', copied: 'Copied!' }
}

const MORSE: Record<string, string> = {
  'A':'.-','B':'-...','C':'-.-.','D':'-..','E':'.','F':'..-.','G':'--.','H':'....','I':'..','J':'.---',
  'K':'-.-','L':'.-..','M':'--','N':'-.','O':'---','P':'.--.','Q':'--.-','R':'.-.','S':'...','T':'-',
  'U':'..-','V':'...-','W':'.--','X':'-..-','Y':'-.--','Z':'--..',
  '0':'-----','1':'.----','2':'..---','3':'...--','4':'....-','5':'.....',
  '6':'-....','7':'--...','8':'---..','9':'----.',
  '.':'.-.-.-',',':'--..--','?':'..--..','!':'-.-.--','/':'-..-.','@':'.--.-.','&':'.-...',':':'---...',
  ' ': '/'
}

const MORSE_REVERSE: Record<string, string> = Object.fromEntries(Object.entries(MORSE).map(([k, v]) => [v, k]))

function textToMorse(text: string): string {
  return text.toUpperCase().split('').map(c => MORSE[c] ?? c).join(' ')
}

function morseToText(morse: string): string {
  return morse.split(' ').map(m => MORSE_REVERSE[m] ?? m).join('').replace(/\//g, ' ')
}

async function playMorse(morse: string) {
  const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
  const dot = 0.06, dash = dot * 3, gap = dot, charGap = dot * 3
  let t = ctx.currentTime
  for (const sym of morse.split('')) {
    if (sym === '.') {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain); gain.connect(ctx.destination)
      osc.frequency.value = 700
      gain.gain.setValueAtTime(0.4, t)
      gain.gain.setValueAtTime(0, t + dot)
      osc.start(t); osc.stop(t + dot)
      t += dot + gap
    } else if (sym === '-') {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain); gain.connect(ctx.destination)
      osc.frequency.value = 700
      gain.gain.setValueAtTime(0.4, t)
      gain.gain.setValueAtTime(0, t + dash)
      osc.start(t); osc.stop(t + dash)
      t += dash + gap
    } else if (sym === ' ') {
      t += charGap
    } else if (sym === '/') {
      t += charGap * 2
    }
  }
}

export default function MorseCode() {
  const { lang } = useLang()
  const tx = T[lang]
  const [mode, setMode] = useState<'encode' | 'decode'>('encode')
  const [text, setText] = useState('SOS')
  const [morse, setMorse] = useState('')
  const [copied, setCopied] = useState<string | null>(null)
  const [playing, setPlaying] = useState(false)
  const copy = async (v: string, k: string) => { await navigator.clipboard.writeText(v); setCopied(k); setTimeout(() => setCopied(null), 1500) }

  const encoded = textToMorse(text)
  const decoded = morseToText(morse)

  const handlePlay = async () => {
    if (playing) return
    setPlaying(true)
    try { await playMorse(mode === 'encode' ? encoded : morse) }
    catch {}
    setTimeout(() => setPlaying(false), 3000)
  }

  const EXAMPLES = [
    { label: 'SOS', text: 'SOS' },
    { label: 'HELLO', text: 'HELLO' },
    { label: 'OK', text: 'OK' },
    { label: 'LOVE', text: 'LOVE' },
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
        {[['encode', tx.textToMorse], ['decode', tx.morseToText]].map(([v, l]) => (
          <button key={v} onClick={() => setMode(v as 'encode' | 'decode')}
            className={`flex-1 py-2.5 text-sm font-medium transition-all ${mode === v ? 'bg-brand-500 text-white font-bold' : 'bg-[#1a1d27] text-slate-300'}`}>{l}</button>
        ))}
      </div>

      {mode === 'encode' && (
        <div className="flex flex-col gap-4">
          <div className="rounded-xl border border-surface-border bg-[#1a1d27] overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-surface-border">
              <span className="text-xs text-slate-400 font-medium">{lang === 'ko' ? '텍스트 입력' : 'Enter Text'}</span>
              <div className="flex gap-1.5">
                {EXAMPLES.map(e => (
                  <button key={e.label} onClick={() => setText(e.text)}
                    className="text-xs px-2 py-1 rounded border border-surface-border text-slate-400 hover:text-brand-300 hover:border-brand-500/40 bg-[#0f1117] transition-all">{e.label}</button>
                ))}
              </div>
            </div>
            <textarea value={text} onChange={e => setText(e.target.value)} rows={3}
              placeholder={lang === 'ko' ? '변환할 텍스트를 입력하세요...' : 'Enter text to convert...'}
              className="w-full bg-transparent px-4 py-3 text-slate-200 text-sm focus:outline-none resize-none uppercase" />
          </div>

          <div className="rounded-xl border border-surface-border bg-[#1a1d27] overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-surface-border">
              <span className="text-xs text-slate-400 font-medium">{lang === 'ko' ? '모스부호' : 'Morse Code'}</span>
              <div className="flex gap-2">
                <button onClick={handlePlay} disabled={playing} className={`text-xs px-3 py-1.5 rounded-lg border flex items-center gap-1 transition-all ${playing ? 'text-brand-400 border-brand-500/40' : 'border-surface-border text-slate-300 hover:border-brand-500/40'}`}>
                  <Volume2 size={12} className={playing ? 'animate-pulse' : ''} /> {tx.play}
                </button>
                <button onClick={() => copy(encoded, 'enc')} className={`text-xs px-3 py-1.5 rounded-lg border flex items-center gap-1 transition-all ${copied === 'enc' ? 'bg-brand-500/20 border-brand-500/40 text-brand-400' : 'border-surface-border text-slate-300 hover:border-brand-500/40'}`}>
                  {copied === 'enc' ? <CheckCheck size={12} /> : <Copy size={12} />} {tx.copy}
                </button>
              </div>
            </div>
            <div className="px-4 py-4 font-mono text-brand-400 text-sm leading-loose tracking-widest break-all min-h-16">
              {encoded || <span className="text-slate-600">{lang === 'ko' ? '모스부호가 여기에 표시됩니다' : 'Morse code appears here'}</span>}
            </div>
          </div>

          {/* 시각화 */}
          {encoded && (
            <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4">
              <p className="text-xs text-slate-400 mb-3 font-medium">{lang === 'ko' ? '시각화' : 'Visualization'}</p>
              <div className="flex flex-wrap gap-2">
                {text.toUpperCase().split('').map((char, i) => (
                  <div key={i} className="text-center">
                    <div className="text-xs font-mono text-brand-400 tracking-widest mb-1">{MORSE[char] ?? char}</div>
                    <div className="text-xs text-slate-500 border border-surface-border rounded px-1.5 py-0.5 bg-[#0f1117]">{char}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {mode === 'decode' && (
        <div className="flex flex-col gap-4">
          <div className="rounded-xl border border-surface-border bg-[#1a1d27] overflow-hidden">
            <div className="px-4 py-2.5 border-b border-surface-border">
              <span className="text-xs text-slate-400 font-medium">{lang === 'ko' ? '모스부호 입력 (공백으로 구분)' : 'Enter Morse Code (space-separated)'}</span>
            </div>
            <textarea value={morse} onChange={e => setMorse(e.target.value)} rows={4}
              placeholder="... --- ..."
              className="w-full bg-transparent px-4 py-3 text-brand-400 text-sm font-mono focus:outline-none resize-none tracking-widest" />
          </div>
          <div className="rounded-xl border border-surface-border bg-[#1a1d27] overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-surface-border">
              <span className="text-xs text-slate-400 font-medium">{lang === 'ko' ? '변환된 텍스트' : 'Decoded Text'}</span>
              <button onClick={() => copy(decoded, 'dec')} className={`text-xs px-3 py-1.5 rounded-lg border flex items-center gap-1 transition-all ${copied === 'dec' ? 'bg-brand-500/20 border-brand-500/40 text-brand-400' : 'border-surface-border text-slate-300 hover:border-brand-500/40'}`}>
                {copied === 'dec' ? <CheckCheck size={12} /> : <Copy size={12} />} {tx.copy}
              </button>
            </div>
            <p className="px-4 py-4 text-2xl font-bold text-slate-200">{decoded || <span className="text-slate-600 text-sm">{lang === 'ko' ? '텍스트가 여기에 표시됩니다' : 'Text appears here'}</span>}</p>
          </div>
        </div>
      )}

      {/* 모스부호 표 */}
      <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4 mt-5">
        <p className="text-xs text-slate-400 font-medium mb-3">{lang === 'ko' ? '모스부호 표 (영문자)' : 'Morse Code Table (Letters)'}</p>
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5">
          {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(c => (
            <div key={c} className="rounded-lg border border-surface-border bg-[#0f1117] p-2 text-center">
              <p className="text-xs font-bold text-slate-200">{c}</p>
              <p className="text-xs font-mono text-brand-400 tracking-widest">{MORSE[c]}</p>
            </div>
          ))}
        </div>
      </div>

      <ToolFooter
        toolName={lang === 'ko' ? '모스부호 변환기' : 'Morse Code Converter'}
        toolUrl="https://keyword-mixer.vercel.app/morse-code"
        description={tx.desc}
        howToUse={lang === 'ko' ? [
          { step: '변환 방향 선택', desc: '텍스트→모스 또는 모스→텍스트 방향을 선택하세요.' },
          { step: '내용 입력', desc: '텍스트 또는 모스부호를 입력하세요.' },
          { step: '결과 확인', desc: '입력 즉시 변환 결과가 표시됩니다.' },
          { step: '소리 재생', desc: '소리 재생 버튼으로 모스부호 소리를 들을 수 있습니다.' },
        ] : [
          { step: 'Select direction', desc: 'Choose text→morse or morse→text conversion.' },
          { step: 'Enter content', desc: 'Type text or morse code to convert.' },
          { step: 'View result', desc: 'Conversion result appears instantly.' },
          { step: 'Play audio', desc: 'Click play to hear the morse code beeps.' },
        ]}
        whyUse={lang === 'ko' ? [
          { title: '양방향 변환', desc: '텍스트→모스, 모스→텍스트 양방향 변환을 모두 지원합니다.' },
          { title: '소리 재생', desc: '웹 오디오 API로 실제 모스부호 소리를 브라우저에서 재생합니다.' },
          { title: '시각화', desc: '각 글자별 모스부호를 시각적으로 확인할 수 있습니다.' },
          { title: '모스부호 표', desc: '영문자 전체의 모스부호 표를 바로 확인할 수 있습니다.' },
        ] : [
          { title: 'Bidirectional', desc: 'Both text→morse and morse→text conversion supported.' },
          { title: 'Audio playback', desc: 'Hear actual morse code beeps using Web Audio API.' },
          { title: 'Visualization', desc: 'See morse code per character visually.' },
          { title: 'Reference table', desc: 'Full morse code alphabet table for quick reference.' },
        ]}
        faqs={lang === 'ko' ? [
          { q: '모스부호란?', a: '점(·)과 선(-)의 조합으로 알파벳·숫자를 표현하는 통신 부호입니다. 1838년 새뮤얼 모스가 발명했으며 무선 통신의 기초가 되었습니다.' },
          { q: 'SOS는 왜 구조 신호인가요?', a: 'SOS는 ...-..-(S-O-S)로 기억하기 쉬운 패턴이라 선택되었습니다. 실제로 SOS 자체에는 의미가 없으며 패턴이 단순해 오류가 없기 때문입니다.' },
          { q: '모스부호를 읽는 방법은?', a: '점은 짧은 신호(1단위), 선은 긴 신호(3단위)입니다. 같은 글자 내 신호 간격은 1단위, 글자 간격은 3단위, 단어 간격은 7단위입니다.' },
          { q: '한글 모스부호가 있나요?', a: '한글에도 KS X 1001 기반의 모스부호 체계가 있지만 표준화가 덜 되어 있습니다. 이 도구에서는 영문 국제 모스부호를 지원합니다.' },
        ] : [
          { q: 'What is Morse code?', a: 'A system encoding letters and numbers using dots (·) and dashes (-). Invented by Samuel Morse in 1838, it became the foundation of wireless communication.' },
          { q: 'Why is SOS the distress signal?', a: 'SOS (···−−−···) was chosen for its easily memorable and distinct pattern. The letters themselves have no special meaning.' },
          { q: 'How to read Morse code?', a: 'Dot = short signal (1 unit), dash = long signal (3 units). Gap within letter = 1 unit, between letters = 3 units, between words = 7 units.' },
          { q: 'Is there Korean Morse code?', a: 'Korean Morse code based on KS X 1001 exists but is not widely standardized. This tool supports international English Morse code.' },
        ]}
        keywords="모스부호 변환기 · 모스코드 · 모스부호 표 · SOS 모스부호 · morse code converter · morse code translator · morse code to text · text to morse · morse decoder · international morse code"
      />
    </div>
  )
}
