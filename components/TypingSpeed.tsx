'use client'

import { useState, useEffect, useRef } from 'react'
import { useLang } from './LangContext'
import ToolFooter from './ToolFooter'
import { RefreshCw, Play } from 'lucide-react'

const TEXTS_KO = [
  '빠른 갈색 여우가 게으른 개를 뛰어넘었습니다. 타이핑 연습을 통해 속도와 정확도를 높이세요. 매일 10분씩 꾸준히 연습하면 놀라운 발전을 경험할 수 있습니다.',
  '대한민국의 수도는 서울입니다. 한강을 따라 발전한 이 도시는 전통과 현대가 공존하는 아름다운 곳입니다. 경복궁과 남산타워는 서울을 대표하는 명소입니다.',
  '인터넷은 현대 사회에서 없어서는 안 될 필수 요소가 되었습니다. 전 세계 수억 명의 사람들이 매일 인터넷을 통해 정보를 검색하고 소통합니다.',
  '키보드 타이핑은 현대인의 필수 기술입니다. 올바른 자세와 손가락 위치를 익히면 훨씬 빠르고 정확하게 타이핑할 수 있습니다. 꾸준한 연습이 중요합니다.',
]

const TEXTS_EN = [
  'The quick brown fox jumps over the lazy dog. Practice typing to improve your speed and accuracy every day. Consistent practice will lead to remarkable improvement.',
  'The internet has become an indispensable part of modern life. Billions of people around the world search for information and communicate through the internet daily.',
  'Keyboard typing is an essential skill for modern life. Learning proper posture and finger placement will help you type much faster and more accurately.',
  'Technology continues to advance at an incredible pace. Artificial intelligence, machine learning, and automation are transforming industries and reshaping our world.',
]

const T = {
  ko: {
    title: '타이핑 속도 측정기',
    desc: '타이핑 속도(WPM)와 정확도를 측정하세요. 한국어·영어 텍스트 지원.',
    start: '시작하기',
    restart: '다시 시작',
    newText: '새 텍스트',
    wpm: 'WPM',
    cpm: 'CPM',
    accuracy: '정확도',
    time: '경과 시간',
    errors: '오류',
    wpmFull: '분당 단어',
    cpmFull: '분당 글자',
    result: '결과',
    grade: (wpm: number) => wpm >= 80 ? '🏆 타이핑 마스터!' : wpm >= 60 ? '⭐ 우수한 실력!' : wpm >= 40 ? '👍 좋은 실력!' : wpm >= 20 ? '📈 계속 연습하세요!' : '🌱 초보자 단계',
    textMode: '텍스트 언어',
  },
  en: {
    title: 'Typing Speed Test',
    desc: 'Measure your typing speed (WPM) and accuracy. Korean and English text supported.',
    start: 'Start Typing',
    restart: 'Restart',
    newText: 'New Text',
    wpm: 'WPM',
    cpm: 'CPM',
    accuracy: 'Accuracy',
    time: 'Time',
    errors: 'Errors',
    wpmFull: 'Words per minute',
    cpmFull: 'Chars per minute',
    result: 'Result',
    grade: (wpm: number) => wpm >= 80 ? '🏆 Typing Master!' : wpm >= 60 ? '⭐ Excellent!' : wpm >= 40 ? '👍 Good!' : wpm >= 20 ? '📈 Keep Practicing!' : '🌱 Beginner',
    textMode: 'Text Language',
  }
}

