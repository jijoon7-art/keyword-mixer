'use client'
import { useState } from 'react'
import { Copy, CheckCheck, Plus, Trash2 } from 'lucide-react'
import { useLang } from './LangContext'
import ToolFooter from './ToolFooter'

const T = {
  ko: {
    title: '단가 계산기 / 가성비 비교',
    desc: '여러 상품의 단위당 가격을 계산해 가장 저렴한 상품을 찾아드립니다. 마트 장보기, 온라인 쇼핑 필수.',
    product: '상품명', price: '가격', amount: '용량/수량', unit: '단위',
    addProduct: '상품 추가', unitPrice: '단위당 가격', cheapest: '최저가',
    perUnit: '단위 가격',
  },
  en: {
    title: 'Unit Price Calculator / Value Comparison',
    desc: 'Calculate unit price for multiple products to find the best value. Essential for grocery shopping.',
    product: 'Product', price: 'Price', amount: 'Amount', unit: 'Unit',
    addProduct: 'Add Product', unitPrice: 'Unit Price', cheapest: 'Best Value',
    perUnit: 'Per Unit',
  }
}

const UNITS = ['g', 'kg', 'ml', 'L', 'ea', 'pack', '장', '개', '봉', '통']

interface Product { id: number; name: string; price: number; amount: number; unit: string }

function comma(n: number) { return n.toLocaleString('ko-KR') }
function formatUnitPrice(price: number, amount: number): string {
  if (amount === 0) return '—'
  const up = price / amount
  if (up >= 1) return `₩${up.toFixed(0)}`
  return `₩${up.toFixed(3)}`
}

