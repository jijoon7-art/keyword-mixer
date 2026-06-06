'use client';

import React, { useState, useEffect, useRef } from 'react';

interface Food {
  n: string;
  e: string;
  t: string[];
  combo?: string;
  tip?: string;
  convo?: string;
  c?: string;
}

const FOODS: Food[] = [
  // 여기에 원본 HTML의 FOODS 배열 전체를 붙여넣으세요 (중요!)
  {n:"김치찌개", e:"🍲", t:["점심","저녁","매콤함","든든함"], combo:"계란말이 + 라면사리", tip:"라면사리 추가는 국룰!", c:"한식"},
  {n:"제육볶음", e:"🥩", t:["점심","매콤함","든든함"], combo:"쌈채소 + 공기밥", tip:"불향 강하게!", c:"한식"},
  {n:"비빔밥", e:"🥗", t:["점심","가볍게","혼밥"], combo:"미역국 + 깍두기", tip:"고추장 조금씩!", c:"한식"},
  {n:"치킨", e:"🍗", t:["저녁","야식"], combo:"치킨무 + 콜라", tip:"후라이드 vs 양념", c:"치킨"},
  {n:"피자", e:"🍕", t:["저녁","야식"], combo:"갈릭디핑", tip:"남은 피자는 물컵과 함께", c:"양식"},
  // ... (원본에서 전체 복사해서 붙여넣기)
];

export default function FoodWorldCup() {
  const [screen, setScreen] = useState<'home' | 'setup' | 'ai' | 'tournament' | 'result'>('home');
  const [filters, setFilters] = useState({ time: 'any', mood: 'any', budget: 'any', place: 'any' });
  const [aiRecommended, setAiRecommended] = useState<Food | null>(null);
  const [winner, setWinner] = useState<Food | null>(null);
  const [matches, setMatches] = useState<Food[]>([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const [roundName, setRoundName] = useState('16강');

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // GA4 트래킹
  const trackEvent = (eventName: string, params: any = {}) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', eventName, params);
    }
  };

  const handleAiInstant = () => {
    trackEvent('food_worldcup_ai_start', filters);
    let pool = FOODS.filter(f => 
      (filters.time === 'any' || f.t.includes(filters.time)) &&
      (filters.mood === 'any' || f.t.includes(filters.mood))
    );
    if (pool.length === 0) pool = [...FOODS];
    const picked = pool[Math.floor(Math.random() * pool.length)];
    setAiRecommended(picked);
    setScreen('ai');
  };

  const startTournament = () => {
    trackEvent('food_worldcup_tournament_start', filters);
    let pool = FOODS.filter(f => filters.time === 'any' || f.t.includes(filters.time));
    if (pool.length < 8) pool = [...FOODS];
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    setMatches(shuffled);
    setCurrentMatchIndex(0);
    setRoundName(`${shuffled.length}강`);
    setScreen('tournament');
  };

  const handleSelectFood = (selected: Food) => {
    const nextIndex = currentMatchIndex + 2;
    if (nextIndex >= matches.length) {
      setWinner(selected);
      setScreen('result');
      trackEvent('food_worldcup_win', { winner: selected.n });
    } else {
      setCurrentMatchIndex(nextIndex);
    }
  };

  const doShare = () => {
    if (!winner || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d')!;
    canvas.width = 600; canvas.height = 400;

    ctx.fillStyle = '#1C1C1A'; ctx.fillRect(0, 0, 600, 400);
    ctx.font = 'bold 44px sans-serif'; ctx.fillStyle = '#fff'; ctx.textAlign = 'center';
    ctx.fillText(winner.n, 300, 220);
    ctx.font = '90px sans-serif'; ctx.fillText(winner.e, 300, 150);
    ctx.font = 'bold 20px sans-serif'; ctx.fillStyle = '#E85D2F';
    ctx.fillText('오늘 뭐 먹지? 월드컵 우승', 300, 280);

    canvas.toBlob(blob => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = `오늘뭐먹지_${winner.n}.png`; a.click();
        URL.revokeObjectURL(url);
      }
    });
  };

  return (
    <div className="max-w-[480px] mx-auto min-h-screen bg-[#F7F6F2] pb-12 text-[#1C1C1A]">
      {/* AdSense 상단 */}
      <div className="p-4">
        <ins className="adsbygoogle" style={{display:"block"}} data-ad-client="ca-pub-3578085366535592" data-ad-slot="9590985950" data-ad-format="auto" data-full-width-responsive="true"></ins>
        <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
      </div>

      {screen === 'home' && (
        <div className="px-5 pt-8 text-center">
          <h1 className="text-4xl font-bold mb-2 text-orange-600">🍽️ 오늘 뭐 먹지?</h1>
          <p className="text-gray-600 mb-10">AI 추천 · 월드컵 · 취향 분석</p>
          <button onClick={() => setScreen('setup')} className="w-full py-4 bg-orange-600 text-white rounded-2xl text-lg font-bold mb-4">🎯 상황 설정하고 추천받기</button>
          <button onClick={startTournament} className="w-full py-4 bg-white border-2 border-orange-600 text-orange-600 rounded-2xl text-lg font-bold">🏆 바로 월드컵 시작</button>
        </div>
      )}

      {screen === 'setup' && (
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6 text-center">지금 어떤 상황인가요?</h2>
          <button onClick={startTournament} className="w-full py-4 bg-orange-600 text-white rounded-2xl font-bold mb-3">🏆 월드컵으로 고르기</button>
          <button onClick={handleAiInstant} className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold">⚡ AI가 바로 골라줘</button>
        </div>
      )}

      {screen === 'tournament' && matches.length > 0 && (
        <div className="p-5 text-center">
          <div className="text-orange-600 font-bold mb-4">{roundName}</div>
          <h2 className="text-xl font-bold mb-6">더 먹고 싶은 메뉴를 선택하세요</h2>
          <div className="space-y-4">
            <div onClick={() => handleSelectFood(matches[currentMatchIndex])} className="bg-white p-6 rounded-2xl border cursor-pointer hover:border-orange-500">
              <span className="text-5xl block mb-3">{matches[currentMatchIndex]?.e}</span>
              <span className="text-xl font-bold">{matches[currentMatchIndex]?.n}</span>
            </div>
            {matches[currentMatchIndex + 1] && (
              <div onClick={() => handleSelectFood(matches[currentMatchIndex + 1])} className="bg-white p-6 rounded-2xl border cursor-pointer hover:border-orange-500">
                <span className="text-5xl block mb-3">{matches[currentMatchIndex + 1]?.e}</span>
                <span className="text-xl font-bold">{matches[currentMatchIndex + 1]?.n}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {screen === 'ai' && aiRecommended && (
        <div className="p-6 text-center">
          <div className="text-7xl mb-6">{aiRecommended.e}</div>
          <h2 className="text-3xl font-bold mb-4">{aiRecommended.n}</h2>
          <p className="text-sm text-gray-600 mb-8">{aiRecommended.tip}</p>
          <button onClick={() => setScreen('home')} className="w-full py-4 bg-gray-800 text-white rounded-2xl">처음으로</button>
        </div>
      )}

      {screen === 'result' && winner && (
        <div className="p-6 text-center">
          <div className="text-8xl mb-6">🏆</div>
          <div className="text-7xl mb-4">{winner.e}</div>
          <h2 className="text-3xl font-bold mb-8">{winner.n}</h2>
          <button onClick={() => setScreen('home')} className="w-full py-4 bg-orange-600 text-white rounded-2xl">다시 하기</button>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}