export default function TypingSpeed() {
  const { lang } = useLang()
  const tx = T[lang]

  const [textLang, setTextLang] = useState<'ko' | 'en'>('ko')
  const [textIdx, setTextIdx] = useState(0)
  const [typed, setTyped] = useState('')
  const [started, setStarted] = useState(false)
  const [finished, setFinished] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [startTime, setStartTime] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const texts = textLang === 'ko' ? TEXTS_KO : TEXTS_EN
  const target = texts[textIdx]

  const wpm = elapsed > 0 ? Math.round((typed.split(' ').length - 1) / (elapsed / 60)) : 0
  const cpm = elapsed > 0 ? Math.round(typed.length / (elapsed / 60)) : 0

  let errors = 0
  for (let i = 0; i < typed.length; i++) {
    if (typed[i] !== target[i]) errors++
  }
  const accuracy = typed.length > 0 ? Math.round(((typed.length - errors) / typed.length) * 100) : 100

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value
    if (!started && val.length > 0) {
      setStarted(true)
      setStartTime(Date.now())
      timerRef.current = setInterval(() => {
        setElapsed(Math.floor((Date.now() - Date.now() + (Date.now() - startTime)) / 1000))
      }, 100)
    }
    setTyped(val)
    if (val === target) {
      setFinished(true)
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }

  useEffect(() => {
    if (started && !finished) {
      timerRef.current = setInterval(() => {
        setElapsed(Math.floor((Date.now() - startTime) / 1000))
      }, 100)
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [started, startTime])

  const restart = () => {
    setTyped(''); setStarted(false); setFinished(false)
    setElapsed(0); setStartTime(0)
    if (timerRef.current) clearInterval(timerRef.current)
    inputRef.current?.focus()
  }

  const newText = () => {
    setTextIdx(i => (i + 1) % texts.length)
    restart()
  }

  // 텍스트 하이라이트 렌더링
  const renderText = () => {
    return target.split('').map((char, i) => {
      let cls = 'text-slate-500'
      if (i < typed.length) {
        cls = typed[i] === char ? 'text-slate-200' : 'text-red-400 bg-red-500/20 rounded'
      } else if (i === typed.length) {
        cls = 'text-slate-200 border-b-2 border-brand-400 animate-pulse'
      }
      return <span key={i} className={cls}>{char}</span>
    })
  }

  const progress = Math.round((typed.length / target.length) * 100)

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-mono mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
          Free Tool
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-3 tracking-tight">{tx.title}</h1>
        <p className="text-slate-300 text-base max-w-lg mx-auto">{tx.desc}</p>
      </div>

      {/* 통계 */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        {[
          { label: tx.wpm, val: String(wpm), sub: tx.wpmFull },
          { label: tx.cpm, val: String(cpm), sub: tx.cpmFull },
          { label: tx.accuracy, val: `${accuracy}%`, sub: '' },
          { label: tx.time, val: `${elapsed}s`, sub: '' },
        ].map(s => (
          <div key={s.label} className={`rounded-xl border p-3 text-center ${s.label === tx.wpm ? 'border-brand-500/30 bg-brand-500/10' : 'border-surface-border bg-[#1a1d27]'}`}>
            <p className={`text-2xl font-bold font-mono ${s.label === tx.wpm ? 'text-brand-400' : 'text-slate-200'}`}>{s.val}</p>
            <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* 진행 바 */}
      <div className="h-1.5 bg-surface-border rounded-full mb-5 overflow-hidden">
        <div className="h-full bg-brand-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
      </div>

      {/* 텍스트 표시 */}
      <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-5 mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex gap-1.5">
            {(['ko', 'en'] as const).map(l => (
              <button key={l} onClick={() => { setTextLang(l); restart() }}
                className={`text-xs px-2.5 py-1 rounded border transition-all ${textLang === l ? 'bg-brand-500 border-brand-500 text-white font-bold' : 'border-surface-border text-slate-400 hover:border-brand-500/40'}`}>
                {l.toUpperCase()}
              </button>
            ))}
          </div>
          <div className="flex gap-1.5">
            <button onClick={restart} className="text-xs px-2.5 py-1.5 rounded border border-surface-border text-slate-400 hover:text-brand-400 hover:border-brand-500/40 transition-all flex items-center gap-1">
              <RefreshCw size={11} /> {tx.restart}
            </button>
            <button onClick={newText} className="text-xs px-2.5 py-1.5 rounded border border-surface-border text-slate-400 hover:text-brand-400 hover:border-brand-500/40 transition-all">
              {tx.newText}
            </button>
          </div>
        </div>
        <p className="text-sm leading-8 font-mono select-none">{renderText()}</p>
      </div>

      {/* 입력창 */}
      <textarea
        ref={inputRef}
        value={typed}
        onChange={handleInput}
        disabled={finished}
        placeholder={lang === 'ko' ? '여기를 클릭하고 위 텍스트를 그대로 입력하세요...' : 'Click here and start typing the text above...'}
        rows={4}
        className="w-full bg-[#1a1d27] border border-surface-border rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-brand-500/50 transition-all resize-none font-mono"
      />

      {/* 완료 결과 */}
      {finished && (
        <div className="rounded-xl border border-brand-500/30 bg-brand-500/10 p-5 mt-4 text-center">
          <p className="text-xl font-bold text-brand-400 mb-2">{tx.grade(wpm)}</p>
          <div className="flex justify-center gap-6">
            <div><p className="text-2xl font-bold text-white font-mono">{wpm}</p><p className="text-xs text-slate-400">WPM</p></div>
            <div><p className="text-2xl font-bold text-white font-mono">{accuracy}%</p><p className="text-xs text-slate-400">{tx.accuracy}</p></div>
            <div><p className="text-2xl font-bold text-white font-mono">{elapsed}s</p><p className="text-xs text-slate-400">{tx.time}</p></div>
          </div>
          <button onClick={restart} className="mt-4 px-6 py-2 rounded-lg bg-brand-500 text-white font-bold text-sm hover:bg-brand-400 transition-all">
            {tx.restart}
          </button>
        </div>
      )}

      <ToolFooter
        toolName={lang === 'ko' ? '타이핑 속도 측정기' : 'Typing Speed Test'}
        toolUrl="https://keyword-mixer.vercel.app/typing-speed"
        description={tx.desc}
        howToUse={lang === 'ko' ? [
          { step: '텍스트 언어 선택', desc: 'KO(한국어) 또는 EN(영어) 텍스트를 선택하세요.' },
          { step: '입력 시작', desc: '하단 입력창을 클릭하고 위에 표시된 텍스트를 입력하면 자동으로 측정이 시작됩니다.' },
          { step: '실시간 통계 확인', desc: 'WPM(분당 단어), CPM(분당 글자), 정확도가 실시간으로 업데이트됩니다.' },
          { step: '결과 확인', desc: '텍스트를 완성하면 최종 타이핑 속도와 등급을 확인할 수 있습니다.' },
        ] : [
          { step: 'Select text language', desc: 'Choose KO (Korean) or EN (English) text.' },
          { step: 'Start typing', desc: 'Click the input area and start typing the displayed text. Timer starts automatically.' },
          { step: 'Monitor stats', desc: 'WPM, CPM, and accuracy update in real-time as you type.' },
          { step: 'See results', desc: 'When you finish, see your final speed, accuracy, and grade.' },
        ]}
        whyUse={lang === 'ko' ? [
          { title: '한국어 타이핑 지원', desc: '한국어와 영어 텍스트를 모두 지원해 한글 타이핑 속도도 측정할 수 있습니다.' },
          { title: '오류 실시간 표시', desc: '잘못 입력한 글자를 빨간색으로 즉시 표시해 정확도를 높일 수 있습니다.' },
          { title: '상세 통계 제공', desc: 'WPM, CPM, 정확도, 오류 수를 모두 측정해 실력을 정확히 파악할 수 있습니다.' },
          { title: '여러 텍스트 지원', desc: '4가지 텍스트를 무작위로 제공해 반복 학습 효과를 높입니다.' },
        ] : [
          { title: 'Korean & English support', desc: 'Test your typing speed in both Korean and English.' },
          { title: 'Real-time error highlighting', desc: 'Mistakes are highlighted in red instantly to help improve accuracy.' },
          { title: 'Detailed statistics', desc: 'Track WPM, CPM, accuracy, and error count for comprehensive analysis.' },
          { title: 'Multiple texts', desc: '4 different texts available to prevent memorization.' },
        ]}
        faqs={lang === 'ko' ? [
          { q: 'WPM이 무엇인가요?', a: 'WPM은 Words Per Minute(분당 단어 수)의 약자입니다. 1단어는 평균 5글자로 계산합니다.' },
          { q: '평균 타이핑 속도는?', a: '일반인 평균은 40~60 WPM, 능숙한 사무직은 65~75 WPM, 전문 타이피스트는 80+ WPM입니다.' },
          { q: '타이핑 속도를 빨리 높이려면?', a: '홈 포지션(ASDF-JKL;)을 익히고, 눈으로 키보드를 보지 않는 연습을 하세요. 매일 15~30분 꾸준히 연습하면 한 달 내 뚜렷한 향상을 볼 수 있습니다.' },
          { q: '한국어 타이핑 속도는 어떻게 측정하나요?', a: '영어와 동일하게 분당 입력 글자 수(CPM)로 측정합니다. 한국어는 WPM보다 CPM이 더 직관적인 지표입니다.' },
        ] : [
          { q: 'What is WPM?', a: 'WPM stands for Words Per Minute. One word is calculated as 5 characters on average.' },
          { q: 'What is the average typing speed?', a: 'Average is 40-60 WPM, office workers around 65-75 WPM, professional typists 80+ WPM.' },
          { q: 'How to improve typing speed quickly?', a: 'Learn home row position (ASDF-JKL;), practice touch typing without looking at keyboard. 15-30 min daily practice shows results within a month.' },
          { q: 'What is a good CPM?', a: 'CPM (Characters Per Minute) is more useful for non-English languages. 200+ CPM is considered good.' },
        ]}
        keywords="타이핑 속도 측정 · 타자 속도 · WPM 측정 · 타이핑 연습 · 한글 타이핑 속도 · 타이핑 테스트 · typing speed test · WPM test · typing practice · keyboard speed test · words per minute · CPM test · free typing test"
      />
    </div>
  )
}