export default function UnitPriceCalculator() {
  const { lang } = useLang()
  const tx = T[lang]
  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: lang === 'ko' ? '상품 A (소형)' : 'Product A (Small)', price: 2900, amount: 200, unit: 'ml' },
    { id: 2, name: lang === 'ko' ? '상품 B (중형)' : 'Product B (Medium)', price: 4500, amount: 500, unit: 'ml' },
    { id: 3, name: lang === 'ko' ? '상품 C (대형)' : 'Product C (Large)', price: 7800, amount: 1000, unit: 'ml' },
  ])
  const [baseUnit, setBaseUnit] = useState(100)
  const [copied, setCopied] = useState<string | null>(null)
  const copy = async (t: string, k: string) => { await navigator.clipboard.writeText(t); setCopied(k); setTimeout(() => setCopied(null), 1500) }

  const addProduct = () => setProducts(p => [...p, {
    id: Date.now(),
    name: `${lang === 'ko' ? '상품' : 'Product'} ${p.length + 1}`,
    price: 1000, amount: 100, unit: 'ml'
  }])
  const remove = (id: number) => setProducts(p => p.filter(x => x.id !== id))
  const update = (id: number, k: keyof Product, v: string | number) =>
    setProducts(p => p.map(x => x.id === id ? { ...x, [k]: v } : x))

  const withUnitPrice = products.map(p => ({
    ...p,
    unitPrice: p.amount > 0 ? p.price / p.amount : Infinity,
    per100: p.amount > 0 ? (p.price / p.amount) * baseUnit : Infinity,
  }))

  const minUnitPrice = Math.min(...withUnitPrice.map(p => p.unitPrice))
  const sorted = [...withUnitPrice].sort((a, b) => a.unitPrice - b.unitPrice)

  const COLORS = ['brand', 'blue', 'purple', 'orange', 'red', 'yellow']
  const COLOR_BORDER: Record<string, string> = {
    brand: 'border-brand-500/40 bg-brand-500/10',
    blue: 'border-blue-500/40 bg-blue-500/10',
    purple: 'border-purple-500/40 bg-purple-500/10',
    orange: 'border-orange-500/40 bg-orange-500/10',
    red: 'border-red-500/40 bg-red-500/10',
    yellow: 'border-yellow-500/40 bg-yellow-500/10',
  }
  const COLOR_TEXT: Record<string, string> = {
    brand: 'text-brand-400', blue: 'text-blue-400', purple: 'text-purple-400',
    orange: 'text-orange-400', red: 'text-red-400', yellow: 'text-yellow-400',
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

      {/* 기준 단위 설정 */}
      <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4 mb-5">
        <label className="text-xs text-slate-400 mb-2 block">{lang === 'ko' ? '비교 기준 단위량' : 'Comparison Base Unit'}</label>
        <div className="flex gap-2">
          {[1, 10, 100, 1000].map(v => (
            <button key={v} onClick={() => setBaseUnit(v)}
              className={`flex-1 py-2 rounded-lg border text-sm font-bold transition-all ${baseUnit === v ? 'bg-brand-500 border-brand-500 text-white' : 'border-surface-border text-slate-300 bg-[#0f1117]'}`}>
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* 상품 입력 */}
      <div className="rounded-xl border border-surface-border bg-[#1a1d27] overflow-hidden mb-5">
        <div className="grid grid-cols-12 gap-0 px-4 py-2.5 bg-[#0f1117] border-b border-surface-border text-xs text-slate-500 font-medium">
          <span className="col-span-4">{tx.product}</span>
          <span className="col-span-2 text-center">{tx.price}</span>
          <span className="col-span-2 text-center">{tx.amount}</span>
          <span className="col-span-1 text-center">{tx.unit}</span>
          <span className="col-span-2 text-center">{tx.perUnit}</span>
          <span className="col-span-1"></span>
        </div>
        {products.map((p, i) => {
          const up = p.amount > 0 ? p.price / p.amount : Infinity
          const isCheapest = up === minUnitPrice
          const color = COLORS[i % COLORS.length]
          return (
            <div key={p.id} className={`grid grid-cols-12 gap-0 px-3 py-2 border-b border-surface-border items-center ${isCheapest ? 'bg-brand-500/5' : 'hover:bg-surface-hover/5'} transition-all`}>
              <div className="col-span-4 pr-2 flex items-center gap-1.5">
                {isCheapest && <span className="text-xs text-brand-400 font-bold">✓</span>}
                <input value={p.name} onChange={e => update(p.id, 'name', e.target.value)}
                  className="w-full bg-transparent text-xs text-slate-200 focus:outline-none" />
              </div>
              <div className="col-span-2 px-1">
                <input type="number" min={0} value={p.price} onChange={e => update(p.id, 'price', +e.target.value)}
                  className="w-full bg-[#0f1117] border border-surface-border rounded px-1 py-1.5 text-slate-200 text-xs font-mono text-center focus:outline-none focus:border-brand-500/50 transition-all" />
              </div>
              <div className="col-span-2 px-1">
                <input type="number" min={0} step={0.1} value={p.amount} onChange={e => update(p.id, 'amount', +e.target.value)}
                  className="w-full bg-[#0f1117] border border-surface-border rounded px-1 py-1.5 text-slate-200 text-xs font-mono text-center focus:outline-none focus:border-brand-500/50 transition-all" />
              </div>
              <div className="col-span-1 px-1">
                <select value={p.unit} onChange={e => update(p.id, 'unit', e.target.value)}
                  className="w-full bg-[#0f1117] border border-surface-border rounded px-1 py-1.5 text-slate-200 text-xs focus:outline-none focus:border-brand-500/50 transition-all">
                  {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
              <div className="col-span-2 text-center">
                <span className={`text-xs font-bold font-mono ${isCheapest ? 'text-brand-400' : COLOR_TEXT[color]}`}>
                  {formatUnitPrice(p.price, p.amount)}/{p.unit}
                </span>
              </div>
              <div className="col-span-1 flex justify-center">
                {products.length > 1 && (
                  <button onClick={() => remove(p.id)} className="text-slate-600 hover:text-red-400 transition-all"><Trash2 size={12} /></button>
                )}
              </div>
            </div>
          )
        })}
        <button onClick={addProduct} className="w-full py-2 text-xs text-brand-400 hover:text-brand-300 flex items-center justify-center gap-1 transition-all">
          <Plus size={12} /> {tx.addProduct}
        </button>
      </div>

      {/* 순위 결과 */}
      <div className="rounded-xl border border-surface-border bg-[#1a1d27] overflow-hidden mb-4">
        <div className="px-4 py-3 border-b border-surface-border bg-[#0f1117]">
          <p className="text-sm font-semibold text-slate-200">
            {lang === 'ko' ? `📊 가성비 순위 (${baseUnit} 단위당 가격 기준)` : `📊 Value Ranking (per ${baseUnit} units)`}
          </p>
        </div>
        <div className="divide-y divide-surface-border">
          {sorted.map((p, rank) => {
            const idx = products.findIndex(x => x.id === p.id)
            const color = COLORS[idx % COLORS.length]
            const savings = rank > 0 ? ((sorted[0].unitPrice / p.unitPrice - 1) * 100) : 0
            return (
              <div key={p.id} className={`flex items-center gap-4 px-4 py-3 ${rank === 0 ? 'bg-brand-500/5' : ''}`}>
                <span className={`text-lg font-extrabold w-6 ${rank === 0 ? 'text-brand-400' : 'text-slate-500'}`}>
                  {rank + 1}
                </span>
                <div className="flex-1">
                  <p className={`text-sm font-medium ${rank === 0 ? 'text-brand-300' : 'text-slate-200'}`}>{p.name}</p>
                  <p className="text-xs text-slate-500">
                    {lang === 'ko' ? `₩${comma(p.price)} / ${p.amount}${p.unit}` : `₩${comma(p.price)} / ${p.amount}${p.unit}`}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-bold font-mono ${COLOR_TEXT[color]}`}>
                    ₩{((p.price / p.amount) * baseUnit).toFixed(0)} / {baseUnit}{p.unit}
                  </p>
                  {rank > 0 && (
                    <p className="text-xs text-red-400">
                      +{Math.abs(((p.unitPrice - sorted[0].unitPrice) / sorted[0].unitPrice) * 100).toFixed(1)}% {lang === 'ko' ? '비쌈' : 'more expensive'}
                    </p>
                  )}
                  {rank === 0 && <p className="text-xs text-brand-400 font-bold">{lang === 'ko' ? '🏆 최저가' : '🏆 Best Value'}</p>}
                </div>
                <button onClick={() => copy(`${p.name}: ₩${((p.price / p.amount) * baseUnit).toFixed(0)}/${baseUnit}${p.unit}`, `p${p.id}`)}
                  className={`p-1.5 rounded border transition-all ${copied === `p${p.id}` ? 'bg-brand-500/20 border-brand-500/40 text-brand-400' : 'border-surface-border text-slate-600 hover:text-brand-400'}`}>
                  {copied === `p${p.id}` ? <CheckCheck size={12} /> : <Copy size={12} />}
                </button>
              </div>
            )
          })}
        </div>
      </div>

      <ToolFooter
        toolName={lang === 'ko' ? '단가 계산기 / 가성비 비교' : 'Unit Price Calculator'}
        toolUrl="https://keyword-mixer.vercel.app/unit-price-calculator"
        description={tx.desc}
        howToUse={lang === 'ko' ? [
          { step: '비교 기준 설정', desc: '100ml당, 1kg당 등 비교하고 싶은 기준 단위를 선택하세요.' },
          { step: '상품 입력', desc: '비교할 상품명, 가격, 용량, 단위를 입력하세요.' },
          { step: '순위 확인', desc: '단위당 가격 순으로 자동 정렬되어 최저가 상품이 표시됩니다.' },
          { step: '결과 복사', desc: '각 상품의 단가를 복사해 메모나 SNS에 공유하세요.' },
        ] : [
          { step: 'Set base unit', desc: 'Choose comparison unit (per 100ml, per kg, etc.).' },
          { step: 'Enter products', desc: 'Input product name, price, amount, and unit.' },
          { step: 'View ranking', desc: 'Auto-sorted by unit price with best value highlighted.' },
          { step: 'Copy results', desc: 'Copy unit prices to share or note.' },
        ]}
        whyUse={lang === 'ko' ? [
          { title: '최저가 자동 표시', desc: '여러 상품 중 단위당 가격이 가장 낮은 상품을 자동으로 찾아줍니다.' },
          { title: '가격 차이 표시', desc: '최저가 대비 얼마나 비싼지 퍼센트로 표시합니다.' },
          { title: '다양한 단위 지원', desc: 'g, kg, ml, L, 개, 봉, 팩 등 다양한 단위를 지원합니다.' },
          { title: '기준 단위 설정', desc: '1, 10, 100, 1000 단위로 비교 기준을 설정할 수 있습니다.' },
        ] : [
          { title: 'Auto best value', desc: 'Automatically finds the product with the lowest unit price.' },
          { title: 'Price difference', desc: 'Shows how much more expensive each product is vs best value.' },
          { title: 'Multiple units', desc: 'Supports g, kg, ml, L, pieces, packs, and more.' },
          { title: 'Custom base unit', desc: 'Set comparison base to 1, 10, 100, or 1000 units.' },
        ]}
        faqs={lang === 'ko' ? [
          { q: '단위가 다른 상품은 어떻게 비교하나요?', a: '같은 단위계(예: ml, L은 모두 용량)라면 비교가 의미 있습니다. 단위 변환(1L=1000ml)을 적용한 후 입력하세요.' },
          { q: '대용량이 항상 저렴한가요?', a: '대체로 그렇지만 항상 그런 건 아닙니다. 이 도구로 실제로 계산해보면 의외로 소용량이 더 저렴한 경우도 있습니다.' },
          { q: '마트 장보기에 어떻게 활용하나요?', a: '같은 제품의 다른 용량별 가격을 입력해 어떤 걸 사는 게 이득인지 확인하세요. 원플원 행사, 번들 상품 비교에도 유용합니다.' },
          { q: '온라인 쇼핑몰 상품 비교는?', a: '여러 판매자의 가격과 용량을 입력해 실제 단가를 비교하세요. 배송비는 별도 고려가 필요합니다.' },
        ] : [
          { q: 'How to compare different units?', a: 'Compare within the same unit system (e.g., ml and L are both volume). Convert first (1L=1000ml) before entering.' },
          { q: 'Is bigger always cheaper?', a: 'Generally yes, but not always. Use this tool to check - sometimes smaller sizes are actually cheaper per unit.' },
          { q: 'Grocery shopping tips?', a: 'Enter different sizes of the same product to find the best deal. Also useful for comparing buy-one-get-one and bundle offers.' },
          { q: 'Online shopping comparison?', a: 'Enter prices and quantities from different sellers to compare real unit prices. Factor in shipping separately.' },
        ]}
        keywords="단가 계산기 · 가성비 비교 · 단위당 가격 · 100ml당 가격 · 마트 가격 비교 · unit price calculator · price per unit · value comparison · grocery price comparison · best value calculator"
      />
    </div>
  )
}
