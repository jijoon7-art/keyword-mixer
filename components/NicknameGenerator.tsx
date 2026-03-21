'use client'

import { useState, useCallback } from 'react'
import { Copy, CheckCheck, RefreshCw } from 'lucide-react'
import { useLang } from './LangContext'
import ToolFooter from './ToolFooter'

const T = {
  ko: {
    title: '랜덤 닉네임 생성기',
    desc: '게임·SNS·커뮤니티용 닉네임을 랜덤으로 즉시 생성. 한글·영문·귀여운·멋있는 스타일 선택 가능.',
    style: '스타일',
    count: '생성 수',
    generate: '닉네임 생성',
    copy: '복사',
    copyAll: '전체 복사',
    copied: '복사됨!',
    includeNum: '숫자 포함',
    length: '길이',
  },
  en: {
    title: 'Random Nickname Generator',
    desc: 'Generate random nicknames for games, SNS, and communities. Choose Korean, English, cute, or cool styles.',
    style: 'Style',
    count: 'Count',
    generate: 'Generate',
    copy: 'Copy',
    copyAll: 'Copy All',
    copied: 'Copied!',
    includeNum: 'Include Numbers',
    length: 'Length',
  }
}

const STYLES = [
  { key: 'cute_ko', label: '귀여운 (한글)', labelEn: 'Cute (Korean)' },
  { key: 'cool_ko', label: '멋진 (한글)', labelEn: 'Cool (Korean)' },
  { key: 'game', label: '게임 스타일', labelEn: 'Gaming' },
  { key: 'animal', label: '동물 조합', labelEn: 'Animal Mix' },
  { key: 'english', label: '영문 스타일', labelEn: 'English' },
  { key: 'random', label: '완전 랜덤', labelEn: 'Full Random' },
]

const CUTE_ADJ = ['달콤한', '귀여운', '작은', '하얀', '분홍', '보들보들', '말랑', '새콤', '따뜻한', '반짝', '빛나는', '작은', '몽글몽글', '솜사탕', '구름', '하늘', '별빛', '달빛', '복숭아', '체리']
const CUTE_NOUN = ['고양이', '토끼', '곰돌이', '팬더', '강아지', '햄스터', '다람쥐', '병아리', '오리', '사슴', '코끼리', '기린', '펭귄', '바다표범', '물개', '코알라']
const COOL_ADJ = ['무적의', '최강', '전설의', '신화의', '어둠의', '빛의', '폭풍의', '번개', '불꽃', '얼음', '강철', '황금', '다이아', '플래티넘', '다크', '섀도우', '루나', '솔라', '스톰']
const COOL_NOUN = ['검객', '전사', '마법사', '궁수', '기사', '파이터', '헌터', '스나이퍼', '닌자', '사무라이', '드래곤', '피닉스', '타이탄', '워리어', '레이더', '브레이커']
const GAME_PREFIX = ['Pro', 'Dark', 'Super', 'Ultra', 'Hyper', 'Mega', 'Alpha', 'Omega', 'Neo', 'Shadow', 'Ghost', 'Blade', 'Storm', 'Fire', 'Ice', 'Thunder', 'Dark', 'Night', 'Star', 'Sky']
const GAME_SUFFIX = ['Killer', 'Master', 'Legend', 'King', 'Queen', 'God', 'Devil', 'Angel', 'Warrior', 'Hunter', 'Slayer', 'Breaker', 'Rider', 'Walker', 'Runner', 'Striker', 'Sniper', 'Wizard', 'Knight']
const ANIMALS_EN = ['Wolf', 'Fox', 'Bear', 'Tiger', 'Lion', 'Eagle', 'Hawk', 'Falcon', 'Dragon', 'Phoenix', 'Panther', 'Cheetah', 'Jaguar', 'Cobra', 'Viper', 'Shark', 'Orca']
const ANIMALS_ADJ = ['Swift', 'Silent', 'Mighty', 'Wild', 'Fierce', 'Dark', 'Shadow', 'Golden', 'Iron', 'Storm', 'Thunder', 'Blazing', 'Frozen', 'Toxic', 'Raging']
const EN_WORDS_1 = ['Brave', 'Bold', 'Bright', 'Sharp', 'Quick', 'Calm', 'Cool', 'Deep', 'Epic', 'Fine', 'Grand', 'High', 'Keen', 'Lone', 'Mild', 'Noble', 'Pure', 'Real', 'True', 'Wise']
const EN_WORDS_2 = ['Blade', 'Cipher', 'Coder', 'Drifter', 'Explorer', 'Fighter', 'Glitch', 'Hacker', 'Phantom', 'Pixel', 'Ranger', 'Rebel', 'Scout', 'Shade', 'Spark', 'Spirit', 'Storm', 'Void', 'Wave']

function rand<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)] }
function randNum(min: number, max: number): number { return Math.floor(Math.random() * (max - min + 1)) + min }

