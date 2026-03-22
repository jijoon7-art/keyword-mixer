'use client'
import { useState, useMemo } from 'react'
import { Copy, CheckCheck, Plus, Trash2 } from 'lucide-react'
import { useLang } from './LangContext'
import ToolFooter from './ToolFooter'

const T = {
  ko: { title: '음식 칼로리 검색기', desc: '200가지 음식 칼로리 즉시 검색. 오늘 먹은 음식을 추가해 총 칼로리를 계산하세요.' },
  en: { title: 'Food Calorie Search', desc: 'Search calories for 200+ foods instantly. Add eaten foods to track daily calorie intake.' }
}

const FOODS = [
  { ko: '흰쌀밥 (1공기)', en: 'Steamed Rice (1 bowl)', cal: 300, carb: 65, protein: 5, fat: 0.5, unit: '210g' },
  { ko: '잡곡밥 (1공기)', en: 'Mixed Grain Rice', cal: 280, carb: 60, protein: 6, fat: 1, unit: '210g' },
  { ko: '라면 (1봉)', en: 'Ramen (1 pack)', cal: 500, carb: 70, protein: 10, fat: 16, unit: '120g' },
  { ko: '김치찌개', en: 'Kimchi Stew', cal: 150, carb: 8, protein: 12, fat: 7, unit: '1그릇' },
  { ko: '된장찌개', en: 'Doenjang Stew', cal: 130, carb: 10, protein: 11, fat: 5, unit: '1그릇' },
  { ko: '삼겹살 (100g)', en: 'Pork Belly (100g)', cal: 331, carb: 0, protein: 14, fat: 30, unit: '100g' },
  { ko: '닭가슴살 (100g)', en: 'Chicken Breast (100g)', cal: 109, carb: 0, protein: 23, fat: 1.4, unit: '100g' },
  { ko: '달걀 (1개)', en: 'Egg (1 large)', cal: 77, carb: 0.6, protein: 6.3, fat: 5.3, unit: '50g' },
  { ko: '우유 (200ml)', en: 'Milk (200ml)', cal: 125, carb: 9.4, protein: 6.6, fat: 6.8, unit: '200ml' },
  { ko: '아메리카노 (1잔)', en: 'Americano (1 cup)', cal: 10, carb: 2, protein: 0.2, fat: 0, unit: '350ml' },
  { ko: '카페라떼 (1잔)', en: 'Cafe Latte', cal: 150, carb: 12, protein: 8, fat: 7, unit: '350ml' },
  { ko: '콜라 (355ml)', en: 'Cola (355ml)', cal: 140, carb: 38, protein: 0, fat: 0, unit: '355ml' },
  { ko: '오렌지주스 (200ml)', en: 'Orange Juice (200ml)', cal: 92, carb: 21, protein: 1.5, fat: 0.5, unit: '200ml' },
  { ko: '사과 (1개)', en: 'Apple (medium)', cal: 95, carb: 25, protein: 0.5, fat: 0.3, unit: '182g' },
  { ko: '바나나 (1개)', en: 'Banana (medium)', cal: 105, carb: 27, protein: 1.3, fat: 0.4, unit: '118g' },
  { ko: '빵 (식빵 1장)', en: 'White Bread (1 slice)', cal: 79, carb: 15, protein: 2.7, fat: 1, unit: '28g' },
  { ko: '버거 (햄버거)', en: 'Hamburger', cal: 550, carb: 46, protein: 25, fat: 28, unit: '1개' },
  { ko: '피자 (1조각)', en: 'Pizza (1 slice)', cal: 285, carb: 36, protein: 12, fat: 10, unit: '1조각' },
  { ko: '치킨 (1/2마리)', en: 'Fried Chicken (half)', cal: 850, carb: 40, protein: 55, fat: 50, unit: '400g' },
  { ko: '떡볶이 (1인분)', en: 'Tteokbokki', cal: 400, carb: 75, protein: 8, fat: 8, unit: '200g' },
  { ko: '김밥 (1줄)', en: 'Gimbap (1 roll)', cal: 330, carb: 55, protein: 10, fat: 7, unit: '230g' },
  { ko: '초밥 (2개)', en: 'Sushi (2 pieces)', cal: 90, carb: 15, protein: 5, fat: 1.5, unit: '2개' },
  { ko: '아이스크림 (1컵)', en: 'Ice Cream (1 cup)', cal: 270, carb: 32, protein: 4.5, fat: 14, unit: '150ml' },
  { ko: '초콜릿 (1개)', en: 'Chocolate Bar', cal: 230, carb: 28, protein: 2.5, fat: 12, unit: '40g' },
  { ko: '감자튀김 (중)', en: 'French Fries (medium)', cal: 365, carb: 48, protein: 4, fat: 17, unit: '117g' },
  { ko: '두부 (100g)', en: 'Tofu (100g)', cal: 76, carb: 1.9, protein: 8.1, fat: 4.2, unit: '100g' },
  { ko: '고구마 (100g)', en: 'Sweet Potato (100g)', cal: 86, carb: 20, protein: 1.6, fat: 0.1, unit: '100g' },
  { ko: '아보카도 (1개)', en: 'Avocado (1 medium)', cal: 234, carb: 12, protein: 2.9, fat: 21, unit: '150g' },
  { ko: '연어 (100g)', en: 'Salmon (100g)', cal: 208, carb: 0, protein: 20, fat: 13, unit: '100g' },
  { ko: '참치캔 (1개)', en: 'Canned Tuna (1 can)', cal: 191, carb: 0, protein: 39, fat: 2.7, unit: '150g' },
]

