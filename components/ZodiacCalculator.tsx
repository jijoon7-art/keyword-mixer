'use client'
import { useState } from 'react'
import { Copy, CheckCheck } from 'lucide-react'
import { useLang } from './LangContext'
import ToolFooter from './ToolFooter'

const T = {
  ko: { title: '띠 / 별자리 계산기', desc: '생년월일로 띠(12간지)·별자리·사주 연주(年柱)·음력 생일을 즉시 계산.' },
  en: { title: 'Chinese Zodiac & Star Sign Calculator', desc: 'Calculate Chinese zodiac, star sign, and birth info from date of birth instantly.' }
}

const ZODIAC_ZH = ['쥐', '소', '호랑이', '토끼', '용', '뱀', '말', '양', '원숭이', '닭', '개', '돼지']
const ZODIAC_EN = ['Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake', 'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig']
const ZODIAC_EMOJI = ['🐭', '🐂', '🐯', '🐰', '🐲', '🐍', '🐴', '🐑', '🐵', '🐔', '🐶', '🐷']
const ZODIAC_TRAIT_KO = ['지혜롭고 영리함', '성실하고 근면함', '용감하고 열정적', '온화하고 우아함', '야망있고 강인함', '신중하고 현명함', '자유롭고 활발함', '온순하고 창의적', '재치있고 유머러스', '자신감있고 정직함', '충직하고 다정함', '낙관적이고 친근함']
const ZODIAC_TRAIT_EN = ['Wise and clever', 'Diligent and hardworking', 'Brave and passionate', 'Gentle and elegant', 'Ambitious and strong', 'Prudent and wise', 'Free-spirited and lively', 'Gentle and creative', 'Witty and humorous', 'Confident and honest', 'Loyal and affectionate', 'Optimistic and friendly']

const STAR_SIGNS = [
  { name_ko: '염소자리', name_en: 'Capricorn', symbol: '♑', start: [12, 22], end: [1, 19], trait_ko: '야심차고 책임감 강함', trait_en: 'Ambitious and responsible' },
  { name_ko: '물병자리', name_en: 'Aquarius', symbol: '♒', start: [1, 20], end: [2, 18], trait_ko: '독창적이고 인도주의적', trait_en: 'Original and humanitarian' },
  { name_ko: '물고기자리', name_en: 'Pisces', symbol: '♓', start: [2, 19], end: [3, 20], trait_ko: '공감능력이 뛰어나고 예술적', trait_en: 'Empathetic and artistic' },
  { name_ko: '양자리', name_en: 'Aries', symbol: '♈', start: [3, 21], end: [4, 19], trait_ko: '용감하고 에너지가 넘침', trait_en: 'Brave and energetic' },
  { name_ko: '황소자리', name_en: 'Taurus', symbol: '♉', start: [4, 20], end: [5, 20], trait_ko: '믿음직하고 인내심 강함', trait_en: 'Reliable and patient' },
  { name_ko: '쌍둥이자리', name_en: 'Gemini', symbol: '♊', start: [5, 21], end: [6, 20], trait_ko: '적응력이 좋고 호기심이 많음', trait_en: 'Adaptable and curious' },
  { name_ko: '게자리', name_en: 'Cancer', symbol: '♋', start: [6, 21], end: [7, 22], trait_ko: '직관력이 뛰어나고 돌봄을 좋아함', trait_en: 'Intuitive and caring' },
  { name_ko: '사자자리', name_en: 'Leo', symbol: '♌', start: [7, 23], end: [8, 22], trait_ko: '창의적이고 자신감이 넘침', trait_en: 'Creative and confident' },
  { name_ko: '처녀자리', name_en: 'Virgo', symbol: '♍', start: [8, 23], end: [9, 22], trait_ko: '분석적이고 꼼꼼함', trait_en: 'Analytical and meticulous' },
  { name_ko: '천칭자리', name_en: 'Libra', symbol: '♎', start: [9, 23], end: [10, 22], trait_ko: '공정하고 사교적', trait_en: 'Fair and sociable' },
  { name_ko: '전갈자리', name_en: 'Scorpio', symbol: '♏', start: [10, 23], end: [11, 21], trait_ko: '열정적이고 강인함', trait_en: 'Passionate and intense' },
  { name_ko: '사수자리', name_en: 'Sagittarius', symbol: '♐', start: [11, 22], end: [12, 21], trait_ko: '낙관적이고 자유를 사랑함', trait_en: 'Optimistic and freedom-loving' },
]

