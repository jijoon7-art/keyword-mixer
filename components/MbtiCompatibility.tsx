
'use client'
import { useState } from 'react'
import { useLang } from './LangContext'
import ToolFooter from './ToolFooter'
const T = { ko:{ title:'MBTI 궁합 계산기', desc:'두 사람의 MBTI 유형으로 궁합, 갈등 요인, 보완점을 분석. 16가지 유형별 상세 궁합 정보.' }, en:{ title:'MBTI Compatibility Calculator', desc:'Analyze compatibility, conflict factors, and complementary points from two MBTI types. Detailed compatibility for all 16 types.' } }
const TYPES = ['INTJ','INTP','ENTJ','ENTP','INFJ','INFP','ENFJ','ENFP','ISTJ','ISFJ','ESTJ','ESFJ','ISTP','ISFP','ESTP','ESFP']
const TYPE_DESC: Record<string,{ko:string,en:string,nickname_ko:string,nickname_en:string}> = {
  'INTJ':{ko:'전략가형. 독립적이고 분석적.',en:'Architect. Independent and analytical.',nickname_ko:'전략가',nickname_en:'Architect'},
  'INTP':{ko:'논리술사형. 창의적이고 논리적.',en:'Logician. Creative and logical.',nickname_ko:'논리술사',nickname_en:'Logician'},
  'ENTJ':{ko:'통솔자형. 카리스마있고 리더십.',en:'Commander. Charismatic leader.',nickname_ko:'통솔자',nickname_en:'Commander'},
  'ENTP':{ko:'변론가형. 독창적이고 토론을 즐김.',en:'Debater. Original and loves debate.',nickname_ko:'변론가',nickname_en:'Debater'},
  'INFJ':{ko:'옹호자형. 이상주의적이고 공감.',en:'Advocate. Idealistic and empathetic.',nickname_ko:'옹호자',nickname_en:'Advocate'},
  'INFP':{ko:'중재자형. 창의적이고 열정적.',en:'Mediator. Creative and passionate.',nickname_ko:'중재자',nickname_en:'Mediator'},
  'ENFJ':{ko:'선도자형. 카리스마있고 영감을 줌.',en:'Protagonist. Charismatic and inspiring.',nickname_ko:'선도자',nickname_en:'Protagonist'},
  'ENFP':{ko:'활동가형. 열정적이고 창의적.',en:'Campaigner. Enthusiastic and creative.',nickname_ko:'활동가',nickname_en:'Campaigner'},
  'ISTJ':{ko:'현실주의자형. 신뢰할수있고 체계적.',en:'Logistician. Reliable and systematic.',nickname_ko:'현실주의자',nickname_en:'Logistician'},
  'ISFJ':{ko:'수호자형. 헌신적이고 따뜻함.',en:'Defender. Dedicated and warm.',nickname_ko:'수호자',nickname_en:'Defender'},
  'ESTJ':{ko:'경영자형. 전통적이고 리더십.',en:'Executive. Traditional leader.',nickname_ko:'경영자',nickname_en:'Executive'},
  'ESFJ':{ko:'집정관형. 돌봄과 사교적.',en:'Consul. Caring and sociable.',nickname_ko:'집정관',nickname_en:'Consul'},
  'ISTP':{ko:'장인형. 실용적이고 분석적.',en:'Virtuoso. Practical and analytical.',nickname_ko:'장인',nickname_en:'Virtuoso'},
  'ISFP':{ko:'모험가형. 예술적이고 탐구적.',en:'Adventurer. Artistic and exploratory.',nickname_ko:'모험가',nickname_en:'Adventurer'},
  'ESTP':{ko:'사업가형. 에너지넘치고 현실적.',en:'Entrepreneur. Energetic and realistic.',nickname_ko:'사업가',nickname_en:'Entrepreneur'},
  'ESFP':{ko:'연예인형. 즉흥적이고 사교적.',en:'Entertainer. Spontaneous and sociable.',nickname_ko:'연예인',nickname_en:'Entertainer'},
}
// 궁합 매트릭스 (간략 버전 - 실제 MBTI 호환성 기반)
const GOLDEN_PAIRS = [['INTJ','ENFP'],['INTP','ENTJ'],['INFJ','ENTP'],['INFP','ENTJ'],['ISTJ','ESFP'],['ISFJ','ESTP'],['ESTJ','INFP'],['ESFJ','ISTP']]
function getCompat(a: string, b: string): number {
  const sameE = a[0] === b[0]
  const sameN = a[1] === b[1]
  const sameT = a[2] === b[2]
  const sameJ = a[3] === b[3]
  // Golden pair = 90+
  if(GOLDEN_PAIRS.some(([x,y])=>(x===a&&y===b)||(x===b&&y===a))) return 88 + Math.floor(Math.random()*8)
  // 정반대 = 70+
  const opposite = a.split('').map((c,i)=>{const o={I:'E',E:'I',N:'S',S:'N',T:'F',F:'T',J:'P',P:'J'};return o[c]||c}).join('')
  if(opposite===b) return 72 + Math.floor(Math.random()*8)
  // 공통점 계산
  const matches = [!sameE,sameN,sameT,sameJ].filter(Boolean).length
  return 55 + matches * 8 + Math.floor(Math.random()*5)
}
export default function MbtiCompatibility() {
  const { lang } = useLang(); const tx = T[lang]
  const [type1,setType1]=useState('INFJ'); const [type2,setType2]=useState('ENTP')
  const score = getCompat(type1, type2)
  const t1 = TYPE_DESC[type1]; const t2 = TYPE_DESC[type2]
  const scoreColor = score>=85?'text-red-400':score>=75?'text-orange-400':score>=65?'text-brand-400':'text-blue-400'
  const scoreBg = score>=85?'border-red-500/30 bg-red-500/10':score>=75?'border-orange-500/30 bg-orange-500/10':score>=65?'border-brand-500/30 bg-brand-500/10':'border-blue-500/30 bg-blue-500/10'
  const isGolden = GOLDEN_PAIRS.some(([a,b])=>(a===type1&&b===type2)||(a===type2&&b===type1))
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-mono mb-4"><span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse"/>Fun Tool ✨</div>
        <h1 className="text-4xl font-extrabold text-white mb-3">{tx.title}</h1>
        <p className="text-slate-300 text-base max-w-xl mx-auto">{tx.desc}</p>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-5">
        {[[type1,setType1,lang==='ko'?'나의 MBTI':'My MBTI'],[type2,setType2,lang==='ko'?'상대방 MBTI':'Partner MBTI']].map(([v,s,label],i)=>(
          <div key={i} className="rounded-xl border border-surface-border bg-[#1a1d27] p-4">
            <p className="text-xs text-slate-400 mb-2 font-medium">{label as string}</p>
            <div className="grid grid-cols-4 gap-1 mb-2">{TYPES.map(t=><button key={t} onClick={()=>(s as Function)(t)} className={`py-1 rounded text-xs font-mono font-bold transition-all ${v===t?'bg-brand-500 text-white':'border border-surface-border text-slate-400 bg-[#0f1117] hover:border-brand-500/40'}`}>{t}</button>)}</div>
            <div className={`rounded-lg border p-2 text-center ${v===type1?'border-blue-500/30 bg-blue-500/10':'border-pink-500/30 bg-pink-500/10'}`}>
              <p className={`text-xl font-extrabold font-mono ${v===type1?'text-blue-400':'text-pink-400'}`}>{v as string}</p>
              <p className="text-xs text-slate-400">{lang==='ko'?TYPE_DESC[v as string]?.nickname_ko:TYPE_DESC[v as string]?.nickname_en}</p>
              <p className="text-xs text-slate-500 mt-0.5">{lang==='ko'?TYPE_DESC[v as string]?.ko:TYPE_DESC[v as string]?.en}</p>
            </div>
          </div>
        ))}
      </div>
      <div className={`rounded-xl border p-6 text-center mb-4 ${scoreBg}`}>
        {isGolden && <p className="text-xs text-yellow-400 mb-1">✨ {lang==='ko'?'황금 궁합!':'Golden Pair!'}</p>}
        <p className={`text-7xl font-extrabold font-mono ${scoreColor}`}>{score}<span className="text-3xl">%</span></p>
        <p className="text-sm text-slate-400 mt-2">{type1} ♥ {type2}</p>
        <div className="h-3 bg-surface-border rounded-full overflow-hidden mt-3 max-w-xs mx-auto">
          <div className={`h-full rounded-full ${scoreColor.replace('text-','bg-')}`} style={{width:`${score}%`}} />
        </div>
      </div>
      <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4">
        <p className="text-xs text-slate-400 font-medium mb-2">{lang==='ko'?'💡 관계 분석':'💡 Relationship Analysis'}</p>
        <div className="grid grid-cols-2 gap-3 text-xs">
          {[
            [lang==='ko'?'공통점':'Strengths', lang==='ko'?type1[0]===type2[0]?`둘 다 ${type1[0]==='I'?'내향형':'외향형'}`:type1[1]===type2[1]?`같은 ${type1[1]==='N'?'직관형':'현실형'}`:'서로 다른 에너지':'Both have complementary perspectives'],
            [lang==='ko'?'보완점':'Complements', lang==='ko'?type1[2]!==type2[2]?`${type1[2]==='T'?'논리적 사고':'감성'}과 ${type2[2]==='T'?'논리적 사고':'감성'}의 균형`:'서로의 강점을 공유':'Balance each other's strengths and weaknesses'],
          ].map(([l,v])=>(
            <div key={l as string} className="rounded-lg border border-surface-border bg-[#0f1117] p-2.5">
              <p className="text-slate-400 mb-0.5 font-medium">{l}</p>
              <p className="text-slate-200">{v}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-600 mt-3 text-center">{lang==='ko'?'* 재미를 위한 결과이며 실제 관계를 보장하지 않습니다':'* For entertainment only, not a guarantee of real compatibility'}</p>
      </div>
      <ToolFooter toolName={lang==='ko'?'MBTI 궁합 계산기':'MBTI Compatibility'} toolUrl="https://keyword-mixer.vercel.app/mbti-compatibility" description={tx.desc}
        howToUse={lang==='ko'?[{step:'MBTI 선택',desc:'두 사람의 MBTI 유형을 각각 선택하세요.'},{step:'궁합 점수 확인',desc:'두 유형의 궁합 점수와 황금 궁합 여부를 확인하세요.'},{step:'관계 분석',desc:'공통점과 보완점 분석을 확인하세요.'},{step:'결과 공유',desc:'결과를 캡처해 친구들과 공유하세요.'}]:[{step:'Select MBTI types',desc:'Choose MBTI type for both people.'},{step:'View score',desc:'See compatibility score and golden pair status.'},{step:'Relationship analysis',desc:'Check strengths and complementary points.'},{step:'Share results',desc:'Screenshot and share with friends.'}]}
        whyUse={lang==='ko'?[{title:'16×16 유형 분석',desc:'16가지 MBTI 유형의 모든 조합을 분석합니다.'},{title:'황금 궁합 표시',desc:'전통적으로 잘 맞는 황금 궁합 쌍을 특별히 표시합니다.'},{title:'관계 특성 분석',desc:'공통점, 차이점, 보완점을 분석해 관계를 이해합니다.'},{title:'빠른 MBTI 선택',desc:'버튼 클릭으로 16가지 유형을 빠르게 선택합니다.'}]:[{title:'16×16 type analysis',desc:'Analyzes all combinations of 16 MBTI types.'},{title:'Golden pair highlight',desc:'Specially marks traditionally compatible golden pairs.'},{title:'Relationship traits',desc:'Analyzes commonalities, differences, and complements.'},{title:'Quick MBTI selection',desc:'Select from 16 types with one click.'}]}
        faqs={lang==='ko'?[{q:'황금 궁합이란?',a:'MBTI에서 서로 보완적인 기능을 가진 유형 쌍입니다. 예: INFJ-ENTP, INTJ-ENFP 등이 황금 궁합으로 알려져 있습니다.'},{q:'반대 MBTI가 잘 맞나요?',a:'정반대 유형(예: INTJ-ESFP)은 서로 다른 강점으로 보완할 수 있지만, 소통 방식 차이로 갈등도 생길 수 있습니다.'},{q:'MBTI 궁합이 실제 관계를 예측하나요?',a:'아니요. MBTI는 성격 유형의 참고 도구일 뿐 실제 관계의 성공을 예측하지 않습니다. 개인의 노력과 소통이 더 중요합니다.'},{q:'같은 MBTI끼리의 궁합은?',a:'같은 유형은 서로를 잘 이해하지만 단점도 공유할 수 있습니다. 서로의 약점을 보완하기 어려울 수 있습니다.'}]:[{q:'What is a golden pair?',a:'MBTI type pairs with complementary functions. E.g., INFJ-ENTP, INTJ-ENFP are known golden pairs.'},{q:'Do opposites attract in MBTI?',a:'Opposite types can complement strengths but may have communication conflicts due to different styles.'},{q:'Does MBTI predict relationships?',a:'No. MBTI is just a personality reference tool. Individual effort and communication matter more than type compatibility.'},{q:'Same MBTI compatibility?',a:'Same types understand each other well but share weaknesses. May struggle to compensate for each other's limitations.'}]}
        keywords="MBTI 궁합 · MBTI 궁합 계산기 · MBTI 황금 궁합 · 내 MBTI 궁합 · MBTI compatibility · MBTI couple test · MBTI golden pair · MBTI relationship"
      />
    </div>
  )
}
