'use client'

import ToolFooter from './ToolFooter'
import { useState, useMemo } from 'react'
import { Search, Copy, CheckCheck } from 'lucide-react'

const EMOJIS = [
  // 얼굴
  { emoji: '😀', name: '웃는 얼굴 grinning face 기쁨', tags: ['웃음', '기쁨', '행복', 'smile'] },
  { emoji: '😂', name: '눈물 흘리며 웃는 얼굴 joy tears', tags: ['웃음', '눈물', '재미'] },
  { emoji: '😍', name: '하트 눈 heart eyes', tags: ['사랑', '좋아', '예쁘다'] },
  { emoji: '🥰', name: '사랑스러운 smiling face hearts', tags: ['사랑', '귀여움'] },
  { emoji: '😎', name: '선글라스 쿨 cool sunglasses', tags: ['쿨', '멋있다'] },
  { emoji: '🤔', name: '생각하는 thinking', tags: ['고민', '생각', '궁금'] },
  { emoji: '😭', name: '엉엉 우는 loudly crying', tags: ['슬픔', '울음'] },
  { emoji: '😡', name: '화난 angry', tags: ['화남', '분노'] },
  { emoji: '🥳', name: '파티 party', tags: ['파티', '축하', '생일'] },
  { emoji: '😴', name: '자는 sleeping', tags: ['졸림', '수면'] },
  { emoji: '🤣', name: '구르며 웃는 rolling laughing', tags: ['폭소', '웃음'] },
  { emoji: '😊', name: '수줍은 미소 blush', tags: ['미소', '부끄러움'] },
  { emoji: '🥺', name: '애원하는 pleading', tags: ['부탁', '애원', '귀여움'] },
  { emoji: '😏', name: '씩 웃는 smirk', tags: ['자신감', '비웃음'] },
  { emoji: '🤗', name: '안아주는 hugging', tags: ['포옹', '반가움'] },
  { emoji: '😒', name: '시큰둥한 unamused', tags: ['불만', '무관심'] },
  { emoji: '😔', name: '풀죽은 pensive', tags: ['슬픔', '실망'] },
  { emoji: '🙄', name: '눈 굴리는 eye roll', tags: ['어이없음', '무시'] },
  { emoji: '😱', name: '놀란 screaming', tags: ['놀람', '공포'] },
  { emoji: '🤩', name: '별 눈 star struck', tags: ['감탄', '설렘'] },
  // 손/몸
  { emoji: '👍', name: '좋아요 thumbs up', tags: ['좋아', '최고', 'OK'] },
  { emoji: '👎', name: '싫어요 thumbs down', tags: ['싫어', '반대'] },
  { emoji: '👏', name: '박수 clapping', tags: ['박수', '응원', '칭찬'] },
  { emoji: '🙏', name: '두 손 모아 folded hands', tags: ['감사', '부탁', '기도'] },
  { emoji: '✌️', name: '브이 victory', tags: ['브이', '승리', '평화'] },
  { emoji: '🤞', name: '행운 fingers crossed', tags: ['행운', '기원'] },
  { emoji: '💪', name: '근육 flexed biceps', tags: ['힘', '근육', '파이팅'] },
  { emoji: '🤝', name: '악수 handshake', tags: ['악수', '계약', '협력'] },
  { emoji: '👋', name: '손 흔들기 waving hand', tags: ['안녕', '인사'] },
  { emoji: '🤙', name: '전화해 call me', tags: ['전화', '연락'] },
  // 하트/감정
  { emoji: '❤️', name: '빨간 하트 red heart', tags: ['사랑', '하트', 'love'] },
  { emoji: '💔', name: '깨진 하트 broken heart', tags: ['실연', '슬픔'] },
  { emoji: '💕', name: '두 하트 two hearts', tags: ['사랑', '커플'] },
  { emoji: '💯', name: '100점 hundred points', tags: ['완벽', '최고', '100'] },
  { emoji: '🔥', name: '불 fire', tags: ['불', '핫', '인기'] },
  { emoji: '⭐', name: '별 star', tags: ['별', '평점', '좋아요'] },
  { emoji: '✨', name: '반짝 sparkles', tags: ['반짝', '예쁘다', '특별'] },
  { emoji: '🎉', name: '파티 celebration', tags: ['축하', '파티', '기쁨'] },
  { emoji: '🎊', name: '색종이 confetti', tags: ['축하', '파티'] },
  { emoji: '🏆', name: '트로피 trophy', tags: ['우승', '1등', '상'] },
  // 음식
  { emoji: '🍕', name: '피자 pizza', tags: ['피자', '음식', '이탈리아'] },
  { emoji: '🍔', name: '햄버거 burger', tags: ['햄버거', '패스트푸드'] },
  { emoji: '🍣', name: '초밥 sushi', tags: ['초밥', '일식', '스시'] },
  { emoji: '☕', name: '커피 coffee', tags: ['커피', '카페', '아메리카노'] },
  { emoji: '🍺', name: '맥주 beer', tags: ['맥주', '술', '건배'] },
  { emoji: '🍰', name: '케이크 cake', tags: ['케이크', '생일', '디저트'] },
  { emoji: '🍎', name: '사과 apple', tags: ['사과', '과일'] },
  { emoji: '🍊', name: '오렌지 orange', tags: ['오렌지', '과일'] },
  { emoji: '🍓', name: '딸기 strawberry', tags: ['딸기', '과일'] },
  { emoji: '🍫', name: '초콜릿 chocolate', tags: ['초콜릿', '달콤'] },
  // 동물
  { emoji: '🐶', name: '강아지 dog', tags: ['강아지', '개', '반려동물'] },
  { emoji: '🐱', name: '고양이 cat', tags: ['고양이', '냥이', '반려동물'] },
  { emoji: '🐼', name: '판다 panda', tags: ['판다', '귀여움'] },
  { emoji: '🦊', name: '여우 fox', tags: ['여우', '교활함'] },
  { emoji: '🐨', name: '코알라 koala', tags: ['코알라', '귀여움'] },
  { emoji: '🦁', name: '사자 lion', tags: ['사자', '왕'] },
  { emoji: '🐸', name: '개구리 frog', tags: ['개구리', '초록'] },
  { emoji: '🦋', name: '나비 butterfly', tags: ['나비', '예쁘다', '변화'] },
  // 자연
  { emoji: '🌸', name: '벚꽃 cherry blossom', tags: ['벚꽃', '봄', '꽃'] },
  { emoji: '🌺', name: '꽃 hibiscus', tags: ['꽃', '예쁘다'] },
  { emoji: '🌈', name: '무지개 rainbow', tags: ['무지개', '희망'] },
  { emoji: '☀️', name: '태양 sun', tags: ['맑음', '태양', '날씨'] },
  { emoji: '🌙', name: '달 moon', tags: ['달', '밤', '수면'] },
  { emoji: '⛄', name: '눈사람 snowman', tags: ['눈사람', '겨울', '눈'] },
  { emoji: '🌊', name: '파도 wave', tags: ['바다', '파도', '여름'] },
  { emoji: '🍀', name: '네잎클로버 four leaf clover', tags: ['행운', '클로버'] },
  // 물건/기타
  { emoji: '📱', name: '스마트폰 phone', tags: ['스마트폰', '전화', '핸드폰'] },
  { emoji: '💻', name: '노트북 laptop', tags: ['컴퓨터', '노트북', '업무'] },
  { emoji: '📚', name: '책 books', tags: ['책', '공부', '독서'] },
  { emoji: '🎵', name: '음악 music', tags: ['음악', '노래', '멜로디'] },
  { emoji: '🎮', name: '게임 controller', tags: ['게임', '조이스틱'] },
  { emoji: '✈️', name: '비행기 airplane', tags: ['여행', '비행기', '해외'] },
  { emoji: '🚗', name: '자동차 car', tags: ['자동차', '드라이브'] },
  { emoji: '🏠', name: '집 house', tags: ['집', '홈', '부동산'] },
  { emoji: '💰', name: '돈 money bag', tags: ['돈', '부자', '수익'] },
  { emoji: '💎', name: '다이아몬드 diamond', tags: ['다이아몬드', '보석', '귀중함'] },
  { emoji: '🔑', name: '열쇠 key', tags: ['열쇠', '비밀', '접근'] },
  { emoji: '📢', name: '확성기 loudspeaker', tags: ['공지', '알림', '발표'] },
  { emoji: '⚡', name: '번개 lightning', tags: ['번개', '빠름', '에너지'] },
  { emoji: '🎯', name: '다트 dart', tags: ['목표', '정확', '집중'] },
  { emoji: '🚀', name: '로켓 rocket', tags: ['로켓', '빠름', '성장'] },
  { emoji: '💡', name: '전구 idea lightbulb', tags: ['아이디어', '생각', '발명'] },
  { emoji: '🔔', name: '종 bell notification', tags: ['알림', '벨', '공지'] },
  { emoji: '📌', name: '핀 pin', tags: ['핀', '고정', '중요'] },
  { emoji: '✅', name: '체크 check mark', tags: ['완료', '체크', '확인'] },
  { emoji: '❌', name: 'X표 cross mark', tags: ['취소', '오류', '금지'] },
  { emoji: '⚠️', name: '경고 warning', tags: ['경고', '주의', '위험'] },
]

