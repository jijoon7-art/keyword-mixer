
'use client'
import { useState } from 'react'
import { Copy, CheckCheck } from 'lucide-react'
import { useLang } from './LangContext'
import ToolFooter from './ToolFooter'

const T = {
  ko: { title: '텍스트→표 변환기', desc: 'CSV·TSV·공백 구분 텍스트를 HTML·Markdown·JSON 표로 즉시 변환. 엑셀 붙여넣기 지원.' },
  en: { title: 'Text to Table Converter', desc: 'Convert CSV, TSV, space-delimited text to HTML, Markdown, or JSON tables instantly. Supports Excel paste.' }
}

export default function TextToTable() {
  const { lang } = useLang()
  const tx = T[lang]
  const [input, setInput] = useState(lang === "ko" ? "이름,나이,도시\n홍길동,30,서울\n김철수,25,부산\n이영희,28,인천" : "Name,Age,City\nAlice,30,Seoul\nBob,25,Busan\nCarol,28,Incheon")
  const [delimiter, setDelimiter] = useState("comma")
  const [hasHeader, setHasHeader] = useState(true)
  const [outputFormat, setOutputFormat] = useState("html")
  const [copied, setCopied] = useState(false)
  const copy = async () => { await navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 1500) }

  const getDelim = () => { switch(delimiter) { case "comma": return ","; case "tab": return "\t"; case "pipe": return "|"; case "semicolon": return ";"; default: return /\s+/ } }
  const delim = getDelim()
  const rows = input.trim().split("\n").map(row => row.split(typeof delim === "string" ? delim : /\s+/).map(c => c.trim()))
  const headers = hasHeader ? rows[0] : rows[0].map((_,i) => `Col ${i+1}`)
  const dataRows = hasHeader ? rows.slice(1) : rows

  let output = ""
  if (outputFormat === "html") {
    output = `<table border="1" cellpadding="8" style="border-collapse:collapse">\n`
    if (hasHeader) output += `  <thead>\n    <tr>${headers.map(h => `<th>${h}</th>`).join("")}</tr>\n  </thead>\n`
    output += `  <tbody>\n`
    dataRows.forEach(row => { output += `    <tr>${row.map(c => `<td>${c}</td>`).join("")}</tr>\n` })
    output += `  </tbody>\n</table>`
  } else if (outputFormat === "markdown") {
    output = `| ${headers.join(" | ")} |\n`
    output += `| ${headers.map(() => "---").join(" | ")} |\n`
    dataRows.forEach(row => { output += `| ${row.join(" | ")} |\n` })
  } else if (outputFormat === "json") {
    const data = dataRows.map(row => { const obj: Record<string,string> = {}; headers.forEach((h,i) => obj[h] = row[i] || ""); return obj })
    output = JSON.stringify(data, null, 2)
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-mono mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />Free Tool
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-3">{tx.title}</h1>
        <p className="text-slate-300 text-base max-w-xl mx-auto">{tx.desc}</p>
      </div>
      <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4 mb-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">{lang==="ko"?"구분자":"Delimiter"}</label>
            <select value={delimiter} onChange={e => setDelimiter(e.target.value)} className="w-full bg-[#0f1117] border border-surface-border rounded-lg px-2 py-2 text-slate-200 text-xs focus:outline-none focus:border-brand-500/50 transition-all">
              <option value="comma">, (콤마/Comma)</option>
              <option value="tab">↹ (탭/Tab)</option>
              <option value="semicolon">; (세미콜론)</option>
              <option value="pipe">| (파이프)</option>
              <option value="space">{lang==="ko"?"공백":"Space"}</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">{lang==="ko"?"출력 형식":"Output Format"}</label>
            <select value={outputFormat} onChange={e => setOutputFormat(e.target.value)} className="w-full bg-[#0f1117] border border-surface-border rounded-lg px-2 py-2 text-slate-200 text-xs focus:outline-none focus:border-brand-500/50 transition-all">
              <option value="html">HTML Table</option>
              <option value="markdown">Markdown Table</option>
              <option value="json">JSON Array</option>
            </select>
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-2 cursor-pointer">
              <div onClick={() => setHasHeader(!hasHeader)} className={`w-9 h-5 rounded-full relative transition-all ${hasHeader ? "bg-brand-500" : "bg-surface-border"}`}>
                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${hasHeader ? "left-4" : "left-0.5"}`} />
              </div>
              <span className="text-xs text-slate-300">{lang==="ko"?"첫 줄 헤더":"First row = header"}</span>
            </label>
          </div>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div className="rounded-xl border border-surface-border bg-[#1a1d27] overflow-hidden">
          <div className="px-4 py-2.5 border-b border-surface-border bg-[#0f1117]"><span className="text-xs text-slate-400 font-medium">{lang==="ko"?"입력 (CSV/TSV/텍스트)":"Input (CSV/TSV/Text)"}</span></div>
          <textarea value={input} onChange={e => setInput(e.target.value)} rows={10} className="w-full bg-transparent px-4 py-3 text-sm text-slate-200 font-mono focus:outline-none resize-none leading-relaxed" />
        </div>
        <div className="rounded-xl border border-surface-border bg-[#1a1d27] overflow-hidden">
          <div className="flex justify-between px-4 py-2.5 border-b border-surface-border bg-[#0f1117]">
            <span className="text-xs text-slate-400 font-medium">{lang==="ko"?"변환 결과":"Output"}</span>
            <button onClick={copy} className={`text-xs px-3 py-1 rounded-lg border flex items-center gap-1 transition-all ${copied?"bg-brand-500/20 border-brand-500/40 text-brand-400":"border-surface-border text-slate-300 hover:border-brand-500/40"}`}>
              {copied?<CheckCheck size={11}/>:<Copy size={11}/>} {lang==="ko"?"복사":"Copy"}
            </button>
          </div>
          <textarea readOnly value={output} rows={10} className="w-full bg-transparent px-4 py-3 text-xs text-slate-200 font-mono focus:outline-none resize-none leading-relaxed" />
        </div>
      </div>
      {/* 미리보기 */}
      {outputFormat === "html" && dataRows.length > 0 && (
        <div className="rounded-xl border border-surface-border bg-white p-4 overflow-x-auto">
          <p className="text-xs text-slate-500 mb-2">{lang==="ko"?"HTML 미리보기":"HTML Preview"}</p>
          <table className="border-collapse text-sm" style={{borderCollapse:"collapse"}}>
            {hasHeader && <thead><tr>{headers.map((h,i) => <th key={i} className="border border-gray-400 px-3 py-1.5 bg-gray-100 text-gray-800 font-bold">{h}</th>)}</tr></thead>}
            <tbody>{dataRows.map((row,i) => <tr key={i}>{row.map((c,j) => <td key={j} className="border border-gray-300 px-3 py-1.5 text-gray-700">{c}</td>)}</tr>)}</tbody>
          </table>
        </div>
      )}
      <ToolFooter
        toolName={lang==="ko"?"텍스트→표 변환기":"Text to Table Converter"}
        toolUrl="https://keyword-mixer.vercel.app/text-to-table"
        description={tx.desc}
        howToUse={lang==="ko"?[{step:"텍스트 입력",desc:"CSV, TSV, 또는 구분된 텍스트를 붙여넣으세요."},{step:"구분자 선택",desc:"콤마, 탭, 세미콜론 등 구분자를 선택하세요."},{step:"출력 형식 선택",desc:"HTML, Markdown, JSON 중 원하는 형식을 선택하세요."},{step:"복사하여 사용",desc:"변환된 결과를 복사해 문서나 코드에 바로 사용하세요."}]:[{step:"Enter text",desc:"Paste CSV, TSV, or delimited text."},{step:"Select delimiter",desc:"Choose comma, tab, semicolon, or other delimiter."},{step:"Select output format",desc:"Choose HTML, Markdown, or JSON format."},{step:"Copy & use",desc:"Copy converted result for use in documents or code."}]}
        whyUse={lang==="ko"?[{title:"3가지 출력 형식",desc:"HTML, Markdown, JSON 형식으로 즉시 변환합니다."},{title:"HTML 실시간 미리보기",desc:"HTML 형식 선택 시 실제 표 모양을 미리봅니다."},{title:"엑셀 붙여넣기 지원",desc:"엑셀에서 복사한 데이터(탭 구분)를 바로 변환합니다."},{title:"헤더 옵션",desc:"첫 번째 행을 헤더로 처리할지 선택할 수 있습니다."}]:[{title:"3 output formats",desc:"Instantly converts to HTML, Markdown, or JSON."},{title:"HTML live preview",desc:"See actual table appearance when HTML format is selected."},{title:"Excel paste support",desc:"Directly converts Excel-copied data (tab-separated)."},{title:"Header option",desc:"Choose whether to treat the first row as a header."}]}
        faqs={lang==="ko"?[{q:"엑셀 데이터를 바로 붙여넣을 수 있나요?",a:"네, 엑셀에서 복사한 데이터는 탭으로 구분되어 있습니다. 구분자를 '탭'으로 선택하면 바로 변환됩니다."},{q:"Markdown 표는 어디서 사용하나요?",a:"GitHub README.md, Notion, Obsidian, 개발 문서 등에서 사용합니다."},{q:"JSON 출력은 어디에 활용하나요?",a:"API 개발, JavaScript 코드, 데이터 분석 등에 활용합니다."},{q:"열 수가 다른 행이 있으면?",a:"열 수가 부족한 행은 빈 칸으로 처리됩니다."}]:[{q:"Can I paste Excel data directly?",a:"Yes, Excel-copied data is tab-separated. Select 'Tab' as delimiter to convert directly."},{q:"Where to use Markdown tables?",a:"GitHub README.md, Notion, Obsidian, and technical documentation."},{q:"JSON output use cases?",a:"API development, JavaScript code, and data analysis."},{q:"What if rows have different column counts?",a:"Rows with fewer columns are filled with empty cells."}]}
        keywords="텍스트 표 변환 · CSV HTML 변환 · 마크다운 표 생성 · TSV 변환기 · text to table · CSV to HTML · markdown table generator · TSV converter · JSON table"
      />
    </div>
  )
}
