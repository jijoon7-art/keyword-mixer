
'use client'
import { useState, useEffect } from 'react'
import { useLang } from './LangContext'
import ToolFooter from './ToolFooter'

const T = {
  ko: { title: '점심 메뉴 추천기', desc: '오늘 점심 뭐 먹을지 고민될 때! 카테고리별 랜덤 메뉴 추천. 직접 메뉴를 추가해 맞춤 뽑기도 가능.' },
  en: { title: 'Lunch Menu Picker', desc: "Can't decide what to eat for lunch? Random menu recommendation by category. Add your own menus for custom picks." }
}

const MENUS: Record<string, {ko:string,en:string,emoji:string}[]> = {
  한식: [
    {ko:'김치찌개',en:'Kimchi Stew',emoji:'🍲'},{ko:'된장찌개',en:'Soybean Paste Stew',emoji:'🍲'},
    {ko:'비빔밥',en:'Bibimbap',emoji:'🍚'},{ko:'삼겹살',en:'Pork Belly',emoji:'🥩'},
    {ko:'냉면',en:'Cold Noodles',emoji:'🍜'},{ko:'순두부찌개',en:'Soft Tofu Stew',emoji:'🍲'},
    {ko:'제육볶음',en:'Spicy Pork',emoji:'🥘'},{ko:'갈비탕',en:'Beef Rib Soup',emoji:'🥣'},
    {ko:'설렁탕',en:'Ox Bone Soup',emoji:'🍜'},{ko:'불고기',en:'Bulgogi',emoji:'🥩'},
  ],
  양식: [
    {ko:'파스타',en:'Pasta',emoji:'🍝'},{ko:'피자',en:'Pizza',emoji:'🍕'},
    {ko:'스테이크',en:'Steak',emoji:'🥩'},{ko:'버거',en:'Burger',emoji:'🍔'},
    {ko:'샌드위치',en:'Sandwich',emoji:'🥪'},{ko:'샐러드',en:'Salad',emoji:'🥗'},
    {ko:'리조또',en:'Risotto',emoji:'🍚'},{ko:'스프',en:'Soup',emoji:'🥣'},
  ],
  일식: [
    {ko:'초밥',en:'Sushi',emoji:'🍣'},{ko:'라멘',en:'Ramen',emoji:'🍜'},
    {ko:'돈가스',en:'Tonkatsu',emoji:'🍖'},{ko:'우동',en:'Udon',emoji:'🍜'},
    {ko:'카레',en:'Curry',emoji:'🍛'},{ko:'오야코동',en:'Oyakodon',emoji:'🍚'},
    {ko:'타코야키',en:'Takoyaki',emoji:'🐙'},{ko:'텐동',en:'Tempura Bowl',emoji:'🍤'},
  ],
  중식: [
    {ko:'짜장면',en:'Black Bean Noodles',emoji:'🍜'},{ko:'짬뽕',en:'Spicy Seafood Noodles',emoji:'🍜'},
    {ko:'탕수육',en:'Sweet & Sour Pork',emoji:'🥢'},{ko:'마파두부',en:'Mapo Tofu',emoji:'🫘'},
    {ko:'볶음밥',en:'Fried Rice',emoji:'🍳'},{ko:'딤섬',en:'Dim Sum',emoji:'🥟'},
  ],
  분식: [
    {ko:'떡볶이',en:'Tteokbokki',emoji:'🍢'},{ko:'라면',en:'Ramyeon',emoji:'🍜'},
    {ko:'순대',en:'Sundae',emoji:'🫕'},{ko:'튀김',en:'Fried Snacks',emoji:'🍤'},
    {ko:'김밥',en:'Gimbap',emoji:'🍱'},{ko:'만두',en:'Dumplings',emoji:'🥟'},
  ],
}

const CATS = Object.keys(MENUS)

