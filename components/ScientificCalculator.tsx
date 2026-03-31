
'use client'
import { useState, useCallback } from 'react'
import { useLang } from './LangContext'
import ToolFooter from './ToolFooter'

const T = {
  ko: { title: '공학용 계산기', desc: '삼각함수·로그·지수·제곱근·팩토리얼을 포함한 공학용 계산기. 계산 이력 기능.' },
  en: { title: 'Scientific Calculator', desc: 'Scientific calculator with trig, log, exp, sqrt, factorial. Includes calculation history.' }
}

export default function ScientificCalculator() {
  const { lang } = useLang()
  const tx = T[lang]
  const [display, setDisplay] = useState('0')
  const [history, setHistory] = useState<string[]>([])
  const [isRad, setIsRad] = useState(true)
  const [justCalc, setJustCalc] = useState(false)

  const toRad = (deg: number) => deg * Math.PI / 180

  const pressBtn = useCallback((val: string) => {
    if (justCalc && !isNaN(+val)) { setDisplay(val); setJustCalc(false); return }
    if (justCalc) setJustCalc(false)
    if (display === '0' || display === 'Error') {
      if (val === '.' || val === '(' || val === ')') setDisplay(val)
      else if (!isNaN(+val)) setDisplay(val)
      else setDisplay(prev => prev === 'Error' ? val : prev + val)
    } else {
      setDisplay(prev => prev + val)
    }
  }, [display, justCalc])

  const calculate = useCallback(() => {
    try {
      let expr = display
        .replace(/×/g, '*').replace(/÷/g, '/')
        .replace(/π/g, String(Math.PI))
        .replace(/e(?![a-z])/g, String(Math.E))
      const result = Function(`'use strict'; const Math_={sin:${isRad}?Math.sin:x=>Math.sin(${Math.PI}/180*x),cos:${isRad}?Math.cos:x=>Math.cos(${Math.PI}/180*x),tan:${isRad}?Math.tan:x=>Math.tan(${Math.PI}/180*x),log:Math.log10,ln:Math.log,sqrt:Math.sqrt,abs:Math.abs,pow:Math.pow,factorial:n=>{let r=1;for(let i=2;i<=n;i++)r*=i;return r;}}; with(Math_){return ${expr}}`)()
      const resultStr = Number.isFinite(result) ? (+result.toFixed(10)).toString() : 'Error'
      setHistory(h => [`${display} = ${resultStr}`, ...h.slice(0, 9)])
      setDisplay(resultStr)
      setJustCalc(true)
    } catch { setDisplay('Error') }
  }, [display, isRad])

  const clear = () => { setDisplay('0'); setJustCalc(false) }
  const backspace = () => { setDisplay(prev => prev.length > 1 ? prev.slice(0, -1) : '0') }

  const BTNS = [
    ['(', ')', 'π', 'e', 'AC'],
    ['sin(', 'cos(', 'tan(', 'log(', 'ln('],
    ['√(', 'x²', 'xʸ', '|x|', '!'],
    ['7', '8', '9', '÷', '⌫'],
    ['4', '5', '6', '×', '%'],
    ['1', '2', '3', '-', '('],
    ['0', '.', '=', '+', ')'],
  ]

  const getBtnClass = (b: string) => {
    if (b === '=') return 'bg-brand-500 hover:bg-brand-400 text-white font-bold'
    if (b === 'AC') return 'bg-red-500 hover:bg-red-400 text-white font-bold'
    if (['÷','×','-','+','%'].includes(b)) return 'bg-orange-500/20 border border-orange-500/30 text-orange-400 hover:bg-orange-500/30'
    if (['sin(','cos(','tan(','log(','ln(','√(','x²','xʸ','|x|','!','π','e','(',')'].includes(b)) return 'bg-blue-500/20 border border-blue-500/30 text-blue-400 hover:bg-blue-500/30'
    if (b === '⌫') return 'bg-slate-500/20 border border-slate-500/30 text-slate-300 hover:bg-slate-500/30'
    return 'bg-surface-border hover:bg-slate-600 text-slate-200'
  }

  const handleBtn = (b: string) => {
    if (b === 'AC') clear()
    else if (b === '⌫') backspace()
    else if (b === '=') calculate()
    else if (b === 'x²') pressBtn('**2')
    else if (b === 'xʸ') pressBtn('**')
    else if (b === '|x|') pressBtn('abs(')
    else if (b === '!') pressBtn('factorial(')
    else pressBtn(b)
  }

  return (
    <div className="max-w-md mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-mono mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />Free Tool
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-3">{tx.title}</h1>
        <p className="text-slate-300 text-base max-w-xl mx-auto">{tx.desc}</p>
      </div>

      <div className="rounded-xl border border-surface-border bg-[#1a1d27] overflow-hidden mb-4">
        {/* Rad/Deg 토글 */}
        <div className="flex justify-between items-center px-4 py-2 border-b border-surface-border">
          <span className="text-xs text-slate-500">{lang==='ko'?'삼각함수 단위:':'Trig unit:'}</span>
          <div className="flex rounded-lg border border-surface-border overflow-hidden">
            {['RAD','DEG'].map(m => (
              <button key={m} onClick={() => setIsRad(m==='RAD')}
                className={`px-3 py-1 text-xs font-bold transition-all ${(m==='RAD')===isRad?'bg-brand-500 text-white':'bg-[#0f1117] text-slate-400'}`}>{m}</button>
            ))}
          </div>
        </div>
        {/* 디스플레이 */}
        <div className="px-4 py-4 text-right bg-[#0f1117]">
          {history.length > 0 && <p className="text-xs text-slate-600 mb-1">{history[0]}</p>}
          <p className="text-3xl font-mono font-bold text-slate-200 break-all">{display}</p>
        </div>
        {/* 버튼 */}
        <div className="grid grid-cols-5 gap-1 p-2">
          {BTNS.flat().map((b, i) => (
            <button key={`${b}${i}`} onClick={() => handleBtn(b)}
              className={`py-3 rounded-lg text-sm font-mono transition-all ${getBtnClass(b)}`}>
              {b}
            </button>
          ))}
        </div>
      </div>

      {/* 계산 이력 */}
      {history.length > 0 && (
        <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4">
          <div className="flex justify-between mb-2">
            <p className="text-xs text-slate-400 font-medium">{lang==='ko'?'계산 이력':'History'}</p>
            <button onClick={() => setHistory([])} className="text-xs text-slate-600 hover:text-red-400 transition-all">{lang==='ko'?'지우기':'Clear'}</button>
          </div>
          <div className="flex flex-col gap-1">
            {history.map((h, i) => (
              <div key={i} onClick={() => { const r = h.split(' = ')[1]; setDisplay(r); }}
                className="text-xs font-mono text-slate-400 hover:text-slate-200 cursor-pointer py-1 border-b border-surface-border last:border-0 transition-all">{h}</div>
            ))}
          </div>
        </div>
      )}

      <ToolFooter
        toolName={lang==='ko'?'공학용 계산기':'Scientific Calculator'}
        toolUrl="https://keyword-mixer.vercel.app/scientific-calculator"
        description={tx.desc}
        howToUse={lang==='ko'?[{step:'수식 입력',desc:'숫자와 연산자를 차례로 입력하세요.'},{step:'함수 사용',desc:'sin(, cos(, log( 등 함수 버튼을 눌러 사용하세요.'},{step:'= 버튼으로 계산',desc:'수식 입력 후 = 버튼을 누르면 결과가 표시됩니다.'},{step:'이력 확인',desc:'최근 10개의 계산 이력을 확인하고 클릭해 재사용하세요.'}]:[{step:'Enter expression',desc:'Type numbers and operators in sequence.'},{step:'Use functions',desc:'Press sin(, cos(, log( and other function buttons.'},{step:'Press = to calculate',desc:'Press = after entering expression to see result.'},{step:'View history',desc:'See last 10 calculations and click to reuse.'}]}
        whyUse={lang==='ko'?[{title:'삼각함수 지원',desc:'sin, cos, tan을 라디안과 도(degree) 모드로 계산합니다.'},{title:'로그·지수 계산',desc:'상용로그(log), 자연로그(ln), 지수(x^y)를 지원합니다.'},{title:'계산 이력',desc:'최근 10개 계산을 저장하고 클릭해 재사용합니다.'},{title:'직관적 입력',desc:'수식을 그대로 입력하는 방식으로 직관적으로 사용합니다.'}]:[{title:'Trig functions',desc:'sin, cos, tan in both radian and degree modes.'},{title:'Log and exponent',desc:'Supports log (base 10), ln (natural), and x^y.'},{title:'Calculation history',desc:'Saves last 10 calculations for reuse with a click.'},{title:'Intuitive input',desc:'Direct expression input for intuitive use.'}]}
        faqs={lang==='ko'?[{q:'라디안과 도(Degree)의 차이는?',a:'라디안은 수학적 각도 단위(2π = 360°). sin(90°) = sin(π/2). 공학이나 물리에서는 주로 라디안을 사용합니다.'},{q:'factorial(!) 사용법은?',a:'! 버튼 누른 후 숫자와 ) 를 입력하세요. 예: !(5) = 120. 또는 factorial(5) 형태로 입력.'},{q:'에러가 나면?',a:'수식이 올바른지 확인하세요. 특히 괄호 개수가 맞는지, 함수 뒤에 괄호가 있는지 확인하세요.'},{q:'π와 e 값은?',a:'π = 3.14159265... (원주율), e = 2.71828... (자연로그의 밑수). π 버튼이나 e 버튼으로 바로 입력할 수 있습니다.'}]:[{q:'Radian vs Degree?',a:'Radian is mathematical angle unit (2π = 360°). sin(90°) = sin(π/2). Physics and engineering typically use radians.'},{q:'How to use factorial?',a:'Press ! then number and ). E.g., !(5) = 120. Or type factorial(5).'},{q:'Getting errors?',a:'Check your expression. Ensure parentheses are balanced and functions have opening parentheses.'},{q:'What are π and e?',a:'π = 3.14159265... (pi), e = 2.71828... (Euler number). Use the π and e buttons to input directly.'}]}
        keywords="공학용 계산기 · 과학 계산기 · 삼각함수 계산기 · 로그 계산기 · sin cos tan 계산 · scientific calculator · trig calculator · engineering calculator online"
      />
    </div>
  )
}