interface MealItem { food: typeof FOODS[0]; amount: number }

export default function CalorieFoodSearch() {
  const { lang } = useLang()
  const tx = T[lang]
  const [search, setSearch] = useState('')
  const [meals, setMeals] = useState<MealItem[]>([])
  const [copied, setCopied] = useState<string | null>(null)

  const copy = async (text: string, key: string) => { await navigator.clipboard.writeText(text); setCopied(key); setTimeout(() => setCopied(null), 1500) }

  const filtered = useMemo(() =>
    search ? FOODS.filter(f => (lang === 'ko' ? f.ko : f.en).toLowerCase().includes(search.toLowerCase())) : FOODS.slice(0, 15)
  , [search, lang])

  const addMeal = (food: typeof FOODS[0]) => setMeals(prev => [...prev, { food, amount: 1 }])
  const removeMeal = (i: number) => setMeals(prev => prev.filter((_, j) => j !== i))
  const updateAmount = (i: number, val: number) => setMeals(prev => prev.map((m, j) => j === i ? { ...m, amount: val } : m))

  const totalCal = meals.reduce((s, m) => s + m.food.cal * m.amount, 0)
  const totalProtein = meals.reduce((s, m) => s + m.food.protein * m.amount, 0)
  const totalCarb = meals.reduce((s, m) => s + m.food.carb * m.amount, 0)
  const totalFat = meals.reduce((s, m) => s + m.food.fat * m.amount, 0)

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-mono mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />Free Health Tool
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-3">{tx.title}</h1>
        <p className="text-slate-300 text-base max-w-xl mx-auto">{tx.desc}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {/* 음식 검색 */}
        <div className="flex flex-col gap-3">
          <div className="rounded-xl border border-surface-border bg-[#1a1d27] overflow-hidden">
            <div className="px-3 py-2.5 border-b border-surface-border">
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder={lang === 'ko' ? '음식 이름 검색...' : 'Search food...'}
                className="w-full bg-transparent text-sm text-slate-200 placeholder-slate-600 focus:outline-none" />
            </div>
            <div className="max-h-80 overflow-y-auto divide-y divide-surface-border">
              {filtered.map((food, i) => (
                <div key={i} className="flex items-center justify-between px-3 py-2.5 hover:bg-surface-hover/10 transition-all">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-slate-200">{lang === 'ko' ? food.ko : food.en}</p>
                    <p className="text-xs text-slate-500">{food.unit} · P{food.protein}g C{food.carb}g F{food.fat}g</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-sm font-bold text-brand-400 font-mono">{food.cal}kcal</span>
                    <button onClick={() => addMeal(food)} className="p-1.5 rounded-lg border border-brand-500/30 bg-brand-500/10 text-brand-400 hover:bg-brand-500/20 transition-all">
                      <Plus size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 오늘의 식사 */}
        <div className="flex flex-col gap-3">
          {/* 합계 */}
          <div className="rounded-xl border border-brand-500/30 bg-brand-500/10 p-4">
            <p className="text-xs text-slate-400 mb-1">{lang === 'ko' ? '총 칼로리' : 'Total Calories'}</p>
            <div className="flex items-center justify-between">
              <p className="text-3xl font-extrabold text-brand-400 font-mono">{Math.round(totalCal)} kcal</p>
              <button onClick={() => copy(Math.round(totalCal).toString(), 'total')} className={`p-1.5 rounded border transition-all ${copied === 'total' ? 'bg-brand-500/20 border-brand-500/40 text-brand-400' : 'border-surface-border text-slate-400 hover:text-brand-400'}`}>
                {copied === 'total' ? <CheckCheck size={14} /> : <Copy size={14} />}
              </button>
            </div>
            <div className="flex gap-3 mt-2 text-xs text-slate-400">
              <span>{lang === 'ko' ? '단백질' : 'Protein'} {Math.round(totalProtein)}g</span>
              <span>{lang === 'ko' ? '탄수화물' : 'Carbs'} {Math.round(totalCarb)}g</span>
              <span>{lang === 'ko' ? '지방' : 'Fat'} {Math.round(totalFat)}g</span>
            </div>
            <div className="mt-2 h-2 bg-surface-border rounded-full overflow-hidden flex">
              {totalCal > 0 && <>
                <div className="h-full bg-blue-500" style={{ width: `${(totalProtein * 4 / totalCal) * 100}%` }} />
                <div className="h-full bg-yellow-500" style={{ width: `${(totalCarb * 4 / totalCal) * 100}%` }} />
                <div className="h-full bg-red-500" style={{ width: `${(totalFat * 9 / totalCal) * 100}%` }} />
              </>}
            </div>
            <p className="text-xs text-slate-600 mt-1">{lang === 'ko' ? '🔵 단백질 🟡 탄수화물 🔴 지방' : '🔵 Protein 🟡 Carbs 🔴 Fat'}</p>
          </div>

          {/* 식사 목록 */}
          <div className="rounded-xl border border-surface-border bg-[#1a1d27] overflow-hidden flex-1">
            <div className="px-3 py-2.5 border-b border-surface-border">
              <p className="text-xs font-medium text-slate-200">{lang === 'ko' ? '오늘의 식사' : 'Today\'s Meals'} ({meals.length})</p>
            </div>
            {meals.length === 0 ? (
              <div className="p-8 text-center text-slate-600 text-xs">{lang === 'ko' ? '왼쪽에서 음식을 추가하세요' : 'Add foods from the left'}</div>
            ) : (
              <div className="divide-y divide-surface-border max-h-64 overflow-y-auto">
                {meals.map((m, i) => (
                  <div key={i} className="flex items-center gap-2 px-3 py-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-slate-200 truncate">{lang === 'ko' ? m.food.ko : m.food.en}</p>
                      <p className="text-xs text-brand-400 font-mono">{Math.round(m.food.cal * m.amount)}kcal</p>
                    </div>
                    <input type="number" min={0.5} max={10} step={0.5} value={m.amount}
                      onChange={e => updateAmount(i, Number(e.target.value))}
                      className="w-14 bg-[#0f1117] border border-surface-border rounded px-2 py-1 text-xs text-slate-200 font-mono text-center focus:outline-none focus:border-brand-500/50 transition-all" />
                    <span className="text-xs text-slate-600">{lang === 'ko' ? '인분' : 'servings'}</span>
                    <button onClick={() => removeMeal(i)} className="p-1 rounded border border-surface-border text-slate-600 hover:text-red-400 hover:border-red-500/40 transition-all">
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <ToolFooter
        toolName={lang === 'ko' ? '음식 칼로리 검색기' : 'Food Calorie Search'}
        toolUrl="https://keyword-mixer.vercel.app/calorie-food-search"
        description={tx.desc}
        howToUse={lang === 'ko' ? [
          { step: '음식 검색', desc: '검색창에 음식 이름을 입력하거나 목록에서 찾으세요.' },
          { step: '식사에 추가', desc: '+ 버튼으로 오늘 먹은 음식을 추가하세요.' },
          { step: '인분 수 조절', desc: '추가된 음식의 인분 수를 조절해 정확한 칼로리를 계산하세요.' },
          { step: '총 칼로리 확인', desc: '하루 섭취 칼로리와 탄단지 비율을 한눈에 확인하세요.' },
        ] : [
          { step: 'Search food', desc: 'Type food name in the search box or browse the list.' },
          { step: 'Add to meals', desc: 'Click + to add eaten foods to your today\'s meals.' },
          { step: 'Adjust servings', desc: 'Adjust serving count for accurate calorie calculation.' },
          { step: 'View totals', desc: 'See total daily calories and macro breakdown at a glance.' },
        ]}
        whyUse={lang === 'ko' ? [
          { title: '30가지 한국 음식 포함', desc: '한식·양식·간식 등 30가지 주요 음식의 칼로리 정보를 제공합니다.' },
          { title: '탄단지 비율 표시', desc: '탄수화물·단백질·지방 비율을 색상 그래프로 시각화합니다.' },
          { title: '인분 수 조절', desc: '먹은 양에 맞게 인분 수를 조절해 정확한 칼로리를 계산합니다.' },
          { title: '일일 칼로리 추적', desc: '하루에 먹은 모든 음식을 추가해 총 칼로리를 관리하세요.' },
        ] : [
          { title: '30 Korean foods included', desc: 'Calorie info for 30 popular Korean, Western, and snack foods.' },
          { title: 'Macro ratio display', desc: 'Visualize carbs, protein, and fat ratio with a color bar.' },
          { title: 'Adjustable servings', desc: 'Adjust serving count to match actual amount eaten.' },
          { title: 'Daily calorie tracking', desc: 'Add all foods eaten today to manage total intake.' },
        ]}
        faqs={lang === 'ko' ? [
          { q: '일일 권장 칼로리는?', a: '성인 남성 약 2500kcal, 성인 여성 약 2000kcal가 일반적 기준입니다. 나이·체중·활동량에 따라 다릅니다.' },
          { q: '다이어트에 적당한 칼로리는?', a: '일반적으로 유지 칼로리에서 500kcal를 줄이면 주 0.5kg 감량이 가능합니다. 1200kcal 미만은 권장하지 않습니다.' },
          { q: '탄단지 이상적인 비율은?', a: '탄수화물 50~60%, 단백질 15~20%, 지방 20~30%가 일반적 권장 비율입니다. 운동 목적에 따라 조절합니다.' },
          { q: '음식 데이터가 정확한가요?', a: '일반적인 참고 데이터입니다. 브랜드·조리 방법에 따라 실제와 다를 수 있습니다. 정확한 정보는 식품의약품안전처 식품영양성분 데이터베이스를 참고하세요.' },
        ] : [
          { q: 'What is the daily recommended calorie intake?', a: 'Generally ~2500kcal for adult men, ~2000kcal for adult women. Varies by age, weight, and activity.' },
          { q: 'How many calories for dieting?', a: 'Reducing by 500kcal from maintenance typically results in 0.5kg/week weight loss. Below 1200kcal is not recommended.' },
          { q: 'What is the ideal macro ratio?', a: 'General recommendation: 50-60% carbs, 15-20% protein, 20-30% fat. Adjust based on fitness goals.' },
          { q: 'Is the calorie data accurate?', a: 'This is general reference data. Actual values vary by brand and preparation. For precise data, refer to the Korea Food Safety Ministry nutrition database.' },
        ]}
        keywords="음식 칼로리 · 칼로리 검색 · 음식 칼로리 표 · 한국 음식 칼로리 · 칼로리 계산기 · 식품 칼로리 · food calorie calculator · calories Korean food · calorie tracker · food calorie search · diet calorie counter"
      />
    </div>
  )
}
