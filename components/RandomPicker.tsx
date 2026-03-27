'use client'
import { useState, useCallback } from 'react'
import { Copy, CheckCheck, Plus, Trash2, Shuffle } from 'lucide-react'
import { useLang } from './LangContext'
import ToolFooter from './ToolFooter'

const T = {
  ko: {
    title: '랜덤 선택기 / 뽑기 도구',
    desc: '여러 항목 중 무작위로 선택. 점심 메뉴 고르기, 당첨자 추첨, 팀 배정, 순서 정하기에 활용.',
    items: '항목 목록', add: '항목 추가', pick: '뽑기!', pickN: '여러 개 뽑기',
    result: '결과', history: '뽑기 기록', clear: '초기화',
    count: '뽑을 개수',
  },
  en: {
    title: 'Random Picker / Lucky Draw',
    desc: 'Randomly pick from multiple items. Use for lunch menus, lucky draws, team assignments, and order shuffling.',
    items: 'Items List', add: 'Add Item', pick: 'Pick!', pickN: 'Pick Multiple',
    result: 'Result', history: 'History', clear: 'Clear',
    count: 'Pick Count',
  }
}

const PRESETS = {
  lunch: { ko: '🍱 점심 메뉴', en: '🍱 Lunch Menu', items: ['한식', '중식', '일식', '양식', '분식', '치킨', '피자', '샌드위치'] },
  team: { ko: '👥 팀 구성', en: '👥 Team Builder', items: ['팀A', '팀B', '팀C', '팀D'] },
  weekday: { ko: '📅 요일', en: '📅 Weekdays', items: ['월요일', '화요일', '수요일', '목요일', '금요일'] },
  rock: { ko: '✊ 가위바위보', en: '✊ Rock Paper Scissors', items: ['가위 ✂️', '바위 ✊', '보 🖐'] },
  number: { ko: '🔢 1~10 숫자', en: '🔢 Numbers 1~10', items: Array.from({ length: 10 }, (_, i) => String(i + 1)) },
  yesno: { ko: '✅ 예/아니오', en: '✅ Yes/No', items: ['예 ✅', '아니오 ❌'] },
}

