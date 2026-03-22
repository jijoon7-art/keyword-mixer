'use client'
import { useState } from 'react'
import { Copy, CheckCheck } from 'lucide-react'
import { useLang } from './LangContext'
import ToolFooter from './ToolFooter'

const T = {
  ko: {
    title: '팁 계산기 / 더치페이 계산기',
    desc: '식사 금액에서 팁 비율 계산, 인원별 더치페이 금액 즉시 계산. 해외여행·비즈니스 식사에 필수.',
    bill: '총 금액', tip: '팁 비율', people: '인원 수',
    tipAmount: '팁 금액', total: '합계', perPerson: '1인당',
    dutch: '더치페이', round: '반올림',
  },
  en: {
    title: 'Tip Calculator / Bill Splitter',
    desc: 'Calculate tip amount and split the bill per person instantly. Essential for dining out and business meals.',
    bill: 'Bill Amount', tip: 'Tip %', people: 'People',
    tipAmount: 'Tip Amount', total: 'Total', perPerson: 'Per Person',
    dutch: 'Split Bill', round: 'Round up',
  }
}

const TIP_PRESETS = [0, 10, 15, 18, 20, 25]
const PEOPLE_PRESETS = [1, 2, 3, 4, 5, 6, 8, 10]
function comma(n: number) { return Math.round(n).toLocaleString() }