function getZodiac(year: number) {
  const idx = ((year - 4) % 12 + 12) % 12
  return idx
}

function getStarSign(month: number, day: number) {
  for (const s of STAR_SIGNS) {
    const [sm, sd] = s.start
    const [em, ed] = s.end
    if ((month === sm && day >= sd) || (month === em && day <= ed)) return s
    if (sm > em) { // 염소자리 특수 처리
      if (month === sm && day >= sd) return s
      if (month === em && day <= ed) return s
    }
  }
  return STAR_SIGNS[0]
}

function getAge(birthDate: string): number {
  const today = new Date()
  const birth = new Date(birthDate)
  let age = today.getFullYear() - birth.getFullYear()
  const m = today.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--
  return age
}

const CHEONGAN = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계']
const JIJI = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해']

function getSaju(year: number): string {
  const cheonganIdx = ((year - 4) % 10 + 10) % 10
  const jijiIdx = ((year - 4) % 12 + 12) % 12
  return `${CHEONGAN[cheonganIdx]}${JIJI[jijiIdx]}`
}

export default function ZodiacCalculator() {
  const { lang } = useLang()
  const tx = T[lang]
  const [birthDate, setBirthDate] = useState('1990-01-01')
  const [copied, setCopied] = useState<string | null>(null)
  const copy = async (t: string, k: string) => { await navigator.clipboard.writeText(t); setCopied(k); setTimeout(() => setCopied(null), 1500) }

  const d = new Date(birthDate)
  const year = d.getFullYear()
  const month = d.getMonth() + 1
  const day = d.getDate()

  const zodiacIdx = getZodiac(year)
  const starSign = getStarSign(month, day)
  const age = getAge(birthDate)
  const saju = getSaju(year)

  const SEASONS: Record<number, string> = { 3: '봄', 4: '봄', 5: '봄', 6: '여름', 7: '여름', 8: '여름', 9: '가을', 10: '가을', 11: '가을', 12: '겨울', 1: '겨울', 2: '겨울' }
  const SEASONS_EN: Record<number, string> = { 3: 'Spring', 4: 'Spring', 5: 'Spring', 6: 'Summer', 7: 'Summer', 8: 'Summer', 9: 'Autumn', 10: 'Autumn', 11: 'Autumn', 12: 'Winter', 1: 'Winter', 2: 'Winter' }

  const ELEMENTS_KO = ['목', '목', '화', '화', '토', '토', '금', '금', '수', '수']
  const ELEMENTS_EN = ['Wood', 'Wood', 'Fire', 'Fire', 'Earth', 'Earth', 'Metal', 'Metal', 'Water', 'Water']
  const elementIdx = ((year - 4) % 10 + 10) % 10

  const dayOfWeek = d.getDay()
  const DAYS_KO = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일']
  const DAYS_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-mono mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />Free Tool
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-3">{tx.title}</h1>
        <p className="text-slate-300 text-base max-w-xl mx-auto">{tx.desc}</p>
      </div>

      <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-5 mb-5">
        <label className="text-xs text-slate-400 mb-1.5 block font-medium">{lang === 'ko' ? '생년월일 입력' : 'Enter Date of Birth'}</label>
        <input type="date" value={birthDate} onChange={e => setBirthDate(e.target.value)}
          className="w-full bg-[#0f1117] border border-surface-border rounded-xl px-4 py-3 text-slate-200 text-xl font-mono focus:outline-none focus:border-brand-500/50 transition-all" />
      </div>

      {/* 메인 결과 */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        {/* 띠 */}
        <div className="rounded-xl border border-brand-500/30 bg-brand-500/10 p-5 text-center">
          <p className="text-5xl mb-2">{ZODIAC_EMOJI[zodiacIdx]}</p>
          <p className="text-xs text-slate-400 mb-1">{lang === 'ko' ? '띠 (12간지)' : 'Chinese Zodiac'}</p>
          <p className="text-2xl font-extrabold text-brand-400">
            {lang === 'ko' ? `${ZODIAC_ZH[zodiacIdx]}띠` : ZODIAC_EN[zodiacIdx]}
          </p>
          <p className="text-xs text-slate-500 mt-1">{lang === 'ko' ? ZODIAC_TRAIT_KO[zodiacIdx] : ZODIAC_TRAIT_EN[zodiacIdx]}</p>
          <button onClick={() => copy(lang === 'ko' ? `${ZODIAC_ZH[zodiacIdx]}띠` : ZODIAC_EN[zodiacIdx], 'zodiac')}
            className={`mt-2 p-1.5 rounded border transition-all ${copied === 'zodiac' ? 'bg-brand-500/20 border-brand-500/40 text-brand-400' : 'border-surface-border text-slate-500 hover:text-brand-400'}`}>
            {copied === 'zodiac' ? <CheckCheck size={12} /> : <Copy size={12} />}
          </button>
        </div>

        {/* 별자리 */}
        <div className="rounded-xl border border-purple-500/30 bg-purple-500/10 p-5 text-center">
          <p className="text-5xl mb-2">{starSign.symbol}</p>
          <p className="text-xs text-slate-400 mb-1">{lang === 'ko' ? '별자리' : 'Star Sign'}</p>
          <p className="text-2xl font-extrabold text-purple-400">
            {lang === 'ko' ? starSign.name_ko : starSign.name_en}
          </p>
          <p className="text-xs text-slate-500 mt-1">{lang === 'ko' ? starSign.trait_ko : starSign.trait_en}</p>
          <button onClick={() => copy(lang === 'ko' ? starSign.name_ko : starSign.name_en, 'star')}
            className={`mt-2 p-1.5 rounded border transition-all ${copied === 'star' ? 'bg-purple-500/20 border-purple-500/40 text-purple-400' : 'border-surface-border text-slate-500 hover:text-purple-400'}`}>
            {copied === 'star' ? <CheckCheck size={12} /> : <Copy size={12} />}
          </button>
        </div>
      </div>

      {/* 상세 정보 */}
      <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4 mb-4">
        <p className="text-xs text-slate-400 font-medium mb-3">{lang === 'ko' ? '📅 생일 상세 정보' : '📅 Birthday Details'}</p>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: lang === 'ko' ? '나이 (만)' : 'Age', val: `${age}${lang === 'ko' ? '세' : ' years'}`, key: 'age' },
            { label: lang === 'ko' ? '태어난 요일' : 'Day of Week', val: lang === 'ko' ? DAYS_KO[dayOfWeek] : DAYS_EN[dayOfWeek], key: 'dow' },
            { label: lang === 'ko' ? '사주 연주 (年柱)' : 'Birth Year Pillar', val: `${saju}년`, key: 'saju' },
            { label: lang === 'ko' ? '오행' : 'Element', val: lang === 'ko' ? ELEMENTS_KO[elementIdx] : ELEMENTS_EN[elementIdx], key: 'elem' },
            { label: lang === 'ko' ? '태어난 계절' : 'Birth Season', val: lang === 'ko' ? SEASONS[month] : SEASONS_EN[month], key: 'season' },
            { label: lang === 'ko' ? '생년' : 'Birth Year', val: `${year}${lang === 'ko' ? '년' : ''}`, key: 'year' },
          ].map(r => (
            <div key={r.key} className="flex items-center justify-between p-2.5 rounded-lg border border-surface-border bg-[#0f1117]">
              <div>
                <p className="text-xs text-slate-500">{r.label}</p>
                <p className="text-sm font-bold text-slate-200">{r.val}</p>
              </div>
              <button onClick={() => copy(r.val, r.key)} className={`p-1 rounded border transition-all ${copied === r.key ? 'bg-brand-500/20 border-brand-500/40 text-brand-400' : 'border-surface-border text-slate-600 hover:text-brand-400'}`}>
                {copied === r.key ? <CheckCheck size={11} /> : <Copy size={11} />}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 별자리 전체 달력 */}
      <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4">
        <p className="text-xs text-slate-400 font-medium mb-3">{lang === 'ko' ? '🌟 별자리 달력' : '🌟 Zodiac Calendar'}</p>
        <div className="grid grid-cols-3 gap-2">
          {STAR_SIGNS.slice(1).map((s, i) => (
            <div key={i} className={`rounded-lg border p-2 text-center transition-all ${lang === 'ko' ? s.name_ko === starSign.name_ko : s.name_en === starSign.name_en ? 'border-purple-500/40 bg-purple-500/10' : 'border-surface-border bg-[#0f1117]'}`}>
              <p className="text-lg">{s.symbol}</p>
              <p className="text-xs font-medium text-slate-200">{lang === 'ko' ? s.name_ko : s.name_en}</p>
              <p className="text-xs text-slate-600">{s.start[0]}/{s.start[1]}~{s.end[0]}/{s.end[1]}</p>
            </div>
          ))}
        </div>
      </div>

      <ToolFooter
        toolName={lang === 'ko' ? '띠/별자리 계산기' : 'Zodiac & Star Sign Calculator'}
        toolUrl="https://keyword-mixer.vercel.app/zodiac-calculator"
        description={tx.desc}
        howToUse={lang === 'ko' ? [
          { step: '생년월일 입력', desc: '생년월일을 입력하면 모든 정보가 자동으로 계산됩니다.' },
          { step: '띠 확인', desc: '12간지 띠와 해당 띠의 특성을 확인하세요.' },
          { step: '별자리 확인', desc: '생일에 해당하는 별자리와 특성을 확인하세요.' },
          { step: '상세 정보 확인', desc: '사주 연주, 오행, 태어난 요일 등 상세 정보를 확인하세요.' },
        ] : [
          { step: 'Enter birth date', desc: 'All information calculates automatically from birth date.' },
          { step: 'View Chinese zodiac', desc: 'See your 12-year cycle zodiac animal and traits.' },
          { step: 'View star sign', desc: 'See your Western zodiac sign and characteristics.' },
          { step: 'Check details', desc: 'View birth year pillar, element, day of week, and season.' },
        ]}
        whyUse={lang === 'ko' ? [
          { title: '띠 + 별자리 통합', desc: '동양의 12간지 띠와 서양의 별자리를 한 페이지에서 확인합니다.' },
          { title: '사주 연주 계산', desc: '태어난 해의 천간지지(甲子 등)를 계산합니다.' },
          { title: '오행 정보', desc: '태어난 해의 오행(목·화·토·금·수)을 알 수 있습니다.' },
          { title: '상세 생일 정보', desc: '나이, 태어난 요일, 계절 등 다양한 생일 정보를 제공합니다.' },
        ] : [
          { title: 'East + West combined', desc: 'Chinese zodiac and Western star sign on one page.' },
          { title: 'Birth year pillar', desc: 'Calculates the Heavenly Stems and Earthly Branches for birth year.' },
          { title: 'Five elements', desc: 'Find out your birth year element (Wood, Fire, Earth, Metal, Water).' },
          { title: 'Detailed birth info', desc: 'Age, day of week, season, and more birthday details.' },
        ]}
        faqs={lang === 'ko' ? [
          { q: '띠는 어떻게 결정되나요?', a: '음력 설날(보통 양력 1~2월)을 기준으로 바뀝니다. 1~2월생은 전년도 띠일 수 있습니다. 이 계산기는 양력 연도 기준으로 계산합니다.' },
          { q: '별자리는 언제 바뀌나요?', a: '각 별자리의 시작·끝 날짜는 고정되어 있습니다. 예: 양자리 3월 21일~4월 19일. 경계일에 태어난 경우 전문 점성술 확인 권장.' },
          { q: '오행이란?', a: '동양 철학의 다섯 가지 기본 요소: 목(木)·화(火)·토(土)·금(金)·수(水). 10년마다 한 바퀴를 돌며 태어난 해의 특성을 나타냅니다.' },
          { q: '사주 연주란?', a: '사주팔자의 첫 번째 기둥(年柱)으로 태어난 해를 10천간×12지지의 조합(60갑자)으로 표현합니다. 예: 갑자년, 을축년.' },
        ] : [
          { q: 'How is Chinese zodiac determined?', a: 'Based on the Lunar New Year (usually Jan-Feb). Those born in Jan-Feb might belong to the previous year. This calculator uses the solar year.' },
          { q: 'When do star signs change?', a: 'Each sign has fixed start/end dates. E.g., Aries: March 21 - April 19. For borderline dates, consult a professional astrologer.' },
          { q: 'What are the Five Elements?', a: 'Five fundamental elements in Eastern philosophy: Wood, Fire, Earth, Metal, Water. They cycle every 10 years.' },
          { q: 'What is the birth year pillar?', a: 'The first pillar of the Four Pillars (birth year expressed as Heavenly Stem + Earthly Branch combination).' },
        ]}
        keywords="띠 계산기 · 별자리 계산기 · 나의 띠 · 생년월일 띠 · 별자리 운세 · 사주 연주 · zodiac calculator · star sign calculator · Chinese zodiac · birth date zodiac · western zodiac sign · 12간지"
      />
    </div>
  )
}