export default function LunchPicker() {
  const { lang } = useLang()
  const tx = T[lang]
  const [selectedCats, setSelectedCats] = useState<string[]>(CATS)
  const [result, setResult] = useState<{ko:string,en:string,emoji:string,cat:string}|null>(null)
  const [spinning, setSpinning] = useState(false)
  const [history, setHistory] = useState<string[]>([])
  const [customMenu, setCustomMenu] = useState('')

  const toggleCat = (cat: string) => {
    setSelectedCats(p => p.includes(cat) ? (p.length > 1 ? p.filter(c => c !== cat) : p) : [...p, cat])
  }

  const pick = () => {
    setSpinning(true)
    setResult(null)
    const pool: {ko:string,en:string,emoji:string,cat:string}[] = []
    selectedCats.forEach(cat => MENUS[cat]?.forEach(m => pool.push({...m, cat})))
    let count = 0
    const interval = setInterval(() => {
      const random = pool[Math.floor(Math.random() * pool.length)]
      setResult({...random})
      count++
      if (count >= 15) {
        clearInterval(interval)
        setSpinning(false)
        const final = pool[Math.floor(Math.random() * pool.length)]
        setResult({...final})
        setHistory(p => [lang==='ko'?final.ko:final.en, ...p.slice(0,4)])
      }
    }, 100)
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-mono mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />Fun Tool 🍽️
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-3">{tx.title}</h1>
        <p className="text-slate-300 text-base max-w-xl mx-auto">{tx.desc}</p>
      </div>
      <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4 mb-5">
        <p className="text-xs text-slate-400 mb-2 font-medium">{lang==='ko'?'음식 카테고리 선택':'Select Categories'}</p>
        <div className="flex flex-wrap gap-2">{CATS.map(cat => (
          <button key={cat} onClick={() => toggleCat(cat)}
            className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-all ${selectedCats.includes(cat)?'bg-brand-500 border-brand-500 text-white':'border-surface-border text-slate-300 bg-[#0f1117]'}`}>{cat}</button>
        ))}</div>
      </div>
      <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-8 mb-5 text-center min-h-[200px] flex flex-col items-center justify-center">
        {result ? (
          <>
            <p className="text-7xl mb-3">{result.emoji}</p>
            <p className="text-3xl font-extrabold text-slate-200">{lang==='ko'?result.ko:result.en}</p>
            <p className="text-sm text-slate-500 mt-1">{result.cat}</p>
          </>
        ) : (
          <p className="text-slate-600 text-base">{lang==='ko'?'버튼을 눌러 오늘의 점심을 정하세요!':"Press the button to decide today's lunch!"}</p>
        )}
      </div>
      <button onClick={pick} disabled={spinning}
        className={`w-full py-4 rounded-xl text-white font-extrabold text-xl transition-all mb-5 ${spinning?'bg-orange-500 animate-pulse':'bg-brand-500 hover:bg-brand-400'}`}>
        {spinning?(lang==='ko'?'🎲 뽑는 중...':'🎲 Picking...'):(lang==='ko'?'🎲 오늘의 점심 뽑기!':'🎲 Pick My Lunch!')}
      </button>
      {history.length > 0 && (
        <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4">
          <p className="text-xs text-slate-400 font-medium mb-2">{lang==='ko'?'최근 추천 기록':'Recent Picks'}</p>
          <div className="flex flex-wrap gap-2">{history.map((h,i) => (
            <span key={i} className="text-xs px-2.5 py-1 rounded-lg border border-surface-border bg-[#0f1117] text-slate-400">{h}</span>
          ))}</div>
        </div>
      )}
      <ToolFooter
        toolName={lang==='ko'?'점심 메뉴 추천기':'Lunch Menu Picker'}
        toolUrl="https://keyword-mixer.vercel.app/lunch-picker"
        description={tx.desc}
        howToUse={lang==='ko'?[{step:'카테고리 선택',desc:'원하는 음식 카테고리를 선택하세요.'},{step:'뽑기 버튼',desc:'오늘의 점심 뽑기 버튼을 누르세요.'},{step:'결과 확인',desc:'랜덤으로 오늘의 점심 메뉴가 선택됩니다.'},{step:'마음에 안 들면',desc:'다시 뽑기 버튼을 누르면 됩니다.'}]:[{step:'Select categories',desc:'Choose food categories you want.'},{step:'Press button',desc:'Click the Pick My Lunch button.'},{step:'View result',desc:'A random menu is selected for today.'},{step:'Not satisfied?',desc:'Just press the button again!'}]}
        whyUse={lang==='ko'?[{title:'5개 카테고리 35종 메뉴',desc:'한식·양식·일식·중식·분식 5개 카테고리 35가지 메뉴.'},{title:'카테고리별 필터',desc:'원하는 카테고리만 선택해 뽑기 범위를 좁힐 수 있습니다.'},{title:'최근 기록',desc:'최근 뽑힌 메뉴 5개를 기억해 중복을 피할 수 있습니다.'},{title:'재미있는 애니메이션',desc:'뽑기 과정이 슬롯머신처럼 빠르게 바뀌어 재미를 더합니다.'}]:[{title:'35 menus in 5 categories',desc:'Korean, Western, Japanese, Chinese, and Street food categories.'},{title:'Category filter',desc:'Narrow down choices by selecting only desired categories.'},{title:'Recent history',desc:'Remembers last 5 picks to help avoid repeats.'},{title:'Fun animation',desc:'Slot machine-style spinning adds excitement to the pick.'}]}
        faqs={lang==='ko'?[{q:'메뉴를 추가할 수 있나요?',a:'현재는 기본 메뉴 35종을 제공합니다.'},{q:'특정 메뉴가 싫으면?',a:'해당 카테고리를 선택 해제하면 그 카테고리 메뉴들이 제외됩니다.'},{q:'팀 전체 점심 메뉴를 정할 때도 쓸 수 있나요?',a:'네! 여러 명이 동시에 보면서 결과를 공유할 수 있습니다.'},{q:'메뉴가 계속 같은 게 나오면?',a:'완전한 랜덤이므로 같은 메뉴가 연속으로 나올 수 있습니다. 당신의 운명이 그 메뉴인 거예요! 😄'}]:[{q:'Can I add custom menus?',a:'Currently provides 35 pre-set menus.'},{q:'What if I dislike a category?',a:'Deselect that category to exclude its menus from the pool.'},{q:'Use for team lunch decisions?',a:'Yes! Everyone can watch the screen together and share the result.'},{q:'Same menu keeps appearing?',a:"It's completely random - if the same menu keeps appearing, it's fate! 😄"}]}
        keywords="점심 메뉴 추천 · 오늘 점심 뭐 먹지 · 메뉴 뽑기 · 점심 랜덤 추천 · lunch picker · random food picker · what to eat · lunch menu random"
      />
    </div>
  )
}
