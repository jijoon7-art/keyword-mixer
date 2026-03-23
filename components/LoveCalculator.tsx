'use client'
import { useState } from 'react'
import { Copy, CheckCheck } from 'lucide-react'
import { useLang } from './LangContext'
import ToolFooter from './ToolFooter'

const T = {
  ko: {
    title: '궁합 계산기 / 커플 테스트',
    desc: '이름·생년월일로 궁합 점수 계산. 혈액형·별자리·띠 궁합을 재미있게 확인해보세요.',
    name1: '첫 번째 이름', name2: '두 번째 이름',
    birth1: '생년월일 1', birth2: '생년월일 2',
    calc: '궁합 계산하기', score: '궁합 점수',
    result: '결과',
  },
  en: {
    title: 'Love Compatibility Calculator',
    desc: 'Calculate love compatibility from names and birth dates. Check blood type, star sign, and zodiac compatibility for fun.',
    name1: 'First Name', name2: 'Second Name',
    birth1: 'Birthday 1', birth2: 'Birthday 2',
    calc: 'Calculate', score: 'Compatibility',
    result: 'Result',
  }
}

function nameScore(a: string, b: string): number {
  // 이름 기반 점수 (재미용 알고리즘)
  const combined = (a + b).toUpperCase()
  let hash = 0
  for (let i = 0; i < combined.length; i++) {
    hash = (hash * 31 + combined.charCodeAt(i)) % 100
  }
  // 60~99 사이 분포
  return 60 + (hash % 40)
}

function birthScore(b1: string, b2: string): number {
  if (!b1 || !b2) return 75
  const d1 = new Date(b1), d2 = new Date(b2)
  const diff = Math.abs(d1.getTime() - d2.getTime())
  const days = diff / (1000 * 60 * 60 * 24)
  // 나이 차이가 가까울수록 높은 점수 (재미용)
  const ageDiff = Math.abs(d1.getFullYear() - d2.getFullYear())
  const base = 100 - ageDiff * 2
  return Math.min(99, Math.max(55, base))
}

function getZodiac(year: number): string {
  const z = ['쥐', '소', '호랑이', '토끼', '용', '뱀', '말', '양', '원숭이', '닭', '개', '돼지']
  const ze = ['Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake', 'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig']
  const idx = ((year - 4) % 12 + 12) % 12
  return `${z[idx]} (${ze[idx]})`
}

function getStarSign(month: number, day: number): string {
  const signs = [
    { name: '염소자리/Capricorn', sm: 12, sd: 22 }, { name: '물병자리/Aquarius', sm: 1, sd: 20 },
    { name: '물고기자리/Pisces', sm: 2, sd: 19 }, { name: '양자리/Aries', sm: 3, sd: 21 },
    { name: '황소자리/Taurus', sm: 4, sd: 20 }, { name: '쌍둥이자리/Gemini', sm: 5, sd: 21 },
    { name: '게자리/Cancer', sm: 6, sd: 21 }, { name: '사자자리/Leo', sm: 7, sd: 23 },
    { name: '처녀자리/Virgo', sm: 8, sd: 23 }, { name: '천칭자리/Libra', sm: 9, sd: 23 },
    { name: '전갈자리/Scorpio', sm: 10, sd: 23 }, { name: '사수자리/Sagittarius', sm: 11, sd: 22 },
  ]
  for (let i = 0; i < signs.length; i++) {
    const cur = signs[i], next = signs[(i + 1) % 12]
    if (cur.sm === month && day >= cur.sd) return cur.name
    if (next.sm === month && day < next.sd) return cur.name
  }
  return signs[0].name
}

function getComment(score: number, lang: string): { emoji: string; label: string; desc: string } {
  if (score >= 90) return { emoji: '💑', label: lang === 'ko' ? '천생연분!' : 'Soulmates!', desc: lang === 'ko' ? '운명적인 만남! 서로를 위해 태어난 커플입니다.' : 'A destined meeting! Born for each other.' }
  if (score >= 80) return { emoji: '❤️', label: lang === 'ko' ? '최고의 궁합' : 'Perfect Match', desc: lang === 'ko' ? '서로 잘 맞는 최고의 파트너입니다.' : 'Great compatibility, excellent partners.' }
  if (score >= 70) return { emoji: '💕', label: lang === 'ko' ? '좋은 궁합' : 'Good Match', desc: lang === 'ko' ? '좋은 궁합입니다. 서로 노력하면 행복한 관계가 됩니다.' : 'Good compatibility. Happiness with effort.' }
  if (score >= 60) return { emoji: '💙', label: lang === 'ko' ? '보통 궁합' : 'Average', desc: lang === 'ko' ? '서로 다른 점이 있지만 이해와 소통으로 극복할 수 있어요.' : 'Different but understanding bridges the gap.' }
  return { emoji: '🤝', label: lang === 'ko' ? '노력이 필요' : 'Needs Effort', desc: lang === 'ko' ? '차이가 있지만 사랑으로 모든 것을 극복할 수 있습니다!' : 'Differences exist, but love overcomes all!' }
}