function generate(style: string, includeNum: boolean): string {
  let base = ''
  switch (style) {
    case 'cute_ko': base = rand(CUTE_ADJ) + rand(CUTE_NOUN); break
    case 'cool_ko': base = rand(COOL_ADJ) + rand(COOL_NOUN); break
    case 'game': base = rand(GAME_PREFIX) + rand(GAME_SUFFIX); break
    case 'animal': base = rand(ANIMALS_ADJ) + rand(ANIMALS_EN); break
    case 'english': base = rand(EN_WORDS_1) + rand(EN_WORDS_2); break
    case 'random': {
      const styles = ['cute_ko', 'cool_ko', 'game', 'animal', 'english']
      return generate(rand(styles), includeNum)
    }
    default: base = rand(GAME_PREFIX) + rand(GAME_SUFFIX)
  }
  return includeNum ? base + randNum(1, 999) : base
}

export default function NicknameGenerator() {
  const { lang } = useLang()
  const tx = T[lang]
  const [style, setStyle] = useState('cute_ko')
  const [count, setCount] = useState(10)
  const [includeNum, setIncludeNum] = useState(false)
  const [nicknames, setNicknames] = useState<string[]>([])
  const [copied, setCopied] = useState<string | null>(null)
  const [favorites, setFavorites] = useState<string[]>([])

  const generateNicknames = useCallback(() => {
    const result = Array.from({ length: count }, () => generate(style, includeNum))
    setNicknames(result)
  }, [style, count, includeNum])

  const copy = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(key); setTimeout(() => setCopied(null), 1500)
  }

  const copyAll = () => copy(nicknames.join('\n'), 'all')

  const toggleFav = (name: string) => {
    setFavorites(prev => prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name])
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-mono mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />Free Tool
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-3">{tx.title}</h1>
        <p className="text-slate-300 text-base max-w-lg mx-auto">{tx.desc}</p>
      </div>

      {/* 설정 */}
      <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-5 mb-5">
        <div className="mb-4">
          <p className="text-xs text-slate-400 mb-2 font-medium">{tx.style}</p>
          <div className="grid grid-cols-3 gap-1.5">
            {STYLES.map(s => (
              <button key={s.key} onClick={() => setStyle(s.key)}
                className={`py-2 rounded-lg border text-xs font-medium transition-all ${style === s.key ? 'bg-brand-500 border-brand-500 text-white font-bold' : 'border-surface-border text-slate-300 hover:border-brand-500/40 bg-[#0f1117]'}`}>
                {lang === 'ko' ? s.label : s.labelEn}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1">
            <p className="text-xs text-slate-400 mb-2 font-medium">{tx.count}</p>
            <div className="flex gap-1.5">
              {[5, 10, 20, 30].map(n => (
                <button key={n} onClick={() => setCount(n)}
                  className={`flex-1 py-1.5 rounded-lg border text-xs font-mono transition-all ${count === n ? 'bg-brand-500 border-brand-500 text-white font-bold' : 'border-surface-border text-slate-300 bg-[#0f1117]'}`}>
                  {n}
                </button>
              ))}
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer mt-4">
            <div onClick={() => setIncludeNum(!includeNum)} className={`w-10 h-5 rounded-full relative transition-all ${includeNum ? 'bg-brand-500' : 'bg-surface-border'}`}>
              <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all shadow ${includeNum ? 'left-5' : 'left-0.5'}`} />
            </div>
            <span className="text-xs text-slate-300">{tx.includeNum}</span>
          </label>
        </div>

        <button onClick={generateNicknames} className="w-full py-3 rounded-xl bg-brand-500 hover:bg-brand-400 text-white font-bold text-sm transition-all flex items-center justify-center gap-2">
          <RefreshCw size={15} /> {tx.generate}
        </button>
      </div>

      {/* 결과 */}
      {nicknames.length > 0 && (
        <div className="rounded-xl border border-surface-border bg-[#1a1d27] overflow-hidden mb-5">
          <div className="flex items-center justify-between px-4 py-3 border-b border-surface-border">
            <span className="text-sm font-medium text-slate-200">{nicknames.length}{lang === 'ko' ? '개 생성됨' : ' Generated'}</span>
            <button onClick={copyAll} className={`text-xs px-3 py-1.5 rounded-lg border flex items-center gap-1 transition-all ${copied === 'all' ? 'bg-brand-500/20 border-brand-500/40 text-brand-400' : 'border-surface-border text-slate-300 hover:border-brand-500/40'}`}>
              {copied === 'all' ? <CheckCheck size={12} /> : <Copy size={12} />} {tx.copyAll}
            </button>
          </div>
          <div className="grid grid-cols-2 divide-x divide-y divide-surface-border">
            {nicknames.map((name, i) => (
              <div key={i} className="flex items-center justify-between px-3 py-2.5 hover:bg-surface-hover/10 transition-all">
                <span className="text-sm text-slate-200 font-medium">{name}</span>
                <div className="flex items-center gap-1">
                  <button onClick={() => toggleFav(name)} className={`p-1 rounded transition-all text-sm ${favorites.includes(name) ? 'text-yellow-400' : 'text-slate-600 hover:text-yellow-400'}`}>★</button>
                  <button onClick={() => copy(name, name)} className={`p-1.5 rounded border transition-all ${copied === name ? 'bg-brand-500/20 border-brand-500/40 text-brand-400' : 'border-surface-border text-slate-500 hover:text-brand-400 hover:border-brand-500/40'}`}>
                    {copied === name ? <CheckCheck size={12} /> : <Copy size={12} />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 즐겨찾기 */}
      {favorites.length > 0 && (
        <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/5 p-4 mb-5">
          <p className="text-xs text-yellow-400 mb-2 font-medium">★ {lang === 'ko' ? '즐겨찾기' : 'Favorites'}</p>
          <div className="flex flex-wrap gap-2">
            {favorites.map(name => (
              <div key={name} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
                <span className="text-sm text-slate-200">{name}</span>
                <button onClick={() => copy(name, `fav-${name}`)} className="text-yellow-400 hover:text-brand-400 transition-all">
                  {copied === `fav-${name}` ? <CheckCheck size={12} /> : <Copy size={12} />}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <ToolFooter
        toolName={lang === 'ko' ? '랜덤 닉네임 생성기' : 'Random Nickname Generator'}
        toolUrl="https://keyword-mixer.vercel.app/nickname-generator"
        description={tx.desc}
        howToUse={lang === 'ko' ? [
          { step: '스타일 선택', desc: '귀여운, 멋진, 게임, 동물, 영문 스타일 중 원하는 것을 선택하세요.' },
          { step: '생성 수 설정', desc: '5~30개 중 원하는 개수를 선택하세요.' },
          { step: '생성 버튼 클릭', desc: '버튼을 클릭하면 랜덤 닉네임이 즉시 생성됩니다.' },
          { step: '복사 또는 즐겨찾기', desc: '마음에 드는 닉네임을 복사하거나 ★로 즐겨찾기에 저장하세요.' },
        ] : [
          { step: 'Select style', desc: 'Choose from cute Korean, cool Korean, gaming, animal mix, or English styles.' },
          { step: 'Set count', desc: 'Choose 5 to 30 nicknames to generate at once.' },
          { step: 'Click generate', desc: 'Click the button to instantly generate random nicknames.' },
          { step: 'Copy or favorite', desc: 'Copy nicknames you like or save them with ★ to favorites.' },
        ]}
        whyUse={lang === 'ko' ? [
          { title: '6가지 스타일', desc: '귀여운 한글부터 게임용 영문까지 다양한 스타일을 지원합니다.' },
          { title: '즐겨찾기 기능', desc: '마음에 드는 닉네임을 즐겨찾기에 저장해두고 비교할 수 있습니다.' },
          { title: '숫자 포함 옵션', desc: '닉네임에 숫자를 포함해 중복 방지에 활용할 수 있습니다.' },
          { title: '전체 복사', desc: '생성된 모든 닉네임을 한번에 복사할 수 있습니다.' },
        ] : [
          { title: '6 style options', desc: 'From cute Korean to English gaming styles.' },
          { title: 'Favorites system', desc: 'Save and compare your favorite generated nicknames.' },
          { title: 'Number suffix option', desc: 'Add numbers to reduce nickname duplication.' },
          { title: 'Bulk copy', desc: 'Copy all generated nicknames at once.' },
        ]}
        faqs={lang === 'ko' ? [
          { q: '생성된 닉네임을 실제로 사용해도 되나요?', a: '네, 생성된 닉네임은 자유롭게 사용하실 수 있습니다. 다만 플랫폼마다 이미 사용 중인 닉네임일 수 있으니 확인 후 사용하세요.' },
          { q: '게임별로 추천 스타일이 있나요?', a: 'FPS·배틀로얄은 "게임 스타일", RPG는 "멋진 한글", 귀여운 캐릭터 게임은 "귀여운 한글"을 추천합니다.' },
          { q: '닉네임 길이를 조절할 수 있나요?', a: '현재는 스타일별로 자동 생성됩니다. 숫자 포함 옵션을 켜면 더 길게, 끄면 더 짧게 조절됩니다.' },
          { q: '중복 가능성은?', a: '조합 방식이라 동일 닉네임이 나올 확률이 있습니다. 숫자를 포함하면 중복 가능성이 크게 줄어듭니다.' },
        ] : [
          { q: 'Can I use generated nicknames freely?', a: 'Yes! Feel free to use generated nicknames. Just check if they\'re already taken on your platform.' },
          { q: 'Which style suits which game?', a: '"Gaming" for FPS/Battle Royale, "Cool Korean" for RPG, "Cute Korean" for casual/cute games.' },
          { q: 'Can I control nickname length?', a: 'Lengths are determined by style. Enable "Include Numbers" to make them longer and more unique.' },
          { q: 'Is there a duplication risk?', a: 'Since names are combination-based, duplicates can occur. Adding numbers greatly reduces duplication.' },
        ]}
        keywords="닉네임 생성기 · 랜덤 닉네임 · 게임 닉네임 · 아이디 생성기 · 닉네임 추천 · 귀여운 닉네임 · 영문 닉네임 · nickname generator · random nickname · game username generator · cool nickname ideas · cute nickname Korean"
      />
    </div>
  )
}