export default function RandomPicker() {
  const { lang } = useLang()
  const tx = T[lang]
  const [items, setItems] = useState(['항목 1', '항목 2', '항목 3', '항목 4', '항목 5'])
  const [newItem, setNewItem] = useState('')
  const [pickCount, setPickCount] = useState(1)
  const [result, setResult] = useState<string[]>([])
  const [history, setHistory] = useState<{ items: string[]; time: string }[]>([])
  const [isSpinning, setIsSpinning] = useState(false)
  const [copied, setCopied] = useState(false)

  const addItem = () => {
    if (!newItem.trim()) return
    setItems(p => [...p, newItem.trim()])
    setNewItem('')
  }

  const removeItem = (i: number) => setItems(p => p.filter((_, j) => j !== i))

  const pickRandom = useCallback(() => {
    if (items.length === 0) return
    setIsSpinning(true)
    setResult([])

    // 드럼롤 효과
    let count = 0
    const maxCount = 15
    const interval = setInterval(() => {
      const shuffled = [...items].sort(() => Math.random() - 0.5)
      const selected = shuffled.slice(0, Math.min(pickCount, items.length))
      setResult(selected)
      count++
      if (count >= maxCount) {
        clearInterval(interval)
        setIsSpinning(false)
        const time = new Date().toLocaleTimeString()
        setHistory(p => [{ items: selected, time }, ...p].slice(0, 20))
      }
    }, 80)
  }, [items, pickCount])

  const shuffle = () => setItems(p => [...p].sort(() => Math.random() - 0.5))

  const copy = async () => {
    await navigator.clipboard.writeText(result.join(', '))
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const loadPreset = (key: keyof typeof PRESETS) => {
    setItems(PRESETS[key].items)
    setResult([])
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-mono mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />Free Tool
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-3">{tx.title}</h1>
        <p className="text-slate-300 text-base max-w-xl mx-auto">{tx.desc}</p>
      </div>

      {/* 프리셋 */}
      <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4 mb-5">
        <p className="text-xs text-slate-400 mb-2 font-medium">{lang === 'ko' ? '빠른 프리셋' : 'Quick Presets'}</p>
        <div className="flex flex-wrap gap-2">
          {Object.entries(PRESETS).map(([key, preset]) => (
            <button key={key} onClick={() => loadPreset(key as keyof typeof PRESETS)}
              className="text-xs px-3 py-1.5 rounded-lg border border-surface-border text-slate-300 hover:border-brand-500/40 hover:text-brand-300 bg-[#0f1117] transition-all">
              {lang === 'ko' ? preset.ko : preset.en}
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {/* 항목 관리 */}
        <div className="flex flex-col gap-3">
          <div className="rounded-xl border border-surface-border bg-[#1a1d27] overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-surface-border bg-[#0f1117]">
              <p className="text-xs font-medium text-slate-200">{tx.items} ({items.length})</p>
              <div className="flex gap-2">
                <button onClick={shuffle} className="text-xs px-2 py-1 rounded border border-surface-border text-slate-400 hover:text-brand-300 hover:border-brand-500/40 flex items-center gap-1 transition-all">
                  <Shuffle size={11} /> {lang === 'ko' ? '섞기' : 'Shuffle'}
                </button>
                <button onClick={() => { setItems([]); setResult([]) }} className="text-xs px-2 py-1 rounded border border-surface-border text-slate-400 hover:text-red-400 transition-all">
                  {tx.clear}
                </button>
              </div>
            </div>
            <div className="max-h-64 overflow-y-auto divide-y divide-surface-border">
              {items.map((item, i) => (
                <div key={i} className="flex items-center gap-2 px-4 py-2.5 hover:bg-surface-hover/10">
                  <span className="text-xs text-slate-500 w-5">{i + 1}.</span>
                  <span className="flex-1 text-sm text-slate-200">{item}</span>
                  <button onClick={() => removeItem(i)} className="text-slate-600 hover:text-red-400 transition-all">
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2 p-3 border-t border-surface-border">
              <input
                value={newItem}
                onChange={e => setNewItem(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addItem()}
                placeholder={lang === 'ko' ? '새 항목 입력...' : 'New item...'}
                className="flex-1 bg-[#0f1117] border border-surface-border rounded-lg px-3 py-2 text-slate-200 text-sm focus:outline-none focus:border-brand-500/50 transition-all"
              />
              <button onClick={addItem} className="px-3 py-2 rounded-lg bg-brand-500 hover:bg-brand-400 text-white text-sm font-bold transition-all">
                <Plus size={14} />
              </button>
            </div>
          </div>

          {/* 뽑기 설정 */}
          <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4">
            <label className="text-xs text-slate-400 mb-2 block">{tx.count}</label>
            <div className="flex gap-2 mb-3">
              {[1, 2, 3, 5].map(n => (
                <button key={n} onClick={() => setPickCount(n)}
                  className={`flex-1 py-2 rounded-lg border text-sm font-bold transition-all ${pickCount === n ? 'bg-brand-500 border-brand-500 text-white' : 'border-surface-border text-slate-300 bg-[#0f1117]'}`}>
                  {n}
                </button>
              ))}
              <input type="number" min={1} max={items.length} value={pickCount} onChange={e => setPickCount(+e.target.value)}
                className="w-16 bg-[#0f1117] border border-surface-border rounded-lg px-2 py-2 text-slate-200 text-sm font-mono text-center focus:outline-none focus:border-brand-500/50 transition-all" />
            </div>
            <button onClick={pickRandom} disabled={items.length === 0 || isSpinning}
              className={`w-full py-4 rounded-xl font-extrabold text-xl transition-all ${isSpinning
                ? 'bg-yellow-500 text-black animate-pulse cursor-wait'
                : 'bg-gradient-to-r from-brand-500 to-blue-500 hover:from-brand-400 hover:to-blue-400 text-white shadow-lg'}`}>
              {isSpinning ? (lang === 'ko' ? '🎰 추첨 중...' : '🎰 Drawing...') : `🎲 ${tx.pick}`}
            </button>
          </div>
        </div>

        {/* 결과 */}
        <div className="flex flex-col gap-3">
          {/* 결과 표시 */}
          <div className="rounded-xl border border-brand-500/30 bg-brand-500/10 p-5 min-h-36 flex flex-col items-center justify-center">
            {result.length > 0 ? (
              <>
                <p className="text-xs text-slate-400 mb-3">{tx.result}</p>
                <div className="flex flex-wrap gap-2 justify-center mb-3">
                  {result.map((r, i) => (
                    <div key={i} className={`px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white font-bold text-xl ${isSpinning ? 'opacity-50' : ''}`}>
                      {r}
                    </div>
                  ))}
                </div>
                <button onClick={copy} className={`text-xs px-4 py-2 rounded-lg border flex items-center gap-1.5 transition-all ${copied ? 'bg-brand-500/20 border-brand-500/40 text-brand-400' : 'border-surface-border text-slate-300 hover:border-brand-500/40'}`}>
                  {copied ? <CheckCheck size={12} /> : <Copy size={12} />}
                  {lang === 'ko' ? '결과 복사' : 'Copy Result'}
                </button>
              </>
            ) : (
              <p className="text-slate-500 text-sm">{lang === 'ko' ? '뽑기 버튼을 눌러주세요' : 'Press the Pick button'}</p>
            )}
          </div>

          {/* 기록 */}
          {history.length > 0 && (
            <div className="rounded-xl border border-surface-border bg-[#1a1d27] overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-surface-border bg-[#0f1117]">
                <p className="text-xs font-medium text-slate-200">{tx.history}</p>
                <button onClick={() => setHistory([])} className="text-xs text-slate-500 hover:text-red-400 transition-all">{tx.clear}</button>
              </div>
              <div className="max-h-48 overflow-y-auto divide-y divide-surface-border">
                {history.map((h, i) => (
                  <div key={i} className="flex items-center gap-2 px-4 py-2">
                    <span className="text-xs text-slate-600 w-16 flex-shrink-0">{h.time}</span>
                    <div className="flex flex-wrap gap-1">
                      {h.items.map((item, j) => (
                        <span key={j} className="text-xs px-2 py-0.5 rounded bg-brand-500/20 border border-brand-500/30 text-brand-300">{item}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 통계 */}
          {items.length > 0 && (
            <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-3">
              <p className="text-xs text-slate-400 mb-2">{lang === 'ko' ? '📊 각 항목 당첨 확률' : '📊 Win Probability'}</p>
              <p className="text-sm font-bold text-brand-400 font-mono">
                {((pickCount / items.length) * 100).toFixed(1)}%
                <span className="text-xs text-slate-500 font-normal ml-2">({lang === 'ko' ? `${items.length}개 중 ${pickCount}개` : `${pickCount} of ${items.length}`})</span>
              </p>
            </div>
          )}
        </div>
      </div>

      <ToolFooter
        toolName={lang === 'ko' ? '랜덤 선택기 / 뽑기 도구' : 'Random Picker'}
        toolUrl="https://keyword-mixer.vercel.app/random-picker"
        description={tx.desc}
        howToUse={lang === 'ko' ? [
          { step: '항목 입력', desc: '뽑기할 항목들을 입력하거나 프리셋을 선택하세요.' },
          { step: '뽑을 개수 설정', desc: '한 번에 몇 개를 뽑을지 설정하세요.' },
          { step: '뽑기 버튼 클릭', desc: '뽑기! 버튼을 누르면 드럼롤 효과와 함께 랜덤 선택됩니다.' },
          { step: '결과 확인 및 복사', desc: '선택된 항목을 확인하고 필요 시 복사하세요.' },
        ] : [
          { step: 'Enter items', desc: 'Add items to pick from or select a preset.' },
          { step: 'Set pick count', desc: 'Set how many items to pick at once.' },
          { step: 'Click Pick!', desc: 'Click Pick! for drum roll animation and random selection.' },
          { step: 'View & copy result', desc: 'See selected items and copy if needed.' },
        ]}
        whyUse={lang === 'ko' ? [
          { title: '드럼롤 애니메이션', desc: '뽑기 과정을 실감나는 드럼롤 효과로 보여줍니다.' },
          { title: '여러 개 동시 뽑기', desc: '최대 항목 수만큼 한 번에 여러 개를 뽑을 수 있습니다.' },
          { title: '뽑기 기록', desc: '이전 뽑기 결과를 기록해 나중에 참조할 수 있습니다.' },
          { title: '다양한 프리셋', desc: '점심 메뉴, 팀 구성, 요일, 가위바위보 등 프리셋을 제공합니다.' },
        ] : [
          { title: 'Drum roll animation', desc: 'Shows the picking process with exciting drum roll animation.' },
          { title: 'Pick multiple items', desc: 'Pick multiple items simultaneously up to the total count.' },
          { title: 'Pick history', desc: 'Records previous picks for later reference.' },
          { title: 'Presets', desc: 'Quick presets for lunch menus, teams, weekdays, rock-paper-scissors.' },
        ]}
        faqs={lang === 'ko' ? [
          { q: '완전히 공정한 랜덤인가요?', a: 'JavaScript의 Math.random()을 사용해 균등 확률로 선택합니다. 각 항목의 당첨 확률은 동일합니다.' },
          { q: '같은 항목이 중복 뽑힐 수 있나요?', a: '중복 없이 뽑힙니다. 예: 5개 항목에서 3개를 뽑으면 항상 서로 다른 3개가 선택됩니다.' },
          { q: '항목은 몇 개까지 입력할 수 있나요?', a: '이론상 제한이 없지만, 실용적으로는 50개 이하를 권장합니다.' },
          { q: '뽑기 결과를 저장할 수 있나요?', a: '복사 버튼으로 텍스트를 복사할 수 있습니다. 뽑기 기록은 세션 동안 유지됩니다.' },
        ] : [
          { q: 'Is it truly random?', a: 'Uses JavaScript Math.random() for equal probability. Each item has the same chance of being selected.' },
          { q: 'Can the same item be picked twice?', a: 'No duplicates. Picking 3 from 5 always gives 3 different items.' },
          { q: 'How many items can I add?', a: 'No theoretical limit, but under 50 items is recommended for best experience.' },
          { q: 'Can I save the results?', a: 'Use the copy button to save text. Pick history is maintained during the session.' },
        ]}
        keywords="랜덤 선택기 · 무작위 뽑기 · 랜덤 추첨 · 점심 메뉴 고르기 · 당첨자 추첨 · 팀 배정 · random picker · lucky draw · random selector · random choice · 무작위 선택기"
      />
    </div>
  )
}