const CATEGORIES = ['전체', '얼굴', '손/몸', '하트/감정', '음식', '동물', '자연', '물건/기타']

export default function EmojiSearch() {
  const [query, setQuery] = useState('')
  const [copied, setCopied] = useState<string | null>(null)
  const [favorites, setFavorites] = useState<string[]>([])
  const [recent, setRecent] = useState<string[]>([])

  const filtered = useMemo(() => {
    if (!query.trim()) return EMOJIS
    const q = query.toLowerCase()
    return EMOJIS.filter(e =>
      e.name.toLowerCase().includes(q) ||
      e.tags.some(t => t.toLowerCase().includes(q)) ||
      e.emoji === q
    )
  }, [query])

  const copy = async (emoji: string) => {
    await navigator.clipboard.writeText(emoji)
    setCopied(emoji)
    setRecent(prev => [emoji, ...prev.filter(e => e !== emoji)].slice(0, 20))
    setTimeout(() => setCopied(null), 1000)
  }

  const toggleFav = (emoji: string) => {
    setFavorites(prev =>
      prev.includes(emoji) ? prev.filter(e => e !== emoji) : [...prev, emoji]
    )
  }

  const EmojiBtn = ({ e }: { e: typeof EMOJIS[0] }) => (
    <div className="group relative flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-surface-hover cursor-pointer transition-all"
      onClick={() => copy(e.emoji)}>
      <span className="text-2xl select-none">{e.emoji}</span>
      <span className="text-xs text-slate-600 text-center leading-tight line-clamp-1 w-full text-center">
        {e.name.split(' ')[0]}
      </span>
      {copied === e.emoji && (
        <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs bg-brand-500 text-white px-2 py-0.5 rounded whitespace-nowrap">복사!</span>
      )}
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-mono mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
          Free Tool
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-3 tracking-tight">이모지 검색기</h1>
        <p className="text-slate-300 text-base max-w-lg mx-auto">
          이모지를 한국어·영어로 검색하고 클릭 한 번으로 복사. 최근 사용, 즐겨찾기 기능 제공.
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="이모지 검색... 예: 사랑, 웃음, fire, heart"
          className="w-full bg-[#1a1d27] border border-surface-border rounded-xl pl-10 pr-4 py-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-brand-500/50 transition-all"
          autoFocus
        />
      </div>

      {/* Recent */}
      {recent.length > 0 && !query && (
        <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4 mb-4">
          <p className="text-xs text-slate-400 mb-3 font-medium">최근 사용</p>
          <div className="flex flex-wrap gap-1">
            {recent.map(e => (
              <button key={e} onClick={() => copy(e)}
                className="text-2xl p-1.5 rounded-lg hover:bg-surface-hover transition-all relative">
                {e}
                {copied === e && <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-xs bg-brand-500 text-white px-1.5 py-0.5 rounded">복사!</span>}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs text-slate-400 font-medium">
            {query ? `"${query}" 검색 결과 ${filtered.length}개` : `전체 ${filtered.length}개`}
          </p>
          <p className="text-xs text-slate-600">클릭하면 복사됩니다</p>
        </div>
        {filtered.length === 0 ? (
          <p className="text-center text-slate-600 py-10">검색 결과가 없어요</p>
        ) : (
          <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-1">
            {filtered.map(e => <EmojiBtn key={e.emoji} e={e} />)}
          </div>
        )}
      </div>
      <ToolFooter
        toolName="이모지 검색기"
        toolUrl="https://keyword-mixer.vercel.app/emoji-search"
        description="이모지를 한국어·영어로 검색하고 클릭으로 복사."
        howToUse={[
          { step: '도구 접속', desc: '이모지 검색기에 접속하세요.' },
          { step: '내용 입력', desc: '필요한 내용을 입력하거나 파일을 업로드하세요.' },
          { step: '결과 확인', desc: '변환/생성된 결과를 즉시 확인하세요.' },
          { step: '복사 또는 저장', desc: '결과를 복사하거나 파일로 저장하세요.' },
        ]}
        whyUse={[
          { title: '무료 사용', desc: '로그인 없이 완전 무료로 사용할 수 있습니다.' },
          { title: '빠른 처리', desc: '브라우저에서 즉시 처리되어 빠르게 결과를 얻을 수 있습니다.' },
          { title: '개인정보 보호', desc: '서버에 데이터가 저장되지 않아 안전합니다.' },
          { title: '다양한 기능', desc: '시중 유사 도구보다 더 많은 기능을 제공합니다.' },
        ]}
        faqs={[
          { q: '이 도구는 무료인가요?', a: '네, 완전 무료입니다. 로그인도 필요 없습니다.' },
          { q: '데이터는 서버에 저장되나요?', a: '아니요. 모든 처리는 브라우저에서 이루어지며 서버에 전송되지 않습니다.' },
          { q: '모바일에서도 사용할 수 있나요?', a: '네, 모바일 브라우저에서도 동일하게 사용할 수 있습니다.' },
          { q: '오류가 발생하면 어떻게 하나요?', a: '페이지를 새로고침하거나 하단 피드백 폼으로 알려주시면 빠르게 수정하겠습니다.' },
        ]}
        keywords="이모지 검색기 · 이모티콘 검색 · 이모지 복사 · 한국어 이모지 · emoji search · emoji finder · emoji copy · emoji picker"
      />
    </div>
  )
}