export default function TipCalculator() {
  const { lang } = useLang()
  const tx = T[lang]
  const [bill, setBill] = useState(50000)
  const [tipPct, setTipPct] = useState(15)
  const [people, setPeople] = useState(4)
  const [roundUp, setRoundUp] = useState(true)
  const [copied, setCopied] = useState<string | null>(null)
  const copy = async (text: string, key: string) => { await navigator.clipboard.writeText(text); setCopied(key); setTimeout(() => setCopied(null), 1500) }

  const tipAmount = bill * (tipPct / 100)
  const total = bill + tipAmount
  const rawPerPerson = total / people
  const perPerson = roundUp ? Math.ceil(rawPerPerson / 100) * 100 : Math.round(rawPerPerson)
  const roundedTotal = perPerson * people

  // 커스텀 분할
  const [customSplit, setCustomSplit] = useState<number[]>([])

  const ResultCard = ({ label, value, key: k, large }: { label: string; value: string; key: string; large?: boolean }) => (
    <div className={`rounded-xl border p-4 flex items-center justify-between ${large ? 'border-brand-500/40 bg-brand-500/10' : 'border-surface-border bg-[#1a1d27]'}`}>
      <div>
        <p className="text-xs text-slate-400">{label}</p>
        <p className={`font-bold font-mono ${large ? 'text-3xl text-brand-400' : 'text-xl text-slate-200'}`}>{value}</p>
      </div>
      <button onClick={() => copy(value.replace(/[₩,]/g, ''), k)} className={`p-2 rounded-lg border transition-all ${copied === k ? 'bg-brand-500/20 border-brand-500/40 text-brand-400' : 'border-surface-border text-slate-500 hover:text-brand-400'}`}>
        {copied === k ? <CheckCheck size={14} /> : <Copy size={14} />}
      </button>
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-mono mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />Free Tool
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-3">{tx.title}</h1>
        <p className="text-slate-300 text-base max-w-xl mx-auto">{tx.desc}</p>
      </div>

      <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-5 mb-5">
        {/* 금액 */}
        <div className="mb-4">
          <label className="text-xs text-slate-400 mb-1.5 block">{tx.bill}</label>
          <input type="number" value={bill} step={1000} onChange={e => setBill(+e.target.value)}
            className="w-full bg-[#0f1117] border border-surface-border rounded-xl px-4 py-3 text-slate-200 text-2xl font-mono focus:outline-none focus:border-brand-500/50 transition-all" />
        </div>

        {/* 팁 비율 */}
        <div className="mb-4">
          <div className="flex justify-between mb-1.5">
            <label className="text-xs text-slate-400">{tx.tip}</label>
            <span className="text-brand-400 font-mono text-sm font-bold">{tipPct}%</span>
          </div>
          <div className="flex gap-1.5 mb-2">
            {TIP_PRESETS.map(t => (
              <button key={t} onClick={() => setTipPct(t)}
                className={`flex-1 py-2 rounded-lg border text-xs font-bold transition-all ${tipPct === t ? 'bg-brand-500 border-brand-500 text-white' : 'border-surface-border text-slate-300 bg-[#0f1117]'}`}>
                {t}%
              </button>
            ))}
          </div>
          <input type="range" min={0} max={30} step={1} value={tipPct} onChange={e => setTipPct(+e.target.value)} className="w-full accent-green-500" />
        </div>

        {/* 인원 */}
        <div className="mb-4">
          <label className="text-xs text-slate-400 mb-1.5 block">{tx.people}</label>
          <div className="flex gap-1.5">
            {PEOPLE_PRESETS.map(p => (
              <button key={p} onClick={() => setPeople(p)}
                className={`flex-1 py-2 rounded-lg border text-xs font-bold transition-all ${people === p ? 'bg-brand-500 border-brand-500 text-white' : 'border-surface-border text-slate-300 bg-[#0f1117]'}`}>
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* 반올림 옵션 */}
        <label className="flex items-center gap-2 cursor-pointer">
          <div onClick={() => setRoundUp(!roundUp)} className={`w-9 h-5 rounded-full relative transition-all ${roundUp ? 'bg-brand-500' : 'bg-surface-border'}`}>
            <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${roundUp ? 'left-4' : 'left-0.5'}`} />
          </div>
          <span className="text-xs text-slate-300">{tx.round} (100{lang === 'ko' ? '원 단위' : ' units'})</span>
        </label>
      </div>

      <div className="flex flex-col gap-3">
        <ResultCard label={tx.tipAmount} value={`₩${comma(tipAmount)}`} key="tip" />
        <ResultCard label={tx.total} value={`₩${comma(total)}`} key="total" />
        <ResultCard label={`${tx.perPerson} (${people}${lang === 'ko' ? '명' : ' people'})`} value={`₩${comma(perPerson)}`} key="per" large />
        {roundUp && Math.abs(roundedTotal - total) > 1 && (
          <p className="text-xs text-slate-500 text-center">
            {lang === 'ko' ? `반올림 차액: ₩${comma(roundedTotal - total)} (총 ₩${comma(roundedTotal)})` : `Rounding difference: ₩${comma(roundedTotal - total)} (Total: ₩${comma(roundedTotal)})`}
          </p>
        )}
      </div>

      {/* 팁 비율 가이드 */}
      <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4 mt-5">
        <p className="text-xs text-slate-400 font-medium mb-2">{lang === 'ko' ? '💡 나라별 팁 문화' : '💡 Tip Culture by Country'}</p>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {[
            [lang === 'ko' ? '🇺🇸 미국' : '🇺🇸 USA', '15~25%'],
            [lang === 'ko' ? '🇬🇧 영국' : '🇬🇧 UK', '10~15%'],
            [lang === 'ko' ? '🇯🇵 일본' : '🇯🇵 Japan', lang === 'ko' ? '없음 (실례)' : 'None (rude)'],
            [lang === 'ko' ? '🇰🇷 한국' : '🇰🇷 Korea', lang === 'ko' ? '없음 (없어도 됨)' : 'None (optional)'],
            [lang === 'ko' ? '🇫🇷 프랑스' : '🇫🇷 France', '5~10%'],
            [lang === 'ko' ? '🇦🇺 호주' : '🇦🇺 Australia', '10~15%'],
          ].map(([country, tip]) => (
            <div key={country as string} className="flex justify-between p-2 rounded-lg bg-[#0f1117] border border-surface-border">
              <span className="text-slate-300">{country as string}</span>
              <span className="text-brand-400 font-bold">{tip as string}</span>
            </div>
          ))}
        </div>
      </div>

      <ToolFooter
        toolName={lang === 'ko' ? '팁 계산기 / 더치페이 계산기' : 'Tip Calculator / Bill Splitter'}
        toolUrl="https://keyword-mixer.vercel.app/tip-calculator"
        description={tx.desc}
        howToUse={lang === 'ko' ? [
          { step: '금액 입력', desc: '식사 또는 서비스 총 금액을 입력하세요.' },
          { step: '팁 비율 선택', desc: '0~30% 중 적절한 팁 비율을 선택하거나 슬라이더로 조정하세요.' },
          { step: '인원 선택', desc: '함께 식사한 인원 수를 선택하세요.' },
          { step: '1인당 금액 확인', desc: '팁 포함 1인당 지불할 금액이 즉시 계산됩니다.' },
        ] : [
          { step: 'Enter bill amount', desc: 'Input the total bill for food or service.' },
          { step: 'Select tip rate', desc: 'Choose 0-30% or adjust with the slider.' },
          { step: 'Set number of people', desc: 'Select how many people are sharing the bill.' },
          { step: 'View per-person amount', desc: 'Per-person amount including tip is calculated instantly.' },
        ]}
        whyUse={lang === 'ko' ? [
          { title: '나라별 팁 가이드', desc: '미국·영국·일본 등 나라별 팁 문화를 한눈에 확인할 수 있습니다.' },
          { title: '100원 단위 반올림', desc: '계산하기 편한 금액으로 반올림해 실제 지불 금액을 제안합니다.' },
          { title: '더치페이 계산', desc: '최대 10명까지 1인당 금액을 즉시 계산합니다.' },
          { title: '팁 비율 프리셋', desc: '0/10/15/18/20/25% 프리셋으로 빠르게 선택할 수 있습니다.' },
        ] : [
          { title: 'Country tip guide', desc: 'Quick reference for tipping culture in USA, UK, Japan, and more.' },
          { title: '100-unit rounding', desc: 'Rounds to convenient amounts for easy cash payment.' },
          { title: 'Bill splitting', desc: 'Split bill among up to 10 people instantly.' },
          { title: 'Tip presets', desc: 'Quick buttons for 0/10/15/18/20/25% tip rates.' },
        ]}
        faqs={lang === 'ko' ? [
          { q: '미국에서 팁은 얼마가 적당한가요?', a: '레스토랑에서 15~20%가 표준입니다. 서비스가 훌륭하면 25%, 불만족스러우면 10~15%. 계산서의 세전 금액 기준으로 계산합니다.' },
          { q: '한국은 팁 문화가 없나요?', a: '한국은 기본적으로 팁 문화가 없습니다. 일부 고급 레스토랑에서 봉사료(10%)가 포함될 수 있으며, 이 경우 추가 팁은 불필요합니다.' },
          { q: '더치페이란?', a: '식사 비용을 인원수로 나누어 각자 부담하는 방식입니다. 한국에서는 각자 내기, 영어권에서는 "going Dutch" 또는 "splitting the bill"이라고 합니다.' },
          { q: '카드 결제 시 팁은 어떻게 하나요?', a: '미국 레스토랑에서는 카드 영수증에 팁 금액을 직접 기재하거나 직원에게 전달합니다. 일부 단말기에서는 결제 시 팁 비율을 직접 선택할 수 있습니다.' },
        ] : [
          { q: 'How much tip in the US?', a: '15-20% is standard at restaurants. 25% for excellent service, 10-15% if unsatisfied. Calculate from pre-tax amount.' },
          { q: 'Is tipping necessary in Korea?', a: 'Tipping is not customary in Korea. Some upscale restaurants include a 10% service charge, making additional tips unnecessary.' },
          { q: 'What does "going Dutch" mean?', a: 'Splitting the bill equally among all diners. Each person pays their share of the total.' },
          { q: 'How to tip by card?', a: 'At US restaurants, write the tip on the credit card slip or tell the server. Some card terminals let you select tip percentage during payment.' },
        ]}
        keywords="팁 계산기 · 더치페이 계산기 · 인당 계산기 · 팁 얼마 · 미국 팁 · bill splitter · tip calculator · dutch pay calculator · restaurant tip · how much tip · split bill calculator"
      />
    </div>
  )
}
