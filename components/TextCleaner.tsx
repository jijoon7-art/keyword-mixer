
'use client'
import { useState } from 'react'
import { Copy, CheckCheck, RefreshCw } from 'lucide-react'
import { useLang } from './LangContext'
import ToolFooter from './ToolFooter'
const T = { ko:{ title:'텍스트 정리/청소기', desc:'불필요한 공백·특수문자·HTML 태그를 한번에 제거. 복사한 텍스트를 깔끔하게 정리.' }, en:{ title:'Text Cleaner & Formatter', desc:'Remove unnecessary spaces, special characters, and HTML tags at once. Clean up copied text instantly.' } }
export default function TextCleaner() {
  const { lang } = useLang(); const tx = T[lang]
  const [input,setInput]=useState(lang==='ko'?'  안녕하세요!  이   텍스트를   정리해   드릴게요.   복사한   텍스트에   불필요한   공백이   많을 때   사용하세요.  ':'  Hello!  This   text   cleaner   removes   extra   spaces   and   cleans   up   copied   text   quickly.  ')
  const [options,setOptions]=useState({multiSpace:true,leadingTrailing:true,emptyLines:true,htmlTags:false,specialChars:false,lowercase:false,numbers:false,lineBreaks:false})
  const [copied,setCopied]=useState(false)
  const copy = async () => { await navigator.clipboard.writeText(output); setCopied(true); setTimeout(()=>setCopied(false),1500) }
  const toggle = (k:keyof typeof options) => setOptions(p=>({...p,[k]:!p[k]}))
  let output = input
  if(options.htmlTags) output = output.replace(/<[^>]+>/g,'')
  if(options.multiSpace) output = output.replace(/ +/g,' ')
  if(options.leadingTrailing) output = output.split('\n').map(l=>l.trim()).join('\n')
  if(options.emptyLines) output = output.replace(/\n{3,}/g,'\n\n')
  if(options.specialChars) output = output.replace(/[^가-힣a-zA-Z0-9\s.,!?\-_\(\)\[\]\{\}\/\\:;\'\"`@#$%&*+=<>]/g,'')
  if(options.numbers) output = output.replace(/[0-9]/g,'')
  if(options.lowercase) output = output.toLowerCase()
  if(options.lineBreaks) output = output.replace(/\n/g,' ')
  const charSaved = input.length - output.length
  const OPTS = [
    ['multiSpace', lang==='ko'?'중복 공백 제거':'Remove extra spaces'],
    ['leadingTrailing', lang==='ko'?'줄 앞뒤 공백 제거':'Trim line spaces'],
    ['emptyLines', lang==='ko'?'빈 줄 정리 (2줄 이상→1줄)':'Clean empty lines'],
    ['htmlTags', lang==='ko'?'HTML 태그 제거':'Remove HTML tags'],
    ['specialChars', lang==='ko'?'특수문자 제거':'Remove special chars'],
    ['lowercase', lang==='ko'?'소문자 변환':'Convert to lowercase'],
    ['numbers', lang==='ko'?'숫자 제거':'Remove numbers'],
    ['lineBreaks', lang==='ko'?'줄바꿈 → 공백':'Line breaks → spaces'],
  ]
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-mono mb-4"><span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse"/>Free Tool</div>
        <h1 className="text-4xl font-extrabold text-white mb-3">{tx.title}</h1>
        <p className="text-slate-300 text-base max-w-xl mx-auto">{tx.desc}</p>
      </div>
      <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4 mb-4">
        <p className="text-xs text-slate-400 font-medium mb-2">{lang==='ko'?'정리 옵션':'Cleaning Options'}</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">{OPTS.map(([k,l])=><label key={k} className={`flex items-center gap-2 px-2 py-1.5 rounded-lg border cursor-pointer transition-all ${options[k as keyof typeof options]?'border-brand-500/40 bg-brand-500/10':'border-surface-border bg-[#0f1117]'}`}><input type="checkbox" checked={options[k as keyof typeof options]} onChange={()=>toggle(k as keyof typeof options)} className="accent-green-500"/><span className="text-xs text-slate-300">{l}</span></label>)}</div>
      </div>
      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div className="rounded-xl border border-surface-border bg-[#1a1d27] overflow-hidden">
          <div className="flex justify-between px-4 py-2.5 border-b border-surface-border">
            <span className="text-xs text-slate-400 font-medium">{lang==='ko'?'입력 텍스트':'Input Text'} ({input.length}{lang==='ko'?'자':'ch'})</span>
            <button onClick={()=>setInput('')} className="text-xs text-slate-500 hover:text-red-400 transition-all">{lang==='ko'?'지우기':'Clear'}</button>
          </div>
          <textarea value={input} onChange={e=>setInput(e.target.value)} rows={10} className="w-full bg-transparent px-4 py-3 text-sm text-slate-200 focus:outline-none resize-none leading-relaxed" placeholder={lang==='ko'?'텍스트를 입력하거나 붙여넣기하세요...':'Enter or paste text here...'}/>
        </div>
        <div className="rounded-xl border border-surface-border bg-[#1a1d27] overflow-hidden">
          <div className="flex justify-between px-4 py-2.5 border-b border-surface-border">
            <span className="text-xs text-slate-400 font-medium">{lang==='ko'?'정리된 텍스트':'Cleaned Text'} ({output.length}{lang==='ko'?'자':'ch'})</span>
            <button onClick={copy} className={`text-xs px-3 py-1 rounded-lg border flex items-center gap-1 transition-all ${copied?'bg-brand-500/20 border-brand-500/40 text-brand-400':'border-surface-border text-slate-300 hover:border-brand-500/40'}`}>
              {copied?<CheckCheck size={11}/>:<Copy size={11}/>} {lang==='ko'?'복사':'Copy'}
            </button>
          </div>
          <div className="px-4 py-3 text-sm text-slate-200 leading-relaxed h-56 overflow-y-auto whitespace-pre-wrap">{output}</div>
        </div>
      </div>
      {charSaved !== 0 && (
        <div className={`rounded-xl border p-3 text-center text-xs ${charSaved > 0 ? 'border-brand-500/30 bg-brand-500/10 text-brand-400':'border-orange-500/30 bg-orange-500/10 text-orange-400'}`}>
          {charSaved > 0 ? `✓ ${lang==='ko'?`${charSaved}글자 정리됨`:`${charSaved} characters removed`}` : `${lang==='ko'?`${Math.abs(charSaved)}글자 추가됨`:`${Math.abs(charSaved)} characters added`}`}
        </div>
      )}
      <ToolFooter toolName={lang==='ko'?'텍스트 정리/청소기':'Text Cleaner'} toolUrl="https://keyword-mixer.vercel.app/text-cleaner" description={tx.desc}
        howToUse={lang==='ko'?[{step:'텍스트 입력',desc:'정리할 텍스트를 붙여넣거나 입력하세요.'},{step:'옵션 선택',desc:'필요한 정리 옵션을 체크하세요.'},{step:'결과 확인',desc:'오른쪽에 정리된 텍스트가 실시간으로 표시됩니다.'},{step:'복사하여 사용',desc:'복사 버튼으로 결과를 클립보드에 복사하세요.'}]:[{step:'Enter text',desc:'Paste or type the text to clean.'},{step:'Select options',desc:'Check the cleaning options you need.'},{step:'View result',desc:'Cleaned text appears in real-time on the right.'},{step:'Copy to use',desc:'Click copy to save result to clipboard.'}]}
        whyUse={lang==='ko'?[{title:'8가지 정리 옵션',desc:'공백·HTML·특수문자·줄바꿈 등 다양한 옵션을 제공합니다.'},{title:'실시간 미리보기',desc:'옵션 선택 즉시 결과를 확인할 수 있습니다.'},{title:'글자수 절약 표시',desc:'정리를 통해 몇 글자가 줄었는지 표시합니다.'},{title:'PDF·웹 복붙 정리',desc:'PDF나 웹에서 복사한 텍스트의 불필요 요소를 제거합니다.'}]:[{title:'8 cleaning options',desc:'Spaces, HTML, special chars, line breaks and more.'},{title:'Real-time preview',desc:'See results instantly as you select options.'},{title:'Character savings display',desc:'Shows how many characters were removed.'},{title:'PDF/web copy cleanup',desc:'Remove unwanted elements from PDF or web-copied text.'}]}
        faqs={lang==='ko'?[{q:'HTML 태그 제거란?',a:'<b>, <p>, <div> 등의 HTML 마크업 태그를 모두 제거해 순수 텍스트만 남깁니다. 웹 페이지 소스를 복사했을 때 유용합니다.'},{q:'어디에 활용하나요?',a:'PDF에서 복사한 텍스트 정리, 웹 스크래핑 데이터 정리, 문서 양식 정리, 이메일/SNS 텍스트 정리에 활용하세요.'},{q:'한글도 처리되나요?',a:'네, 한글 텍스트도 공백 정리, 특수문자 제거 등 모든 기능이 동일하게 적용됩니다.'},{q:'처리 결과가 저장되나요?',a:'이 도구는 브라우저에서만 처리되며 서버에 저장되지 않습니다. 개인정보가 포함된 텍스트도 안전하게 처리할 수 있습니다.'}]:[{q:'What is HTML tag removal?',a:'Removes all HTML markup like <b>, <p>, <div> leaving pure text. Useful when copying from web pages.'},{q:'Use cases?',a:'Clean PDF-copied text, web scraping data, document formatting, email/social media text cleanup.'},{q:'Does it work with Korean?',a:'Yes, all features including space cleanup and special character removal work the same for Korean text.'},{q:'Is data saved?',a:'Processing happens in your browser only. Nothing is sent to a server. Safe for text with personal information.'}]}
        keywords="텍스트 정리 · 텍스트 청소기 · 공백 제거 · HTML 태그 제거 · 텍스트 포맷 · text cleaner · remove extra spaces · HTML tag remover · text formatter · clean text tool"
      />
    </div>
  )
}