const BLOOD_COMPAT: Record<string, string[]> = {
  A: ['A', 'AB'], B: ['B', 'AB'], O: ['A', 'B', 'O', 'AB'], AB: ['AB', 'A', 'B']
}

export default function LoveCalculator() {
  const { lang } = useLang()
  const tx = T[lang]
  const [name1, setName1] = useState('')
  const [name2, setName2] = useState('')
  const [birth1, setBirth1] = useState('1995-03-15')
  const [birth2, setBirth2] = useState('1993-07-22')
  const [blood1, setBlood1] = useState('A')
  const [blood2, setBlood2] = useState('O')
  const [calculated, setCalculated] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)
  const copy = async (t: string, k: string) => { await navigator.clipboard.writeText(t); setCopied(k); setTimeout(() => setCopied(null), 1500) }

  const n1 = name1 || (lang === 'ko' ? '홍길동' : 'Alex')
  const n2 = name2 || (lang === 'ko' ? '김영희' : 'Jordan')

  const nScore = nameScore(n1, n2)
  const bScore = birthScore(birth1, birth2)
  const totalScore = Math.round((nScore + bScore) / 2)

  const comment = getComment(totalScore, lang)
  const d1 = new Date(birth1), d2 = new Date(birth2)
  const zodiac1 = getZodiac(d1.getFullYear())
  const zodiac2 = getZodiac(d2.getFullYear())
  const star1 = getStarSign(d1.getMonth() + 1, d1.getDate())
  const star2 = getStarSign(d2.getMonth() + 1, d2.getDate())

  const bloodCompat = BLOOD_COMPAT[blood1]?.includes(blood2)

  // 점수 구간별 색상
  const scoreColor = totalScore >= 90 ? 'text-red-400' : totalScore >= 80 ? 'text-orange-400' : totalScore >= 70 ? 'text-brand-400' : totalScore >= 60 ? 'text-blue-400' : 'text-slate-400'
  const scoreBorder = totalScore >= 90 ? 'border-red-500/30 bg-red-500/10' : totalScore >= 80 ? 'border-orange-500/30 bg-orange-500/10' : totalScore >= 70 ? 'border-brand-500/30 bg-brand-500/10' : 'border-blue-500/30 bg-blue-500/10'

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-mono mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />Fun Tool ✨
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-3">{tx.title}</h1>
        <p className="text-slate-300 text-base max-w-xl mx-auto">{tx.desc}</p>
      </div>

      <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-5 mb-5">
        <div className="grid grid-cols-2 gap-4">
          {/* Person 1 */}
          <div className="flex flex-col gap-2">
            <div className="text-center text-xs text-slate-400 font-medium pb-1 border-b border-surface-border">💙 {tx.name1}</div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">{lang === 'ko' ? '이름' : 'Name'}</label>
              <input value={name1} onChange={e => setName1(e.target.value)} placeholder={n1}
                className="w-full bg-[#0f1117] border border-surface-border rounded-lg px-3 py-2 text-slate-200 text-sm focus:outline-none focus:border-brand-500/50 transition-all" />
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">{tx.birth1}</label>
              <input type="date" value={birth1} onChange={e => setBirth1(e.target.value)}
                className="w-full bg-[#0f1117] border border-surface-border rounded-lg px-2 py-2 text-slate-200 text-xs focus:outline-none focus:border-brand-500/50 transition-all" />
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">{lang === 'ko' ? '혈액형' : 'Blood Type'}</label>
              <div className="flex gap-1">
                {['A', 'B', 'O', 'AB'].map(t => (
                  <button key={t} onClick={() => setBlood1(t)}
                    className={`flex-1 py-1.5 rounded border text-xs font-bold transition-all ${blood1 === t ? 'bg-blue-500 border-blue-500 text-white' : 'border-surface-border text-slate-400 bg-[#0f1117]'}`}>{t}</button>
                ))}
              </div>
            </div>
          </div>

          {/* Person 2 */}
          <div className="flex flex-col gap-2">
            <div className="text-center text-xs text-slate-400 font-medium pb-1 border-b border-surface-border">💗 {tx.name2}</div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">{lang === 'ko' ? '이름' : 'Name'}</label>
              <input value={name2} onChange={e => setName2(e.target.value)} placeholder={n2}
                className="w-full bg-[#0f1117] border border-surface-border rounded-lg px-3 py-2 text-slate-200 text-sm focus:outline-none focus:border-brand-500/50 transition-all" />
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">{tx.birth2}</label>
              <input type="date" value={birth2} onChange={e => setBirth2(e.target.value)}
                className="w-full bg-[#0f1117] border border-surface-border rounded-lg px-2 py-2 text-slate-200 text-xs focus:outline-none focus:border-brand-500/50 transition-all" />
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">{lang === 'ko' ? '혈액형' : 'Blood Type'}</label>
              <div className="flex gap-1">
                {['A', 'B', 'O', 'AB'].map(t => (
                  <button key={t} onClick={() => setBlood2(t)}
                    className={`flex-1 py-1.5 rounded border text-xs font-bold transition-all ${blood2 === t ? 'bg-pink-500 border-pink-500 text-white' : 'border-surface-border text-slate-400 bg-[#0f1117]'}`}>{t}</button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <button onClick={() => setCalculated(true)}
          className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-400 hover:to-red-400 text-white font-bold text-base transition-all">
          💕 {tx.calc}
        </button>
      </div>

      {/* 결과 */}
      {calculated && (
        <>
          <div className={`rounded-xl border p-6 mb-4 text-center ${scoreBorder}`}>
            <p className="text-6xl mb-3">{comment.emoji}</p>
            <p className="text-xs text-slate-400 mb-2">{n1} ♥ {n2}</p>
            <p className={`text-7xl font-extrabold font-mono mb-2 ${scoreColor}`}>{totalScore}<span className="text-3xl">%</span></p>
            <p className={`text-xl font-bold mb-2 ${scoreColor}`}>{comment.label}</p>
            <p className="text-sm text-slate-300 max-w-xs mx-auto">{comment.desc}</p>

            {/* 점수 바 */}
            <div className="h-3 bg-surface-border rounded-full overflow-hidden mt-4 mx-auto max-w-xs">
              <div className="h-full bg-gradient-to-r from-pink-500 to-red-500 rounded-full transition-all" style={{ width: `${totalScore}%` }} />
            </div>

            <button onClick={() => copy(`${n1} ♥ ${n2} 궁합: ${totalScore}%`, 'result')}
              className={`mt-3 text-xs px-4 py-2 rounded-lg border flex items-center gap-1.5 mx-auto transition-all ${copied === 'result' ? 'bg-pink-500/20 border-pink-500/40 text-pink-400' : 'border-surface-border text-slate-300 hover:border-pink-500/40'}`}>
              {copied === 'result' ? <CheckCheck size={12} /> : <Copy size={12} />}
              {lang === 'ko' ? '결과 복사' : 'Copy Result'}
            </button>
          </div>

          {/* 세부 분석 */}
          <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4 mb-4">
            <p className="text-xs text-slate-400 font-medium mb-3">{lang === 'ko' ? '🔍 세부 궁합 분석' : '🔍 Detailed Analysis'}</p>
            <div className="flex flex-col gap-2">
              {[
                { label: lang === 'ko' ? '이름 궁합' : 'Name Compatibility', score: nScore, key: 'ns' },
                { label: lang === 'ko' ? '생일 궁합' : 'Birthday Compatibility', score: bScore, key: 'bs' },
              ].map(r => (
                <div key={r.key}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">{r.label}</span>
                    <span className="text-slate-200 font-bold">{r.score}%</span>
                  </div>
                  <div className="h-2 bg-surface-border rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-pink-500/60 to-red-500/60 rounded-full" style={{ width: `${r.score}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 띠·별자리·혈액형 */}
          <div className="grid grid-cols-3 gap-3">
            {[
              {
                label: lang === 'ko' ? '띠 궁합' : 'Zodiac',
                val1: zodiac1, val2: zodiac2,
                compat: Math.random() > 0.3,
                key: 'zod'
              },
              {
                label: lang === 'ko' ? '별자리' : 'Star Sign',
                val1: star1.split('/')[lang === 'ko' ? 0 : 1], val2: star2.split('/')[lang === 'ko' ? 0 : 1],
                compat: Math.random() > 0.3,
                key: 'star'
              },
              {
                label: lang === 'ko' ? '혈액형 궁합' : 'Blood Type',
                val1: blood1, val2: blood2,
                compat: bloodCompat,
                key: 'blood'
              },
            ].map(r => (
              <div key={r.key} className="rounded-xl border border-surface-border bg-[#1a1d27] p-3 text-center">
                <p className="text-xs text-slate-400 mb-2">{r.label}</p>
                <div className="flex items-center justify-center gap-1 text-xs mb-1.5">
                  <span className="text-blue-300 font-medium truncate">{r.val1}</span>
                  <span className="text-slate-600">♥</span>
                  <span className="text-pink-300 font-medium truncate">{r.val2}</span>
                </div>
                <span className={`text-xs font-bold ${r.compat ? 'text-brand-400' : 'text-slate-500'}`}>
                  {r.compat ? '✓ ' + (lang === 'ko' ? '좋음' : 'Good') : '△ ' + (lang === 'ko' ? '보통' : 'OK')}
                </span>
              </div>
            ))}
          </div>

          <p className="text-xs text-slate-600 mt-3 text-center">
            {lang === 'ko' ? '* 이 결과는 재미를 위한 것이며 실제 관계를 보장하지 않습니다 😊' : '* For entertainment purposes only. Not a guarantee of real relationships 😊'}
          </p>
        </>
      )}

      <ToolFooter
        toolName={lang === 'ko' ? '궁합 계산기' : 'Love Compatibility Calculator'}
        toolUrl="https://keyword-mixer.vercel.app/love-calculator"
        description={tx.desc}
        howToUse={lang === 'ko' ? [
          { step: '이름 입력', desc: '두 사람의 이름을 입력하세요.' },
          { step: '생년월일 입력', desc: '두 사람의 생년월일을 선택하세요.' },
          { step: '혈액형 선택', desc: '두 사람의 혈액형을 선택하세요.' },
          { step: '궁합 계산', desc: '계산하기 버튼을 누르면 이름·생일·혈액형 궁합이 모두 계산됩니다.' },
        ] : [
          { step: 'Enter names', desc: 'Input both people\'s names.' },
          { step: 'Enter birth dates', desc: 'Select both people\'s birth dates.' },
          { step: 'Select blood types', desc: 'Choose both people\'s blood types.' },
          { step: 'Calculate', desc: 'Click calculate for name, birthday, and blood type compatibility.' },
        ]}
        whyUse={lang === 'ko' ? [
          { title: '3가지 궁합 분석', desc: '이름·생일·혈액형 3가지 방식으로 궁합을 분석합니다.' },
          { title: '띠·별자리 확인', desc: '두 사람의 띠와 별자리도 함께 확인할 수 있습니다.' },
          { title: '재미있는 점수', desc: '숫자와 이모지로 궁합을 재미있게 표현합니다.' },
          { title: '결과 공유', desc: '결과를 복사해 카카오톡, SNS에 공유하세요.' },
        ] : [
          { title: '3 compatibility types', desc: 'Name, birthday, and blood type compatibility analysis.' },
          { title: 'Zodiac info', desc: 'See both people\'s Chinese zodiac and star signs.' },
          { title: 'Fun scoring', desc: 'Fun compatibility expressed with numbers and emojis.' },
          { title: 'Share results', desc: 'Copy and share results to KakaoTalk and social media.' },
        ]}
        faqs={lang === 'ko' ? [
          { q: '이 계산기는 얼마나 정확한가요?', a: '이 계산기는 완전히 재미를 위한 도구입니다. 실제 궁합이나 관계의 성공을 예측하지 않습니다. 즐겁게 참고만 하세요!' },
          { q: '혈액형 궁합이 과학적인가요?', a: '혈액형으로 성격이나 궁합을 판단하는 것은 과학적 근거가 없습니다. 재미로 즐기는 문화입니다.' },
          { q: '좋은 궁합 혈액형 조합은?', a: 'O형은 모든 혈액형과 호환됩니다. A×A, B×B, AB형은 같은 혈액형끼리 잘 맞는다고 알려져 있습니다.' },
          { q: '이름 궁합은 어떻게 계산하나요?', a: '이름의 글자 수와 자음·모음 조합을 기반으로 재미있게 계산합니다. 동일 이름이라도 결과가 달라질 수 있습니다.' },
        ] : [
          { q: 'How accurate is this?', a: 'This is purely for fun! It does not predict actual relationship success. Enjoy it as entertainment.' },
          { q: 'Is blood type compatibility scientific?', a: 'Using blood type to determine personality or compatibility has no scientific basis. It\'s a cultural fun tradition.' },
          { q: 'Best blood type combinations?', a: 'Type O is universally compatible. A×A, B×B, and AB types are traditionally said to match well with same types.' },
          { q: 'How is name compatibility calculated?', a: 'Based on letter patterns and character combinations for fun. Results may vary for the same names.' },
        ]}
        keywords="궁합 계산기 · 이름 궁합 · 혈액형 궁합 · 커플 궁합 테스트 · 생일 궁합 · love calculator · compatibility calculator · name compatibility · zodiac compatibility · couple test · 사랑 테스트"
      />
    </div>
  )
}
